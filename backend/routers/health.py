from fastapi import APIRouter

router = APIRouter(tags=["health"])

@router.get("/healthz")
async def health_check():
    return {"status": "ok"}
