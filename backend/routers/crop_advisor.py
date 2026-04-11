from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.crop_advisor import CropAdvisorService

router = APIRouter(tags=["crop-advisor"])

class CropAdviceRequest(BaseModel):
    crop_name: str
    language: str = "en"
    season: Optional[str] = None

class CropAdviceResponse(BaseModel):
    advice: str

@router.post("/crop-advice", response_model=CropAdviceResponse)
async def get_crop_advice(request: CropAdviceRequest):
    if not request.crop_name.strip():
        raise HTTPException(status_code=400, detail="Please enter a valid crop name.")
    try:
        service = CropAdvisorService(language=request.language)
        advice, error = service.get_crop_advice(request.crop_name)
        if error:
            raise HTTPException(status_code=500, detail=error)
        return {"advice": advice}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
