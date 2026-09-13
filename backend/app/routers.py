from datetime import datetime
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import func, or_
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
    try:
        projects_q = db.query(Project)
        if user.role == "business" and user.business_id:
            projects_q = projects_q.filter(Project.business_id == user.business_id)
        elif user.role == "creative" and user.creator_id:
            projects_q = projects_q.filter(Project.creator_id == user.creator_id)
        elif user.role == "pm":
            projects_q = projects_q.filter(Project.pm_user_id == user.id)

        # Keep this light — dashboard cards only need business/creator, not collections
        recent = (
            projects_q.options(
                joinedload(Project.business),
                joinedload(Project.creator),
            )
            .order_by(Project.id.desc())
            .limit(6)
            .all()
        )
        scoped_projects = projects_q.order_by(Project.id.desc()).all()

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

        status_counts: dict[str, int] = {}
        category_counts: dict[str, int] = {}
        for p in scoped_projects:
            status_counts[p.status or "unknown"] = status_counts.get(p.status or "unknown", 0) + 1
            cat = (p.category or "general").strip() or "general"
            category_counts[cat] = category_counts.get(cat, 0) + 1

        creator_rows = db.query(Creator).filter(Creator.is_active.is_(True)).all()
        creator_avail: dict[str, int] = {}
        for c in creator_rows:
            key = c.availability or "unknown"
            creator_avail[key] = creator_avail.get(key, 0) + 1

        invoice_rows = db.query(Invoice.status).all()
        invoice_status: dict[str, int] = {}
        for (status,) in invoice_rows:
            key = status or "unknown"
            invoice_status[key] = invoice_status.get(key, 0) + 1

        month_keys: list[tuple[int, int, str]] = []
        now = datetime.utcnow()
        yy, mm = now.year, now.month
        for _ in range(6):
            month_keys.append((yy, mm, datetime(yy, mm, 1).strftime("%b")))
            mm -= 1
            if mm <= 0:
                mm = 12
                yy -= 1
        month_keys.reverse()

        cash_map = {(y, m): {"inbound": 0.0, "payout": 0.0} for y, m, _ in month_keys}
        for pay in db.query(Payment).all():
            created = pay.created_at
            if not created:
                continue
            key = (int(created.year), int(created.month))
            if key not in cash_map:
                continue
            amt = float(pay.amount or 0)
            if pay.direction == "inbound":
                cash_map[key]["inbound"] += amt
            elif pay.direction == "payout":
                cash_map[key]["payout"] += amt

        cashflow = [
            CashflowPoint(
                name=label,
                inbound=cash_map[(y, m)]["inbound"],
                payout=cash_map[(y, m)]["payout"],
            )
            for y, m, label in month_keys
        ]

        active_statuses = {"assigned", "in_progress", "qa", "client_review", "delivered"}
        delivery_rows = sorted(
            [p for p in scoped_projects if p.status in active_statuses],
            key=lambda p: p.progress_pct or 0,
            reverse=True,
        )[:8]

        avg_progress = (
            round(sum((p.progress_pct or 0) for p in scoped_projects) / len(scoped_projects), 1)
            if scoped_projects
            else 0.0
        )
        pipeline_active = {
            "intake",
            "quoting",
            "matching",
            "assigned",
            "in_progress",
            "qa",
            "client_review",
        }

        assignments_open = (
            db.query(func.count(Assignment.id))
            .filter(Assignment.status.in_(["shortlisted", "offered"]))
            .scalar()
            or 0
        )
        quality_pending = (
            db.query(func.count(QualityReview.id))
            .filter(QualityReview.status.in_(["pending", "revision_requested"]))
            .scalar()
            or 0
        )

        data = DashboardOut(
            projects_total=len(scoped_projects),
            projects_active=sum(1 for p in scoped_projects if p.status in pipeline_active),
            projects_in_qa=sum(1 for p in scoped_projects if p.status in {"qa", "client_review"}),
            businesses=db.query(Business).filter(Business.is_active.is_(True)).count(),
            creators=len(creator_rows),
            creators_available=creator_avail.get("available", 0),
            invoices_open=invoice_status.get("draft", 0) + invoice_status.get("sent", 0),
            revenue_collected=Decimal(str(revenue or 0)),
            payouts_pending=Decimal(str(payouts_pending or 0)),
            unread_notifications=db.query(Notification).filter(
                Notification.user_id == user.id, Notification.is_read.is_(False)
            ).count(),
            recent_projects=[ProjectOut.model_validate(p) for p in recent],
            recent_invoices=[InvoiceOut.model_validate(i) for i in invoices],
            projects_by_status=[
                ChartSlice(name=k, value=float(v)) for k, v in sorted(status_counts.items())
            ],
            projects_by_category=[
                ChartSlice(name=k, value=float(v)) for k, v in sorted(category_counts.items())
            ],
            creators_by_availability=[
                ChartSlice(name=k, value=float(v)) for k, v in sorted(creator_avail.items())
            ],
            invoices_by_status=[
                ChartSlice(name=k, value=float(v)) for k, v in sorted(invoice_status.items())
            ],
            cashflow=cashflow,
            delivery_progress=[
                ProgressPoint(name=p.code, progress=float(p.progress_pct or 0), status=p.status)
                for p in delivery_rows
            ],
            avg_progress=float(avg_progress),
            assignments_open=int(assignments_open),
            quality_pending=int(quality_pending),
        )
        return ApiResponse(data=data)
    except HTTPException:
        raise
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"dashboard_error: {type(exc).__name__}: {exc}",
        ) from exc


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
