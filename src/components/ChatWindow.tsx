import { useState, useRef, useEffect } from 'react'
import { useWebSocket } from '../hooks/useWebSocket'
import MessageBubble from './MessageBubble'
import UserList from './UserList'

interface Props { username: string }

export default function ChatWindow({ username }: Props) {
    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { messages, users, status, myClientId, typingUsers, sendMessage, handleTyping } =
        useWebSocket('ws://localhost:8080', username)

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = () => {
        if (!input.trim()) return
        sendMessage(input.trim())
        setInput('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const statusColor = status === 'connected' ? '#63ffb4' : status === 'error' ? '#ff6b6b' : '#ffd93d'

    return (
        <div style={{
            display: 'flex', height: '100vh',
            background: '#070707', fontFamily: "'Syne', sans-serif",
        }}>
            {/* Main Chat */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid #1a1a1a',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'rgba(7,7,7,0.9)', backdropFilter: 'blur(10px)',
                }}>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#f0f0f0', letterSpacing: -0.5 }}>
                            Live Chat <span style={{ color: '#63ffb4' }}>Room</span>
                        </div>
                        <div style={{
                            fontFamily: "'DM Mono', monospace", fontSize: 10,
                            color: '#444', letterSpacing: 2, marginTop: 2,
                        }}>
                            WebSocket · Real-time
                        </div>
                    </div>

                    {/* Status */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: '#111', border: '1px solid #1e1e1e',
                        borderRadius: 20, padding: '6px 14px',
                    }}>
                        <div style={{
                            width: 7, height: 7, borderRadius: '50%',
                            background: statusColor,
                            boxShadow: `0 0 8px ${statusColor}`,
                            animation: status === 'connected' ? 'pulse 2s infinite' : 'none',
                        }} />
                        <span style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 10, color: statusColor, letterSpacing: 1,
                            textTransform: 'uppercase',
                        }}>
                            {status}
                        </span>
                    </div>
                </div>

                {/* Messages */}
                <div style={{
                    flex: 1, overflowY: 'auto', padding: '16px 24px',
                    display: 'flex', flexDirection: 'column',
                }}>
                    {messages.map(msg => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isOwn={msg.clientId === myClientId}
                        />
                    ))}

                    {/* Typing indicator */}
                    {typingUsers.length > 0 && (
                        <div style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 11, color: '#555', padding: '4px 0',
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <div style={{ display: 'flex', gap: 3 }}>
                                {[0, 1, 2].map(i => (
                                    <div key={i} style={{
                                        width: 5, height: 5, borderRadius: '50%',
                                        background: '#63ffb4', opacity: 0.6,
                                        animation: `bounce 1s infinite ${i * 0.2}s`,
                                    }} />
                                ))}
                            </div>
                            {typingUsers.join(', ')} typing...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid #1a1a1a',
                    display: 'flex', gap: 12, alignItems: 'flex-end',
                }}>
                    <input
                        value={input}
                        onChange={e => { setInput(e.target.value); handleTyping() }}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message... (Enter to send)"
                        style={{
                            flex: 1, background: '#111', border: '1px solid #1e1e1e',
                            borderRadius: 12, padding: '12px 16px',
                            color: '#f0f0f0', fontSize: 14,
                            fontFamily: "'Syne', sans-serif", outline: 'none',
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = '#63ffb4'}
                        onBlur={e => e.target.style.borderColor = '#1e1e1e'}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || status !== 'connected'}
                        style={{
                            padding: '12px 24px',
                            background: input.trim() && status === 'connected' ? '#63ffb4' : '#111',
                            color: input.trim() && status === 'connected' ? '#070707' : '#333',
                            border: '1px solid #1e1e1e',
                            borderRadius: 12, fontSize: 13, fontWeight: 700,
                            fontFamily: "'Syne', sans-serif",
                            cursor: input.trim() ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s', letterSpacing: 1,
                        }}
                    >
                        Send →
                    </button>
                </div>
            </div>

            {/* User List */}
            <UserList users={users} myClientId={myClientId} />

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #070707; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 2px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
      `}</style>
        </div>
    )
}