from typing import Generator, Optional, List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session, joinedload
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User, Role, UserScope
from app.models.organization import Project, BusinessUnit, Subsidiary, Group

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    auto_error=True
)

ALGORITHM = "HS256"

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    from app.services.token_blocklist import is_token_revoked
    if is_token_revoked(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked upon logout. Please re-authenticate.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        user_id: Optional[str] = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception


    user = db.query(User).options(
        joinedload(User.role).joinedload(Role.permissions),
        joinedload(User.scopes)
    ).filter(User.id == user_id).first()

    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )
    return user

def get_current_role(
    current_user: User = Depends(get_current_user)
) -> Optional[Role]:
    return current_user.role

def get_current_scopes(
    current_user: User = Depends(get_current_user)
) -> List[dict]:
    return [{"type": s.scope_type, "id": s.scope_id} for s in current_user.scopes]

class RequirePermission:
    def __init__(self, permission_code: str):
        self.permission_code = permission_code

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        if current_user.is_superuser:
            return current_user
        
        if current_user.role:
            role_permissions = [p.code for p in current_user.role.permissions]
            if self.permission_code in role_permissions:
                return current_user

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Operation not permitted. Missing required permission: {self.permission_code}"
        )

def require_permission(permission_code: str):
    return RequirePermission(permission_code)

def check_project_access(user: User, project_id: str, db: Session) -> bool:
    if user.is_superuser:
        return True

    # Check scopes
    user_scopes = user.scopes
    has_group_scope = any(s.scope_type == "GROUP" for s in user_scopes)
    if has_group_scope:
        return True

    # Retrieve project hierarchy
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Target project not found")

    for s in user_scopes:
        if s.scope_type == "PROJECT" and s.scope_id == project.id:
            return True
        if s.scope_type == "BUSINESS_UNIT" and s.scope_id == project.business_unit_id:
            return True
        if s.scope_type == "SUBSIDIARY" and s.scope_id == project.subsidiary_id:
            return True

    return False

def check_bu_access(user: User, bu_id: str, db: Session) -> bool:
    if user.is_superuser:
        return True

    user_scopes = user.scopes
    if any(s.scope_type == "GROUP" for s in user_scopes):
        return True

    bu = db.query(BusinessUnit).filter(BusinessUnit.id == bu_id).first()
    if not bu:
        raise HTTPException(status_code=404, detail="Business unit not found")

    for s in user_scopes:
        if s.scope_type == "BUSINESS_UNIT" and s.scope_id == bu.id:
            return True
        if s.scope_type == "SUBSIDIARY" and s.scope_id == bu.subsidiary_id:
            return True

    return False

def check_subsidiary_access(user: User, subsidiary_id: str, db: Session) -> bool:
    if user.is_superuser:
        return True

    user_scopes = user.scopes
    if any(s.scope_type == "GROUP" for s in user_scopes):
        return True

    for s in user_scopes:
        if s.scope_type == "SUBSIDIARY" and s.scope_id == subsidiary_id:
            return True

    return False

def require_project_access(project_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Project:
    if not check_project_access(current_user, project_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: User does not have authorization for project {project_id}"
        )
    project = db.query(Project).filter(Project.id == project_id).first()
    return project

def require_bu_access(bu_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> BusinessUnit:
    if not check_bu_access(current_user, bu_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: User does not have authorization for business unit {bu_id}"
        )
    bu = db.query(BusinessUnit).filter(BusinessUnit.id == bu_id).first()
    return bu

def require_subsidiary_access(subsidiary_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Subsidiary:
    if not check_subsidiary_access(current_user, subsidiary_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: User does not have authorization for subsidiary {subsidiary_id}"
        )
    sub = db.query(Subsidiary).filter(Subsidiary.id == subsidiary_id).first()
    return sub

def check_group_access(user: User, group_id: Optional[str] = None) -> bool:
    if user.is_superuser:
        return True
    return any(s.scope_type == "GROUP" for s in user.scopes)

def require_group_access(group_id: Optional[str] = None, current_user: User = Depends(get_current_user)) -> User:
    if check_group_access(current_user, group_id):
        return current_user
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Access denied: Group-level authorization required"
    )

def get_user_authorized_project_ids(arg1, arg2) -> Optional[List[str]]:
    """
    Returns list of project IDs the user has scope to access.
    Returns None if the user has unrestricted global group access (Item 24 & 30).
    Supports either (user, db) or (db, user) calling convention.
    """
    if isinstance(arg1, User):
        user, db = arg1, arg2
    else:
        db, user = arg1, arg2

    if user.is_superuser:
        return None

    user_scopes = user.scopes
    if any(s.scope_type == "GROUP" for s in user_scopes):
        return None

    allowed_ids = set()
    for s in user_scopes:
        if s.scope_type == "PROJECT":
            allowed_ids.add(s.scope_id)
        elif s.scope_type == "BUSINESS_UNIT":
            p_ids = [p[0] for p in db.query(Project.id).filter(Project.business_unit_id == s.scope_id).all()]
            allowed_ids.update(p_ids)
        elif s.scope_type == "SUBSIDIARY":
            p_ids = [p[0] for p in db.query(Project.id).filter(Project.subsidiary_id == s.scope_id).all()]
            allowed_ids.update(p_ids)

    return list(allowed_ids)

class RequireAnyPermission:
    def __init__(self, *permission_codes: str):
        self.permission_codes = permission_codes

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        if current_user.is_superuser:
            return current_user
        if current_user.role:
            user_perms = [p.code for p in current_user.role.permissions]
            if any(code in user_perms for code in self.permission_codes):
                return current_user
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Operation not permitted. Required one of: {', '.join(self.permission_codes)}"
        )

def require_any_permission(*permission_codes: str):
    return RequireAnyPermission(*permission_codes)

