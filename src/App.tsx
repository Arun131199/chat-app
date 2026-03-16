import { useState } from 'react'
import ChatWindow from './components/ChatWindow'

export default function App() {
  const [username, setUsername] = useState('')
  const [joined, setJoined] = useState(false)

  if (joined) return <ChatWindow username={username} />

  return (
    <div style={{
      height: '100vh', background: '#070707',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Syne', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{
        background: '#0a0a0a', border: '1px solid #1a1a1a',
        borderRadius: 24, padding: 48, width: 400, textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{
          width: 60, height: 60, borderRadius: 18,
          background: 'linear-gradient(135deg, #63ffb4, #00d4aa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, margin: '0 auto 24px',
        }}>
          💬
        </div>

        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10,
          color: '#63ffb4', letterSpacing: 3,
          textTransform: 'uppercase', marginBottom: 12,
        }}>
          Real-time Chat
        </div>

        <h1 style={{
          fontSize: 32, fontWeight: 800, color: '#f0f0f0',
          letterSpacing: -1, marginBottom: 8,
        }}>
          Join the <span style={{ color: '#63ffb4' }}>Room</span>
        </h1>

        <p style={{
          fontSize: 14, color: '#555', marginBottom: 32, lineHeight: 1.6,
        }}>
          Enter your name to start chatting in real-time with WebSocket
        </p>

        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && username.trim() && setJoined(true)}
          placeholder="Your name..."
          style={{
            width: '100%', background: '#111',
            border: '1px solid #1e1e1e', borderRadius: 12,
            padding: '14px 16px', color: '#f0f0f0',
            fontSize: 15, fontFamily: "'Syne', sans-serif",
            outline: 'none', marginBottom: 16,
            textAlign: 'center',
          }}
          onFocus={e => e.target.style.borderColor = '#63ffb4'}
          onBlur={e => e.target.style.borderColor = '#1e1e1e'}
          autoFocus
        />

        <button
          onClick={() => username.trim() && setJoined(true)}
          disabled={!username.trim()}
          style={{
            width: '100%', padding: '14px',
            background: username.trim() ? '#63ffb4' : '#111',
            color: username.trim() ? '#070707' : '#333',
            border: 'none', borderRadius: 12,
            fontSize: 14, fontWeight: 700,
            fontFamily: "'Syne', sans-serif",
            cursor: username.trim() ? 'pointer' : 'not-allowed',
            letterSpacing: 1, transition: 'all 0.2s',
          }}
        >
          Join Chat →
        </button>
      </div>
    </div>
  )
}