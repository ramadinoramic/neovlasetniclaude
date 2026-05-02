# Anatomy images

Drop two PNG / JPG / SVG files here:

- `front.png` — front view of human body (anatomy chart, mannequin, illustration)
- `back.png`  — back view

## Recommended sources (free / public domain)

- **Wikimedia Commons** — search for "human anatomy front" / "human muscles posterior"
  https://commons.wikimedia.org/wiki/Category:Diagrams_of_human_anatomy_in_English
- **Pixabay** — free photos and illustrations https://pixabay.com/images/search/anatomy/
- **Unsplash** — free photos https://unsplash.com/s/photos/anatomy-mannequin

## Image specifications

- **Aspect ratio**: portrait, ~2:3 (e.g. 600×900 px or 800×1200 px)
- **Body**: standing T-pose or arms-down, feet visible
- **Background**: ideally transparent (PNG) or solid white/black; will sit on dark theme
- **Body fills**: ~80–90% of canvas vertically (no big margins)

## How highlights are positioned

`BodyHighlight.tsx` uses **percentage coordinates** mapped to muscles. The defaults
work for a standard anatomy chart layout. If your image has different proportions
(e.g. body is shifted), tweak the `ZONES` map in `frontend/src/components/training/BodyHighlight.tsx`.

## Until you add images

If `front.png` / `back.png` are missing, the component renders a minimal SVG
silhouette placeholder so the page still works.
