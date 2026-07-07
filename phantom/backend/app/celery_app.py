"""Celery app skeleton — wire workers when implementing async video pipeline."""
import os

from celery import Celery

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery("phantom", broker=redis_url, backend=redis_url)


@celery_app.task
def analyze_video_task(video_path: str, job_id: str):
    # TODO: frame extraction, face detection, per-frame CNN, temporal scoring
    return {"status": "completed", "job_id": job_id}
