/**
 * Swagger/OpenAPI Configuration
 * Generates comprehensive API documentation
 */

import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ShipSpeak API',
    version: process.env.API_VERSION || '1.0.0',
    description: `
# ShipSpeak API Documentation

ShipSpeak is an AI-powered platform that integrates product sense development with executive communication training. 
The platform creates a complete learning loop where meeting analysis identifies weakness areas and automatically 
generates personalized practice modules for product managers and leaders.

## Features

- **Meeting Intelligence**: Real-time analysis of communication patterns in actual meetings
- **Personalized Practice**: Auto-generated modules targeting specific weak areas  
- **Product Sense Development**: Real company case studies and decision-making practice
- **Smart Sampling**: Cost-optimized meeting analysis with 75% cost reduction
- **Real-time Progress**: WebSocket-powered live updates for all processing operations

## Authentication

This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

## Rate Limiting

API endpoints are rate limited to ensure fair usage:

- **General endpoints**: 1000 requests per 15 minutes per IP
- **Authentication endpoints**: 20 requests per 15 minutes per IP
- **AI processing endpoints**: 100 requests per hour per user
- **File uploads**: 50 requests per 15 minutes per user

## WebSocket Events

Real-time updates are available via WebSocket connection at \`/socket.io\`:

- **Meeting Analysis**: Progress updates during audio processing and analysis
- **Scenario Generation**: Live updates during AI scenario creation
- **Smart Sampling**: Real-time cost optimization and pattern detection updates
- **Practice Sessions**: Live coaching hints and feedback during practice

## Error Handling

All API responses follow a consistent format:

**Success Response:**
\`\`\`json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "uuid",
    "timestamp": "ISO 8601",
    "version": "1.0.0",
    "processingTime": 150
  }
}
\`\`\`

**Error Response:**
\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": { ... }
  },
  "meta": {
    "requestId": "uuid",
    "timestamp": "ISO 8601"
  }
}
\`\`\`
    `,
    contact: {
      name: 'ShipSpeak API Support',
      email: 'api-support@shipspeak.com',
      url: 'https://shipspeak.com/support'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    },
    termsOfService: 'https://shipspeak.com/terms'
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' 
        ? 'https://api.shipspeak.com'
        : 'http://localhost:3001',
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: Bearer <token>'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { type: 'string', enum: ['user', 'admin', 'premium'] },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive']
      },
      Meeting: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          title: { type: 'string', maxLength: 200 },
          description: { type: 'string', maxLength: 1000 },
          participantCount: { type: 'integer', minimum: 1, maximum: 100 },
          duration: { type: 'integer', minimum: 1, maximum: 480 },
          meetingType: { 
            type: 'string', 
            enum: ['standup', 'review', 'planning', 'retrospective', 'one-on-one', 'presentation', 'demo', 'other'] 
          },
          tags: { type: 'array', items: { type: 'string' }, maxItems: 10 },
          status: {
            type: 'string',
            enum: ['CREATED', 'UPLOADED', 'PROCESSING', 'ANALYZED', 'FAILED']
          },
          audioFileId: { type: 'string', format: 'uuid' },
          analysisId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          completedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id', 'userId', 'title', 'status', 'createdAt', 'updatedAt']
      },
      Scenario: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          category: {
            type: 'string',
            enum: [
              'EXECUTIVE_PRESENCE', 'STAKEHOLDER_INFLUENCE', 'STRATEGIC_COMMUNICATION',
              'DATA_STORYTELLING', 'CONFLICT_RESOLUTION', 'PRODUCT_STRATEGY',
              'ROADMAP_DEFENSE', 'RESOURCE_NEGOTIATION', 'CUSTOMER_ADVOCACY', 'TECHNICAL_TRANSLATION'
            ]
          },
          subcategory: { type: 'string' },
          difficulty: { type: 'integer', minimum: 1, maximum: 5 },
          estimatedDuration: { type: 'integer', minimum: 1 },
          pmSkillFocus: {
            type: 'array',
            items: {
              type: 'string',
              enum: [
                'STAKEHOLDER_MANAGEMENT', 'EXECUTIVE_COMMUNICATION', 'DATA_ANALYSIS',
                'STRATEGIC_THINKING', 'CONFLICT_RESOLUTION', 'PRODUCT_VISION',
                'TECHNICAL_UNDERSTANDING', 'CUSTOMER_EMPATHY'
              ]
            }
          },
          learningObjectives: { type: 'array', items: { type: 'string' } },
          stakeholderProfile: { $ref: '#/components/schemas/StakeholderProfile' },
          isGenerated: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id', 'title', 'category', 'difficulty', 'isGenerated']
      },
      StakeholderProfile: {
        type: 'object',
        properties: {
          role: { type: 'string' },
          seniority: { type: 'string', enum: ['JUNIOR', 'SENIOR', 'EXECUTIVE', 'C_LEVEL'] },
          personality: { type: 'string', enum: ['ANALYTICAL', 'DRIVER', 'EXPRESSIVE', 'AMIABLE'] },
          concerns: { type: 'array', items: { type: 'string' } },
          motivations: { type: 'array', items: { type: 'string' } }
        },
        required: ['role', 'seniority', 'personality']
      },
      SmartSamplingAnalysis: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          meetingId: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          status: { type: 'string', enum: ['PROCESSING', 'COMPLETED', 'FAILED'] },
          progress: { type: 'number', minimum: 0, maximum: 100 },
          config: { $ref: '#/components/schemas/SmartSamplingConfig' },
          startedAt: { type: 'string', format: 'date-time' },
          completedAt: { type: 'string', format: 'date-time' },
          results: { $ref: '#/components/schemas/AnalysisResults' },
          error: { type: 'string' }
        },
        required: ['id', 'meetingId', 'userId', 'status', 'progress', 'config', 'startedAt']
      },
      SmartSamplingConfig: {
        type: 'object',
        properties: {
          name: { type: 'string', enum: ['COST_OPTIMIZED', 'BALANCED', 'QUALITY_FOCUSED', 'ENTERPRISE', 'CUSTOM'] },
          chunkSizeSeconds: { type: 'integer', minimum: 5, maximum: 300 },
          overlapSeconds: { type: 'integer', minimum: 0, maximum: 60 },
          confidenceThreshold: { type: 'number', minimum: 0, maximum: 1 },
          energyThreshold: { type: 'number', minimum: 0, maximum: 1 },
          samplingRatio: { type: 'number', minimum: 0, maximum: 1 },
          description: { type: 'string' }
        },
        required: ['name', 'chunkSizeSeconds', 'samplingRatio']
      },
      AnalysisResults: {
        type: 'object',
        properties: {
          costReduction: { type: 'number', minimum: 0, maximum: 1 },
          qualityScore: { type: 'number', minimum: 0, maximum: 1 },
          analyzedDuration: { type: 'number' },
          originalDuration: { type: 'number' },
          selectedMoments: { type: 'array', items: { $ref: '#/components/schemas/CriticalMoment' } },
          pmAnalysis: { $ref: '#/components/schemas/PMInsights' }
        }
      },
      CriticalMoment: {
        type: 'object',
        properties: {
          startTime: { type: 'number' },
          endTime: { type: 'number' },
          energyLevel: { type: 'number', minimum: 0, maximum: 1 },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
          reason: {
            type: 'string',
            enum: ['HIGH_ENERGY_AND_KEYWORDS', 'SPEAKER_TRANSITION', 'POST_SILENCE_HIGH_ENERGY', 'DECISION_POINT', 'EXECUTIVE_HANDOFF', 'STAKEHOLDER_PUSHBACK']
          },
          keywords: { type: 'array', items: { type: 'string' } },
          speakerIds: { type: 'array', items: { type: 'string' } },
          pmSpecific: {
            type: 'object',
            properties: {
              communicationType: {
                type: 'string',
                enum: ['EXECUTIVE_SUMMARY', 'STAKEHOLDER_INFLUENCE', 'DECISION_DEFENSE', 'STATUS_UPDATE']
              },
              confidencePattern: { type: 'string', enum: ['ASSERTIVE', 'HEDGE_WORDS', 'UNCERTAIN'] },
              structurePattern: { type: 'string', enum: ['ANSWER_FIRST', 'BUILD_UP', 'SCATTERED'] }
            }
          }
        },
        required: ['startTime', 'endTime', 'energyLevel', 'confidence', 'reason']
      },
      PMInsights: {
        type: 'object',
        properties: {
          executivePresence: {
            type: 'object',
            properties: {
              score: { type: 'number', minimum: 0, maximum: 100 },
              strengths: { type: 'array', items: { type: 'string' } },
              improvements: { type: 'array', items: { type: 'string' } }
            }
          },
          influenceSkills: {
            type: 'object',
            properties: {
              score: { type: 'number', minimum: 0, maximum: 100 },
              persuasionTechniques: { type: 'array', items: { type: 'string' } },
              stakeholderAlignment: { type: 'number', minimum: 0, maximum: 100 }
            }
          },
          communicationStructure: {
            type: 'object',
            properties: {
              clarity: { type: 'number', minimum: 0, maximum: 100 },
              conciseness: { type: 'number', minimum: 0, maximum: 100 },
              answerFirst: { type: 'boolean' }
            }
          },
          dataStorytelling: {
            type: 'object',
            properties: {
              score: { type: 'number', minimum: 0, maximum: 100 },
              visualSupport: { type: 'boolean' },
              contextualizing: { type: 'number', minimum: 0, maximum: 100 }
            }
          },
          overallAssessment: {
            type: 'object',
            properties: {
              score: { type: 'number', minimum: 0, maximum: 100 },
              level: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] },
              recommendations: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      },
      ApiError: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
          details: { type: 'object' },
          stack: { type: 'string' }
        },
        required: ['code', 'message']
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100 },
          total: { type: 'integer', minimum: 0 },
          totalPages: { type: 'integer', minimum: 0 },
          hasNext: { type: 'boolean' },
          hasPrevious: { type: 'boolean' }
        },
        required: ['page', 'limit', 'total', 'totalPages', 'hasNext', 'hasPrevious']
      }
    },
    responses: {
      Success: {
        description: 'Successful operation',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                data: { type: 'object' },
                meta: {
                  type: 'object',
                  properties: {
                    requestId: { type: 'string', format: 'uuid' },
                    timestamp: { type: 'string', format: 'date-time' },
                    version: { type: 'string' },
                    processingTime: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      },
      Error: {
        description: 'Error response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                error: { $ref: '#/components/schemas/ApiError' },
                meta: {
                  type: 'object',
                  properties: {
                    requestId: { type: 'string', format: 'uuid' },
                    timestamp: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        }
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                error: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', example: 'VALIDATION_ERROR' },
                    message: { type: 'string', example: 'Validation failed' },
                    details: {
                      type: 'object',
                      properties: {
                        errors: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              field: { type: 'string' },
                              message: { type: 'string' },
                              value: { type: 'string' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      Unauthorized: {
        description: 'Authentication required',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                error: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', example: 'UNAUTHORIZED' },
                    message: { type: 'string', example: 'Authentication required' }
                  }
                }
              }
            }
          }
        }
      },
      Forbidden: {
        description: 'Access denied',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                error: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', example: 'AUTHORIZATION_ERROR' },
                    message: { type: 'string', example: 'Access denied' }
                  }
                }
              }
            }
          }
        }
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                error: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', example: 'NOT_FOUND' },
                    message: { type: 'string', example: 'Resource not found' }
                  }
                }
              }
            }
          }
        }
      },
      RateLimitExceeded: {
        description: 'Rate limit exceeded',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                error: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', example: 'RATE_LIMIT_EXCEEDED' },
                    message: { type: 'string', example: 'Too many requests. Please try again later.' }
                  }
                }
              }
            }
          }
        }
      },
      InternalError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                error: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', example: 'INTERNAL_ERROR' },
                    message: { type: 'string', example: 'Internal server error' }
                  }
                }
              }
            }
          }
        }
      }
    },
    parameters: {
      PageParam: {
        name: 'page',
        in: 'query',
        description: 'Page number for pagination',
        required: false,
        schema: { type: 'integer', minimum: 1, default: 1 }
      },
      LimitParam: {
        name: 'limit',
        in: 'query',
        description: 'Number of items per page',
        required: false,
        schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
      },
      SortByParam: {
        name: 'sortBy',
        in: 'query',
        description: 'Field to sort by',
        required: false,
        schema: { type: 'string', default: 'createdAt' }
      },
      SortOrderParam: {
        name: 'sortOrder',
        in: 'query',
        description: 'Sort order',
        required: false,
        schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
      }
    }
  },
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and authorization endpoints'
    },
    {
      name: 'Meetings',
      description: 'Meeting management and audio analysis endpoints'
    },
    {
      name: 'Scenarios',
      description: 'Practice scenario generation and management endpoints'
    },
    {
      name: 'Smart Sampling',
      description: 'Cost-optimized meeting analysis with AI insights'
    },
    {
      name: 'Practice Sessions',
      description: 'Interactive practice session management'
    },
    {
      name: 'Analytics',
      description: 'User analytics and performance tracking'
    }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/types/*.ts'
  ]
};

export const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;