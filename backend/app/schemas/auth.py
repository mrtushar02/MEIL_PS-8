from typing import Optional, List
from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    full_name: str
    role: str
    scopes: List[dict] = []

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role_name: str

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role_name: str
    scope_type: str = "GROUP"
    scope_id: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool
    scopes: List[dict] = []

    class Config:
        from_attributes = True
