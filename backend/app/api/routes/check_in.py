from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.check_in import CheckIn
from app.schemas.check_in import CheckInCreate, CheckInRead
from app.services.recommendations import recommend_from_energy

router = APIRouter(prefix="/check-in", tags=["check-in"])


@router.post("", response_model=CheckInRead, status_code=201)
def create_check_in(payload: CheckInCreate, db: Session = Depends(get_db)) -> CheckIn:
    recommendation = recommend_from_energy(payload.energy_level)
    row = CheckIn(
        user_id=payload.user_id,
        energy_level=payload.energy_level,
        recommendation=recommendation,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row
