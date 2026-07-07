# Phantom

Multi-modal AI content detection platform — detect AI-generated text, images, audio, deepfake video, and documents.

**Stack:** DistilBERT, Whisper, EfficientNet, ChromaDB, Redis, Celery, Docker

## Quick Start

```bash
cd phantom/frontend
npm install
npm run dev
```

Open http://localhost:5173 — the dashboard runs with mock data out of the box.

See [phantom/README.md](phantom/README.md) for full backend and Docker setup.

## Structure

```
phantom/
├── frontend/     React dashboard (implemented)
├── backend/      FastAPI skeleton + mock endpoints
└── docker-compose.yml
```
