"""Mock responses for API skeleton — replace with real model inference."""

TEXT_SAMPLE = {
    "ai_score": 0.87,
    "scam_score": 0.12,
    "burstiness": 0.24,
    "perplexity": 18.4,
    "verdict": "likely_ai",
    "shap_attributions": [
        {"word": "Furthermore", "contribution": 0.14},
        {"word": "comprehensive", "contribution": 0.11},
        {"word": "leverage", "contribution": 0.09},
        {"word": "utilize", "contribution": 0.08},
        {"word": "robust", "contribution": 0.07},
    ],
}

IMAGE_SAMPLE = {
    "ai_score": 0.91,
    "fft_anomaly": 0.78,
    "clip_distance": 0.65,
    "verdict": "likely_ai",
    "gradcam_available": True,
}

AUDIO_SAMPLE = {
    "clone_score": 0.73,
    "scam_score": 0.31,
    "transcript": "This is an urgent message from your bank. Please verify your account immediately.",
    "verdict": "suspicious",
}

VIDEO_SAMPLE = {
    "deepfake_score": 0.82,
    "temporal_variance": 0.45,
    "frames_analyzed": 48,
    "verdict": "likely_deepfake",
}

DOCUMENT_SAMPLE = {
    "chunks_indexed": 24,
    "avg_ai_score": 0.61,
    "sections": [
        {"page": 1, "heading": "Introduction", "ai_score": 0.32},
        {"page": 2, "heading": "Methodology", "ai_score": 0.88},
        {"page": 3, "heading": "Results", "ai_score": 0.74},
        {"page": 4, "heading": "Conclusion", "ai_score": 0.91},
    ],
}

RAG_SAMPLE = {
    "answer": "Based on the document, the methodology section shows the highest AI-authorship signals (score 0.88), particularly in paragraphs describing data preprocessing.",
    "sources": [
        {"page": 2, "heading": "Methodology", "ai_score": 0.88, "relevance": 0.94},
        {"page": 3, "heading": "Results", "ai_score": 0.74, "relevance": 0.71},
    ],
}
