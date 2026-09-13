from datetime import datetime
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import extract, func, or_
from sqlalchemy.orm import joinedload

from app.auth import CurrentUser, DbSession, authenticate_user, create_access_token, hash_password
from app.models import (
    Assignment,
    Business,
    Company,
    Creator,
    Invoice,
    Message,
    Milestone,
    Notification,
    Payment,
    Project,
    ProjectFile,
    QualityReview,
    Review,
    Task,
    User,
)
from app.schemas import (
    ApiResponse,
    AssignmentIn,
    AssignmentOut,
    BusinessIn,
    BusinessOut,
    CashflowPoint,
    ChartSlice,
    CompanyOut,
    CreatorIn,
    CreatorOut,
    DashboardOut,
    FileIn,
    FileOut,
    InvoiceIn,
    ProgressPoint,
    InvoiceOut,
    LoginRequest,
    MessageIn,
    MessageOut,
    MilestoneIn,
    MilestoneOut,
    NotificationOut,
    PaymentIn,
    PaymentOut,
    ProjectIn,
    ProjectOut,
    QualityReviewIn,
    QualityReviewOut,
    ReviewIn,
    ReviewOut,
    TaskIn,
    TaskOut,
    TokenOut,
    UserCreate,
    UserOut,
    UserUpdate,
)
from app.services.docs import next_doc_no

auth_router = APIRouter(prefix="/api/auth", tags=["auth"])
api = APIRouter(prefix="/api", tags=["bfm"])


@auth_router.post("/login", response_model=ApiResponse[TokenOut])
def login(payload: LoginRequest, db: DbSession):
    user = authenticate_user(db, payload.username, payload.password)
    if not user:
        raise HTTPException(401, "Invalid username or password")
    token = create_access_token({"sub": user.username, "uid": user.id, "role": user.role})
    return ApiResponse(data=TokenOut(access_token=token, user=UserOut.model_validate(user)))


@auth_router.post("/token", response_model=TokenOut)
def login_form(form_data: OAuth2PasswordRequestForm = Depends(), db: DbSession = None):
    user = authenticate_user(db, form_data.username, form_data.password)  # type: ignore[arg-type]
    if not user:
        raise HTTPException(401, "Invalid username or password")
    token = create_access_token({"sub": user.username, "uid": user.id, "role": user.role})
    return TokenOut(access_token=token, user=UserOut.model_validate(user))


@auth_router.get("/me", response_model=ApiResponse[UserOut])
def me(user: CurrentUser):
    return ApiResponse(data=UserOut.model_validate(user))


@api.get("/company", response_model=ApiResponse[CompanyOut])
def get_company(db: DbSession, user: CurrentUser):
    company = db.query(Company).first()
    if not company:
        raise HTTPException(404, "Company not found")
    return ApiResponse(data=CompanyOut.model_validate(company))


@api.get("/dashboard", response_model=ApiResponse[DashboardOut])
def dashboard(db: DbSession, user: CurrentUser):
    projects_q = db.query(Project)
    if user.role == "business" and user.business_id:
        projects_q = projects_q.filter(Project.business_id == user.business_id)
    elif user.role == "creative" and user.creator_id:
        projects_q = projects_q.filter(Project.creator_id == user.creator_id)
    elif user.role == "pm":
        projects_q = projects_q.filter(Project.pm_user_id == user.id)

    recent = (
        projects_q.options(
            joinedload(Project.business),
            joinedload(Project.creator),
            joinedload(Project.milestones),
            joinedload(Project.tasks),
        )
        .order_by(Project.id.desc())
        .limit(6)
        .all()
    )
    invoices = (
        db.query(Invoice)
        .options(joinedload(Invoice.project), joinedload(Invoice.business))
        .order_by(Invoice.id.desc())
        .limit(5)
        .all()
    )
    revenue = db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(
        Payment.direction == "inbound", Payment.status == "completed"
    ).scalar()
    payouts_pending = db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(
        Payment.direction == "payout", Payment.status.in_(["pending", "escrow"])
    ).scalar()

    status_rows = (
        projects_q.with_entities(Project.status, func.count(Project.id))
        .group_by(Project.status)
        .all()
    )
    category_rows = (
        projects_q.with_entities(
            func.coalesce(Project.category, "general"),
            func.count(Project.id),
        )
        .group_by(func.coalesce(Project.category, "general"))
        .all()
    )
    creator_avail = (
        db.query(Creator.availability, func.count(Creator.id))
        .filter(Creator.is_active.is_(True))
        .group_by(Creator.availability)
        .all()
    )
    invoice_status = (
        db.query(Invoice.status, func.count(Invoice.id))
        .group_by(Invoice.status)
        .all()
    )

    now = datetime.utcnow()
    cashflow: list[CashflowPoint] = []
    for offset in range(5, -1, -1):
        month = now.month - offset
        year = now.year
        while month <= 0:
            month += 12
            year -= 1
        inbound = db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(
            Payment.direction == "inbound",
            extract("year", Payment.created_at) == year,
            extract("month", Payment.created_at) == month,
        ).scalar()
        payout = db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(
            Payment.direction == "payout",
            extract("year", Payment.created_at) == year,
            extract("month", Payment.created_at) == month,
        ).scalar()
        label = datetime(year, month, 1).strftime("%b")
        cashflow.append(
            CashflowPoint(
                name=label,
                inbound=float(inbound or 0),
                payout=float(payout or 0),
            )
        )

    delivery_rows = (
        projects_q.filter(
            Project.status.in_(["assigned", "in_progress", "qa", "client_review", "delivered"])
        )
        .order_by(Project.progress_pct.desc())
        .limit(8)
        .all()
    )
    scoped_ids = [row[0] for row in projects_q.with_entities(Project.id).all()]
    if scoped_ids:
        avg_progress = (
            db.query(func.coalesce(func.avg(Project.progress_pct), 0))
            .filter(Project.id.in_(scoped_ids))
            .scalar()
        )
    else:
        avg_progress = 0

    data = DashboardOut(
        projects_total=projects_q.count(),
        projects_active=projects_q.filter(
            Project.status.in_(["intake", "quoting", "matching", "assigned", "in_progress", "qa", "client_review"])
        ).count(),
        projects_in_qa=projects_q.filter(Project.status.in_(["qa", "client_review"])).count(),
        businesses=db.query(Business).filter(Business.is_active.is_(True)).count(),
        creators=db.query(Creator).filter(Creator.is_active.is_(True)).count(),
        creators_available=db.query(Creator).filter(Creator.availability == "available").count(),
        invoices_open=db.query(Invoice).filter(Invoice.status.in_(["draft", "sent"])).count(),
        revenue_collected=Decimal(str(revenue or 0)),
        payouts_pending=Decimal(str(payouts_pending or 0)),
        unread_notifications=db.query(Notification).filter(
            Notification.user_id == user.id, Notification.is_read.is_(False)
        ).count(),
        recent_projects=[ProjectOut.model_validate(p) for p in recent],
        recent_invoices=[InvoiceOut.model_validate(i) for i in invoices],
        projects_by_status=[ChartSlice(name=s or "unknown", value=float(c)) for s, c in status_rows],
        projects_by_category=[ChartSlice(name=c or "general", value=float(n)) for c, n in category_rows],
        creators_by_availability=[
            ChartSlice(name=a or "unknown", value=float(n)) for a, n in creator_avail
        ],
        invoices_by_status=[ChartSlice(name=s or "unknown", value=float(n)) for s, n in invoice_status],
        cashflow=cashflow,
        delivery_progress=[
            ProgressPoint(name=p.code, progress=float(p.progress_pct or 0), status=p.status)
            for p in delivery_rows
        ],
        avg_progress=round(float(avg_progress or 0), 1),
        assignments_open=db.query(Assignment)
        .filter(Assignment.status.in_(["shortlisted", "offered"]))
        .count(),
        quality_pending=db.query(QualityReview)
        .filter(QualityReview.status.in_(["pending", "revision_requested"]))
        .count(),
    )
    return ApiResponse(data=data)


@api.get("/users", response_model=ApiResponse[list[UserOut]])
def list_users(db: DbSession, user: CurrentUser):
    if user.role != "admin":
        raise HTTPException(403, "Admin only")
    rows = db.query(User).order_by(User.id).all()
    return ApiResponse(data=[UserOut.model_validate(u) for u in rows])


ALLOWED_ROLES = {"admin", "business", "creative", "pm"}


@api.post("/users", response_model=ApiResponse[UserOut])
def create_user(payload: UserCreate, db: DbSession, user: CurrentUser):
    if user.role != "admin":
        raise HTTPException(403, "Admin only")
    if payload.role not in ALLOWED_ROLES:
        raise HTTPException(400, f"Role must be one of: {', '.join(sorted(ALLOWED_ROLES))}")
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(400, "Username already exists")
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(400, "Email already exists")
    obj = User(
        username=payload.username,
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role,
        phone=payload.phone,
        is_verified=payload.is_verified,
        business_id=payload.business_id if payload.role == "business" else None,
        creator_id=payload.creator_id if payload.role == "creative" else None,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="User created", data=UserOut.model_validate(obj))


@api.put("/users/{item_id}", response_model=ApiResponse[UserOut])
def update_user(item_id: int, payload: UserUpdate, db: DbSession, user: CurrentUser):
    if user.role != "admin":
        raise HTTPException(403, "Admin only")
    obj = db.get(User, item_id)
    if not obj:
        raise HTTPException(404, "Not found")
    if payload.role not in ALLOWED_ROLES:
        raise HTTPException(400, f"Role must be one of: {', '.join(sorted(ALLOWED_ROLES))}")
    email_clash = db.query(User).filter(User.email == payload.email, User.id != item_id).first()
    if email_clash:
        raise HTTPException(400, "Email already exists")
    obj.full_name = payload.full_name
    obj.email = payload.email
    obj.role = payload.role
    obj.phone = payload.phone
    obj.is_verified = payload.is_verified
    obj.is_active = payload.is_active
    obj.business_id = payload.business_id if payload.role == "business" else None
    obj.creator_id = payload.creator_id if payload.role == "creative" else None
    if payload.password:
        obj.hashed_password = hash_password(payload.password)
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="User updated", data=UserOut.model_validate(obj))


# ---- 1.0 / D3 Businesses ----
@api.get("/businesses", response_model=ApiResponse[list[BusinessOut]])
def list_businesses(db: DbSession, user: CurrentUser, search: Optional[str] = None):
    q = db.query(Business)
    if search:
        q = q.filter(or_(Business.name.ilike(f"%{search}%"), Business.code.ilike(f"%{search}%")))
    return ApiResponse(data=[BusinessOut.model_validate(x) for x in q.order_by(Business.id.desc()).all()])


@api.post("/businesses", response_model=ApiResponse[BusinessOut])
def create_business(payload: BusinessIn, db: DbSession, user: CurrentUser):
    obj = Business(**payload.model_dump())
    if not obj.code:
        obj.code = next_doc_no(db, "BUSINESS")
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Business created", data=BusinessOut.model_validate(obj))


# ---- 1.0 / D2 Creators ----
@api.get("/creators", response_model=ApiResponse[list[CreatorOut]])
def list_creators(
    db: DbSession,
    user: CurrentUser,
    search: Optional[str] = None,
    availability: Optional[str] = None,
    category: Optional[str] = None,
):
    q = db.query(Creator)
    if search:
        q = q.filter(
            or_(
                Creator.display_name.ilike(f"%{search}%"),
                Creator.skills.ilike(f"%{search}%"),
                Creator.code.ilike(f"%{search}%"),
            )
        )
    if availability:
        q = q.filter(Creator.availability == availability)
    if category:
        q = q.filter(Creator.categories.ilike(f"%{category}%"))
    return ApiResponse(data=[CreatorOut.model_validate(x) for x in q.order_by(Creator.rating_avg.desc()).all()])


@api.post("/creators", response_model=ApiResponse[CreatorOut])
def create_creator(payload: CreatorIn, db: DbSession, user: CurrentUser):
    obj = Creator(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Creator created", data=CreatorOut.model_validate(obj))


@api.put("/creators/{item_id}", response_model=ApiResponse[CreatorOut])
def update_creator(item_id: int, payload: CreatorIn, db: DbSession, user: CurrentUser):
    obj = db.get(Creator, item_id)
    if not obj:
        raise HTTPException(404, "Not found")
    for k, v in payload.model_dump().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Updated", data=CreatorOut.model_validate(obj))


# ---- 2.0 / 5.0 Projects ----
def _project_query(db):
    return db.query(Project).options(
        joinedload(Project.business),
        joinedload(Project.creator),
        joinedload(Project.milestones),
        joinedload(Project.tasks),
    )


@api.get("/projects", response_model=ApiResponse[list[ProjectOut]])
def list_projects(db: DbSession, user: CurrentUser, status: Optional[str] = None, search: Optional[str] = None):
    q = _project_query(db)
    if user.role == "business" and user.business_id:
        q = q.filter(Project.business_id == user.business_id)
    elif user.role == "creative" and user.creator_id:
        q = q.filter(Project.creator_id == user.creator_id)
    elif user.role == "pm":
        q = q.filter(or_(Project.pm_user_id == user.id, Project.pm_user_id.is_(None)))
    if status:
        q = q.filter(Project.status == status)
    if search:
        q = q.filter(or_(Project.title.ilike(f"%{search}%"), Project.code.ilike(f"%{search}%")))
    return ApiResponse(data=[ProjectOut.model_validate(x) for x in q.order_by(Project.id.desc()).all()])


@api.get("/projects/{item_id}", response_model=ApiResponse[ProjectOut])
def get_project(item_id: int, db: DbSession, user: CurrentUser):
    obj = _project_query(db).filter(Project.id == item_id).first()
    if not obj:
        raise HTTPException(404, "Not found")
    return ApiResponse(data=ProjectOut.model_validate(obj))


@api.post("/projects", response_model=ApiResponse[ProjectOut])
def create_project(payload: ProjectIn, db: DbSession, user: CurrentUser):
    obj = Project(
        code=next_doc_no(db, "PROJECT"),
        status="intake",
        **payload.model_dump(),
    )
    if user.role == "business" and user.business_id:
        obj.business_id = user.business_id
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Project created", data=ProjectOut.model_validate(obj))


@api.patch("/projects/{item_id}/status", response_model=ApiResponse[ProjectOut])
def update_project_status(item_id: int, status: str, db: DbSession, user: CurrentUser, progress_pct: Optional[int] = None):
    obj = db.get(Project, item_id)
    if not obj:
        raise HTTPException(404, "Not found")
    obj.status = status
    if progress_pct is not None:
        obj.progress_pct = progress_pct
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Status updated", data=ProjectOut.model_validate(obj))


@api.post("/projects/{project_id}/milestones", response_model=ApiResponse[MilestoneOut])
def add_milestone(project_id: int, payload: MilestoneIn, db: DbSession, user: CurrentUser):
    if not db.get(Project, project_id):
        raise HTTPException(404, "Project not found")
    obj = Milestone(project_id=project_id, **payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Milestone added", data=MilestoneOut.model_validate(obj))


@api.post("/projects/{project_id}/tasks", response_model=ApiResponse[TaskOut])
def add_task(project_id: int, payload: TaskIn, db: DbSession, user: CurrentUser):
    if not db.get(Project, project_id):
        raise HTTPException(404, "Project not found")
    obj = Task(project_id=project_id, **payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Task added", data=TaskOut.model_validate(obj))


@api.patch("/tasks/{task_id}", response_model=ApiResponse[TaskOut])
def update_task(task_id: int, payload: TaskIn, db: DbSession, user: CurrentUser):
    obj = db.get(Task, task_id)
    if not obj:
        raise HTTPException(404, "Not found")
    for k, v in payload.model_dump().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Task updated", data=TaskOut.model_validate(obj))


# ---- 3.0 Matching ----
@api.get("/assignments", response_model=ApiResponse[list[AssignmentOut]])
def list_assignments(db: DbSession, user: CurrentUser, project_id: Optional[int] = None):
    q = db.query(Assignment).options(joinedload(Assignment.creator), joinedload(Assignment.project))
    if project_id:
        q = q.filter(Assignment.project_id == project_id)
    if user.role == "creative" and user.creator_id:
        q = q.filter(Assignment.creator_id == user.creator_id)
    return ApiResponse(data=[AssignmentOut.model_validate(x) for x in q.order_by(Assignment.id.desc()).all()])


@api.post("/assignments", response_model=ApiResponse[AssignmentOut])
def create_assignment(payload: AssignmentIn, db: DbSession, user: CurrentUser):
    obj = Assignment(**payload.model_dump(), status="shortlisted")
    project = db.get(Project, payload.project_id)
    if project and project.status in ("intake", "quoting"):
        project.status = "matching"
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Creator shortlisted", data=AssignmentOut.model_validate(obj))


@api.post("/assignments/{item_id}/offer", response_model=ApiResponse[AssignmentOut])
def offer_assignment(item_id: int, db: DbSession, user: CurrentUser, offer_amount: Optional[Decimal] = None):
    obj = db.get(Assignment, item_id)
    if not obj:
        raise HTTPException(404, "Not found")
    obj.status = "offered"
    if offer_amount is not None:
        obj.offer_amount = offer_amount
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Offer sent", data=AssignmentOut.model_validate(obj))


@api.post("/assignments/{item_id}/respond", response_model=ApiResponse[AssignmentOut])
def respond_assignment(item_id: int, accept: bool, db: DbSession, user: CurrentUser):
    obj = db.get(Assignment, item_id)
    if not obj:
        raise HTTPException(404, "Not found")
    obj.status = "accepted" if accept else "declined"
    obj.responded_at = datetime.utcnow()
    if accept:
        project = db.get(Project, obj.project_id)
        if project:
            project.creator_id = obj.creator_id
            project.status = "assigned"
            if obj.offer_amount:
                project.quoted_amount = obj.offer_amount
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Response recorded", data=AssignmentOut.model_validate(obj))


# ---- 4.0 Communication ----
@api.get("/projects/{project_id}/messages", response_model=ApiResponse[list[MessageOut]])
def list_messages(project_id: int, db: DbSession, user: CurrentUser):
    rows = (
        db.query(Message)
        .options(joinedload(Message.sender))
        .filter(Message.project_id == project_id)
        .order_by(Message.id)
        .all()
    )
    return ApiResponse(data=[MessageOut.model_validate(x) for x in rows])


@api.post("/messages", response_model=ApiResponse[MessageOut])
def create_message(payload: MessageIn, db: DbSession, user: CurrentUser):
    obj = Message(project_id=payload.project_id, body=payload.body, message_type=payload.message_type, sender_user_id=user.id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Message sent", data=MessageOut.model_validate(obj))


@api.get("/notifications", response_model=ApiResponse[list[NotificationOut]])
def list_notifications(db: DbSession, user: CurrentUser):
    rows = (
        db.query(Notification)
        .filter(Notification.user_id == user.id)
        .order_by(Notification.id.desc())
        .limit(50)
        .all()
    )
    return ApiResponse(data=[NotificationOut.model_validate(x) for x in rows])


@api.post("/notifications/{item_id}/read", response_model=ApiResponse[NotificationOut])
def mark_notification_read(item_id: int, db: DbSession, user: CurrentUser):
    obj = db.get(Notification, item_id)
    if not obj or obj.user_id != user.id:
        raise HTTPException(404, "Not found")
    obj.is_read = True
    db.commit()
    db.refresh(obj)
    return ApiResponse(data=NotificationOut.model_validate(obj))


# ---- D5 Files ----
@api.get("/projects/{project_id}/files", response_model=ApiResponse[list[FileOut]])
def list_files(project_id: int, db: DbSession, user: CurrentUser):
    rows = db.query(ProjectFile).filter(ProjectFile.project_id == project_id).order_by(ProjectFile.id.desc()).all()
    return ApiResponse(data=[FileOut.model_validate(x) for x in rows])


@api.post("/files", response_model=ApiResponse[FileOut])
def create_file(payload: FileIn, db: DbSession, user: CurrentUser):
    obj = ProjectFile(**payload.model_dump(), uploaded_by=user.id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="File recorded", data=FileOut.model_validate(obj))


# ---- 6.0 Quality ----
@api.get("/quality-reviews", response_model=ApiResponse[list[QualityReviewOut]])
def list_reviews_qa(db: DbSession, user: CurrentUser, project_id: Optional[int] = None):
    q = db.query(QualityReview)
    if project_id:
        q = q.filter(QualityReview.project_id == project_id)
    return ApiResponse(data=[QualityReviewOut.model_validate(x) for x in q.order_by(QualityReview.id.desc()).all()])


@api.post("/quality-reviews", response_model=ApiResponse[QualityReviewOut])
def create_qa(payload: QualityReviewIn, db: DbSession, user: CurrentUser):
    obj = QualityReview(**payload.model_dump(), reviewer_user_id=user.id)
    project = db.get(Project, payload.project_id)
    if project:
        if payload.status == "revision_requested":
            project.status = "in_progress"
        elif payload.status == "approved" and payload.stage == "qa":
            project.status = "client_review"
        elif payload.status == "approved" and payload.stage == "client":
            project.status = "delivered"
            project.progress_pct = 100
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Review saved", data=QualityReviewOut.model_validate(obj))


# ---- 7.0 Billing ----
@api.get("/invoices", response_model=ApiResponse[list[InvoiceOut]])
def list_invoices(db: DbSession, user: CurrentUser):
    q = db.query(Invoice).options(joinedload(Invoice.project), joinedload(Invoice.business))
    if user.role == "business" and user.business_id:
        q = q.filter(Invoice.business_id == user.business_id)
    return ApiResponse(data=[InvoiceOut.model_validate(x) for x in q.order_by(Invoice.id.desc()).all()])


@api.post("/invoices", response_model=ApiResponse[InvoiceOut])
def create_invoice(payload: InvoiceIn, db: DbSession, user: CurrentUser):
    total = payload.amount + payload.tax_amount
    obj = Invoice(
        invoice_no=next_doc_no(db, "INVOICE"),
        total_amount=total,
        status="sent",
        **payload.model_dump(),
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Invoice created", data=InvoiceOut.model_validate(obj))


@api.post("/invoices/{item_id}/pay", response_model=ApiResponse[InvoiceOut])
def pay_invoice(item_id: int, db: DbSession, user: CurrentUser, gateway: str = "stripe"):
    inv = db.get(Invoice, item_id)
    if not inv:
        raise HTTPException(404, "Not found")
    if inv.status == "paid":
        raise HTTPException(400, "Already paid")
    inv.status = "paid"
    inv.paid_at = datetime.utcnow()
    inv.gateway_ref = f"{gateway}_sim_{inv.invoice_no}"
    payment = Payment(
        payment_no=next_doc_no(db, "PAYMENT"),
        invoice_id=inv.id,
        project_id=inv.project_id,
        direction="inbound",
        amount=inv.total_amount,
        currency=inv.currency,
        status="completed",
        gateway=gateway,
        gateway_ref=inv.gateway_ref,
        notes="Simulated gateway confirmation",
    )
    db.add(payment)
    db.commit()
    db.refresh(inv)
    return ApiResponse(message="Payment confirmed", data=InvoiceOut.model_validate(inv))


@api.get("/payments", response_model=ApiResponse[list[PaymentOut]])
def list_payments(db: DbSession, user: CurrentUser):
    rows = db.query(Payment).order_by(Payment.id.desc()).all()
    return ApiResponse(data=[PaymentOut.model_validate(x) for x in rows])


@api.post("/payments", response_model=ApiResponse[PaymentOut])
def create_payment(payload: PaymentIn, db: DbSession, user: CurrentUser):
    obj = Payment(
        payment_no=next_doc_no(db, "PAYMENT"),
        status="escrow" if payload.direction == "payout" else "pending",
        **payload.model_dump(),
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Payment recorded", data=PaymentOut.model_validate(obj))


@api.post("/payments/{item_id}/release", response_model=ApiResponse[PaymentOut])
def release_payout(item_id: int, db: DbSession, user: CurrentUser):
    obj = db.get(Payment, item_id)
    if not obj:
        raise HTTPException(404, "Not found")
    if obj.direction != "payout":
        raise HTTPException(400, "Only payouts can be released")
    obj.status = "completed"
    obj.gateway_ref = obj.gateway_ref or f"{obj.gateway}_payout_{obj.payment_no}"
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Payout released", data=PaymentOut.model_validate(obj))


# ---- D7 Reviews ----
@api.get("/reviews", response_model=ApiResponse[list[ReviewOut]])
def list_reviews(db: DbSession, user: CurrentUser):
    rows = db.query(Review).order_by(Review.id.desc()).all()
    return ApiResponse(data=[ReviewOut.model_validate(x) for x in rows])


@api.post("/reviews", response_model=ApiResponse[ReviewOut])
def create_review(payload: ReviewIn, db: DbSession, user: CurrentUser):
    obj = Review(**payload.model_dump(), from_user_id=user.id)
    if payload.to_creator_id and payload.rating:
        creator = db.get(Creator, payload.to_creator_id)
        if creator:
            total = (creator.rating_avg * creator.rating_count) + payload.rating
            creator.rating_count += 1
            creator.rating_avg = (total / creator.rating_count).quantize(Decimal("0.01"))
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return ApiResponse(message="Review submitted", data=ReviewOut.model_validate(obj))
