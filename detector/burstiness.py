import numpy as np
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str

def burstiness_score(text: str):
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]

    if len(sentences) < 2:
        return {"error": "too short — need at least 2 sentences"}

    lengths = [len(s.split()) for s in sentences]
    mean = np.mean(lengths)
    std = np.std(lengths)
    score = round(float(std / mean), 3)

    if score < 0.3:
        verdict = "likely AI"
    elif score < 0.6:
        verdict = "uncertain"
    else:
        verdict = "likely human"

    return {
        "score": score,
        "verdict": verdict,
        "sentences": sentences,
        "lengths": lengths
    }

@app.post("/burstiness")
def analyze(input: TextInput):
    return burstiness_score(input.text)