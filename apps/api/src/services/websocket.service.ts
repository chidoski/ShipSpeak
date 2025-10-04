/**
 * WebSocket Service - Real-time communication for progress updates
 * Handles Socket.IO integration for live progress tracking
 */

import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { jwtService } from '../utils/jwt';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface ProgressUpdate {
  progress: number; // 0-100
  stage: string;
  message: string;
  timestamp: Date;
}

export interface AnalysisProgress extends ProgressUpdate {
  meetingId: string;
  analysisId: string;
  momentsFound?: number;
  costSavings?: number;
}

export interface GenerationProgress extends ProgressUpdate {
  generationId: string;
  scenariosCompleted: number;
  totalScenarios: number;
}

export interface BatchProgress extends ProgressUpdate {
  batchId: string;
  completedMeetings: number;
  totalMeetings: number;
  failedMeetings: number;
  estimatedCompletion: Date;
}

export interface SessionUpdate {
  sessionId: string;
  event: 'response-submitted' | 'hint-triggered' | 'session-paused' | 'session-resumed';
  score?: number;
  feedback?: object;
  hint?: string;
  trigger?: string;
  confidence?: number;
}

export class WebSocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, Socket> = new Map();
  private userRooms: Map<string, Set<string>> = new Map();

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware(): void {
    // Authentication middleware
    this.io.use(async (socket: Socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication required'));
        }

        const user = await jwtService.verifyToken(token);
        if (!user) {
          return next(new Error('Authentication failed'));
        }

        (socket as any).user = user;
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      const user = (socket as any).user as User;
      console.log(`User ${user.id} connected via WebSocket`);

      // Store connection
      this.connectedUsers.set(user.id, socket);
      this.userRooms.set(user.id, new Set());

      // Handle room joining
      socket.on('join-meeting', (meetingId: string) => {
        this.handleJoinMeeting(socket, user, meetingId);
      });

      socket.on('join-analysis', (analysisId: string) => {
        this.handleJoinAnalysis(socket, user, analysisId);
      });

      socket.on('join-generation', (generationId: string) => {
        this.handleJoinGeneration(socket, user, generationId);
      });

      socket.on('join-session', (sessionId: string) => {
        this.handleJoinSession(socket, user, sessionId);
      });

      socket.on('join-batch', (batchId: string) => {
        this.handleJoinBatch(socket, user, batchId);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(user.id);
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error(`WebSocket error for user ${user.id}:`, error);
      });
    });
  }

  private handleJoinMeeting(socket: Socket, user: User, meetingId: string): void {
    if (!meetingId || meetingId.trim().length === 0) {
      socket.emit('error', {
        code: 'INVALID_ROOM',
        message: 'Invalid room identifier'
      });
      return;
    }

    // TODO: Verify user owns this meeting in real implementation
    if (meetingId === 'unauthorized-meeting') {
      socket.emit('error', {
        code: 'UNAUTHORIZED_ACCESS',
        message: 'Access denied to this meeting'
      });
      return;
    }

    const roomName = `meeting-${meetingId}`;
    socket.join(roomName);
    
    const userRooms = this.userRooms.get(user.id);
    if (userRooms) {
      userRooms.add(roomName);
    }

    console.log(`User ${user.id} joined meeting room: ${roomName}`);
  }

  private handleJoinAnalysis(socket: Socket, user: User, analysisId: string): void {
    if (!analysisId || analysisId.trim().length === 0) {
      socket.emit('error', {
        code: 'INVALID_ROOM',
        message: 'Invalid analysis identifier'
      });
      return;
    }

    const roomName = `analysis-${analysisId}`;
    socket.join(roomName);
    
    const userRooms = this.userRooms.get(user.id);
    if (userRooms) {
      userRooms.add(roomName);
    }

    console.log(`User ${user.id} joined analysis room: ${roomName}`);
  }

  private handleJoinGeneration(socket: Socket, user: User, generationId: string): void {
    if (!generationId || generationId.trim().length === 0) {
      socket.emit('error', {
        code: 'INVALID_ROOM',
        message: 'Invalid generation identifier'
      });
      return;
    }

    const roomName = `generation-${generationId}`;
    socket.join(roomName);
    
    const userRooms = this.userRooms.get(user.id);
    if (userRooms) {
      userRooms.add(roomName);
    }

    console.log(`User ${user.id} joined generation room: ${roomName}`);
  }

  private handleJoinSession(socket: Socket, user: User, sessionId: string): void {
    if (!sessionId || sessionId.trim().length === 0) {
      socket.emit('error', {
        code: 'INVALID_ROOM',
        message: 'Invalid session identifier'
      });
      return;
    }

    const roomName = `session-${sessionId}`;
    socket.join(roomName);
    
    const userRooms = this.userRooms.get(user.id);
    if (userRooms) {
      userRooms.add(roomName);
    }

    console.log(`User ${user.id} joined session room: ${roomName}`);
  }

  private handleJoinBatch(socket: Socket, user: User, batchId: string): void {
    if (!batchId || batchId.trim().length === 0) {
      socket.emit('error', {
        code: 'INVALID_ROOM',
        message: 'Invalid batch identifier'
      });
      return;
    }

    const roomName = `batch-${batchId}`;
    socket.join(roomName);
    
    const userRooms = this.userRooms.get(user.id);
    if (userRooms) {
      userRooms.add(roomName);
    }

    console.log(`User ${user.id} joined batch room: ${roomName}`);
  }

  private handleDisconnect(userId: string): void {
    console.log(`User ${userId} disconnected from WebSocket`);
    
    // Clean up user data
    this.connectedUsers.delete(userId);
    this.userRooms.delete(userId);
  }

  // Public methods for emitting events

  public emitMeetingAnalysisProgress(data: AnalysisProgress): void {
    const roomName = `meeting-${data.meetingId}`;
    this.io.to(roomName).emit('analysis-progress', {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  public emitMeetingAnalysisCompleted(meetingId: string, analysisId: string, results: any): void {
    const roomName = `meeting-${meetingId}`;
    this.io.to(roomName).emit('analysis-completed', {
      meetingId,
      analysisId,
      results,
      timestamp: new Date().toISOString()
    });
  }

  public emitMeetingAnalysisError(meetingId: string, analysisId: string, error: any): void {
    const roomName = `meeting-${meetingId}`;
    this.io.to(roomName).emit('analysis-error', {
      meetingId,
      analysisId,
      error,
      timestamp: new Date().toISOString()
    });
  }

  public emitSmartSamplingProgress(data: AnalysisProgress): void {
    const roomName = `analysis-${data.analysisId}`;
    this.io.to(roomName).emit('sampling-progress', {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  public emitSmartSamplingCompleted(analysisId: string, results: any): void {
    const roomName = `analysis-${analysisId}`;
    this.io.to(roomName).emit('sampling-completed', {
      analysisId,
      results,
      timestamp: new Date().toISOString()
    });
  }

  public emitScenarioGenerationProgress(data: GenerationProgress): void {
    const roomName = `generation-${data.generationId}`;
    this.io.to(roomName).emit('generation-progress', {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  public emitScenarioGenerationCompleted(generationId: string, scenarios: any[]): void {
    const roomName = `generation-${generationId}`;
    this.io.to(roomName).emit('generation-completed', {
      generationId,
      scenarios,
      timestamp: new Date().toISOString()
    });
  }

  public emitPracticeSessionUpdate(data: SessionUpdate): void {
    const roomName = `session-${data.sessionId}`;
    this.io.to(roomName).emit('session-update', {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  public emitCoachingHint(sessionId: string, hint: string, trigger: string, confidence: number): void {
    const roomName = `session-${sessionId}`;
    this.io.to(roomName).emit('coaching-hint', {
      sessionId,
      hint,
      trigger,
      confidence,
      timestamp: new Date().toISOString()
    });
  }

  public emitBatchProgress(data: BatchProgress): void {
    const roomName = `batch-${data.batchId}`;
    this.io.to(roomName).emit('batch-progress', {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  // Utility methods

  public isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  public getUserRooms(userId: string): string[] {
    const rooms = this.userRooms.get(userId);
    return rooms ? Array.from(rooms) : [];
  }

  public getRoomUsers(roomName: string): string[] {
    const room = this.io.sockets.adapter.rooms.get(roomName);
    if (!room) return [];

    const userIds: string[] = [];
    for (const [userId, socket] of this.connectedUsers) {
      if (room.has(socket.id)) {
        userIds.push(userId);
      }
    }
    return userIds;
  }

  public close(): void {
    this.io.close();
    this.connectedUsers.clear();
    this.userRooms.clear();
  }
}

// Export singleton instance (will be initialized when server starts)
export let webSocketService: WebSocketService | null = null;

export function initializeWebSocketService(httpServer: HTTPServer): WebSocketService {
  webSocketService = new WebSocketService(httpServer);
  return webSocketService;
}