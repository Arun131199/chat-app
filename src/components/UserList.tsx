import type { User } from "../hooks/useWebSocket"


interface Props {
    users: User[]
    myClientId: string | null
}

export default function UserList({ users, myClientId }: Props) {
    return (
        <div style={{
            width: 220, background: '#0a0a0a',
            borderLeft: '1px solid #1a1a1a',
            display: 'flex', flexDirection: 'column',
        }}>
            {/* Header */}
            <div style={{
                padding: '20px 16px 12px',
                borderBottom: '1px solid #1a1a1a',
            }}>
                <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9, color: '#63ffb4',
                    letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4,
                }}>
                    Online
                </div>
                <div style={{
                    fontSize: 22, fontWeight: 800, color: '#f0f0f0',
                    fontFamily: "'Syne', sans-serif",
                }}>
                    {users.length} <span style={{ color: '#63ffb4' }}>Active</span>
                </div>
            </div>

            {/* Users */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
                {users.map(user => (
                    <div key={user.id} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 16px',
                        background: user.id === myClientId ? 'rgba(99,255,180,0.05)' : 'transparent',
                    }}>
                        {/* Avatar */}
                        <div style={{
                            width: 32, height: 32, borderRadius: 10,
                            background: user.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: 13, color: '#070707', flexShrink: 0,
                            position: 'relative',
                        }}>
                            {user.username[0].toUpperCase()}
                            {/* Online dot */}
                            <div style={{
                                position: 'absolute', bottom: -2, right: -2,
                                width: 8, height: 8, borderRadius: '50%',
                                background: '#63ffb4', border: '2px solid #0a0a0a',
                            }} />
                        </div>

                        <div>
                            <div style={{
                                fontSize: 13, fontWeight: 600, color: '#e0e0e0',
                                fontFamily: "'Syne', sans-serif",
                            }}>
                                {user.username}
                                {user.id === myClientId && (
                                    <span style={{ color: '#63ffb4', fontSize: 10, marginLeft: 6 }}>(you)</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}