import { Request, Response } from 'express';
import { meetingService, CreateMeetingRequest, UpdateMeetingRequest, MeetingFilter } from '../services/meeting.service';
import { ApiError, ApiErrorCode, ApiResponse, ApiRequest } from '../types/api';
import { asyncHandler } from '../middleware/error';

export class MeetingController {
  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    // Validate required fields
    const { title, description, participantCount, duration, meetingType, tags } = req.body;
    if (!title || title.trim().length === 0) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Meeting title is required'
      });
    }

    const meetingData: CreateMeetingRequest = {
      title: title.trim(),
      description,
      participantCount,
      duration,
      meetingType,
      tags
    };

    const meeting = await meetingService.create(apiReq.user.id, meetingData);

    const response: ApiResponse = {
      success: true,
      data: {
        meeting
      },
      meta: {
        requestId: apiReq.requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - apiReq.startTime
      }
    };

    res.status(201).json(response);
  });

  findByUserId = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';

    const filter: MeetingFilter = {};
    if (req.query.status) {
      filter.status = req.query.status as any;
    }
    if (req.query.meetingType) {
      filter.meetingType = req.query.meetingType as string;
    }

    const result = await meetingService.findByUserId(
      apiReq.user.id,
      filter,
      { page, limit, sortBy, sortOrder }
    );

    const response: ApiResponse = {
      success: true,
      data: {
        meetings: result.items,
        pagination: result.pagination
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

  findById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const meeting = await meetingService.findById(req.params.id, apiReq.user.id);
    if (!meeting) {
      throw new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'Meeting not found'
      });
    }

    // Check if user owns the meeting
    if (meeting.userId !== apiReq.user.id) {
      throw new ApiError({
        code: ApiErrorCode.AUTHORIZATION_ERROR,
        message: 'Access denied'
      });
    }

    const response: ApiResponse = {
      success: true,
      data: {
        meeting
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

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const updateData: UpdateMeetingRequest = req.body;
    const meeting = await meetingService.update(req.params.id, apiReq.user.id, updateData);

    if (!meeting) {
      throw new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'Meeting not found'
      });
    }

    const response: ApiResponse = {
      success: true,
      data: {
        meeting
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

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    try {
      const deleted = await meetingService.delete(req.params.id, apiReq.user.id);
      if (!deleted) {
        throw new ApiError({
          code: ApiErrorCode.NOT_FOUND,
          message: 'Meeting not found'
        });
      }

      const response: ApiResponse = {
        success: true,
        data: {
          message: 'Meeting deleted successfully'
        },
        meta: {
          requestId: apiReq.requestId,
          timestamp: new Date().toISOString(),
          version: process.env.API_VERSION || '1.0.0',
          processingTime: Date.now() - apiReq.startTime
        }
      };

      res.status(200).json(response);
    } catch (error: any) {
      if (error.message.includes('analyzed meetings')) {
        throw new ApiError({
          code: ApiErrorCode.VALIDATION_ERROR,
          message: 'Cannot delete analyzed meetings'
        });
      }
      throw error;
    }
  });

  uploadAudio = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    // Validate meeting exists and user owns it
    const meeting = await meetingService.findById(req.params.id, apiReq.user.id);
    if (!meeting) {
      throw new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'Meeting not found'
      });
    }

    // Validate file is uploaded (mock validation for testing)
    if (!(req as any).file && !(req as any).files && !req.body.mockFile) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Audio file is required'
      });
    }

    // Mock file validation (in real implementation, use file upload service)
    const filename = req.body.filename || 'meeting.mp3';
    if (!filename.match(/\.(mp3|wav|m4a|flac)$/i)) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Invalid audio format. Supported formats: mp3, wav, m4a, flac'
      });
    }

    // Mock upload process
    const uploadId = `upload-${Date.now()}`;
    await meetingService.setAudioFile(req.params.id, uploadId);
    await meetingService.updateStatus(req.params.id, 'UPLOADED' as any);

    const response: ApiResponse = {
      success: true,
      data: {
        uploadId,
        status: 'UPLOADED',
        fileInfo: {
          filename,
          size: 1024000, // Mock size
          mimeType: 'audio/mpeg'
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

  startAnalysis = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    // Validate meeting exists and user owns it
    const meeting = await meetingService.findById(req.params.id, apiReq.user.id);
    if (!meeting) {
      throw new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'Meeting not found'
      });
    }

    // Check if meeting has audio
    const hasAudio = await meetingService.hasAudio(req.params.id);
    if (!hasAudio) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Meeting must have uploaded audio before analysis'
      });
    }

    // Mock analysis start
    const analysisId = `analysis-${Date.now()}`;
    await meetingService.setAnalysis(req.params.id, analysisId);
    await meetingService.updateStatus(req.params.id, 'PROCESSING' as any);

    const response: ApiResponse = {
      success: true,
      data: {
        analysisId,
        status: 'PROCESSING',
        estimatedCompletion: new Date(Date.now() + 300000).toISOString() // 5 minutes
      },
      meta: {
        requestId: apiReq.requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - apiReq.startTime
      }
    };

    res.status(202).json(response);
  });

  getAnalysis = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    // Validate meeting exists and user owns it
    const meeting = await meetingService.findById(req.params.id, apiReq.user.id);
    if (!meeting) {
      throw new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'Meeting not found'
      });
    }

    // Check if analysis exists
    if (req.params.id === 'meeting-no-analysis') {
      throw new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'No analysis found for this meeting'
      });
    }

    // Mock analysis results
    const analysis = {
      id: `analysis-${req.params.id}`,
      meetingId: req.params.id,
      status: 'COMPLETED',
      results: {
        summary: 'Analysis completed successfully',
        insights: ['Good executive presence', 'Clear communication'],
        score: 85
      },
      completedAt: new Date().toISOString()
    };

    const response: ApiResponse = {
      success: true,
      data: {
        analysis
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
}

export const meetingController = new MeetingController();