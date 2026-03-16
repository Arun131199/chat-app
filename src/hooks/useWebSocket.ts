import { useCallback, useEffect, useRef, useState } from "react"

export interface Message {
    id: string
    type: 'MESSAGE' | 'USER_JOINED' | 'USER_LEFT' | 'SYSTEM'
    clientId?: string
    username?: string
    color?: string
    text?: string
    timestamp: number
}

export interface User {
    id: string
    username: string
    color: string
}

export interface WebSocketState {
    messages: Message[]
    users: User[]
    status: 'connecting' | 'connected' | 'disconnected' | 'error'
    myClientId: string | null
    myColor: string | null
    typingUsers: string[]
}

export function useWebSocket(url: string, username: string) {
    const ws = useRef<WebSocket | null>(null);
    const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [state, setState] = useState<WebSocketState>({
        messages: [],
        users: [],
        status: 'connecting',
        myClientId: null,
        myColor: null,
        typingUsers: [],
    })
    const connect = useCallback(() => {
        ws.current = new WebSocket(url)

        ws.current.onopen = () => {
            setState(prev => ({ ...prev, status: 'connected' }))
            ws.current?.send(JSON.stringify({ type: 'JOIN', username }))
        }

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.type === 'WELCOME') {
                setState(prev => ({
                    ...prev,
                    myClientId: data.clientId,
                    myColor: data.color,
                    users: data.users,
                    messages: [...prev.messages, {
                        id: Date.now().toString(),
                        type: 'SYSTEM',
                        text: data.message,
                        timestamp: Date.now(),
                    }]
                }))
            }

            if (data.type === 'MESSAGE') {
                setState(prev => ({
                    ...prev,
                    messages: [...prev.messages, data],
                }))
            }

            if (data.type === 'USER_JOINED') {
                setState(prev => ({
                    ...prev,
                    users: data.users,
                    messages: [...prev.messages, {
                        id: Date.now().toString(),
                        type: 'USER_JOINED',
                        username: data.username,
                        color: data.color,
                        text: `${data.username} joined the chat`,
                        timestamp: data.timestamp,
                    }]
                }))
            }

            if (data.type === 'USER_LEFT') {
                setState(prev => ({
                    ...prev,
                    users: data.users,
                    messages: [...prev.messages, {
                        id: Date.now().toString(),
                        type: 'USER_LEFT',
                        username: data.username,
                        text: `${data.username} left the chat`,
                        timestamp: data.timestamp,
                    }]
                }))
            }

            if (data.type === 'TYPING') {
                setState(prev => ({
                    ...prev,
                    typingUsers: data.isTyping
                        ? [...prev.typingUsers.filter(u => u !== data.username), data.username]
                        : prev.typingUsers.filter(u => u !== data.username),
                }))
            }
        }

        ws.current.onerror = () => {
            setState(prev => ({ ...prev, status: 'error' }))
        }

        ws.current.onclose = () => {
            setState(prev => ({ ...prev, status: 'disconnected' }))
            setTimeout(connect, 3000)
        }
    }, [url, username])

    useEffect(() => {
        connect()
        return () => ws.current?.close()
    }, [connect])

    const sendMessage = useCallback((text: string) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'MESSAGE', text }))
        }
    }, [])

    const sendTyping = useCallback((isTyping: boolean) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'TYPING', isTyping }))
        }
    }, [])

    const handleTyping = useCallback(() => {
        sendTyping(true)
        if (typingTimer.current) clearTimeout(typingTimer.current)
        typingTimer.current = setTimeout(() => sendTyping(false), 1500)
    }, [sendTyping])

    return { ...state, sendMessage, handleTyping }
}