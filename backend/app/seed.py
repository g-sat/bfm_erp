from datetime import date, datetime, timedelta
from decimal import Decimal

from sqlalchemy.orm import Session

from app.auth import hash_password
from app.models import (
    Assignment,
    Business,
    Company,
    Creator,
    DocumentSequence,
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


def seed_database(db: Session) -> None:
    if db.query(User).first():
        return

    company = Company(
        code="BFM",
        name="BOLDFRAME",
        tagline="The Operating System for Creative Services",
        email="hello@boldframe.io",
        phone="+91 98765 43210",
    )
    db.add(company)

    for doc_type, prefix in [
        ("PROJECT", "PRJ-"),
        ("INVOICE", "INV-"),
        ("PAYMENT", "PAY-"),
        ("BUSINESS", "BIZ-"),
        ("CREATOR", "CR-"),
    ]:
        db.add(DocumentSequence(doc_type=doc_type, prefix=prefix, next_number=1001, pad_length=4))

    businesses = [
        Business(
            code="BIZ-1001",
            name="NovaStart Labs",
            industry="SaaS / Startup",
            contact_name="Ananya Rao",
            email="ananya@novastart.io",
            phone="+91 90000 11111",
            website="https://novastart.io",
            subscription="growth",
            team_size=12,
            address="Koramangala, Bengaluru",
        ),
        Business(
            code="BIZ-1002",
            name="PixelHouse Agency",
            industry="Marketing Agency",
            contact_name="Rahul Mehta",
            email="rahul@pixelhouse.co",
            phone="+91 90000 22222",
            subscription="enterprise",
            team_size=40,
            address="Bandra, Mumbai",
        ),
        Business(
            code="BIZ-1003",
            name="GreenCart Retail",
            industry="E-commerce",
            contact_name="Priya Shah",
            email="priya@greencart.in",
            phone="+91 90000 33333",
            subscription="starter",
            team_size=8,
            address="Gurgaon, Delhi NCR",
        ),
    ]
    db.add_all(businesses)
    db.flush()

    creators = [
        Creator(
            code="CR-1001",
            display_name="Aisha Khan",
            headline="Brand & UI Designer",
            bio="8 years crafting brand systems and product UI for startups.",
            skills="Brand Identity,UI Design,Figma,Design Systems",
            categories="design",
            experience_years=8,
            hourly_rate=Decimal("2500"),
            day_rate=Decimal("18000"),
            availability="available",
            portfolio_url="https://portfolio.example/aisha",
            location="Bengaluru",
            rating_avg=Decimal("4.80"),
            rating_count=24,
            is_verified=True,
        ),
        Creator(
            code="CR-1002",
            display_name="Dev Patel",
            headline="Motion & Video Editor",
            bio="High-energy motion graphics and product launch videos.",
            skills="After Effects,Premiere,Motion Graphics,Color Grade",
            categories="video,motion",
            experience_years=6,
            hourly_rate=Decimal("2200"),
            day_rate=Decimal("16000"),
            availability="available",
            portfolio_url="https://portfolio.example/dev",
            location="Mumbai",
            rating_avg=Decimal("4.60"),
            rating_count=18,
            is_verified=True,
        ),
        Creator(
            code="CR-1003",
            display_name="Maya Fernandes",
            headline="Content Strategist & Writer",
            bio="B2B content systems, landing copy, and campaign narratives.",
            skills="Copywriting,Content Strategy,SEO,Brand Voice",
            categories="writing",
            experience_years=7,
            hourly_rate=Decimal("1800"),
            day_rate=Decimal("12000"),
            availability="busy",
            portfolio_url="https://portfolio.example/maya",
            location="Goa",
            rating_avg=Decimal("4.90"),
            rating_count=31,
            is_verified=True,
        ),
        Creator(
            code="CR-1004",
            display_name="Arjun Iyer",
            headline="Full-stack Creative Developer",
            bio="Interactive microsites and WebGL experiences.",
            skills="Next.js,Three.js,GSAP,WebGL",
            categories="development",
            experience_years=5,
            hourly_rate=Decimal("3000"),
            day_rate=Decimal("22000"),
            availability="available",
            location="Hyderabad",
            rating_avg=Decimal("4.70"),
            rating_count=12,
            is_verified=False,
        ),
    ]
    db.add_all(creators)
    db.flush()

    admin = User(
        username="admin",
        full_name="BFM Admin",
        email="admin@boldframe.io",
        hashed_password=hash_password("admin123"),
        role="admin",
        is_verified=True,
    )
    pm = User(
        username="pm",
        full_name="Sneha Kapoor",
        email="sneha@boldframe.io",
        hashed_password=hash_password("pm12345"),
        role="pm",
        is_verified=True,
        phone="+91 98888 10001",
    )
    client = User(
        username="client",
        full_name="Ananya Rao",
        email="ananya@novastart.io",
        hashed_password=hash_password("client123"),
        role="business",
        is_verified=True,
        business_id=businesses[0].id,
    )
    creative = User(
        username="creative",
        full_name="Aisha Khan",
        email="aisha@creatives.bfm",
        hashed_password=hash_password("creative123"),
        role="creative",
        is_verified=True,
        creator_id=creators[0].id,
    )
    db.add_all([admin, pm, client, creative])
    db.flush()

    today = date.today()
    p1 = Project(
        code="PRJ-1001",
        title="NovaStart Brand Refresh",
        brief="Full brand identity refresh including logo system, color, type, and UI kit.",
        category="design",
        status="in_progress",
        priority="high",
        budget=Decimal("450000"),
        quoted_amount=Decimal("420000"),
        currency="INR",
        start_date=today - timedelta(days=14),
        due_date=today + timedelta(days=30),
        business_id=businesses[0].id,
        pm_user_id=pm.id,
        creator_id=creators[0].id,
        progress_pct=55,
        requirements="Must feel premium SaaS. Deliver Figma source + brand book PDF.",
    )
    p1.milestones = [
        Milestone(
            title="Discovery & Moodboards",
            due_date=today - timedelta(days=7),
            amount=Decimal("80000"),
            status="approved",
            sort_order=1,
        ),
        Milestone(
            title="Logo & Visual System",
            due_date=today + timedelta(days=7),
            amount=Decimal("160000"),
            status="in_progress",
            sort_order=2,
        ),
        Milestone(
            title="UI Kit & Brand Book",
            due_date=today + timedelta(days=30),
            amount=Decimal("180000"),
            status="pending",
            sort_order=3,
        ),
    ]
    p1.tasks = [
        Task(title="Stakeholder interview notes", status="done", estimated_hours=Decimal("8"), logged_hours=Decimal("8")),
        Task(title="Logo exploration set A/B", status="doing", estimated_hours=Decimal("20"), logged_hours=Decimal("12")),
        Task(title="Color & type tokens", status="todo", estimated_hours=Decimal("10")),
    ]
    p1.files = [
        ProjectFile(name="nova-brief.pdf", file_type="brief", url="/files/nova-brief.pdf", uploaded_by=client.id),
        ProjectFile(name="competitor-refs.zip", file_type="reference", url="/files/refs.zip", uploaded_by=client.id),
        ProjectFile(name="moodboard-v2.fig", file_type="deliverable", url="/files/moodboard.fig", uploaded_by=creative.id, version=2),
    ]

    p2 = Project(
        code="PRJ-1002",
        title="GreenCart Product Launch Film",
        brief="60s launch film + 15s cutdowns for social.",
        category="video",
        status="matching",
        priority="medium",
        budget=Decimal("280000"),
        currency="INR",
        start_date=today + timedelta(days=3),
        due_date=today + timedelta(days=45),
        business_id=businesses[2].id,
        pm_user_id=pm.id,
        progress_pct=10,
        requirements="Sustainable grocery vibe. Voiceover + licensed music.",
    )

    p3 = Project(
        code="PRJ-1003",
        title="PixelHouse Website Microsite",
        brief="Interactive agency capabilities microsite.",
        category="development",
        status="qa",
        priority="high",
        budget=Decimal("350000"),
        quoted_amount=Decimal("340000"),
        currency="INR",
        start_date=today - timedelta(days=40),
        due_date=today + timedelta(days=5),
        business_id=businesses[1].id,
        pm_user_id=pm.id,
        creator_id=creators[3].id,
        progress_pct=90,
        requirements="Next.js + Three.js hero. Lighthouse 90+.",
    )
    p3.milestones = [
        Milestone(title="Build & Interactions", amount=Decimal("200000"), status="approved", sort_order=1),
        Milestone(title="QA & Launch", amount=Decimal("140000"), status="submitted", sort_order=2, due_date=today + timedelta(days=5)),
    ]

    p4 = Project(
        code="PRJ-1004",
        title="NovaStart Content Sprint",
        brief="Landing page copy + 6 nurture emails.",
        category="writing",
        status="client_review",
        priority="medium",
        budget=Decimal("90000"),
        quoted_amount=Decimal("85000"),
        currency="INR",
        business_id=businesses[0].id,
        pm_user_id=pm.id,
        creator_id=creators[2].id,
        progress_pct=85,
        due_date=today + timedelta(days=2),
    )

    db.add_all([p1, p2, p3, p4])
    db.flush()

    db.add_all(
        [
            Assignment(project_id=p2.id, creator_id=creators[1].id, status="offered", match_score=92, offer_amount=Decimal("240000"), notes="Strong motion reel match"),
            Assignment(project_id=p2.id, creator_id=creators[0].id, status="shortlisted", match_score=70, notes="Backup for art direction"),
            Assignment(project_id=p1.id, creator_id=creators[0].id, status="accepted", match_score=95, offer_amount=Decimal("420000"), responded_at=datetime.utcnow()),
        ]
    )

    db.add_all(
        [
            Message(project_id=p1.id, sender_user_id=pm.id, body="Kickoff scheduled. Please share brand guidelines folder.", message_type="chat"),
            Message(project_id=p1.id, sender_user_id=client.id, body="Uploaded competitor refs and old logo pack.", message_type="chat"),
            Message(project_id=p1.id, sender_user_id=creative.id, body="Moodboard v2 ready for internal QA.", message_type="chat"),
            Message(project_id=p3.id, sender_user_id=pm.id, body="Microsite moved to QA. Client review Friday.", message_type="alert"),
        ]
    )

    db.add(
        QualityReview(
            project_id=p3.id,
            milestone_id=p3.milestones[1].id if p3.milestones else None,
            reviewer_user_id=pm.id,
            stage="qa",
            status="pending",
            feedback="Check mobile scroll performance on hero.",
        )
    )
    db.add(
        QualityReview(
            project_id=p4.id,
            reviewer_user_id=None,
            stage="client",
            status="pending",
            feedback="Awaiting client acceptance on email sequence.",
        )
    )

    inv1 = Invoice(
        invoice_no="INV-1001",
        project_id=p1.id,
        business_id=businesses[0].id,
        milestone_id=p1.milestones[0].id,
        amount=Decimal("80000"),
        tax_amount=Decimal("14400"),
        total_amount=Decimal("94400"),
        status="paid",
        due_date=today - timedelta(days=5),
        paid_at=datetime.utcnow() - timedelta(days=3),
        gateway_ref="stripe_ch_001",
    )
    inv2 = Invoice(
        invoice_no="INV-1002",
        project_id=p1.id,
        business_id=businesses[0].id,
        milestone_id=p1.milestones[1].id,
        amount=Decimal("160000"),
        tax_amount=Decimal("28800"),
        total_amount=Decimal("188800"),
        status="sent",
        due_date=today + timedelta(days=10),
    )
    inv3 = Invoice(
        invoice_no="INV-1003",
        project_id=p3.id,
        business_id=businesses[1].id,
        amount=Decimal("200000"),
        tax_amount=Decimal("36000"),
        total_amount=Decimal("236000"),
        status="paid",
        paid_at=datetime.utcnow() - timedelta(days=10),
        gateway_ref="razorpay_pay_991",
    )
    db.add_all([inv1, inv2, inv3])
    db.flush()

    db.add_all(
        [
            Payment(
                payment_no="PAY-1001",
                invoice_id=inv1.id,
                project_id=p1.id,
                direction="inbound",
                amount=Decimal("94400"),
                status="completed",
                gateway="stripe",
                gateway_ref="stripe_ch_001",
            ),
            Payment(
                payment_no="PAY-1002",
                invoice_id=inv1.id,
                project_id=p1.id,
                direction="payout",
                amount=Decimal("60000"),
                status="completed",
                gateway="stripe",
                payee_creator_id=creators[0].id,
                notes="Milestone 1 creator payout",
            ),
            Payment(
                payment_no="PAY-1003",
                project_id=p3.id,
                direction="payout",
                amount=Decimal("120000"),
                status="escrow",
                gateway="razorpay",
                payee_creator_id=creators[3].id,
                notes="Held until QA approval",
            ),
            Payment(
                payment_no="PAY-1004",
                invoice_id=inv3.id,
                project_id=p3.id,
                direction="inbound",
                amount=Decimal("236000"),
                status="completed",
                gateway="razorpay",
            ),
        ]
    )

    db.add_all(
        [
            Review(
                project_id=p1.id,
                from_user_id=client.id,
                to_role="creative",
                to_creator_id=creators[0].id,
                rating=5,
                comment="Clear process and strong first moodboards.",
            ),
            Review(
                project_id=p1.id,
                from_user_id=creative.id,
                to_role="business",
                to_business_id=businesses[0].id,
                rating=5,
                comment="Great brief and fast feedback loops.",
            ),
        ]
    )

    db.add_all(
        [
            Notification(user_id=pm.id, title="New project intake", body="GreenCart Product Launch Film needs talent match.", channel="in_app", link="/matching"),
            Notification(user_id=client.id, title="Invoice sent", body="INV-1002 for Logo & Visual System is ready.", channel="email", link="/billing/invoices"),
            Notification(user_id=creative.id, title="Assignment update", body="Continue Logo exploration for NovaStart.", channel="in_app", link="/projects/PRJ-1001", is_read=True),
            Notification(user_id=admin.id, title="Payout in escrow", body="PAY-1003 awaiting QA release.", channel="in_app", link="/billing/payments"),
        ]
    )

    for seq in db.query(DocumentSequence).all():
        seq.next_number = 1005

    db.commit()
