from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from services.image_analyzer import ImageAnalyzerService

router = APIRouter(tags=["image-analyzer"])

@router.post("/analyze-image")
async def analyze_image(
    image: UploadFile = File(...),
    language: str = Form(default="en")
):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload a valid image file.")
    try:
        image_data = await image.read()
        service = ImageAnalyzerService(language=language)
        analysis, error = service.analyze_crop_image(image_data, image.content_type)
        if error:
            raise HTTPException(status_code=500, detail=error)
        return {"analysis": analysis}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
