"""Smart Fridge service — generates a single, macro-balanced recipe.

The prompt enforces:
- USE ONLY the provided ingredients (+ basic pantry staples).
- Strictly clinical/instructional tone in steps (no banter).
- Return JSON conforming to RecipeResponse schema.
"""

from __future__ import annotations

import json

from openai import OpenAI

from app.core.config import settings
from app.schemas.fridge import RecipeResponse

_SYSTEM_PROMPT = (
    "Ti si nutricionist i kuhar. Vrati ISKLJUČIVO jedan zdrav, makro-balansiran "
    "recept na hrvatskom jeziku, koristeći SAMO navedene namirnice (uz dozvoljene "
    "osnove: sol, papar, voda, ulje). Bez nepotrebnog teksta. Bez uvoda. "
    "Odgovori isključivo kao validan JSON s poljima: title (string), servings (int), "
    "ingredients (string[]), steps (string[]), macros { calories_kcal, protein_g, "
    "carbs_g, fat_g } (svi int). Koraci moraju biti kratki, precizni, imperativ."
)


def generate_recipe(ingredients: list[str]) -> RecipeResponse:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured")

    client = OpenAI(api_key=settings.openai_api_key)

    user_prompt = (
        "Namirnice koje korisnik ima kod kuće: "
        + ", ".join(i.strip() for i in ingredients if i.strip())
    )

    response = client.chat.completions.create(
        model=settings.openai_model,
        response_format={"type": "json_object"},
        temperature=0.4,
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
    )

    content = response.choices[0].message.content or "{}"
    data = json.loads(content)
    return RecipeResponse(**data)
