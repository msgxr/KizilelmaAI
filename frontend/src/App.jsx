import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const API = 'http://localhost:8000';

const PAGES = [
  { id: 'chat', label: 'AI Koç', icon: '🤖' },
  { id: 'harcama', label: 'Harcama Analizi', icon: '📊' },
  { id: 'butce', label: 'Bütçe Planı', icon: '💰' },
];

const ONERI_SORULAR = [
  'Bu ay 15.000 TL harcadım, fazla mı?',
  'Maaşımın ne kadarını biriktirmeliyim?',
  'Türkiye\'de enflasyona karşı nasıl korunurum?',
  'Acil durum fonu nasıl oluşturulur?',
  'Kredi kartı borcumu nasıl öderim?',
];

const KATEGORILER = ['gida', 'ulasim', 'kira_aidat', 'faturalar', 'eglence', 'saglik', 'giyim', 'egitim', 'tasarruf', 'diger'];

function renderMd(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^\| (.+)$/gm, (m, r) => `<tr><td>${r.replace(/\|/g, '</td><td>')}</td></tr>`)
    .replace(/(<tr>.*<\/tr>)/gs, '<table>$1</table>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
}

function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Merhaba! Ben **KızılelmaAI Finans Koçun**.\n\nHarcamalarını analiz edebilir, bütçe planı oluşturabilir, tasarruf önerileri sunabilirim. Ne öğrenmek istersin?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const getHistory = () => messages.slice(0, -1).map(m => ({ role: m.role, content: m.content }));

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    setMessages(p => [...p, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: getHistory() }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role: 'model', content: data.response || 'Hata oluştu.' }]);
    } catch {
      setMessages(p => [...p, { role: 'model', content: 'Bağlantı hatası — backend çalışıyor mu?' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-wrap">
      <div className="chat-box glass">
        <div className="chat-header"><div className="dot-green" /><span>KızılelmaAI Finans Koçu — Aktif</span></div>
        <div className="msgs">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role === 'user' ? 'user' : 'ai'}`}>
              <div className="bubble" dangerouslySetInnerHTML={{ __html: renderMd(m.content) }} />
            </div>
          ))}
          {loading && <div className="msg ai"><div className="bubble typing"><span /><span /><span /></div></div>}
          <div ref={endRef} />
        </div>
        <div className="chips">
          {ONERI_SORULAR.map((s, i) => <button key={i} className="chip" onClick={() => send(s)}>{s}</button>)}
        </div>
        <div className="input-row">
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && send()}
            placeholder="Finansal sorunuzu yazın..." disabled={loading}
          />
          <button className="send" onClick={() => send()} disabled={loading}>
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function HarcamaPage() {
  const [items, setItems] = useState([{ aciklama: '', tutar: '' }]);
  const [gelir, setGelir] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const addItem = () => setItems(p => [...p, { aciklama: '', tutar: '' }]);
  const updateItem = (i, field, val) => setItems(p => p.map((it, idx) => idx === i ? { ...it, [field]: val } : it));
  const removeItem = (i) => setItems(p => p.filter((_, idx) => idx !== i));

  const analyze = async () => {
    const valid = items.filter(it => it.aciklama && parseFloat(it.tutar) > 0);
    if (!valid.length) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/harcama-analiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          harcamalar: valid.map(it => ({ aciklama: it.aciklama, tutar: parseFloat(it.tutar) })),
          aylik_gelir: gelir ? parseFloat(gelir) : null,
        }),
      });
      setResult(await res.json());
    } catch {
      setResult({ analiz: 'Bağlantı hatası.' });
    } finally {
      setLoading(false);
    }
  };

  const toplam = items.reduce((s, it) => s + (parseFloat(it.tutar) || 0), 0);

  return (
    <div className="form-page">
      <div className="glass form-card">
        <h2 className="section-title">📊 Harcama Analizi</h2>
        <p className="section-desc">Harcamalarını gir, Gemini AI agenti kategorize edip analiz etsin.</p>

        <div className="form-group">
          <label>Aylık Geliriniz (opsiyonel)</label>
          <input type="number" placeholder="örn: 35000" value={gelir} onChange={e => setGelir(e.target.value)} />
        </div>

        <div className="harcama-list">
          {items.map((it, i) => (
            <div key={i} className="harcama-row">
              <input className="desc-input" placeholder="Harcama açıklaması (örn: Market alışverişi)" value={it.aciklama} onChange={e => updateItem(i, 'aciklama', e.target.value)} />
              <input className="amt-input" type="number" placeholder="TL" value={it.tutar} onChange={e => updateItem(i, 'tutar', e.target.value)} />
              <button className="del-btn" onClick={() => removeItem(i)} disabled={items.length === 1}>✕</button>
            </div>
          ))}
        </div>

        <div className="row-between">
          <button className="btn-ghost" onClick={addItem}>+ Harcama Ekle</button>
          <span className="total-badge">Toplam: {toplam.toLocaleString('tr-TR')} TL</span>
        </div>

        <button className="btn-primary full-btn" onClick={analyze} disabled={loading || !items[0].aciklama}>
          {loading ? '🤖 Gemini Analiz Yapıyor...' : '📊 Harcamalarımı Analiz Et'}
        </button>

        {result && (
          <div className="result-box">
            {result.agent_calls > 0 && (
              <div className="agent-badge">🤖 Agentik Analiz: {result.agent_calls} işlem gerçekleştirildi</div>
            )}
            <div dangerouslySetInnerHTML={{ __html: renderMd(result.analiz) }} />
          </div>
        )}
      </div>
    </div>
  );
}

function ButcePage() {
  const [form, setForm] = useState({ aylik_gelir: '', sabit_giderler: '', hedef: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const create = async () => {
    if (!form.aylik_gelir) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch(`${API}/butce-olustur`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aylik_gelir: parseFloat(form.aylik_gelir),
          sabit_giderler: form.sabit_giderler ? parseFloat(form.sabit_giderler) : null,
          hedef: form.hedef || null,
        }),
      });
      const data = await res.json();
      setResult(data.butce_plani || 'Hata oluştu.');
    } catch {
      setResult('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="glass form-card">
        <h2 className="section-title">💰 Kişisel Bütçe Planı</h2>
        <p className="section-desc">Gelirine göre Türkiye koşullarına özel bütçe planı oluştur.</p>

        <div className="form-group">
          <label>Aylık Net Geliriniz (TL) *</label>
          <input type="number" placeholder="örn: 40000" value={form.aylik_gelir} onChange={e => update('aylik_gelir', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Sabit Giderler — Kira, fatura vb. (opsiyonel)</label>
          <input type="number" placeholder="örn: 15000" value={form.sabit_giderler} onChange={e => update('sabit_giderler', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Finansal Hedefiniz (opsiyonel)</label>
          <input type="text" placeholder="örn: 6 ayda 50.000 TL biriktirmek" value={form.hedef} onChange={e => update('hedef', e.target.value)} />
        </div>

        <button className="btn-primary full-btn" onClick={create} disabled={loading || !form.aylik_gelir}>
          {loading ? '📐 Bütçe Hazırlanıyor...' : '💰 Bütçe Planımı Oluştur'}
        </button>

        {result && (
          <div className="result-box" dangerouslySetInnerHTML={{ __html: renderMd(result) }} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('chat');

  return (
    <div className="app">
      <div className="orb orb1" /><div className="orb orb2" />

      <nav className="navbar glass">
        <div className="logo"><span className="red">Kızılelma</span><span className="white">AI</span><span className="tag">Finans</span></div>
        <div className="nav-links">
          {PAGES.map(p => (
            <button key={p.id} className={`nav-btn ${page === p.id ? 'active' : ''}`} onClick={() => setPage(p.id)}>
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="hero">
        <h1 className="gradient-text">Akıllı Finans Koçun</h1>
        <p className="sub">Gemini AI ile harcamalarını analiz et, bütçeni planla, hedeflerine ulaş</p>
      </div>

      {page === 'chat' && <ChatPage />}
      {page === 'harcama' && <HarcamaPage />}
      {page === 'butce' && <ButcePage />}

      <footer className="footer">BTK Akademi Hackathon 2026 — KızılelmaAI Finans | Konsept: Finans</footer>
    </div>
  );
}
