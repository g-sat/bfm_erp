from datetime import date, datetime
from decimal import Decimal
from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    result: int = 1
    message: str = "OK"
    data: Optional[T] = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    full_name: str
    email: str
    role: str
    phone: Optional[str] = None
    is_verified: bool = False
    business_id: Optional[int] = None
    creator_id: Optional[int] = None


class UserCreate(BaseModel):
    username: str
    full_name: str
    email: str
    password: str
    role: str = "business"  # admin|business|creative|pm
    phone: Optional[str] = None
    is_verified: bool = True
    business_id: Optional[int] = None
    creator_id: Optional[int] = None


class UserUpdate(BaseModel):
    full_name: str
    email: str
    role: str
    phone: Optional[str] = None
    is_verified: bool = True
    business_id: Optional[int] = None
    creator_id: Optional[int] = None
    password: Optional[str] = None
    is_active: bool = True


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class CompanyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    code: str
    name: str
    tagline: str
    email: Optional[str] = None
    phone: Optional[str] = None


class BusinessIn(BaseModel):
    code: str
    name: str
    industry: Optional[str] = None
    contact_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    subscription: str = "starter"
    team_size: int = 1
    notes: Optional[str] = None
    is_active: bool = True


class BusinessOut(BusinessIn):
    model_config = ConfigDict(from_attributes=True)
    id: int


class CreatorIn(BaseModel):
    code: str
    display_name: str
    headline: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[str] = None
    categories: Optional[str] = None
    experience_years: int = 0
    hourly_rate: Decimal = Decimal("0")
    day_rate: Decimal = Decimal("0")
    availability: str = "available"
    portfolio_url: Optional[str] = None
    location: Optional[str] = None
    is_verified: bool = False
    is_active: bool = True


class CreatorOut(CreatorIn):
    model_config = ConfigDict(from_attributes=True)
    id: int
    rating_avg: Decimal = Decimal("0")
    rating_count: int = 0


class MilestoneIn(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None
    amount: Decimal = Decimal("0")
    status: str = "pending"
    sort_order: int = 1


class MilestoneOut(MilestoneIn):
    model_config = ConfigDict(from_attributes=True)
    id: int
    project_id: int


class TaskIn(BaseModel):
    title: str
    description: Optional[str] = None
    milestone_id: Optional[int] = None
    assignee_user_id: Optional[int] = None
    status: str = "todo"
    due_date: Optional[date] = None
    estimated_hours: Decimal = Decimal("0")
    logged_hours: Decimal = Decimal("0")


class TaskOut(TaskIn):
    model_config = ConfigDict(from_attributes=True)
    id: int
    project_id: int


class ProjectIn(BaseModel):
    title: str
    brief: Optional[str] = None
    category: Optional[str] = None
    priority: str = "medium"
    budget: Decimal = Decimal("0")
    currency: str = "INR"
    start_date: Optional[date] = None
    due_date: Optional[date] = None
    business_id: int
    requirements: Optional[str] = None


class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    code: str
    title: str
    brief: Optional[str] = None
    category: Optional[str] = None
    status: str
    priority: str
    budget: Decimal
    quoted_amount: Optional[Decimal] = None
    currency: str
    start_date: Optional[date] = None
    due_date: Optional[date] = None
    business_id: int
    pm_user_id: Optional[int] = None
    creator_id: Optional[int] = None
    progress_pct: int
    requirements: Optional[str] = None
    business: Optional[BusinessOut] = None
    creator: Optional[CreatorOut] = None
    milestones: List[MilestoneOut] = []
    tasks: List[TaskOut] = []


class AssignmentIn(BaseModel):
    project_id: int
    creator_id: int
    match_score: int = 0
    offer_amount: Optional[Decimal] = None
    notes: Optional[str] = None


class AssignmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    project_id: int
    creator_id: int
    status: str
    match_score: int
    offer_amount: Optional[Decimal] = None
    notes: Optional[str] = None
    creator: Optional[CreatorOut] = None
    project: Optional[ProjectOut] = None


class FileIn(BaseModel):
    project_id: int
    name: str
    file_type: str = "reference"
    url: str
    version: int = 1
    notes: Optional[str] = None


class FileOut(FileIn):
    model_config = ConfigDict(from_attributes=True)
    id: int
    uploaded_by: Optional[int] = None


class MessageIn(BaseModel):
    project_id: int
    body: str
    message_type: str = "chat"


class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    project_id: int
    sender_user_id: int
    body: str
    message_type: str
    created_at: Optional[datetime] = None
    sender: Optional[UserOut] = None


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    title: str
    body: str
    channel: str
    is_read: bool
    link: Optional[str] = None
    created_at: Optional[datetime] = None


class QualityReviewIn(BaseModel):
    project_id: int
    milestone_id: Optional[int] = None
    stage: str = "qa"
    status: str = "pending"
    feedback: Optional[str] = None


class QualityReviewOut(QualityReviewIn):
    model_config = ConfigDict(from_attributes=True)
    id: int
    reviewer_user_id: Optional[int] = None


class InvoiceIn(BaseModel):
    project_id: int
    business_id: int
    milestone_id: Optional[int] = None
    amount: Decimal
    tax_amount: Decimal = Decimal("0")
    currency: str = "INR"
    due_date: Optional[date] = None


class InvoiceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    invoice_no: str
    project_id: int
    business_id: int
    milestone_id: Optional[int] = None
    amount: Decimal
    tax_amount: Decimal
    total_amount: Decimal
    currency: str
    status: str
    due_date: Optional[date] = None
    paid_at: Optional[datetime] = None
    gateway_ref: Optional[str] = None
    project: Optional[ProjectOut] = None
    business: Optional[BusinessOut] = None


class PaymentIn(BaseModel):
    project_id: int
    invoice_id: Optional[int] = None
    direction: str
    amount: Decimal
    currency: str = "INR"
    gateway: str = "stripe"
    payee_creator_id: Optional[int] = None
    notes: Optional[str] = None


class PaymentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    payment_no: str
    invoice_id: Optional[int] = None
    project_id: int
    direction: str
    amount: Decimal
    currency: str
    status: str
    gateway: str
    gateway_ref: Optional[str] = None
    payee_creator_id: Optional[int] = None
    notes: Optional[str] = None


class ReviewIn(BaseModel):
    project_id: int
    to_role: str
    to_creator_id: Optional[int] = None
    to_business_id: Optional[int] = None
    to_user_id: Optional[int] = None
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None


class ReviewOut(ReviewIn):
    model_config = ConfigDict(from_attributes=True)
    id: int
    from_user_id: int


class ChartSlice(BaseModel):
    name: str
    value: float


class CashflowPoint(BaseModel):
    name: str
    inbound: float
    payout: float


class ProgressPoint(BaseModel):
    name: str
    progress: float
    status: str


class DashboardOut(BaseModel):
    projects_total: int
    projects_active: int
    projects_in_qa: int
    businesses: int
    creators: int
    creators_available: int
    invoices_open: int
    revenue_collected: Decimal
    payouts_pending: Decimal
    unread_notifications: int
    recent_projects: List[ProjectOut] = []
    recent_invoices: List[InvoiceOut] = []
    projects_by_status: List[ChartSlice] = []
    projects_by_category: List[ChartSlice] = []
    creators_by_availability: List[ChartSlice] = []
    invoices_by_status: List[ChartSlice] = []
    cashflow: List[CashflowPoint] = []
    delivery_progress: List[ProgressPoint] = []
    avg_progress: float = 0
    assignments_open: int = 0
    quality_pending: int = 0


class PublicStartIn(BaseModel):
    role: str  # business | creative
    email: str
    password: str
    phone: Optional[str] = None
    # business
    company_name: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    team_size: Optional[str] = None
    contact_name: Optional[str] = None
    project_title: Optional[str] = None
    project_category: Optional[str] = None
    project_budget: Optional[float] = None
    project_brief: Optional[str] = None
    # creative
    display_name: Optional[str] = None
    headline: Optional[str] = None
    skills: Optional[str] = None
    categories: Optional[str] = None
    location: Optional[str] = None
