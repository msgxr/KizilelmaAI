import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Merhaba! Ben KızılelmaAI. Size nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await response.json();
      
      if (data.response) {
        setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: 'Üzgünüm, bir hata oluştu.' }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Bağlantı hatası: Backend çalışıyor mu?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container">
      {/* Background Elements */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      <nav className="navbar glass">
        <div className="logo">
          <span className="logo-red">Kızılelma</span>
          <span className="logo-white">AI</span>
        </div>
        <div className="nav-links">
          <span>Hakkımızda</span>
          <span>Dokümantasyon</span>
          <button className="btn-primary">Giriş Yap</button>
        </div>
      </nav>

      <main className="main-content">
        <header className="hero-section">
          <h1 className="gradient-text">Geleceğin Yapay Zekası</h1>
          <p className="subtitle">BTK Akademi Hackathon 2026'nın en güçlü AI asistanı.</p>
        </header>

        <section className="chat-interface glass">
          <div className="chat-header">
            <div className="status-dot"></div>
            <span>KızılelmaAI Aktif</span>
          </div>
          
          <div className="messages-container">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-wrapper ${msg.role}`}>
                <div className="message-bubble">
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message-wrapper ai">
                <div className="message-bubble typing">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}
          </div>

          <div className="input-area">
            <input 
              type="text" 
              placeholder="Mesajınızı buraya yazın..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={handleSend}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2026 KızılelmaAI Team. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

export default App;
