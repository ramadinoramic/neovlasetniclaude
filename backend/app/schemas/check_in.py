from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

Recommendation = Literal[
    "mobility", "light_cardio", "balanced", "strength", "heavy_strength"
]


class CheckInCreate(BaseModel):
    user_id: str = Field(..., min_length=1, max_length=64)
    energy_level: int = Field(..., ge=1, le=5)


class CheckInRead(BaseModel):
    id: int
    user_id: str
    energy_level: int
    recommendation: Recommendation
    created_at: datetime

    class Config:
        from_attributes = True
