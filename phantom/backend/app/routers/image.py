from fastapi import APIRouter, UploadFile, File

from app.services.mock_data import IMAGE_SAMPLE

router = APIRouter()


@router.post("/image")
async def analyze_image(file: UploadFile = File(...)):
    """EfficientNet + FFT + CLIP ensemble with GradCAM heatmap."""
    # TODO: EfficientNet-B0, FFT frequency analysis, CLIP embeddings, GradCAM
    return {**IMAGE_SAMPLE, "filename": file.filename}
