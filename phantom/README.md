# Phantom

**Multi-Modal Deepfake Detection Platform**

Phantom identifies AI-generated text, images, audio, and deepfake video through an ensemble of fine-tuned models, with explainability at every layer.

## Stack

| Layer | Technologies |
|-------|-------------|
| Text | DistilBERT, perplexity, burstiness, SHAP |
| Image | EfficientNet-B0, GradCAM, FFT, CLIP |
| Audio | Whisper, MFCC, spectrogram CNN |
| Video | OpenCV frame pipeline, temporal consistency |
| Documents | ChromaDB, cross-encoder reranking, streaming LLM |
| Infra | FastAPI, Redis, Celery, Docker |

## Project Structure

```
phantom/
├── backend/          # FastAPI API (skeleton + mock responses)
├── frontend/         # React dashboard
├── docker-compose.yml
└── README.md
```

## Quick Start

### Frontend (standalone with mock data)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — works without the backend using built-in mock responses.

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

### Full stack (Docker)

```bash
docker compose up --build
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/analyze/text` | POST | AI + scam scoring with SHAP attributions |
| `/analyze/image` | POST | AI-generated image detection + GradCAM |
| `/analyze/audio` | POST | Voice clone + scam transcript analysis |
| `/analyze/video` | POST | Deepfake detection (async job) |
| `/analyze/document` | POST | PDF chunk scoring + ChromaDB indexing |
| `/rag/query` | POST | Semantic query with reranking |
| `/jobs/{id}` | GET | Async job status |

## Modules

1. **Text** — DistilBERT ensemble (perplexity + burstiness + fine-tuned classifier) with SHAP word-level explainability
2. **Image** — EfficientNet + FFT frequency analysis + CLIP embeddings with GradCAM heatmaps
3. **Audio** — Whisper transcription + MFCC/spectrogram CNN for voice clone detection
4. **Video** — Per-frame face-region analysis with temporal consistency scoring
5. **Documents** — PDF chunk detection + ChromaDB RAG with cross-encoder reranking
6. **Infrastructure** — Celery async workers, Redis broker, WebSocket progress

## License

MIT
