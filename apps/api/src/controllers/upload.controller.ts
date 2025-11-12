import { Request, Response } from 'express';
import multer from 'multer';
import { 
  validateAudioFile,
  scanFileForSecurity,
  processChunkedUpload,
  clearUploadSessions,
  type ChunkedUploadOptions,
  type FileValidationResult,
  type SecurityScanResult 
} from '../../../web/src/lib/file-upload';
import { uploadService, type FileUploadMetadata } from '../services/upload.service';
import { ApiError, ApiErrorCode, ApiResponse, ApiRequest } from '../types/api';
import { asyncHandler } from '../middleware/error';

// In-memory storage for upload sessions (in production, use Redis or database)
interface UploadSession {
  sessionId: string;
  userId: string;
  fileName: string;
  fileSize: number;
  totalChunks: number;
  uploadedChunks: number;
  chunks: Map<number, Buffer>;
  metadata: any;
  createdAt: Date;
}

const uploadSessions = new Map<string, UploadSession>();
const CHUNK_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Cleanup expired sessions periodically
setInterval(() => {
  const now = new Date();
  for (const [sessionId, session] of uploadSessions.entries()) {
    if (now.getTime() - session.createdAt.getTime() > CHUNK_TIMEOUT) {
      uploadSessions.delete(sessionId);
    }
  }
}, 60 * 1000); // Check every minute

export class UploadController {
  /**
   * Initiate a chunked upload session
   */
  initiateChunkedUpload = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const { fileName, fileSize, chunkSize, metadata } = req.body;

    // Validate required parameters
    if (!fileName || !fileSize) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'fileName and fileSize are required'
      });
    }

    // Validate file size limit (100MB)
    if (fileSize > 100 * 1024 * 1024) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'File size exceeds 100MB limit'
      });
    }

    // Validate file extension
    const allowedExtensions = ['.mp3', '.wav', '.m4a', '.webm'];
    const hasValidExtension = allowedExtensions.some(ext => 
      fileName.toLowerCase().endsWith(ext)
    );
    
    if (!hasValidExtension) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Invalid file type. Only audio files are allowed'
      });
    }

    const actualChunkSize = chunkSize || 5 * 1024 * 1024; // Default 5MB chunks
    const totalChunks = Math.ceil(fileSize / actualChunkSize);
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create upload session
    const session: UploadSession = {
      sessionId,
      userId: apiReq.user.id,
      fileName,
      fileSize,
      totalChunks,
      uploadedChunks: 0,
      chunks: new Map(),
      metadata: metadata || {},
      createdAt: new Date()
    };

    uploadSessions.set(sessionId, session);

    const response: ApiResponse = {
      success: true,
      data: {
        sessionId,
        totalChunks,
        chunkSize: actualChunkSize,
        expiresAt: new Date(Date.now() + CHUNK_TIMEOUT).toISOString()
      },
      meta: {
        requestId: apiReq.requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - apiReq.startTime
      }
    };

    res.status(200).json(response);
  });

  /**
   * Upload a file chunk
   */
  uploadChunk = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const { sessionId, chunkIndex, chunkData, checksum } = req.body;

    if (!sessionId || chunkIndex === undefined || !chunkData) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'sessionId, chunkIndex, and chunkData are required'
      });
    }

    const session = uploadSessions.get(sessionId);
    if (!session) {
      throw new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'Upload session not found or expired'
      });
    }

    // Verify user owns the session
    if (session.userId !== apiReq.user.id) {
      throw new ApiError({
        code: ApiErrorCode.AUTHORIZATION_ERROR,
        message: 'Access denied to upload session'
      });
    }

    // Validate chunk index
    if (chunkIndex < 0 || chunkIndex >= session.totalChunks) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Invalid chunk index'
      });
    }

    // Convert base64 chunk data to buffer
    let chunkBuffer: Buffer;
    try {
      chunkBuffer = Buffer.from(chunkData, 'base64');
    } catch (error) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Invalid chunk data format'
      });
    }

    // Verify checksum if provided
    if (checksum) {
      const crypto = require('crypto');
      const actualChecksum = crypto.createHash('sha256').update(chunkBuffer).digest('hex');
      if (actualChecksum !== checksum) {
        throw new ApiError({
          code: ApiErrorCode.VALIDATION_ERROR,
          message: 'Chunk checksum mismatch'
        });
      }
    }

    // Store chunk
    session.chunks.set(chunkIndex, chunkBuffer);
    session.uploadedChunks = session.chunks.size;

    // Update session
    uploadSessions.set(sessionId, session);

    const response: ApiResponse = {
      success: true,
      data: {
        chunkIndex,
        uploadedChunks: session.uploadedChunks,
        totalChunks: session.totalChunks,
        progress: (session.uploadedChunks / session.totalChunks) * 100
      },
      meta: {
        requestId: apiReq.requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - apiReq.startTime
      }
    };

    res.status(200).json(response);
  });

  /**
   * Complete chunked upload
   */
  completeUpload = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const { sessionId } = req.body;

    if (!sessionId) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'sessionId is required'
      });
    }

    const session = uploadSessions.get(sessionId);
    if (!session) {
      throw new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'Upload session not found or expired'
      });
    }

    // Verify user owns the session
    if (session.userId !== apiReq.user.id) {
      throw new ApiError({
        code: ApiErrorCode.AUTHORIZATION_ERROR,
        message: 'Access denied to upload session'
      });
    }

    // Check if all chunks are uploaded
    if (session.uploadedChunks !== session.totalChunks) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: `Missing chunks. Expected ${session.totalChunks}, got ${session.uploadedChunks}`
      });
    }

    // Reassemble file from chunks
    const fileBuffers: Buffer[] = [];
    for (let i = 0; i < session.totalChunks; i++) {
      const chunk = session.chunks.get(i);
      if (!chunk) {
        throw new ApiError({
          code: ApiErrorCode.VALIDATION_ERROR,
          message: `Missing chunk ${i}`
        });
      }
      fileBuffers.push(chunk);
    }

    const completeFile = Buffer.concat(fileBuffers);

    // Create a File-like object for validation
    const file = {
      name: session.fileName,
      size: completeFile.length,
      type: this.getMimeTypeFromExtension(session.fileName),
      arrayBuffer: async () => completeFile.buffer.slice(completeFile.byteOffset, completeFile.byteOffset + completeFile.byteLength)
    } as File;

    // Validate the complete file
    const validationResult = await validateAudioFile(file);
    if (!validationResult.isValid) {
      // Clean up session
      uploadSessions.delete(sessionId);
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: `File validation failed: ${validationResult.error}`
      });
    }

    // Security scan
    const securityResult = await scanFileForSecurity(file);
    if (!securityResult.isSafe) {
      // Clean up session
      uploadSessions.delete(sessionId);
      throw new ApiError({
        code: ApiErrorCode.SECURITY_ERROR,
        message: `Security scan failed: ${securityResult.threats.join(', ')}`
      });
    }

    // Upload to Supabase Storage
    const uploadResult = await uploadService.uploadToSupabaseStorage(
      apiReq.user.id,
      completeFile,
      {
        originalFilename: session.fileName,
        sanitizedFilename: validationResult.sanitizedFilename || session.fileName,
        mimeType: validationResult.mimeType || this.getMimeTypeFromExtension(session.fileName)
      }
    );

    if (!uploadResult.success) {
      // Clean up session
      uploadSessions.delete(sessionId);
      throw new ApiError({
        code: ApiErrorCode.INTERNAL_ERROR,
        message: `Upload to storage failed: ${uploadResult.error}`
      });
    }

    // Save metadata to database
    const metadata: FileUploadMetadata = {
      originalFilename: session.fileName,
      fileSize: completeFile.length,
      mimeType: validationResult.mimeType || this.getMimeTypeFromExtension(session.fileName),
      sanitizedFilename: validationResult.sanitizedFilename || session.fileName,
      storagePath: uploadResult.storagePath!,
      uploadedAt: new Date().toISOString(),
      userId: apiReq.user.id
    };

    const saveResult = await uploadService.saveFileMetadata(apiReq.user.id, metadata, session.metadata);

    if (!saveResult.success) {
      // Clean up uploaded file if database save fails
      // TODO: Implement rollback logic
      uploadSessions.delete(sessionId);
      throw new ApiError({
        code: ApiErrorCode.INTERNAL_ERROR,
        message: `Failed to save file metadata: ${saveResult.error}`
      });
    }

    // Clean up session
    uploadSessions.delete(sessionId);

    const response: ApiResponse = {
      success: true,
      data: {
        fileId: saveResult.fileId,
        meetingId: saveResult.meetingId,
        fileName: session.fileName,
        fileSize: completeFile.length,
        storagePath: uploadResult.storagePath,
        mimeType: validationResult.mimeType,
        sanitizedFilename: validationResult.sanitizedFilename
      },
      meta: {
        requestId: apiReq.requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - apiReq.startTime
      }
    };

    res.status(200).json(response);
  });

  /**
   * Get upload progress
   */
  getUploadProgress = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const { sessionId } = req.params;
    const session = uploadSessions.get(sessionId);

    if (!session) {
      throw new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'Upload session not found or expired'
      });
    }

    // Verify user owns the session
    if (session.userId !== apiReq.user.id) {
      throw new ApiError({
        code: ApiErrorCode.AUTHORIZATION_ERROR,
        message: 'Access denied to upload session'
      });
    }

    const progress = (session.uploadedChunks / session.totalChunks) * 100;
    const timeRemaining = session.uploadedChunks > 0 ? 
      ((session.totalChunks - session.uploadedChunks) * 2) : // Estimate 2 seconds per chunk
      null;

    const response: ApiResponse = {
      success: true,
      data: {
        sessionId,
        uploadedChunks: session.uploadedChunks,
        totalChunks: session.totalChunks,
        progress,
        estimatedTimeRemaining: timeRemaining
      },
      meta: {
        requestId: apiReq.requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - apiReq.startTime
      }
    };

    res.status(200).json(response);
  });

  /**
   * Validate file before upload
   */
  validateFile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    if (!req.file) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'No file provided'
      });
    }

    // Create File object from uploaded file
    const file = new File([req.file.buffer], req.file.originalname, {
      type: req.file.mimetype
    });

    // Validate file
    const validationResult = await validateAudioFile(file);
    
    // Security scan
    const securityResult = await scanFileForSecurity(file);

    const response: ApiResponse = {
      success: true,
      data: {
        validation: validationResult,
        security: securityResult,
        fileInfo: {
          originalName: req.file.originalname,
          size: req.file.size,
          mimeType: req.file.mimetype
        }
      },
      meta: {
        requestId: apiReq.requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - apiReq.startTime
      }
    };

    res.status(200).json(response);
  });

  /**
   * Simple file upload for smaller files
   */
  simpleUpload = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    if (!req.file) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'No file provided'
      });
    }

    // Create File object from uploaded file
    const file = new File([req.file.buffer], req.file.originalname, {
      type: req.file.mimetype
    });

    // Validate file
    const validationResult = await validateAudioFile(file);
    if (!validationResult.isValid) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: `File validation failed: ${validationResult.error}`
      });
    }

    // Security scan
    const securityResult = await scanFileForSecurity(file);
    if (!securityResult.isSafe) {
      throw new ApiError({
        code: ApiErrorCode.SECURITY_ERROR,
        message: `Security scan failed: ${securityResult.threats.join(', ')}`
      });
    }

    // Upload to Supabase Storage
    const uploadResult = await uploadService.uploadToSupabaseStorage(
      apiReq.user.id,
      req.file.buffer,
      {
        originalFilename: req.file.originalname,
        sanitizedFilename: validationResult.sanitizedFilename || req.file.originalname,
        mimeType: validationResult.mimeType || req.file.mimetype
      }
    );

    if (!uploadResult.success) {
      throw new ApiError({
        code: ApiErrorCode.INTERNAL_ERROR,
        message: `Upload to storage failed: ${uploadResult.error}`
      });
    }

    // Save metadata to database
    const metadata: FileUploadMetadata = {
      originalFilename: req.file.originalname,
      fileSize: req.file.size,
      mimeType: validationResult.mimeType || req.file.mimetype,
      sanitizedFilename: validationResult.sanitizedFilename || req.file.originalname,
      storagePath: uploadResult.storagePath!,
      uploadedAt: new Date().toISOString(),
      userId: apiReq.user.id
    };

    const saveResult = await uploadService.saveFileMetadata(apiReq.user.id, metadata);

    if (!saveResult.success) {
      throw new ApiError({
        code: ApiErrorCode.INTERNAL_ERROR,
        message: `Failed to save file metadata: ${saveResult.error}`
      });
    }

    const response: ApiResponse = {
      success: true,
      data: {
        fileId: saveResult.fileId,
        meetingId: saveResult.meetingId,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        storagePath: uploadResult.storagePath,
        mimeType: validationResult.mimeType,
        sanitizedFilename: validationResult.sanitizedFilename
      },
      meta: {
        requestId: apiReq.requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - apiReq.startTime
      }
    };

    res.status(200).json(response);
  });

  /**
   * Cancel upload session
   */
  cancelUploadSession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const { sessionId } = req.params;
    const session = uploadSessions.get(sessionId);

    if (!session) {
      throw new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'Upload session not found or expired'
      });
    }

    // Verify user owns the session
    if (session.userId !== apiReq.user.id) {
      throw new ApiError({
        code: ApiErrorCode.AUTHORIZATION_ERROR,
        message: 'Access denied to upload session'
      });
    }

    // Clean up session
    uploadSessions.delete(sessionId);

    const response: ApiResponse = {
      success: true,
      data: {
        message: 'Upload session cancelled successfully'
      },
      meta: {
        requestId: apiReq.requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - apiReq.startTime
      }
    };

    res.status(200).json(response);
  });

  /**
   * Helper method to get MIME type from file extension
   */
  private getMimeTypeFromExtension(fileName: string): string {
    const ext = fileName.toLowerCase().split('.').pop();
    const mimeTypes: Record<string, string> = {
      'mp3': 'audio/mp3',
      'wav': 'audio/wav',
      'mpeg': 'audio/mpeg',
      'm4a': 'audio/m4a',
      'webm': 'audio/webm'
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }
}

export const uploadController = new UploadController();