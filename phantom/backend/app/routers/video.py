import uuid
from fastapi import APIRouter, UploadFile, File

router = APIRouter()

# In-memory job store for skeleton — replace with Redis/Celery
_jobs: dict = {}


@router.post("/video")
async def analyze_video(file: UploadFile = File(...)):
    """Async deepfake detection via Celery worker."""
    # TODO: enqueue Celery task — OpenCV frames, face detection, temporal scoring
    job_id = str(uuid.uuid4())
    _jobs[job_id] = {
        "status": "queued",
        "progress": 0.0,
        "filename": file.filename,
        "message": "Video queued for analysis",
    }
    return {"job_id": job_id, "status": "queued"}
