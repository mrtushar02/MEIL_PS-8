from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.models.user import User, Role, UserScope
from app.schemas.auth import LoginRequest, Token, UserResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )

    role_name = user.role.name if user.role else "USER"
    scopes = [{"type": s.scope_type, "id": s.scope_id} for s in user.scopes]

    access_token = create_access_token(subject=user.id)
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        full_name=user.full_name,
        role=role_name,
        scopes=scopes
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    role_name = current_user.role.name if current_user.role else "USER"
    role_code = current_user.role.code if current_user.role else None
    permissions = [p.code for p in current_user.role.permissions] if (current_user.role and current_user.role.permissions) else []
    scopes = [{"type": s.scope_type, "id": s.scope_id} for s in current_user.scopes]
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=role_name,
        role_code=role_code,
        is_active=current_user.is_active,
        scopes=scopes,
        permissions=permissions
    )

@router.post("/refresh", response_model=Token)
def refresh_token(current_user: User = Depends(get_current_user)):
    role_name = current_user.role.name if current_user.role else "USER"
    scopes = [{"type": s.scope_type, "id": s.scope_id} for s in current_user.scopes]
    access_token = create_access_token(subject=current_user.id)
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=current_user.id,
        full_name=current_user.full_name,
        role=role_name,
        scopes=scopes
    )

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out", "user_id": current_user.id}
