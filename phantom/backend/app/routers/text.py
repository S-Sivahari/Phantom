from fastapi import APIRouter
from pydantic import BaseModel

from app.services.mock_data import TEXT_SAMPLE

router = APIRouter()


class TextInput(BaseModel):
    text: str


@router.post("/text")
def analyze_text(body: TextInput):
    """DistilBERT + perplexity + burstiness ensemble with SHAP attributions."""
    # TODO: wire DistilBERT, GPT-2 perplexity, burstiness, SHAP
    return {**TEXT_SAMPLE, "input_length": len(body.text.split())}
