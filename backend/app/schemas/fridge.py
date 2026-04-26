from pydantic import BaseModel, Field


class FridgeRequest(BaseModel):
    ingredients: list[str] = Field(..., min_length=1, max_length=12)


class Macros(BaseModel):
    calories_kcal: int
    protein_g: int
    carbs_g: int
    fat_g: int


class RecipeResponse(BaseModel):
    title: str
    servings: int
    ingredients: list[str]
    steps: list[str]
    macros: Macros
