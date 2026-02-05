"""Admin API endpoints."""
import os
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_admin_user, get_password_hash
from app.models.user import User, PracticeArea
from app.models.document import Document, ContentType
from app.schemas.auth import PracticeAreaResponse, UserResponse
from app.schemas.user import UserCreateRequest, UserUpdateRequest, UserPracticeAreaUpdateRequest
from app.schemas.document import DocumentUploadRequest, DocumentResponse
from app.services.ingestion import ingestion_service

router = APIRouter()


# ============== User Management ==============

@router.get("/users", response_model=List[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 50,
    admin_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """List all users (admin only)."""
    result = await db.execute(
        select(User).offset(skip).limit(limit)
    )
    users = list(result.scalars().all())
    return [UserResponse.model_validate(user) for user in users]


@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    request: UserCreateRequest,
    admin_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new user (admin only)."""
    # Check if email exists
    result = await db.execute(select(User).where(User.email == request.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Create user
    user = User(
        email=request.email,
        password_hash=get_password_hash(request.password),
        company_name=request.company_name,
        is_admin=request.is_admin,
    )
    
    # Assign practice areas
    if request.practice_area_ids:
        result = await db.execute(
            select(PracticeArea).where(PracticeArea.id.in_(request.practice_area_ids))
        )
        practice_areas = list(result.scalars().all())
        user.practice_areas = practice_areas
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    return UserResponse.model_validate(user)


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: uuid.UUID,
    admin_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific user (admin only)."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return UserResponse.model_validate(user)


@router.patch("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: uuid.UUID,
    request: UserUpdateRequest,
    admin_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a user (admin only)."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    if request.company_name is not None:
        user.company_name = request.company_name
    if request.is_admin is not None:
        user.is_admin = request.is_admin
    if request.is_active is not None:
        user.is_active = request.is_active
    
    await db.commit()
    await db.refresh(user)
    
    return UserResponse.model_validate(user)


@router.put("/users/{user_id}/practice-areas", response_model=UserResponse)
async def update_user_practice_areas(
    user_id: uuid.UUID,
    request: UserPracticeAreaUpdateRequest,
    admin_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Update user's practice area assignments (admin only)."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Get practice areas
    result = await db.execute(
        select(PracticeArea).where(PracticeArea.id.in_(request.practice_area_ids))
    )
    practice_areas = list(result.scalars().all())
    
    user.practice_areas = practice_areas
    await db.commit()
    await db.refresh(user)
    
    return UserResponse.model_validate(user)


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: uuid.UUID,
    admin_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a user (admin only)."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Prevent deleting yourself
    if user.id == admin_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account",
        )
    
    await db.delete(user)
    await db.commit()
    
    return {"message": "User deleted"}


# ============== Practice Areas ==============

@router.get("/practice-areas", response_model=List[PracticeAreaResponse])
async def list_all_practice_areas(
    admin_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """List all practice areas (admin only)."""
    result = await db.execute(select(PracticeArea))
    practice_areas = list(result.scalars().all())
    
    return [
        PracticeAreaResponse(
            id=pa.id,
            name=pa.name,
            slug=pa.slug,
            description=pa.description,
        )
        for pa in practice_areas
    ]


# ============== Document Management ==============

@router.get("/documents", response_model=List[DocumentResponse])
async def list_all_documents(
    skip: int = 0,
    limit: int = 50,
    practice_area_id: Optional[int] = None,
    admin_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """List all documents (admin only)."""
    query = select(Document)
    
    if practice_area_id:
        query = query.where(Document.practice_area_id == practice_area_id)
    
    query = query.order_by(Document.created_at.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    documents = list(result.scalars().all())
    
    return [
        DocumentResponse(
            id=doc.id,
            title=doc.title,
            description=doc.description,
            content_type=doc.content_type,
            practice_area_id=doc.practice_area_id,
            file_name=doc.file_name,
            file_size_bytes=doc.file_size_bytes,
            source_url=doc.source_url,
            author=doc.author,
            published_at=doc.published_at,
            created_at=doc.created_at,
            chunk_count=0,
        )
        for doc in documents
    ]


@router.post("/documents/text", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_text_document(
    request: DocumentUploadRequest,
    admin_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload a text document (admin only)."""
    try:
        document = await ingestion_service.ingest_text(
            db=db,
            text=request.content,
            title=request.title,
            practice_area_id=request.practice_area_id,
            content_type=request.content_type,
            description=request.description,
            author=request.author,
            source_url=request.source_url,
            metadata=request.metadata,
        )
        
        # Count chunks
        chunk_count = await db.execute(
            select(func.count()).select_from(Document).where(Document.id == document.id)
        )
        
        return DocumentResponse(
            id=document.id,
            title=document.title,
            description=document.description,
            content_type=document.content_type,
            practice_area_id=document.practice_area_id,
            file_name=document.file_name,
            file_size_bytes=document.file_size_bytes,
            source_url=document.source_url,
            author=document.author,
            published_at=document.published_at,
            created_at=document.created_at,
            chunk_count=0,
        )
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post("/documents/file", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_file_document(
    file: UploadFile = File(...),
    title: str = Form(...),
    practice_area_id: int = Form(...),
    content_type: ContentType = Form(ContentType.ARTICLE),
    description: Optional[str] = Form(None),
    author: Optional[str] = Form(None),
    admin_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload a file document (PDF, TXT, MD) (admin only)."""
    # Validate file type
    allowed_extensions = [".pdf", ".txt", ".md"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}",
        )
    
    # Save file
    file_id = str(uuid.uuid4())
    file_path = os.path.join(settings.UPLOAD_DIRECTORY, f"{file_id}{file_ext}")
    
    os.makedirs(settings.UPLOAD_DIRECTORY, exist_ok=True)
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    try:
        document = await ingestion_service.ingest_document(
            db=db,
            file_path=file_path,
            title=title,
            practice_area_id=practice_area_id,
            content_type=content_type,
            description=description,
            author=author,
        )
        
        return DocumentResponse(
            id=document.id,
            title=document.title,
            description=document.description,
            content_type=document.content_type,
            practice_area_id=document.practice_area_id,
            file_name=document.file_name,
            file_size_bytes=document.file_size_bytes,
            source_url=document.source_url,
            author=document.author,
            published_at=document.published_at,
            created_at=document.created_at,
            chunk_count=0,
        )
    
    except Exception as e:
        # Clean up file on error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing file: {str(e)}",
        )


@router.delete("/documents/{document_id}")
async def delete_document(
    document_id: uuid.UUID,
    admin_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a document (admin only)."""
    deleted = await ingestion_service.delete_document(db, document_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )
    
    return {"message": "Document deleted"}


# ============== Stats ==============

@router.get("/stats")
async def get_stats(
    admin_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Get system statistics (admin only)."""
    from app.services.vector_store import vector_store
    
    # Count users
    user_count = await db.execute(select(func.count(User.id)))
    
    # Count documents
    doc_count = await db.execute(select(func.count(Document.id)))
    
    # Vector store stats
    vector_stats = await vector_store.get_collection_stats()
    
    return {
        "users": user_count.scalar(),
        "documents": doc_count.scalar(),
        "vectors": vector_stats["count"],
    }


@router.get("/health")
async def admin_health():
    """Admin service health check."""
    return {"status": "admin service healthy"}
