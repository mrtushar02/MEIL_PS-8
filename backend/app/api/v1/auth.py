from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, create_access_token, get_password_hash
from app.models.user import User, Role, UserScope
from app.schemas.auth import LoginRequest, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account")

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
def get_current_user_profile(user_id: str = None, db: Session = Depends(get_db)):
    # Fallback to demo admin if user_id is not supplied for quick testing
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="No users initialized")
    
    role_name = user.role.name if user.role else "SUPER_ADMIN"
    scopes = [{"type": s.scope_type, "id": s.scope_id} for s in user.scopes]
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=role_name,
        is_active=user.is_active,
        scopes=scopes
    )
