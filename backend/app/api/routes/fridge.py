from fastapi import APIRouter, HTTPException, status

from app.schemas.fridge import FridgeRequest, RecipeResponse
from app.services.fridge import generate_recipe

router = APIRouter(prefix="/fridge", tags=["fridge"])


@router.post("/recipe", response_model=RecipeResponse)
def create_recipe(payload: FridgeRequest) -> RecipeResponse:
    try:
        return generate_recipe(payload.ingredients)
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)
        ) from exc
