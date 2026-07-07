from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import text, image, audio, video, document, jobs

app = FastAPI(
    title="Phantom API",
    description="Multi-modal deepfake and AI content detection platform",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(text.router, prefix="/analyze", tags=["text"])
app.include_router(image.router, prefix="/analyze", tags=["image"])
app.include_router(audio.router, prefix="/analyze", tags=["audio"])
app.include_router(video.router, prefix="/analyze", tags=["video"])
app.include_router(document.router, prefix="/analyze", tags=["document"])
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "phantom"}
