# LLM RAG Assistant

![GitHub](https://img.shields.io/github/license/vasu-llm/rag-assistant)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![CRA](https://img.shields.io/badge/Create%20React%20App-09.5.0-green)

A **professional, voice-enabled RAG (Retrieval-Augmented Generation)** web application that allows users to:

- Upload **PDF documents**
- **Ask questions** via text or **voice**
- Receive **spoken answers** with **real-time robot avatar feedback**
- Export chat history as **PDF**

---

## Live Demo

> **Local Demo**: `http://localhost:3000`  
> **Deployed at**: [https://rag-assistant.vercel.app](https://rag-assistant.vercel.app) *(coming soon)*

---

## Features

| Feature              | Description |
|----------------------|-----------|
| **PDF Upload**       | Drag & drop or click to upload `.pdf` files |
| **Voice Input**      | Speak your question using microphone |
| **Voice Output**     | AI **speaks answers aloud** |
| **Robot Avatar**     | Real-time **animated robot** on the left panel |
| **Dark Mode**        | Professional **icon-only toggle** with persistence |
| **Chat Export**      | Download full conversation as PDF |
| **Responsive**       | Works perfectly on mobile, tablet, and desktop |
| **Local Assets**     | Uses your `public/robot.png` |

---

## Screenshots

> *(Add screenshots later by dragging images into GitHub)*

---

## Tech Stack

- **Frontend**: React + TypeScript + Create React App
- **Styling**: Pure CSS (no frameworks)
- **PDF Processing**: `pdf-parse`, `langchain` (backend)
- **Voice**: Web Speech API (`SpeechRecognition` + `SpeechSynthesis`)
- **PDF Export**: `jsPDF`
- **Backend**: FastAPI (Python)

---

## Project Structure

```
LLM/
├── frontend/
│   ├── public/
│   │   └── robot.png           ← Your custom robot
│   ├── src/
│   │   ├── App.tsx
│   │   └── App.css
│   └── package.json
├── backend/
│   └── main.py                 ← FastAPI server
└── README.md
```

---

## Quick Start

### 1. Clone & Setup

```bash
git clone https://github.com/vasu-llm/rag-assistant.git
cd rag-assistant
```

### 2. Frontend (Create React App)

```bash
cd frontend
npm install
npm start
```

> Opens at [http://localhost:3000](http://localhost:3000)

### 3. Backend (FastAPI)

```bash
cd ../backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

> API runs on [http://localhost:8000](http://localhost:8000)

---


## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Upload PDF |
| `POST` | `/ask`    | Ask question about uploaded PDF |

---


## Development Scripts

| Script | Command | Description |
|-------|--------|-----------|
| Start | `npm start` | Runs app in development mode |
| Build | `npm run build` | Builds for production |
| Test | `npm test` | Runs tests |
| Eject | `npm run eject` | **Irreversible** – eject from CRA |

---

## Contributing

1. Fork the repo
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

```
MIT License
```

---

## Author

**Pradeesh Vasu**  
GitHub: [@vasu-llm](https://github.com/vasu-llm)  
Built with passion for AI + UX

---

**Made with React, TypeScript, and Voice**  
*Your AI companion, now with a face and a voice.*
```