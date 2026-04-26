from app.services.recommendations import recommend_from_energy


def test_low_energy_maps_to_mobility():
    assert recommend_from_energy(1) == "mobility"


def test_mid_energy_maps_to_balanced():
    assert recommend_from_energy(3) == "balanced"


def test_high_energy_maps_to_heavy_strength():
    assert recommend_from_energy(5) == "heavy_strength"


def test_out_of_range_is_clamped():
    assert recommend_from_energy(0) == "mobility"
    assert recommend_from_energy(99) == "heavy_strength"
