// frontend/src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import './App.css';

const API = 'http://localhost:8000';

interface Msg {
  question: string;
  answer: string;
  sources?: string[];
}

/* ---------- Speech Recognition Types ---------- */
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (e: SpeechRecognitionEvent) => void;
  onerror: (e: Event) => void;
  onend: () => void;
}

/* ---------- Main Component ---------- */
export default function App() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false); // check-mark flag

  const recRef = useRef<SpeechRecognition | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const successTimer = useRef<NodeJS.Timeout | null>(null);

  /* ----- Voice Recognition ----- */
  useEffect(() => {
    const SpeechRecognitionAPI =
      (window as any).webkitSpeechRecognition || window.SpeechRecognition;
    if (SpeechRecognitionAPI) {
      const rec = new SpeechRecognitionAPI();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.onresult = (e: SpeechRecognitionEvent) => {
        const transcript = Array.from(e.results)
          .slice(e.resultIndex)
          .map((r) => r[0].transcript)
          .join('');
        setInput(transcript);
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      recRef.current = rec;
    }
  }, []);

  const toggleVoice = () => {
    if (!recRef.current) return;
    if (listening) recRef.current.stop();
    else {
      setInput('');
      recRef.current.start();
    }
    setListening(!listening);
  };

  /* ----- Upload ----- */
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);
    const fd = new FormData();
    fd.append('file', file);

    try {
      await axios.post(`${API}/upload`, fd);
      setUploadSuccess(true);
      setMsgs([]); // clear previous Q&A
      // hide check-mark after 2 s
      if (successTimer.current) clearTimeout(successTimer.current);
      successTimer.current = setTimeout(() => setUploadSuccess(false), 2000);
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  /* ----- Ask ----- */
  const ask = async () => {
    if (!input.trim()) return;
    const q = input;
    setInput('');
    setMsgs((m) => [...m, { question: q, answer: 'Thinking...' }]);
    try {
      const res = await axios.post(`${API}/ask`, { question: q });
      setMsgs((m) => [
        ...m.slice(0, -1),
        { question: q, answer: res.data.answer, sources: res.data.sources },
      ]);
    } catch (e: any) {
      setMsgs((m) => [
        ...m.slice(0, -1),
        { question: q, answer: 'Error: ' + (e.response?.data?.detail || e.message) },
      ]);
    }
  };

  /* ----- PDF Export ----- */
  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.text('RAG Chat History', 20, y);
    y += 15;
    msgs.forEach((m, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(12);
      doc.text(`Q${i + 1}: ${m.question.substring(0, 100)}${m.question.length > 100 ? '...' : ''}`, 15, y);
      y += 10;
      const lines = doc.splitTextToSize(m.answer, 180);
      doc.text(lines, 15, y);
      y += lines.length * 7 + 10;
    });
    doc.save('chat-history.pdf');
  };

  return (
    <div className="app">
      <h1>LLM RAG Assistant</h1>

      {/* ---------- Upload Box ---------- */}
      <div
        className={`upload ${uploading ? 'uploading' : ''} ${uploadSuccess ? 'success' : ''}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) upload({ target: { files: [file] } } as any);
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          onChange={upload}
          style={{ display: 'none' }}
        />
        {uploading ? (
          <div className="spinner">Uploading…</div>
        ) : uploadSuccess ? (
          <div className="check">Uploaded</div>
        ) : (
          'Upload PDF (click or drag)'
        )}
      </div>

      {/* ---------- Chat ---------- */}
      <div className="chat">
        <div className="msgs">
          {msgs.length === 0 && <p className="placeholder">Upload a PDF and ask!</p>}
          {msgs.map((m, i) => (
            <div key={i} className="msg">
              <strong>Q:</strong> {m.question}
              <br />
              <strong>A:</strong> {m.answer}
              {m.sources && m.sources.length > 0 && (
                <small>
                  <br />
                  Sources: {m.sources.join(', ')}
                </small>
              )}
            </div>
          ))}
        </div>

        <div className="input">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), ask())
            }
            placeholder="Ask about the PDF..."
          />
          <button onClick={ask} disabled={!input.trim()}>
            Send
          </button>
          <button onClick={toggleVoice} disabled={!recRef.current}>
            {listening ? 'Stop' : 'Voice'}
          </button>
          {msgs.length > 0 && <button onClick={downloadPDF}>Download PDF</button>}
        </div>
      </div>
    </div>
  );
}