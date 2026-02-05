"""Database connection and session management."""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

from app.core.config import settings

# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base class for models
Base = declarative_base()


async def get_db() -> AsyncSession:
    """Dependency to get database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db() -> None:
    """Initialize database tables and seed practice areas."""
    # Import models to register them
    from app.models.user import PracticeArea, DEFAULT_PRACTICE_AREAS
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed practice areas if they don't exist
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(PracticeArea).limit(1))
        if result.scalar_one_or_none() is None:
            for pa_data in DEFAULT_PRACTICE_AREAS:
                practice_area = PracticeArea(**pa_data)
                session.add(practice_area)
            await session.commit()
