import { Request, Response } from 'express';
import { scenarioService, ScenarioFilter, GenerationRequest, SessionSelfAssessment } from '../services/scenario.service';
import { ApiError, ApiErrorCode, ApiResponse, ApiRequest } from '../types/api';
import { asyncHandler } from '../middleware/error';

export class ScenarioController {
  findAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const filter: ScenarioFilter = {};
    if (req.query.category) {
      filter.category = req.query.category as any;
    }
    if (req.query.difficulty) {
      filter.difficulty = parseInt(req.query.difficulty as string);
    }
    if (req.query.skillFocus) {
      filter.skillFocus = req.query.skillFocus as any;
    }

    const result = await scenarioService.findAll(filter, { page, limit });

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

  findById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const scenario = await scenarioService.findById(req.params.id);
    if (!scenario) {
      throw new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'Scenario not found'
      });
    }

    const response: ApiResponse = {
      success: true,
      data: {
        scenario
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

  generateScenarios = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    // Validate generation request
    const { count, category, difficulty, personalizeFor, basedOnMeetingId, context } = req.body;

    if (!count || count < 1 || count > 10) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Count must be between 1 and 10'
      });
    }

    if (difficulty && (difficulty < 1 || difficulty > 5)) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Difficulty must be between 1 and 5'
      });
    }

    const generationRequest: GenerationRequest = {
      count,
      category,
      difficulty,
      personalizeFor: personalizeFor || apiReq.user.id,
      basedOnMeetingId,
      context
    };

    const generation = await scenarioService.generateScenarios(generationRequest);

    const response: ApiResponse = {
      success: true,
      data: generation,
      meta: {
        requestId: apiReq.requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - apiReq.startTime
      }
    };

    res.status(201).json(response);
  });

  getGenerationStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const generation = await scenarioService.getGenerationStatus(req.params.id);
    if (!generation) {
      throw new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'Generation not found'
      });
    }

    const response: ApiResponse = {
      success: true,
      data: {
        generation
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

  startPractice = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    // Validate scenario exists
    const scenario = await scenarioService.findById(req.params.id);
    if (!scenario) {
      throw new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'Scenario not found'
      });
    }

    // Validate practice options
    const { mode, timeLimit, recordSession } = req.body;
    if (mode && !['guided', 'freeform', 'timed'].includes(mode)) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Invalid practice mode. Must be: guided, freeform, or timed'
      });
    }

    const session = await scenarioService.startPracticeSession(
      apiReq.user.id,
      req.params.id,
      { mode, timeLimit, recordSession: recordSession || false }
    );

    const response: ApiResponse = {
      success: true,
      data: {
        sessionId: session.id,
        status: session.status,
        scenario: {
          id: scenario.id,
          content: {
            title: scenario.title,
            description: scenario.description,
            stakeholderProfile: scenario.stakeholderProfile
          }
        },
        timeLimit: session.timeLimit,
        startedAt: session.startedAt.toISOString()
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

  getPracticeSessions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const filter: any = {};
    if (req.query.status) {
      filter.status = req.query.status as string;
    }

    const result = await scenarioService.findPracticeSessions(
      apiReq.user.id,
      filter,
      { page, limit }
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

  getPracticeSession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const session = await scenarioService.findPracticeSessionById(req.params.id, apiReq.user.id);
    if (!session) {
      throw new ApiError({
        code: ApiErrorCode.NOT_FOUND,
        message: 'Practice session not found'
      });
    }

    const response: ApiResponse = {
      success: true,
      data: {
        session
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

  submitResponse = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const { responseText, audioRecording, timeSpent, responseType } = req.body;

    if (!responseText && !audioRecording) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Response text or audio recording is required'
      });
    }

    const response = await scenarioService.submitResponse(
      req.params.id,
      apiReq.user.id,
      { responseText, audioRecording, timeSpent: timeSpent || 0, responseType: responseType || 'written' }
    );

    const apiResponse: ApiResponse = {
      success: true,
      data: {
        response
      },
      meta: {
        requestId: apiReq.requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - apiReq.startTime
      }
    };

    res.status(200).json(apiResponse);
  });

  completeSession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    const { selfAssessment } = req.body;

    // Validate self assessment
    if (selfAssessment) {
      const { confidence, difficulty, realism, learningValue } = selfAssessment;
      if ([confidence, difficulty, realism, learningValue].some((val: number) => val < 1 || val > 5)) {
        throw new ApiError({
          code: ApiErrorCode.VALIDATION_ERROR,
          message: 'Self assessment scores must be between 1 and 5'
        });
      }
    }

    const session = await scenarioService.completeSession(
      req.params.id,
      apiReq.user.id,
      selfAssessment as SessionSelfAssessment
    );

    const response: ApiResponse = {
      success: true,
      data: {
        session
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

export const scenarioController = new ScenarioController();