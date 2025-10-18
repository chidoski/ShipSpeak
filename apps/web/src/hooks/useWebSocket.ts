/**
 * WebSocket Custom Hook for ShipSpeak
 * Reusable WebSocket management with error handling and reconnection
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { WebSocketMessage, ProgressUpdate } from '@/types/dashboard'

interface UseWebSocketOptions {
  url: string
  enabled?: boolean
  retryInterval?: number
  maxRetries?: number
  onMessage?: (message: WebSocketMessage) => void
  onError?: (error: Event) => void
  onConnect?: () => void
  onDisconnect?: () => void
}

interface UseWebSocketReturn {
  isConnected: boolean
  connectionError: boolean
  retryCount: number
  sendMessage: (message: any) => void
  disconnect: () => void
  reconnect: () => void
}

export const useWebSocket = ({
  url,
  enabled = true,
  retryInterval = 2000,
  maxRetries = 5,
  onMessage,
  onError,
  onConnect,
  onDisconnect
}: UseWebSocketOptions): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  
  const wsRef = useRef<WebSocket | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    if (!enabled || wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      wsRef.current = new WebSocket(url)

      wsRef.current.onopen = () => {
        setIsConnected(true)
        setConnectionError(false)
        setRetryCount(0)
        onConnect?.()
      }

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          onMessage?.(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      wsRef.current.onerror = (error) => {
        setConnectionError(true)
        onError?.(error)
      }

      wsRef.current.onclose = () => {
        setIsConnected(false)
        onDisconnect?.()
        
        // Auto-retry if enabled and under retry limit
        if (enabled && retryCount < maxRetries) {
          retryTimeoutRef.current = setTimeout(() => {
            setRetryCount(prev => prev + 1)
            connect()
          }, retryInterval)
        }
      }
    } catch (error) {
      setConnectionError(true)
      onError?.(error as Event)
    }
  }, [url, enabled, retryCount, maxRetries, retryInterval, onMessage, onError, onConnect, onDisconnect])

  const disconnect = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
    
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    setIsConnected(false)
    setRetryCount(0)
  }, [])

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  const reconnect = useCallback(() => {
    disconnect()
    setRetryCount(0)
    setConnectionError(false)
    connect()
  }, [disconnect, connect])

  useEffect(() => {
    if (enabled) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [enabled, connect, disconnect])

  return {
    isConnected,
    connectionError,
    retryCount,
    sendMessage,
    disconnect,
    reconnect
  }
}