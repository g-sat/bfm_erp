from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True, onupdate=datetime.utcnow)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


# D1 Users
class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(150))
    email: Mapped[str] = mapped_column(String(150), unique=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(30), default="business")  # admin|business|creative|pm
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    business_id: Mapped[Optional[int]] = mapped_column(ForeignKey("businesses.id"), nullable=True)
    creator_id: Mapped[Optional[int]] = mapped_column(ForeignKey("creators.id"), nullable=True)


# D3 Businesses
class Business(Base, TimestampMixin):
    __tablename__ = "businesses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(30), unique=True)
    name: Mapped[str] = mapped_column(String(200))
    industry: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    contact_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    website: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    subscription: Mapped[str] = mapped_column(String(50), default="starter")  # starter|growth|enterprise
    team_size: Mapped[int] = mapped_column(Integer, default=1)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


# D2 Creators
class Creator(Base, TimestampMixin):
    __tablename__ = "creators"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(30), unique=True)
    display_name: Mapped[str] = mapped_column(String(150))
    headline: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    skills: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # comma-separated
    categories: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)  # design,video,writing...
    experience_years: Mapped[int] = mapped_column(Integer, default=0)
    hourly_rate: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0"))
    day_rate: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0"))
    availability: Mapped[str] = mapped_column(String(30), default="available")  # available|busy|unavailable
    portfolio_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    rating_avg: Mapped[Decimal] = mapped_column(Numeric(4, 2), default=Decimal("0"))
    rating_count: Mapped[int] = mapped_column(Integer, default=0)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)


# D4 Projects
class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(30), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    brief: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(String(40), default="intake")
    # intake|quoting|matching|assigned|in_progress|qa|client_review|delivered|archived|cancelled
    priority: Mapped[str] = mapped_column(String(20), default="medium")
    budget: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=Decimal("0"))
    quoted_amount: Mapped[Optional[Decimal]] = mapped_column(Numeric(14, 2), nullable=True)
    currency: Mapped[str] = mapped_column(String(10), default="INR")
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    business_id: Mapped[int] = mapped_column(ForeignKey("businesses.id"))
    pm_user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    creator_id: Mapped[Optional[int]] = mapped_column(ForeignKey("creators.id"), nullable=True)
    progress_pct: Mapped[int] = mapped_column(Integer, default=0)
    requirements: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    business = relationship("Business")
    pm_user = relationship("User", foreign_keys=[pm_user_id])
    creator = relationship("Creator")
    milestones = relationship("Milestone", back_populates="project", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    files = relationship("ProjectFile", back_populates="project", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="project", cascade="all, delete-orphan")


class Milestone(Base, TimestampMixin):
    __tablename__ = "milestones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=Decimal("0"))
    status: Mapped[str] = mapped_column(String(30), default="pending")  # pending|in_progress|submitted|approved|paid
    sort_order: Mapped[int] = mapped_column(Integer, default=1)

    project = relationship("Project", back_populates="milestones")


class Task(Base, TimestampMixin):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"))
    milestone_id: Mapped[Optional[int]] = mapped_column(ForeignKey("milestones.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    assignee_user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="todo")  # todo|doing|done|blocked
    due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    estimated_hours: Mapped[Decimal] = mapped_column(Numeric(8, 2), default=Decimal("0"))
    logged_hours: Mapped[Decimal] = mapped_column(Numeric(8, 2), default=Decimal("0"))

    project = relationship("Project", back_populates="tasks")


class Assignment(Base, TimestampMixin):
    __tablename__ = "assignments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    creator_id: Mapped[int] = mapped_column(ForeignKey("creators.id"))
    status: Mapped[str] = mapped_column(String(30), default="shortlisted")
    # shortlisted|offered|accepted|declined|withdrawn
    match_score: Mapped[int] = mapped_column(Integer, default=0)
    offer_amount: Mapped[Optional[Decimal]] = mapped_column(Numeric(14, 2), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    responded_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    project = relationship("Project")
    creator = relationship("Creator")


# D5 Files
class ProjectFile(Base, TimestampMixin):
    __tablename__ = "project_files"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"))
    uploaded_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(255))
    file_type: Mapped[str] = mapped_column(String(50), default="reference")  # reference|deliverable|brief|other
    url: Mapped[str] = mapped_column(String(500))
    version: Mapped[int] = mapped_column(Integer, default=1)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    project = relationship("Project", back_populates="files")


# Process 4.0 Communication
class Message(Base, TimestampMixin):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"))
    sender_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    body: Mapped[str] = mapped_column(Text)
    message_type: Mapped[str] = mapped_column(String(30), default="chat")  # chat|system|alert

    project = relationship("Project", back_populates="messages")
    sender = relationship("User")


class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String(200))
    body: Mapped[str] = mapped_column(Text)
    channel: Mapped[str] = mapped_column(String(30), default="in_app")  # in_app|email|sms|push
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    link: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)


# Process 6.0 Quality
class QualityReview(Base, TimestampMixin):
    __tablename__ = "quality_reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    milestone_id: Mapped[Optional[int]] = mapped_column(ForeignKey("milestones.id"), nullable=True)
    reviewer_user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    stage: Mapped[str] = mapped_column(String(30), default="qa")  # qa|client
    status: Mapped[str] = mapped_column(String(30), default="pending")  # pending|approved|revision_requested
    feedback: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    project = relationship("Project")


# D6 Payments
class Invoice(Base, TimestampMixin):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    invoice_no: Mapped[str] = mapped_column(String(30), unique=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    business_id: Mapped[int] = mapped_column(ForeignKey("businesses.id"))
    milestone_id: Mapped[Optional[int]] = mapped_column(ForeignKey("milestones.id"), nullable=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=Decimal("0"))
    tax_amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=Decimal("0"))
    total_amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=Decimal("0"))
    currency: Mapped[str] = mapped_column(String(10), default="INR")
    status: Mapped[str] = mapped_column(String(30), default="draft")  # draft|sent|paid|refunded|void
    due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    paid_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    gateway_ref: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    project = relationship("Project")
    business = relationship("Business")


class Payment(Base, TimestampMixin):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    payment_no: Mapped[str] = mapped_column(String(30), unique=True)
    invoice_id: Mapped[Optional[int]] = mapped_column(ForeignKey("invoices.id"), nullable=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    direction: Mapped[str] = mapped_column(String(20))  # inbound|payout|refund
    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=Decimal("0"))
    currency: Mapped[str] = mapped_column(String(10), default="INR")
    status: Mapped[str] = mapped_column(String(30), default="pending")  # pending|completed|failed|escrow
    gateway: Mapped[str] = mapped_column(String(30), default="stripe")
    gateway_ref: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    payee_creator_id: Mapped[Optional[int]] = mapped_column(ForeignKey("creators.id"), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    invoice = relationship("Invoice")
    project = relationship("Project")


# D7 Reviews & Ratings
class Review(Base, TimestampMixin):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    from_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    to_role: Mapped[str] = mapped_column(String(30))  # creative|business|pm
    to_creator_id: Mapped[Optional[int]] = mapped_column(ForeignKey("creators.id"), nullable=True)
    to_business_id: Mapped[Optional[int]] = mapped_column(ForeignKey("businesses.id"), nullable=True)
    to_user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    rating: Mapped[int] = mapped_column(Integer, default=5)
    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    project = relationship("Project")


class DocumentSequence(Base):
    __tablename__ = "document_sequences"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    doc_type: Mapped[str] = mapped_column(String(30), unique=True)
    prefix: Mapped[str] = mapped_column(String(20))
    next_number: Mapped[int] = mapped_column(Integer, default=1)
    pad_length: Mapped[int] = mapped_column(Integer, default=4)


class Company(Base):
    __tablename__ = "company"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, default="BFM")
    name: Mapped[str] = mapped_column(String(200), default="BOLDFRAME")
    tagline: Mapped[str] = mapped_column(String(200), default="The Operating System for Creative Services")
    email: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
