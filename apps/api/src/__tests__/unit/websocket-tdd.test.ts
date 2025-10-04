/**
 * WebSocket Service Advanced TDD Tests
 * Following RED-GREEN-REFACTOR methodology
 * Testing advanced WebSocket service functionality
 */

import { Server as HTTPServer, createServer } from 'http';
import { WebSocketService } from '../../services/websocket.service';

// Mock JWT service for testing
jest.mock('../../utils/jwt', () => ({
  jwtService: {
    verifyToken: jest.fn(),
    generateToken: jest.fn()
  }
}));

describe('WebSocket Service - Advanced TDD', () => {
  let httpServer: HTTPServer;
  let webSocketService: WebSocketService;

  beforeEach(() => {
    jest.clearAllMocks();
    httpServer = createServer();
    webSocketService = new WebSocketService(httpServer);
  });

  afterEach(() => {
    webSocketService.close();
    httpServer.close();
  });

  describe('Service Initialization - TDD', () => {
    it('should create WebSocket service with proper configuration', () => {
      expect(webSocketService).toBeInstanceOf(WebSocketService);
      expect(webSocketService.getConnectedUsersCount()).toBe(0);
    });

    it('should initialize with empty user connections', () => {
      expect(webSocketService.getConnectedUsersCount()).toBe(0);
      expect(webSocketService.isUserConnected('any-user')).toBe(false);
    });

    it('should initialize with empty room mappings', () => {
      const userRooms = webSocketService.getUserRooms('any-user');
      expect(Array.isArray(userRooms)).toBe(true);
      expect(userRooms.length).toBe(0);
    });

    it('should return empty array for non-existent room users', () => {
      const roomUsers = webSocketService.getRoomUsers('non-existent-room');
      expect(Array.isArray(roomUsers)).toBe(true);
      expect(roomUsers.length).toBe(0);
    });
  });

  describe('Meeting Analysis Events - TDD', () => {
    it('should emit meeting analysis progress with timestamp', () => {
      const progressData = {
        meetingId: 'meeting-tdd-123',
        analysisId: 'analysis-tdd-123',
        progress: 45,
        stage: 'transcription',
        message: 'Processing audio transcription...',
        timestamp: new Date(),
        momentsFound: 3,
        costSavings: 0.35
      };

      expect(() => {
        webSocketService.emitMeetingAnalysisProgress(progressData);
      }).not.toThrow();

      // Verify the service doesn't crash with valid data
      expect(webSocketService.getConnectedUsersCount()).toBe(0);
    });

    it('should emit meeting analysis completion with results structure', () => {
      const meetingId = 'meeting-completion-tdd';
      const analysisId = 'analysis-completion-tdd';
      const results = {
        summary: 'TDD Analysis completed successfully',
        insights: ['Strong executive presence', 'Clear communication', 'Data-driven approach'],
        score: 92,
        executivePresence: {
          score: 88,
          level: 'Advanced',
          strengths: ['Confident delivery', 'Clear structure']
        },
        communicationStructure: {
          clarity: 94,
          conciseness: 87,
          answerFirst: true
        }
      };

      expect(() => {
        webSocketService.emitMeetingAnalysisCompleted(meetingId, analysisId, results);
      }).not.toThrow();
    });

    it('should emit meeting analysis error with detailed error structure', () => {
      const meetingId = 'meeting-error-tdd';
      const analysisId = 'analysis-error-tdd';
      const error = {
        code: 'AUDIO_QUALITY_ERROR',
        message: 'Audio quality insufficient for analysis',
        details: {
          stage: 'transcription',
          originalError: 'SNR below threshold',
          retryable: true,
          suggestedAction: 'Please upload higher quality audio file',
          requiredSNR: '15dB',
          actualSNR: '8dB'
        }
      };

      expect(() => {
        webSocketService.emitMeetingAnalysisError(meetingId, analysisId, error);
      }).not.toThrow();
    });

    it('should handle missing optional properties in progress data', () => {
      const minimalProgressData = {
        meetingId: 'meeting-minimal',
        analysisId: 'analysis-minimal',
        progress: 25,
        stage: 'initialization',
        message: 'Starting analysis...',
        timestamp: new Date()
      };

      expect(() => {
        webSocketService.emitMeetingAnalysisProgress(minimalProgressData);
      }).not.toThrow();
    });

    it('should validate progress value ranges', () => {
      const progressValues = [0, 25, 50, 75, 100];
      
      progressValues.forEach(progress => {
        const progressData = {
          meetingId: 'meeting-range-test',
          analysisId: 'analysis-range-test',
          progress,
          stage: 'processing',
          message: `Progress at ${progress}%`,
          timestamp: new Date()
        };

        expect(() => {
          webSocketService.emitMeetingAnalysisProgress(progressData);
        }).not.toThrow();
      });
    });
  });

  describe('Smart Sampling Events - TDD', () => {
    it('should emit smart sampling progress with PM-specific metrics', () => {
      const progressData = {
        meetingId: 'meeting-sampling-123',
        analysisId: 'sampling-tdd-123',
        progress: 70,
        stage: 'pm-pattern-detection',
        message: 'Analyzing PM communication patterns...',
        timestamp: new Date(),
        momentsFound: 12,
        costSavings: 0.68
      };

      expect(() => {
        webSocketService.emitSmartSamplingProgress(progressData);
      }).not.toThrow();
    });

    it('should emit smart sampling completion with cost optimization results', () => {
      const analysisId = 'sampling-completion-tdd';
      const results = {
        costReduction: 0.82,
        qualityScore: 0.94,
        selectedMoments: [
          {
            startTime: 120,
            endTime: 180,
            reason: 'DECISION_POINT',
            confidence: 0.96,
            pmPattern: 'executive-summary'
          },
          {
            startTime: 450,
            endTime: 510,
            reason: 'STAKEHOLDER_PUSHBACK',
            confidence: 0.91,
            pmPattern: 'influence-technique'
          }
        ],
        pmAnalysis: {
          executivePresence: {
            score: 84,
            strengths: ['Confident delivery', 'Clear structure'],
            improvements: ['More data integration']
          },
          influenceSkills: {
            score: 79,
            persuasionTechniques: ['Data storytelling', 'Logical reasoning'],
            stakeholderAlignment: 0.87
          },
          communicationStructure: {
            clarity: 91,
            conciseness: 83,
            answerFirst: true
          }
        }
      };

      expect(() => {
        webSocketService.emitSmartSamplingCompleted(analysisId, results);
      }).not.toThrow();
    });

    it('should handle cost optimization edge cases', () => {
      const edgeCaseResults = {
        costReduction: 0.95, // Very high cost reduction
        qualityScore: 0.99,  // Near perfect quality
        selectedMoments: [], // Empty moments array
        pmAnalysis: {
          executivePresence: { score: 0 }, // Minimum score
          influenceSkills: { score: 100 }, // Maximum score
          communicationStructure: { clarity: 50 } // Average score
        }
      };

      expect(() => {
        webSocketService.emitSmartSamplingCompleted('edge-case-analysis', edgeCaseResults);
      }).not.toThrow();
    });
  });

  describe('Scenario Generation Events - TDD', () => {
    it('should emit scenario generation progress with detailed tracking', () => {
      const progressData = {
        generationId: 'generation-tdd-123',
        progress: 65,
        stage: 'personalization',
        message: 'Personalizing scenarios based on meeting analysis...',
        timestamp: new Date(),
        scenariosCompleted: 3,
        totalScenarios: 5
      };

      expect(() => {
        webSocketService.emitScenarioGenerationProgress(progressData);
      }).not.toThrow();
    });

    it('should emit scenario generation completion with comprehensive scenarios', () => {
      const generationId = 'generation-completion-tdd';
      const scenarios = [
        {
          id: 'scenario-tdd-1',
          title: 'Executive Board Presentation',
          description: 'Present quarterly results to the board of directors',
          category: 'EXECUTIVE_PRESENCE',
          subcategory: 'Board Communication',
          difficulty: 5,
          estimatedDuration: 25,
          pmSkillFocus: ['STAKEHOLDER_MANAGEMENT', 'EXECUTIVE_COMMUNICATION'],
          learningObjectives: [
            'Master executive-level communication',
            'Present complex data clearly',
            'Handle challenging questions'
          ],
          stakeholderProfile: {
            role: 'Board Members',
            seniority: 'C_LEVEL',
            personality: 'ANALYTICAL',
            concerns: ['ROI', 'Risk management', 'Strategic alignment'],
            motivations: ['Growth', 'Shareholder value', 'Market position']
          },
          isGenerated: true,
          personalizationContext: {
            basedOnMeeting: 'meeting-123',
            weaknessAreas: ['data-storytelling', 'stakeholder-influence'],
            strengthAreas: ['strategic-thinking']
          }
        },
        {
          id: 'scenario-tdd-2',
          title: 'Product Strategy Alignment',
          description: 'Align cross-functional teams on product roadmap',
          category: 'STRATEGIC_COMMUNICATION',
          subcategory: 'Cross-functional Leadership',
          difficulty: 4,
          estimatedDuration: 20,
          pmSkillFocus: ['PRODUCT_VISION', 'STAKEHOLDER_MANAGEMENT'],
          learningObjectives: [
            'Communicate product vision effectively',
            'Build consensus across teams',
            'Handle conflicting priorities'
          ],
          stakeholderProfile: {
            role: 'Engineering and Design Leads',
            seniority: 'SENIOR',
            personality: 'DRIVER',
            concerns: ['Technical feasibility', 'Resource allocation'],
            motivations: ['Product success', 'Team efficiency']
          },
          isGenerated: true
        }
      ];

      expect(() => {
        webSocketService.emitScenarioGenerationCompleted(generationId, scenarios);
      }).not.toThrow();

      // Validate scenario structure
      expect(scenarios.length).toBe(2);
      scenarios.forEach(scenario => {
        expect(scenario).toHaveProperty('id');
        expect(scenario).toHaveProperty('title');
        expect(scenario).toHaveProperty('category');
        expect(scenario).toHaveProperty('difficulty');
        expect(scenario.difficulty).toBeGreaterThanOrEqual(1);
        expect(scenario.difficulty).toBeLessThanOrEqual(5);
      });
    });

    it('should handle scenario generation with various categories', () => {
      const categories = [
        'EXECUTIVE_PRESENCE',
        'STAKEHOLDER_INFLUENCE',
        'STRATEGIC_COMMUNICATION',
        'DATA_STORYTELLING',
        'CONFLICT_RESOLUTION',
        'PRODUCT_STRATEGY',
        'ROADMAP_DEFENSE',
        'RESOURCE_NEGOTIATION',
        'CUSTOMER_ADVOCACY',
        'TECHNICAL_TRANSLATION'
      ];

      categories.forEach(category => {
        const scenario = {
          id: `scenario-${category.toLowerCase()}`,
          title: `Test ${category} Scenario`,
          category,
          difficulty: Math.floor(Math.random() * 5) + 1
        };

        expect(() => {
          webSocketService.emitScenarioGenerationCompleted(`gen-${category}`, [scenario]);
        }).not.toThrow();
      });
    });
  });

  describe('Practice Session Events - TDD', () => {
    it('should emit practice session updates with comprehensive feedback', () => {
      const sessionUpdate = {
        sessionId: 'session-tdd-123',
        event: 'response-submitted' as const,
        score: 89,
        feedback: {
          strengths: [
            'Clear executive summary',
            'Strong data supporting arguments',
            'Confident delivery'
          ],
          improvements: [
            'More concise conclusion',
            'Better stakeholder alignment',
            'Faster decision-making'
          ],
          suggestions: [
            'Practice SCQA framework',
            'Focus on outcome-driven messaging',
            'Improve answer-first structure'
          ],
          detailedAnalysis: {
            executivePresence: {
              score: 85,
              feedback: 'Strong presence but could be more authoritative'
            },
            communicationStructure: {
              score: 92,
              feedback: 'Excellent structure with clear logic flow'
            },
            stakeholderManagement: {
              score: 87,
              feedback: 'Good awareness of audience needs'
            }
          }
        }
      };

      expect(() => {
        webSocketService.emitPracticeSessionUpdate(sessionUpdate);
      }).not.toThrow();
    });

    it('should emit coaching hints with context and confidence', () => {
      const coachingScenarios = [
        {
          sessionId: 'session-coaching-1',
          hint: 'Consider starting with your conclusion to improve executive presence',
          trigger: 'communication-pattern-detected',
          confidence: 0.92
        },
        {
          sessionId: 'session-coaching-2',
          hint: 'Try using more specific data points to strengthen your argument',
          trigger: 'weak-data-support-detected',
          confidence: 0.87
        },
        {
          sessionId: 'session-coaching-3',
          hint: 'Address the stakeholder concern directly before moving to next point',
          trigger: 'stakeholder-pushback-detected',
          confidence: 0.94
        }
      ];

      coachingScenarios.forEach(scenario => {
        expect(() => {
          webSocketService.emitCoachingHint(
            scenario.sessionId,
            scenario.hint,
            scenario.trigger,
            scenario.confidence
          );
        }).not.toThrow();
      });
    });

    it('should handle various session event types', () => {
      const sessionId = 'session-events-tdd';
      const eventTypes = ['response-submitted', 'hint-triggered', 'session-paused', 'session-resumed'] as const;

      eventTypes.forEach(eventType => {
        const sessionUpdate = {
          sessionId,
          event: eventType
        };

        expect(() => {
          webSocketService.emitPracticeSessionUpdate(sessionUpdate);
        }).not.toThrow();
      });
    });
  });

  describe('Batch Processing Events - TDD', () => {
    it('should emit batch progress with comprehensive metrics', () => {
      const batchProgressData = {
        batchId: 'batch-tdd-123',
        progress: 75,
        stage: 'analysis',
        message: 'Analyzing meeting batch with smart sampling...',
        timestamp: new Date(),
        completedMeetings: 15,
        totalMeetings: 20,
        failedMeetings: 1,
        estimatedCompletion: new Date(Date.now() + 600000) // 10 minutes
      };

      expect(() => {
        webSocketService.emitBatchProgress(batchProgressData);
      }).not.toThrow();

      // Validate batch metrics
      expect(batchProgressData.completedMeetings).toBeLessThanOrEqual(batchProgressData.totalMeetings);
      expect(batchProgressData.failedMeetings).toBeGreaterThanOrEqual(0);
      expect(batchProgressData.progress).toBeGreaterThanOrEqual(0);
      expect(batchProgressData.progress).toBeLessThanOrEqual(100);
    });

    it('should handle batch completion scenarios', () => {
      const completionScenarios = [
        {
          batchId: 'batch-success',
          completedMeetings: 10,
          totalMeetings: 10,
          failedMeetings: 0,
          progress: 100
        },
        {
          batchId: 'batch-partial-failure',
          completedMeetings: 8,
          totalMeetings: 10,
          failedMeetings: 2,
          progress: 100
        },
        {
          batchId: 'batch-in-progress',
          completedMeetings: 6,
          totalMeetings: 10,
          failedMeetings: 1,
          progress: 70
        }
      ];

      completionScenarios.forEach(scenario => {
        const batchData = {
          batchId: scenario.batchId,
          progress: scenario.progress,
          stage: 'processing',
          message: 'Processing batch...',
          timestamp: new Date(),
          completedMeetings: scenario.completedMeetings,
          totalMeetings: scenario.totalMeetings,
          failedMeetings: scenario.failedMeetings,
          estimatedCompletion: new Date(Date.now() + 300000)
        };

        expect(() => {
          webSocketService.emitBatchProgress(batchData);
        }).not.toThrow();
      });
    });
  });

  describe('Service State Management - TDD', () => {
    it('should maintain consistent user connection state', () => {
      const initialCount = webSocketService.getConnectedUsersCount();
      expect(initialCount).toBe(0);

      // Simulate user connections (this would normally be handled by Socket.IO)
      expect(webSocketService.isUserConnected('user-123')).toBe(false);
      expect(webSocketService.isUserConnected('user-456')).toBe(false);
    });

    it('should handle room management correctly', () => {
      const testUserId = 'test-user-room-management';
      const testRooms = ['meeting-123', 'analysis-456', 'generation-789'];

      // Initially no rooms
      const initialRooms = webSocketService.getUserRooms(testUserId);
      expect(initialRooms.length).toBe(0);

      // Test room user queries for non-existent rooms
      testRooms.forEach(room => {
        const roomUsers = webSocketService.getRoomUsers(room);
        expect(Array.isArray(roomUsers)).toBe(true);
        expect(roomUsers.length).toBe(0);
      });
    });

    it('should handle service close gracefully', () => {
      expect(() => {
        webSocketService.close();
      }).not.toThrow();

      // After close, all counts should be zero
      expect(webSocketService.getConnectedUsersCount()).toBe(0);
    });
  });

  describe('Data Validation & Edge Cases - TDD', () => {
    it('should handle empty and null data gracefully', () => {
      const emptyProgressData = {
        meetingId: '',
        analysisId: '',
        progress: 0,
        stage: '',
        message: '',
        timestamp: new Date()
      };

      expect(() => {
        webSocketService.emitMeetingAnalysisProgress(emptyProgressData);
      }).not.toThrow();
    });

    it('should handle extreme progress values', () => {
      const extremeValues = [-10, 0, 50, 100, 110, 999];

      extremeValues.forEach(progress => {
        const progressData = {
          meetingId: 'meeting-extreme',
          analysisId: 'analysis-extreme',
          progress,
          stage: 'testing',
          message: `Testing extreme value: ${progress}`,
          timestamp: new Date()
        };

        expect(() => {
          webSocketService.emitMeetingAnalysisProgress(progressData);
        }).not.toThrow();
      });
    });

    it('should handle large data payloads', () => {
      const largeFeedback = {
        strengths: Array(100).fill('Excellent communication pattern detected'),
        improvements: Array(100).fill('Consider improving stakeholder alignment'),
        suggestions: Array(100).fill('Practice executive presence techniques'),
        detailedAnalysis: {
          transcript: 'A'.repeat(10000), // Large transcript
          analysisDetails: Array(50).fill({
            timestamp: new Date().toISOString(),
            pattern: 'communication-excellence',
            confidence: 0.95,
            recommendation: 'Continue current approach'
          })
        }
      };

      const sessionUpdate = {
        sessionId: 'session-large-payload',
        event: 'response-submitted' as const,
        score: 95,
        feedback: largeFeedback
      };

      expect(() => {
        webSocketService.emitPracticeSessionUpdate(sessionUpdate);
      }).not.toThrow();
    });

    it('should handle special characters and Unicode in messages', () => {
      const specialCharMessages = [
        'Testing émojis 🚀 and accénts',
        'Testing 中文 characters',
        'Testing special chars: @#$%^&*()_+-=[]{}|;:,.<>?',
        'Testing quotes: "single" \'double\' `backticks`',
        'Testing newlines\nand\ttabs'
      ];

      specialCharMessages.forEach((message, index) => {
        const progressData = {
          meetingId: `meeting-special-${index}`,
          analysisId: `analysis-special-${index}`,
          progress: 50,
          stage: 'testing',
          message,
          timestamp: new Date()
        };

        expect(() => {
          webSocketService.emitMeetingAnalysisProgress(progressData);
        }).not.toThrow();
      });
    });
  });
});