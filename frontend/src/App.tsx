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

export default function App() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const recRef = useRef<SpeechRecognition | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const successTimer = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const robotRef = useRef<HTMLImageElement>(null);

  // Theme
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) setTheme(saved);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Voice Input
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
          .map(r => r[0].transcript)
          .join('');
        setInput(transcript);
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      recRef.current = rec;
    }
  }, []);

  const toggleVoice = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    if (listening) {
      recRef.current?.stop();
      setListening(false);
    } else {
      setInput('');
      recRef.current?.start();
      setListening(true);
    }
  };

  // Speak Answer
  const speak = (text: string) => {
    if (speaking) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onstart = () => {
      setSpeaking(true);
      if (robotRef.current) robotRef.current.classList.add('speaking');
    };
    utterance.onend = () => {
      setSpeaking(false);
      if (robotRef.current) robotRef.current.classList.remove('speaking');
    };
    utterance.onerror = () => {
      setSpeaking(false);
      if (robotRef.current) robotRef.current.classList.remove('speaking');
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Upload
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
      setMsgs([]);
      if (successTimer.current) clearTimeout(successTimer.current);
      successTimer.current = setTimeout(() => setUploadSuccess(false), 2000);
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Ask
  const ask = async () => {
    if (!input.trim()) return;
    const q = input;
    setInput('');
    setMsgs(m => [...m, { question: q, answer: 'Thinking...' }]);
    try {
      const res = await axios.post(`${API}/ask`, { question: q });
      const answer = res.data.answer;
      setMsgs(m => [
        ...m.slice(0, -1),
        { question: q, answer, sources: res.data.sources }
      ]);
      speak(answer);
    } catch (e: any) {
      const err = 'Error: ' + (e.response?.data?.detail || e.message);
      setMsgs(m => [
        ...m.slice(0, -1),
        { question: q, answer: err }
      ]);
    }
  };

  // PDF Export
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
    <div className={`app ${theme}`}>
      <div className="header">
        <h1>LLM RAG Assistant</h1>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        >
          <span className="icon sun">Sun</span>
          <span className="icon moon">Moon</span>
        </button>
      </div>

      <div className="main">
        {/* Left: Robot */}
        <div className="robot-panel">
          <img
            ref={robotRef}
            src="/robot.png"
            alt="AI Assistant"
            className="robot-avatar"
            onError={(e) => {
              console.error("Robot image failed to load. Check: public/robot.png");
              e.currentTarget.src = 'https://www.freepik.com/free-vector/graident-ai-robot-vectorart_125887871.htm#fromView=keyword&page=1&position=13&uuid=7f9c0f87-e5f2-4395-9c18-95cfa3151393&query=Robot+avatar';
            }}
          />
          <div className={`robot-status ${listening ? 'listening' : speaking ? 'speaking' : ''}`}>
            {listening ? 'Listening...' : speaking ? 'Speaking...' : 'Ready'}
          </div>
        </div>

        {/* Right: Chat */}
        <div className="chat-panel">
          <div
            className={`upload ${uploading ? 'uploading' : ''} ${uploadSuccess ? 'success' : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) upload({ target: { files: [file] } } as any);
            }}
          >
            <input ref={fileRef} type="file" accept=".pdf" onChange={upload} style={{ display: 'none' }} />
            {uploading ? (
              <div className="spinner">Uploading…</div>
            ) : uploadSuccess ? (
              <div className="check">Uploaded</div>
            ) : (
              'Upload PDF (click or drag)'
            )}
          </div>

          <div className="msgs">
            {msgs.length === 0 && <p className="placeholder">Upload a PDF and ask!</p>}
            {msgs.map((m, i) => (
              <div key={i} className="msg">
                <strong>Q:</strong> {m.question}
                <br />
                <strong>A:</strong> {m.answer}
                {m.sources && m.sources.length > 0 && (
                  <small><br />Sources: {m.sources.join(', ')}</small>
                )}
              </div>
            ))}
          </div>

          <div className="input">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), ask())}
              placeholder="Ask about the PDF..."
            />
            <button onClick={ask} disabled={!input.trim()}>Send</button>
            <button
              className={`speak-btn ${speaking ? 'speaking' : ''}`}
              onClick={toggleVoice}
              disabled={!recRef.current && !speaking}
            >
              {listening ? 'Mic On' : speaking ? 'Stop' : 'Speak'}
            </button>
            {msgs.length > 0 && <button onClick={downloadPDF}>Download PDF</button>}
          </div>
        </div>
      </div>
    </div>
  );
}