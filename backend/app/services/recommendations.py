from typing import Literal

Recommendation = Literal[
    "mobility", "light_cardio", "balanced", "strength", "heavy_strength"
]

_MAP: dict[int, Recommendation] = {
    1: "mobility",
    2: "light_cardio",
    3: "balanced",
    4: "strength",
    5: "heavy_strength",
}


def recommend_from_energy(energy_level: int) -> Recommendation:
    """Map 1–5 energy level to a workout track. Pure function — no copy."""
    clamped = max(1, min(5, energy_level))
    return _MAP[clamped]
