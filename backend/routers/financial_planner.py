from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.financial_planner import FinancialPlannerService

router = APIRouter(tags=["financial-planner"])

class FinancialPlanRequest(BaseModel):
    crop: str
    land: float
    budget: float
    language: str = "en"

class FinancialPlanResponse(BaseModel):
    plan: str

@router.post("/financial-plan", response_model=FinancialPlanResponse)
async def get_financial_plan(request: FinancialPlanRequest):
    if not request.crop.strip():
        raise HTTPException(status_code=400, detail="Please enter a valid crop name.")
    if request.land <= 0:
        raise HTTPException(status_code=400, detail="Please enter a valid land area.")
    if request.budget <= 0:
        raise HTTPException(status_code=400, detail="Please enter a valid budget.")
    try:
        service = FinancialPlannerService(language=request.language)
        plan, error = service.get_financial_plan(request.crop, request.land, request.budget)
        if error:
            raise HTTPException(status_code=500, detail=error)
        return {"plan": plan}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
