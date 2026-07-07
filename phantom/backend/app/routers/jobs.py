from fastapi import APIRouter, HTTPException

from app.services.mock_data import VIDEO_SAMPLE

router = APIRouter()

# Shared with video router in production via Redis
_jobs: dict = {}


def register_job(job_id: str, data: dict):
    _jobs[job_id] = data


@router.get("/{job_id}")
def get_job(job_id: str):
    """Poll async job status (video analysis, large documents)."""
    if job_id not in _jobs:
        # Return mock completed result for demo
        return {
            "job_id": job_id,
            "status": "completed",
            "progress": 1.0,
            "result": VIDEO_SAMPLE,
        }
    return {"job_id": job_id, **_jobs[job_id]}
