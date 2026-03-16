import type { Message } from "../hooks/useWebSocket"


interface Props {
    message: Message
    isOwn: boolean
}

export default function MessageBubble({ message, isOwn }: Props) {
    const time = new Date(message.timestamp).toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit'
    })

    // System message (join/leave/welcome)
    if (message.type === 'SYSTEM' || message.type === 'USER_JOINED' || message.type === 'USER_LEFT') {
        return (
            <div style={{
                display: 'flex', justifyContent: 'center', margin: '8px 0'
            }}>
                <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    color: message.type === 'USER_JOINED' ? '#63ffb4' : message.type === 'USER_LEFT' ? '#ff6b6b' : '#555',
                    background: '#111',
                    padding: '4px 14px',
                    borderRadius: 20,
                    letterSpacing: 1,
                }}>
                    {message.text}
                </span>
            </div>
        )
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: isOwn ? 'row-reverse' : 'row',
            alignItems: 'flex-end',
            gap: 10,
            margin: '10px 0',
        }}>
            {/* Avatar */}
            {!isOwn && (
                <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: message.color || '#63ffb4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 13, color: '#070707', flexShrink: 0,
                }}>
                    {message.username?.[0]?.toUpperCase()}
                </div>
            )}

            <div style={{ maxWidth: '65%' }}>
                {/* Username */}
                {!isOwn && (
                    <div style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10, color: message.color,
                        letterSpacing: 1, marginBottom: 4, paddingLeft: 4,
                    }}>
                        {message.username}
                    </div>
                )}

                {/* Bubble */}
                <div style={{
                    background: isOwn ? '#63ffb4' : '#111',
                    color: isOwn ? '#070707' : '#e0e0e0',
                    border: isOwn ? 'none' : '1px solid #1e1e1e',
                    borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    padding: '10px 16px',
                    fontSize: 14, lineHeight: 1.5,
                    fontFamily: "'Syne', sans-serif",
                    wordBreak: 'break-word',
                }}>
                    {message.text}
                </div>

                {/* Timestamp */}
                <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9, color: '#333',
                    textAlign: isOwn ? 'right' : 'left',
                    marginTop: 4, paddingLeft: 4, paddingRight: 4,
                }}>
                    {time}
                </div>
            </div>
        </div>
    )
}