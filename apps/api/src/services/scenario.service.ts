/**
 * Scenario Service - Business logic for practice scenarios
 * Integrates with scenario generation and practice session management
 */

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: ScenarioCategory;
  subcategory: string;
  difficulty: number; // 1-5
  estimatedDuration: number; // minutes
  pmSkillFocus: PMSkillArea[];
  learningObjectives: string[];
  stakeholderProfile: StakeholderProfile;
  isGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum ScenarioCategory {
  EXECUTIVE_PRESENCE = 'EXECUTIVE_PRESENCE',
  STAKEHOLDER_INFLUENCE = 'STAKEHOLDER_INFLUENCE',
  STRATEGIC_COMMUNICATION = 'STRATEGIC_COMMUNICATION',
  DATA_STORYTELLING = 'DATA_STORYTELLING',
  CONFLICT_RESOLUTION = 'CONFLICT_RESOLUTION',
  PRODUCT_STRATEGY = 'PRODUCT_STRATEGY',
  ROADMAP_DEFENSE = 'ROADMAP_DEFENSE',
  RESOURCE_NEGOTIATION = 'RESOURCE_NEGOTIATION',
  CUSTOMER_ADVOCACY = 'CUSTOMER_ADVOCACY',
  TECHNICAL_TRANSLATION = 'TECHNICAL_TRANSLATION'
}

export enum PMSkillArea {
  STAKEHOLDER_MANAGEMENT = 'STAKEHOLDER_MANAGEMENT',
  EXECUTIVE_COMMUNICATION = 'EXECUTIVE_COMMUNICATION',
  DATA_ANALYSIS = 'DATA_ANALYSIS',
  STRATEGIC_THINKING = 'STRATEGIC_THINKING',
  CONFLICT_RESOLUTION = 'CONFLICT_RESOLUTION',
  PRODUCT_VISION = 'PRODUCT_VISION',
  TECHNICAL_UNDERSTANDING = 'TECHNICAL_UNDERSTANDING',
  CUSTOMER_EMPATHY = 'CUSTOMER_EMPATHY'
}

export interface StakeholderProfile {
  role: string;
  seniority: 'JUNIOR' | 'SENIOR' | 'EXECUTIVE' | 'C_LEVEL';
  personality: 'ANALYTICAL' | 'DRIVER' | 'EXPRESSIVE' | 'AMIABLE';
  concerns: string[];
  motivations: string[];
}

export interface ScenarioFilter {
  category?: ScenarioCategory;
  difficulty?: number;
  skillFocus?: PMSkillArea;
  duration?: { min?: number; max?: number };
}

export interface GenerationRequest {
  count: number;
  category?: ScenarioCategory;
  difficulty?: number;
  personalizeFor?: string; // user ID
  basedOnMeetingId?: string;
  focusOnWeaknesses?: boolean;
  adaptToCommunicationStyle?: boolean;
  context?: PersonalizationContext;
}

export interface PersonalizationContext {
  industry?: string;
  companySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  roleLevel?: 'junior' | 'mid' | 'senior' | 'principal' | 'executive';
  weaknessAreas?: string[];
}

export interface GenerationStatus {
  id: string;
  status: 'GENERATING' | 'COMPLETED' | 'FAILED';
  progress: number; // 0-100
  scenarios: Scenario[];
  estimatedCompletion?: Date;
  error?: string;
  basedOnMeeting?: string;
}

export interface PracticeSession {
  id: string;
  userId: string;
  scenarioId: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
  mode: 'guided' | 'freeform' | 'timed';
  timeLimit?: number; // seconds
  recordSession: boolean;
  startedAt: Date;
  completedAt?: Date;
  responses: PracticeResponse[];
  score?: number;
  finalScore?: number;
  detailedFeedback?: object;
  nextRecommendations?: string[];
}

export interface PracticeResponse {
  id: string;
  sessionId: string;
  responseText: string;
  audioRecording?: string;
  timeSpent: number; // seconds
  responseType: 'written' | 'audio' | 'combined';
  score: number;
  feedback: object;
  submittedAt: Date;
}

export interface SessionSelfAssessment {
  confidence: number; // 1-5
  difficulty: number; // 1-5
  realism: number; // 1-5
  learningValue: number; // 1-5
}

export class ScenarioService {
  async findAll(filter: ScenarioFilter = {}, pagination: { page: number; limit: number }) {
    // TODO: Implement database operation
    const scenarios: Scenario[] = [
      {
        id: 'scenario-1',
        title: 'Executive Stakeholder Alignment',
        description: 'Navigate competing priorities from multiple executives',
        category: ScenarioCategory.EXECUTIVE_PRESENCE,
        subcategory: 'C-Level Communication',
        difficulty: 4,
        estimatedDuration: 15,
        pmSkillFocus: [PMSkillArea.STAKEHOLDER_MANAGEMENT, PMSkillArea.EXECUTIVE_COMMUNICATION],
        learningObjectives: ['Master executive-level communication', 'Align competing priorities'],
        stakeholderProfile: {
          role: 'Chief Technology Officer',
          seniority: 'C_LEVEL',
          personality: 'ANALYTICAL',
          concerns: ['Technical feasibility', 'Resource allocation'],
          motivations: ['Innovation', 'Efficiency']
        },
        isGenerated: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'scenario-2',
        title: 'Data-Driven Product Decision',
        description: 'Present compelling data story to justify product direction',
        category: ScenarioCategory.DATA_STORYTELLING,
        subcategory: 'Analytics Presentation',
        difficulty: 3,
        estimatedDuration: 20,
        pmSkillFocus: [PMSkillArea.DATA_ANALYSIS, PMSkillArea.STRATEGIC_THINKING],
        learningObjectives: ['Present data effectively', 'Build compelling narratives'],
        stakeholderProfile: {
          role: 'VP of Product',
          seniority: 'EXECUTIVE',
          personality: 'DRIVER',
          concerns: ['ROI', 'Market impact'],
          motivations: ['Growth', 'Competitive advantage']
        },
        isGenerated: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Apply filters
    let filteredScenarios = scenarios;
    if (filter.category) {
      filteredScenarios = filteredScenarios.filter(s => s.category === filter.category);
    }
    if (filter.difficulty) {
      filteredScenarios = filteredScenarios.filter(s => s.difficulty === filter.difficulty);
    }
    if (filter.skillFocus) {
      filteredScenarios = filteredScenarios.filter(s => s.pmSkillFocus.includes(filter.skillFocus!));
    }

    const total = filteredScenarios.length;
    const totalPages = Math.ceil(total / pagination.limit);

    return {
      scenarios: filteredScenarios,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrevious: pagination.page > 1
      }
    };
  }

  async findById(id: string): Promise<Scenario | null> {
    // TODO: Implement database operation
    if (id === 'non-existent') {
      return null;
    }

    return {
      id,
      title: 'Sample Scenario',
      description: 'A sample scenario for testing',
      category: ScenarioCategory.EXECUTIVE_PRESENCE,
      subcategory: 'Leadership Communication',
      difficulty: 3,
      estimatedDuration: 15,
      pmSkillFocus: [PMSkillArea.STAKEHOLDER_MANAGEMENT],
      learningObjectives: ['Improve executive presence'],
      stakeholderProfile: {
        role: 'CEO',
        seniority: 'C_LEVEL',
        personality: 'DRIVER',
        concerns: ['Company vision'],
        motivations: ['Growth', 'Success']
      },
      isGenerated: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async generateScenarios(request: GenerationRequest): Promise<GenerationStatus> {
    // TODO: Implement actual generation with OpenAI integration
    const generationId = `generation-${Date.now()}`;
    
    // Validate request
    if (request.count > 10) {
      throw new Error('Maximum 10 scenarios per generation');
    }
    if (request.difficulty && (request.difficulty < 1 || request.difficulty > 5)) {
      throw new Error('Difficulty must be between 1 and 5');
    }

    const status: GenerationStatus = {
      id: generationId,
      status: 'GENERATING',
      progress: 0,
      scenarios: [],
      estimatedCompletion: new Date(Date.now() + 120000), // 2 minutes
      basedOnMeeting: request.basedOnMeetingId
    };

    // Simulate async generation with WebSocket progress updates
    this.simulateGenerationWithProgress(status, request);

    return status;
  }

  private simulateGenerationWithProgress(status: GenerationStatus, request: GenerationRequest): void {
    // Import WebSocket service dynamically to avoid circular dependencies
    import('./websocket.service').then(({ webSocketService }) => {
      if (!webSocketService) {
        // Fallback to original behavior
        this.fallbackGeneration(status, request);
        return;
      }

      const stages = [
        { progress: 15, stage: 'context-analysis', message: 'Analyzing context and requirements...', duration: 600 },
        { progress: 30, stage: 'template-selection', message: 'Selecting scenario templates...', duration: 500 },
        { progress: 50, stage: 'personalization', message: 'Personalizing scenarios...', duration: 800 },
        { progress: 70, stage: 'scenario-creation', message: 'Generating scenarios...', duration: 1000 },
        { progress: 90, stage: 'validation', message: 'Validating generated content...', duration: 400 },
      ];

      let currentStage = 0;
      let completedScenarios = 0;

      const processNextStage = () => {
        if (currentStage >= stages.length) {
          // Generation complete
          status.status = 'COMPLETED';
          status.progress = 100;
          status.scenarios = Array.from({ length: request.count }, (_, i) => ({
            id: `generated-${status.id}-${i}`,
            title: `Generated Scenario ${i + 1}`,
            description: 'AI-generated personalized scenario',
            category: request.category || ScenarioCategory.EXECUTIVE_PRESENCE,
            subcategory: 'Generated',
            difficulty: request.difficulty || 3,
            estimatedDuration: 15,
            pmSkillFocus: [PMSkillArea.STAKEHOLDER_MANAGEMENT],
            learningObjectives: ['Personalized learning objective'],
            stakeholderProfile: {
              role: 'Stakeholder',
              seniority: 'SENIOR',
              personality: 'ANALYTICAL',
              concerns: ['Performance'],
              motivations: ['Success']
            },
            isGenerated: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }));

          webSocketService.emitScenarioGenerationCompleted(status.id, status.scenarios);
          return;
        }

        const stage = stages[currentStage];
        status.progress = stage.progress;

        // Update completed scenarios count during creation stage
        if (stage.stage === 'scenario-creation') {
          completedScenarios = Math.min(completedScenarios + 1, request.count);
        }

        // Emit progress update
        webSocketService.emitScenarioGenerationProgress({
          generationId: status.id,
          progress: stage.progress,
          stage: stage.stage,
          message: stage.message,
          timestamp: new Date(),
          scenariosCompleted: completedScenarios,
          totalScenarios: request.count
        });

        currentStage++;
        setTimeout(processNextStage, stage.duration);
      };

      processNextStage();
    }).catch(() => {
      // Fallback to original behavior if WebSocket service not available
      this.fallbackGeneration(status, request);
    });
  }

  private fallbackGeneration(status: GenerationStatus, request: GenerationRequest): void {
    setTimeout(() => {
      status.status = 'COMPLETED';
      status.progress = 100;
      status.scenarios = Array.from({ length: request.count }, (_, i) => ({
        id: `generated-${status.id}-${i}`,
        title: `Generated Scenario ${i + 1}`,
        description: 'AI-generated personalized scenario',
        category: request.category || ScenarioCategory.EXECUTIVE_PRESENCE,
        subcategory: 'Generated',
        difficulty: request.difficulty || 3,
        estimatedDuration: 15,
        pmSkillFocus: [PMSkillArea.STAKEHOLDER_MANAGEMENT],
        learningObjectives: ['Personalized learning objective'],
        stakeholderProfile: {
          role: 'Stakeholder',
          seniority: 'SENIOR',
          personality: 'ANALYTICAL',
          concerns: ['Performance'],
          motivations: ['Success']
        },
        isGenerated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
    }, 2000);
  }

  async getGenerationStatus(id: string): Promise<GenerationStatus | null> {
    // TODO: Implement database operation
    if (id === 'generation-123') {
      return {
        id,
        status: 'COMPLETED',
        progress: 100,
        scenarios: [
          {
            id: 'generated-1',
            title: 'Generated Scenario',
            description: 'AI-generated scenario',
            category: ScenarioCategory.EXECUTIVE_PRESENCE,
            subcategory: 'Generated',
            difficulty: 3,
            estimatedDuration: 15,
            pmSkillFocus: [PMSkillArea.STAKEHOLDER_MANAGEMENT],
            learningObjectives: ['Test objective'],
            stakeholderProfile: {
              role: 'Test Role',
              seniority: 'SENIOR',
              personality: 'ANALYTICAL',
              concerns: ['Test concern'],
              motivations: ['Test motivation']
            },
            isGenerated: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };
    }
    return null;
  }

  async startPracticeSession(
    userId: string,
    scenarioId: string,
    options: { mode: string; timeLimit?: number; recordSession: boolean }
  ): Promise<PracticeSession> {
    // TODO: Implement database operation
    if (options.mode && !['guided', 'freeform', 'timed'].includes(options.mode)) {
      throw new Error('Invalid practice mode');
    }

    const session: PracticeSession = {
      id: `session-${Date.now()}`,
      userId,
      scenarioId,
      status: 'ACTIVE',
      mode: options.mode as 'guided' | 'freeform' | 'timed',
      timeLimit: options.timeLimit,
      recordSession: options.recordSession,
      startedAt: new Date(),
      responses: []
    };

    return session;
  }

  async findPracticeSessions(
    userId: string,
    filter: { status?: string } = {},
    pagination: { page: number; limit: number }
  ) {
    // TODO: Implement database operation
    const sessions: PracticeSession[] = [
      {
        id: 'session-1',
        userId,
        scenarioId: 'scenario-1',
        status: 'COMPLETED',
        mode: 'guided',
        recordSession: false,
        startedAt: new Date(),
        completedAt: new Date(),
        responses: [],
        finalScore: 85
      }
    ];

    let filteredSessions = sessions;
    if (filter.status) {
      filteredSessions = filteredSessions.filter(s => s.status === filter.status);
    }

    return {
      sessions: filteredSessions,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: filteredSessions.length,
        totalPages: Math.ceil(filteredSessions.length / pagination.limit),
        hasNext: false,
        hasPrevious: false
      }
    };
  }

  async findPracticeSessionById(id: string, userId: string): Promise<PracticeSession | null> {
    // TODO: Implement database operation
    return {
      id,
      userId,
      scenarioId: 'scenario-1',
      status: 'ACTIVE',
      mode: 'guided',
      recordSession: false,
      startedAt: new Date(),
      responses: [],
      score: 75
    };
  }

  async submitResponse(
    sessionId: string,
    _userId: string,
    response: {
      responseText: string;
      audioRecording?: any;
      timeSpent: number;
      responseType: string;
    }
  ): Promise<PracticeResponse> {
    // TODO: Implement database operation
    const practiceResponse: PracticeResponse = {
      id: `response-${Date.now()}`,
      sessionId,
      responseText: response.responseText,
      timeSpent: response.timeSpent,
      responseType: response.responseType as 'written' | 'audio' | 'combined',
      score: Math.floor(Math.random() * 30) + 70, // Random score 70-100
      feedback: {
        strengths: ['Clear communication'],
        improvements: ['More specific examples'],
        suggestions: ['Consider stakeholder perspective']
      },
      submittedAt: new Date()
    };

    return practiceResponse;
  }

  async completeSession(
    sessionId: string,
    _userId: string,
    selfAssessment: SessionSelfAssessment
  ): Promise<PracticeSession> {
    // TODO: Implement database operation
    const session = await this.findPracticeSessionById(sessionId, _userId);
    if (!session) {
      throw new Error('Session not found');
    }

    const completedSession: PracticeSession = {
      ...session,
      status: 'COMPLETED',
      completedAt: new Date(),
      finalScore: 82,
      detailedFeedback: {
        overallAssessment: 'Strong performance with room for improvement',
        strengths: ['Clear structure', 'Confident delivery'],
        improvements: ['Data integration', 'Stakeholder empathy'],
        selfAssessment
      },
      nextRecommendations: [
        'Practice data storytelling scenarios',
        'Focus on executive presence exercises'
      ]
    };

    return completedSession;
  }
}

export const scenarioService = new ScenarioService();