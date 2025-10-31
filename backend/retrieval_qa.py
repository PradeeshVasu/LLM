# backend/retrieval_qa.py
import os
import logging
from pathlib import Path

from langchain_community.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.chains.llm import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.document_loaders import PDFPlumberLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_experimental.text_splitter import SemanticChunker
from langchain.chains.combine_documents.stuff import StuffDocumentsChain

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

# --- LM Studio ---
os.environ["OPENAI_API_BASE"] = "http://localhost:1234/v1"
os.environ["OPENAI_API_KEY"] = "lm-studio"

# --- Embedding (will load sentence-transformers) ---
embedder = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"}
)

INDEX_PATH = Path("faiss_index")
PDF_PATH = Path("uploaded.pdf")
text_splitter = SemanticChunker(embedder)

vectorstore = None
retriever = None

# --- LLM ---
llm = ChatOpenAI(
    model="",
    temperature=0.7,
    request_timeout=600,
    max_tokens=512
)

prompt = PromptTemplate.from_template("""
You are an expert. Answer using only the context.
If not found, say: "The information is not available in the provided context."

Context: {context}
Question: {question}
Answer:
""")

qa = None  # Lazy-loaded


def _get_qa_chain():
    global qa
    if qa is not None:
        return qa
    if retriever is None:
        raise RuntimeError("No PDF indexed yet. Upload a PDF first.")
    llm_chain = LLMChain(llm=llm, prompt=prompt)
    combine = StuffDocumentsChain(llm_chain=llm_chain, document_variable_name="context")
    qa = RetrievalQA(
        combine_documents_chain=combine,
        retriever=retriever,
        return_source_documents=True,
    )
    return qa


def rebuild_vectorstore(pdf_path: str):
    global vectorstore, retriever, qa
    if INDEX_PATH.exists():
        for f in INDEX_PATH.iterdir():
            f.unlink()
        INDEX_PATH.rmdir()

    loader = PDFPlumberLoader(pdf_path)
    docs = loader.load()
    log.info(f"Loaded {len(docs)} pages from {pdf_path}")

    chunks = text_splitter.split_documents(docs)
    log.info(f"Created {len(chunks)} chunks")

    vectorstore = FAISS.from_documents(chunks, embedder)
    vectorstore.save_local(str(INDEX_PATH))
    retriever = vectorstore.as_retriever(search_kwargs={"k": 2})
    qa = None  # Reset
    log.info("Index rebuilt")


if PDF_PATH.exists():
    try:
        rebuild_vectorstore(str(PDF_PATH))
    except Exception as e:
        log.warning(f"Failed to load default PDF: {e}")