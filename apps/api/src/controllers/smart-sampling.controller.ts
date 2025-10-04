import { Request, Response } from 'express';
import { smartSamplingService } from '../services/smart-sampling.service';
import { ApiError, ApiErrorCode, ApiResponse, ApiRequest } from '../types/api';
import { asyncHandler } from '../middleware/error';

export class SmartSamplingController {
  getConfigs = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const configs = smartSamplingService.getConfigs();

    const response: ApiResponse = {
      success: true,
      data: {
        configs
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

    const { meetingId, config, customConfig, priority } = req.body;

    if (!meetingId) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Meeting ID is required'
      });
    }

    if (!config) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Configuration is required'
      });
    }

    try {
      const analysis = await smartSamplingService.startAnalysis(
        meetingId,
        apiReq.user.id,
        config,
        customConfig,
        priority
      );

      const response: ApiResponse = {
        success: true,
        data: {
          analysisId: analysis.id,
          status: analysis.status,
          config: analysis.config,
          estimatedCompletion: analysis.startedAt.toISOString(),
          costEstimate: {
            originalCost: 15.0,
            optimizedCost: 15.0 * analysis.config.samplingRatio,
            savings: 15.0 * (1 - analysis.config.samplingRatio),
            savingsPercentage: (1 - analysis.config.samplingRatio) * 100,
            currency: 'USD'
          }
        },
        meta: {
          requestId: apiReq.requestId,
          timestamp: new Date().toISOString(),
          version: process.env.API_VERSION || '1.0.0',
          processingTime: Date.now() - apiReq.startTime
        }
      };

      res.status(202).json(response);
    } catch (error: any) {
      if (error.message.includes('not found')) {
        throw new ApiError({
          code: ApiErrorCode.NOT_FOUND,
          message: 'Meeting not found or does not have audio'
        });
      }
      if (error.message.includes('ratio') || error.message.includes('threshold')) {
        throw new ApiError({
          code: ApiErrorCode.VALIDATION_ERROR,
          message: error.message
        });
      }
      throw error;
    }
  });

  getAnalysis = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const analysis = await smartSamplingService.getAnalysis(req.params.id, apiReq.user.id);
    if (!analysis) {
      throw new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'Analysis not found'
      });
    }

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

  getCriticalMoments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const filters: any = {};
    if (req.query.type) {
      filters.type = req.query.type as string;
    }
    if (req.query.pmPattern) {
      filters.pmPattern = req.query.pmPattern as string;
    }

    const result = await smartSamplingService.getCriticalMoments(
      req.params.id,
      apiReq.user.id,
      filters
    );

    const response: ApiResponse = {
      success: true,
      data: result,
      meta: {
        requestId: apiReq.requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - apiReq.startTime
      }
    };

    res.status(200).json(response);
  });

  getPMInsights = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const insights = await smartSamplingService.getPMInsights(req.params.id, apiReq.user.id);

    const response: ApiResponse = {
      success: true,
      data: {
        insights
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

  exportAnalysis = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const options = {
      format: req.body.format || 'json',
      includeAudio: req.body.includeAudio || false,
      includeMoments: req.body.includeMoments || true,
      includePMInsights: req.body.includePMInsights || true,
      includeCharts: req.body.includeCharts || false,
      includeTranscript: req.body.includeTranscript || false
    };

    const exportResult = await smartSamplingService.exportAnalysis(
      req.params.id,
      apiReq.user.id,
      options
    );

    const response: ApiResponse = {
      success: true,
      data: exportResult,
      meta: {
        requestId: apiReq.requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - apiReq.startTime
      }
    };

    res.status(200).json(response);
  });

  getAnalytics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const options = {
      timeRange: req.query.timeRange as string || '30d',
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      groupBy: req.query.groupBy as string || 'week'
    };

    const analytics = await smartSamplingService.getAnalytics(apiReq.user.id, options);

    const response: ApiResponse = {
      success: true,
      data: {
        analytics
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

  startBatchAnalysis = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const { meetingIds, config, priority } = req.body;

    if (!meetingIds || !Array.isArray(meetingIds) || meetingIds.length === 0) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Meeting IDs array is required'
      });
    }

    try {
      const batch = await smartSamplingService.startBatchAnalysis(
        apiReq.user.id,
        meetingIds,
        config || 'BALANCED',
        priority
      );

      const response: ApiResponse = {
        success: true,
        data: batch,
        meta: {
          requestId: apiReq.requestId,
          timestamp: new Date().toISOString(),
          version: process.env.API_VERSION || '1.0.0',
          processingTime: Date.now() - apiReq.startTime
        }
      };

      res.status(202).json(response);
    } catch (error: any) {
      if (error.message.includes('batch size')) {
        throw new ApiError({
          code: ApiErrorCode.VALIDATION_ERROR,
          message: 'Maximum batch size is 100 meetings'
        });
      }
      throw error;
    }
  });

  getBatchAnalysis = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const batch = await smartSamplingService.getBatchAnalysis(req.params.id, apiReq.user.id);
    if (!batch) {
      throw new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'Batch analysis not found'
      });
    }

    const response: ApiResponse = {
      success: true,
      data: {
        batch
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

export const smartSamplingController = new SmartSamplingController();