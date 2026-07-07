from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel

from app.services.mock_data import DOCUMENT_SAMPLE, RAG_SAMPLE

router = APIRouter()


@router.post("/document")
async def analyze_document(file: UploadFile = File(...)):
    """PDF chunk scoring + ChromaDB vector indexing."""
    # TODO: PyMuPDF parsing, chunk-level DistilBERT, ChromaDB upsert
    return {**DOCUMENT_SAMPLE, "filename": file.filename}


class RAGQuery(BaseModel):
    query: str
    filter_ai_score_min: float | None = None


@router.post("/rag/query")
def rag_query(body: RAGQuery):
    """Semantic query with cross-encoder reranking and streaming LLM."""
    # TODO: sentence-transformers embed, ChromaDB retrieve, cross-encoder rerank, LLM stream
    return {**RAG_SAMPLE, "query": body.query}
