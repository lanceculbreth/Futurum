"""Search API endpoints."""
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, PracticeArea
from app.models.document import Document, ContentType
from app.schemas.document import (
    SearchRequest,
    SearchResponse,
    SearchResult,
    DocumentResponse,
    DocumentListResponse,
)
from app.schemas.auth import PracticeAreaResponse
from app.services.embeddings import embedding_service
from app.services.vector_store import vector_store

router = APIRouter()


@router.post("/", response_model=SearchResponse)
async def search(
    request: SearchRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Semantic search across documents."""
    # Get user's practice areas if not specified
    practice_area_ids = request.practice_area_ids
    if not practice_area_ids:
        practice_area_ids = [pa.id for pa in current_user.practice_areas]
    
    # If user has no practice areas and none specified, search all (for admins)
    if not practice_area_ids and not current_user.is_admin:
        return SearchResponse(
            results=[],
            query=request.query,
            total_results=0,
        )
    
    # Generate query embedding
    query_embedding = await embedding_service.generate_embedding(request.query)
    
    # Search vector store
    results = await vector_store.query(
        query_embedding=query_embedding,
        n_results=request.limit,
        practice_area_ids=practice_area_ids if practice_area_ids else None,
    )
    
    # Format results
    search_results = []
    for idx, doc in enumerate(results["documents"]):
        metadata = results["metadatas"][idx] if results["metadatas"] else {}
        
        # Filter by content type if specified
        if request.content_types:
            doc_type = metadata.get("content_type", "article")
            if doc_type not in [ct.value for ct in request.content_types]:
                continue
        
        search_results.append(
            SearchResult(
                document_id=metadata.get("document_id", ""),
                title=metadata.get("title", "Unknown"),
                content_preview=doc[:300] + "..." if len(doc) > 300 else doc,
                practice_area=metadata.get("practice_area_name", "Unknown"),
                content_type=metadata.get("content_type", "article"),
                similarity=1 - results["distances"][idx] if results["distances"] else 0,
            )
        )
    
    return SearchResponse(
        results=search_results,
        query=request.query,
        total_results=len(search_results),
    )


@router.get("/documents", response_model=DocumentListResponse)
async def list_documents(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    practice_area_id: Optional[int] = None,
    content_type: Optional[ContentType] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List documents accessible to the user."""
    # Build query
    query = select(Document)
    count_query = select(func.count(Document.id))
    
    # Filter by user's practice areas unless admin
    if not current_user.is_admin:
        user_pa_ids = [pa.id for pa in current_user.practice_areas]
        if user_pa_ids:
            query = query.where(Document.practice_area_id.in_(user_pa_ids))
            count_query = count_query.where(Document.practice_area_id.in_(user_pa_ids))
        else:
            return DocumentListResponse(
                documents=[],
                total=0,
                page=page,
                page_size=page_size,
            )
    
    # Additional filters
    if practice_area_id:
        query = query.where(Document.practice_area_id == practice_area_id)
        count_query = count_query.where(Document.practice_area_id == practice_area_id)
    
    if content_type:
        query = query.where(Document.content_type == content_type)
        count_query = count_query.where(Document.content_type == content_type)
    
    # Get total count
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Paginate
    offset = (page - 1) * page_size
    query = query.order_by(Document.created_at.desc()).offset(offset).limit(page_size)
    
    result = await db.execute(query)
    documents = list(result.scalars().all())
    
    return DocumentListResponse(
        documents=[
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
                chunk_count=0,  # Would need a subquery to count
            )
            for doc in documents
        ],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/practice-areas", response_model=List[PracticeAreaResponse])
async def list_practice_areas(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List practice areas (user's assigned areas or all for admin)."""
    if current_user.is_admin:
        result = await db.execute(select(PracticeArea))
        practice_areas = list(result.scalars().all())
    else:
        practice_areas = current_user.practice_areas
    
    return [
        PracticeAreaResponse(
            id=pa.id,
            name=pa.name,
            slug=pa.slug,
            description=pa.description,
        )
        for pa in practice_areas
    ]


@router.get("/health")
async def search_health():
    """Search service health check."""
    return {"status": "search service healthy"}
