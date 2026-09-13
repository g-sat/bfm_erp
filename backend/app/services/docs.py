from decimal import Decimal

from sqlalchemy.orm import Session

from app.models import DocumentSequence


def next_doc_no(db: Session, doc_type: str) -> str:
    seq = db.query(DocumentSequence).filter(DocumentSequence.doc_type == doc_type).first()
    if not seq:
        raise ValueError(f"Document sequence not found for {doc_type}")
    number = seq.next_number
    seq.next_number = number + 1
    db.add(seq)
    return f"{seq.prefix}{str(number).zfill(seq.pad_length)}"


def calc_line_amounts(qty: Decimal, unit_price: Decimal, tax_rate: Decimal):
    amount = (qty * unit_price).quantize(Decimal("0.01"))
    tax_amount = (amount * tax_rate / Decimal("100")).quantize(Decimal("0.01"))
    return amount, tax_amount, amount + tax_amount
