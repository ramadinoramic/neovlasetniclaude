from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import check_in, fridge
from app.core.config import settings

app = FastAPI(
    title="Neovlašteni fitness instruktor — API",
    version="0.1.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(check_in.router, prefix="/api")
app.include_router(fridge.router, prefix="/api")
