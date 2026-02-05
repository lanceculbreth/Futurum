"""User and authentication models."""
import uuid
from datetime import datetime
from typing import List

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


# Association table for User <-> PracticeArea many-to-many relationship
user_practice_areas = Table(
    "user_practice_areas",
    Base.metadata,
    Column("user_id", UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("practice_area_id", Integer, ForeignKey("practice_areas.id", ondelete="CASCADE"), primary_key=True),
)


class User(Base):
    """User model for authentication and authorization."""
    
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=True)
    is_admin = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    practice_areas = relationship(
        "PracticeArea",
        secondary=user_practice_areas,
        back_populates="users",
        lazy="selectin",
    )
    conversations = relationship("Conversation", back_populates="user", lazy="dynamic")
    
    def __repr__(self):
        return f"<User {self.email}>"


class PracticeArea(Base):
    """Practice area model representing Futurum's practice areas."""
    
    __tablename__ = "practice_areas"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(String(500), nullable=True)
    
    # Relationships
    users = relationship(
        "User",
        secondary=user_practice_areas,
        back_populates="practice_areas",
        lazy="selectin",
    )
    documents = relationship("Document", back_populates="practice_area", lazy="dynamic")
    
    def __repr__(self):
        return f"<PracticeArea {self.name}>"


# Default practice areas to seed
DEFAULT_PRACTICE_AREAS = [
    {
        "name": "AI Platforms",
        "slug": "ai-platforms",
        "description": "Artificial intelligence platforms, machine learning, and generative AI technologies.",
    },
    {
        "name": "Cybersecurity & Resilience",
        "slug": "cybersecurity-resilience",
        "description": "Enterprise security, threat detection, compliance, and cyber resilience strategies.",
    },
    {
        "name": "Data Intelligence, Analytics, & Infrastructure",
        "slug": "data-intelligence-analytics",
        "description": "Data management, business intelligence, analytics platforms, and data infrastructure.",
    },
    {
        "name": "Digital Leadership & CIO",
        "slug": "digital-leadership-cio",
        "description": "Digital transformation, IT leadership, CIO strategies, and organizational change.",
    },
    {
        "name": "Ecosystems, Channels, & Marketplaces",
        "slug": "ecosystems-channels",
        "description": "Partner ecosystems, channel strategies, cloud marketplaces, and go-to-market approaches.",
    },
    {
        "name": "Enterprise Software & Digital Workflows",
        "slug": "enterprise-software",
        "description": "Enterprise applications, SaaS, workflow automation, and digital business processes.",
    },
    {
        "name": "Intelligent Devices",
        "slug": "intelligent-devices",
        "description": "AI PCs, edge devices, IoT, wearables, and intelligent hardware platforms.",
    },
    {
        "name": "Semiconductors, Supply Chain, & Emerging Tech",
        "slug": "semiconductors-supply-chain",
        "description": "Chip design, semiconductor manufacturing, supply chain, and emerging technologies.",
    },
    {
        "name": "Software Lifecycle Engineering",
        "slug": "software-lifecycle",
        "description": "DevOps, software development, CI/CD, platform engineering, and SDLC practices.",
    },
]
