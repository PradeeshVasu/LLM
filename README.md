# 🧠 LLM-Based RAG System – AI-Powered Knowledge Assistant

![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-success?logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Used-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Build-Passing-brightgreen)
![Platform](https://img.shields.io/badge/Platform-Web-lightgrey)

---

## 📖 Overview

**LLM using RAG (Retrieval-Augmented Generation)** is an AI-driven question-answering system that combines **document retrieval** with **Large Language Models (LLMs)** to deliver **accurate, context-aware responses** from uploaded PDFs.

The application allows users to:
- Upload large PDF files (such as policies, reports, or papers)  
- Query the documents through **text or voice**
- Receive **real-time, AI-generated summaries and answers**

This project integrates:
- A **FastAPI backend** for PDF ingestion, embedding, and RAG logic  
- A **React + TypeScript frontend** for a dynamic, user-friendly experience

---

## 🚀 Key Features

✅ **PDF Upload and Parsing** — Extracts text using advanced PDF parsers  
✅ **Retrieval-Augmented Generation (RAG)** — Combines LLM reasoning with vector search  
✅ **Voice Interaction** — Accepts and responds via speech  
✅ **LLM-Powered Summarization** — Generates high-quality insights  
✅ **Chat History Export** — Downloadable in PDF format  
✅ **Fast & Modern UI** — Built with React + TypeScript  
✅ **Secure and Modular Backend** — Using FastAPI and Uvicorn  

---

## 🧩 Tech Stack

| Category | Technologies Used |
|-----------|-------------------|
| **Programming Language** | Python 3.10, TypeScript |
| **Backend Framework** | FastAPI |
| **Frontend Framework** | React.js + Vite / CRA |
| **LLM / NLP** | LangChain, OpenAI API |
| **Vector Database** | FAISS / Chroma |
| **PDF Processing** | pdfplumber, PyMuPDF |
| **Audio & Speech** | pyttsx3, SpeechRecognition |
| **Server** | Uvicorn |

---

## 📁 Folder Structure

```

📦 LLM_RAG_System/
│
├── 📁 backend/
│   ├── app.py
│   ├── llm_handler.py
│   ├── pdf_utils.py
│   ├── requirements.txt
│   ├── models/
│   │   ├── vector_store.pkl
│   │   ├── tfidf_vectorizer.pkl
│   │   └── model.pkl
│   └── ...
│
├── 📁 frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── index.tsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── ChatBox.tsx
│   │   │   ├── FileUploader.tsx
│   │   │   ├── VoiceInput.tsx
│   │   │   └── ResponseCard.tsx
│   │   └── utils/
│   │       └── api.ts
│   └── ...
│
├── README.md
└── requirements.txt

````

---

## ⚙️ Installation & Setup

### 🧩 Backend Setup

1️⃣ **Navigate to backend**
```bash
cd backend
````

2️⃣ **Create and activate a virtual environment**

```bash
python -m venv venv
venv\Scripts\activate   # Windows
# or
source venv/bin/activate   # Linux/Mac
```

3️⃣ **Install dependencies**

```bash
pip install -r requirements.txt
```

4️⃣ **Run the FastAPI server**

```bash
uvicorn app:app --reload --port 8000
```

➡️ **Backend running at:** [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### 💻 Frontend Setup

1️⃣ **Navigate to frontend**

```bash
cd frontend
```

2️⃣ **Install dependencies**

```bash
npm install
```

3️⃣ **Run the development server**

```bash
npm start
```

➡️ **Frontend running at:** [http://localhost:3000](http://localhost:3000)

---

## 🔗 Connecting Frontend & Backend

To connect both servers, add your backend API endpoint inside the `.env` file in `frontend/`:

```
REACT_APP_API_URL=http://127.0.0.1:8000
```

---

## ⚙️ How It Works

1. **User uploads a PDF** → text and embeddings are extracted
2. **Query sent** → LLM processes query with document context
3. **Vector search** → Top-k relevant chunks retrieved
4. **RAG pipeline** → LLM generates factual response
5. **Response displayed** → Text + optional speech output
6. **Transcript saved** → Downloadable as PDF

---

## 🧪 Example Queries

| Example Query                        | Response Summary                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------- |
| “Summarize this education policy.”   | Returns a structured summary highlighting goals, target groups, and implementation details. |
| “What AI initiatives are mentioned?” | Lists and explains each AI-related scheme in the document.                                  |
| “Who are the key beneficiaries?”     | Extracts and lists stakeholders or target demographics.                                     |

---

## 🧰 Commands Summary

| Task                              | Command                           |
| --------------------------------- | --------------------------------- |
| **Run Backend (FastAPI)**         | `uvicorn app:app --reload`        |
| **Install Backend Dependencies**  | `pip install -r requirements.txt` |
| **Run Frontend (React)**          | `npm start`                       |
| **Install Frontend Dependencies** | `npm install`                     |

---

## 📽️ Model Demo Prototye 

<img width="1919" height="1134" alt="Screenshot 2025-11-02 141425" src="https://github.com/user-attachments/assets/2b2a8bd3-0e7c-4007-9c10-60948645a9fc" />

<img width="1915" height="1136" alt="Screenshot 2025-11-02 142343" src="https://github.com/user-attachments/assets/ec5a8383-3e1b-4b1c-a481-039a97377b7a" />

<img width="1919" height="1131" alt="Screenshot 2025-11-02 142438" src="https://github.com/user-attachments/assets/18196a5d-ab5a-40e3-92f2-45292270ba40" />

---

## 👨‍💻 Author

**Pradeesh Vasu**                       
📧 Email: [pradeeshvasu22@gmail.com](mailto:pradeeshvasu22@gmail.com)              
🔗 LinkedIn: [linkedin.com/in/pradeesh-vasu-03486b319](https://www.linkedin.com/in/pradeesh-vasu-03486b319)                  
🐙 GitHub: [github.com/PradeeshVasu](https://github.com/PradeeshVasu)

---

## 🪪 License

This project is licensed under the **MIT License** – you are free to use, modify, and distribute it for educational and research purposes.

---

## ⭐ Support

If you like this project, please ⭐ **star this repository** on GitHub and share it with others who might find it useful.

---

## 🧭 Version Info

| Component     | Version |
| ------------- | ------- |
| **Python**    | 3.10    |
| **FastAPI**   | ≥0.110  |
| **React**     | 18+     |
| **Node.js**   | ≥18     |
| **LangChain** | 0.2+    |

---
