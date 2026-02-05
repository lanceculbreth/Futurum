"""User management schemas."""
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserUpdateRequest(BaseModel):
    """User update request (admin only)."""
    company_name: Optional[str] = None
    is_admin: Optional[bool] = None
    is_active: Optional[bool] = None


class UserPracticeAreaUpdateRequest(BaseModel):
    """Update user's practice areas (admin only)."""
    practice_area_ids: List[int]


class UserCreateRequest(BaseModel):
    """Admin user creation request."""
    email: EmailStr
    password: str
    company_name: Optional[str] = None
    is_admin: bool = False
    practice_area_ids: List[int] = []
