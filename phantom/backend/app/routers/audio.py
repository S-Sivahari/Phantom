from fastapi import APIRouter, UploadFile, File

from app.services.mock_data import AUDIO_SAMPLE

router = APIRouter()


@router.post("/audio")
async def analyze_audio(file: UploadFile = File(...)):
    """Whisper transcription + MFCC/spectrogram CNN voice clone detection."""
    # TODO: Whisper, librosa MFCC, spectrogram CNN
    return {**AUDIO_SAMPLE, "filename": file.filename}
