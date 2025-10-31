# backend/app.py
import logging
import shutil
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path

from retrieval_qa import rebuild_vectorstore, _get_qa_chain

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

app = FastAPI(title="LLM RAG Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CURRENT_PDF = Path("uploaded.pdf")

class Query(BaseModel):
    question: str

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files allowed")
    
    with open(CURRENT_PDF, "wb") as f:
        shutil.copyfileobj(file.file, f)
    log.info(f"Uploaded: {file.filename}")
    
    try:
        rebuild_vectorstore(str(CURRENT_PDF))
        return {"message": "PDF uploaded and indexed"}
    except Exception as e:
        log.exception("Indexing failed")
        raise HTTPException(500, "Failed to process PDF")

@app.post("/ask")
async def ask(query: Query):
    if not query.question.strip():
        raise HTTPException(400, "Question cannot be empty")
    
    try:
        qa_chain = _get_qa_chain()
        result = qa_chain.invoke({"query": query.question})
        sources = [d.metadata.get("source", "Unknown") for d in result.get("source_documents", [])]
        return {"answer": result["result"], "sources": sources}
    except RuntimeError as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        log.exception("QA failed")
        raise HTTPException(500, "Answer generation failed")