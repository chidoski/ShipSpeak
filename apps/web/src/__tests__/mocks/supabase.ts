/**
 * Supabase Service Mocks for ShipSpeak TDD Framework
 * Comprehensive mocking for Supabase database and auth integration testing
 */

import { jest } from '@jest/globals'

// =============================================================================
// MOCK DATA TYPES
// =============================================================================

export interface MockUser {
  id: string
  email: string
  name: string
  role: 'individual' | 'team_member' | 'admin' | 'enterprise_admin'
  subscription_status: 'free' | 'premium' | 'enterprise'
  created_at: string
  updated_at: string
  last_login: string
  settings: {
    notifications: boolean
    auto_analysis: boolean
    privacy_mode: boolean
  }
}

export interface MockMeeting {
  id: string
  user_id: string
  title: string
  duration: number
  platform: 'google_meet' | 'zoom' | 'teams' | 'manual_upload'
  status: 'processing' | 'completed' | 'failed'
  audio_url?: string
  transcript?: string
  analysis_results?: any
  created_at: string
  updated_at: string
}

export interface MockPracticeModule {
  id: string
  user_id: string
  source_meeting_id?: string
  title: string
  type: 'FILLER_WORD_REDUCTION' | 'EXECUTIVE_PRESENCE' | 'STRATEGIC_NARRATIVE'
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  status: 'pending' | 'in_progress' | 'completed'
  content: any
  progress: number
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface MockPracticeSession {
  id: string
  module_id: string
  user_id: string
  exercise_id: string
  recording_url?: string
  transcript?: string
  feedback: any
  score: number
  duration: number
  completed_at: string
  created_at: string
}

// =============================================================================
// MOCK DATABASE IMPLEMENTATION
// =============================================================================

export class MockSupabaseDatabase {
  private users: Map<string, MockUser> = new Map()
  private meetings: Map<string, MockMeeting> = new Map()
  private practiceModules: Map<string, MockPracticeModule> = new Map()
  private practiceSessions: Map<string, MockPracticeSession> = new Map()
  
  constructor() {
    this.seedDatabase()
  }

  /**
   * Seed database with initial test data
   */
  private seedDatabase(): void {
    // Create test users
    const testUser: MockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'individual',
      subscription_status: 'premium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      settings: {
        notifications: true,
        auto_analysis: true,
        privacy_mode: false
      }
    }
    this.users.set(testUser.id, testUser)

    // Create test meeting
    const testMeeting: MockMeeting = {
      id: 'meeting-456',
      user_id: testUser.id,
      title: 'Product Review Meeting',
      duration: 1800,
      platform: 'google_meet',
      status: 'completed',
      transcript: 'Thank you everyone for joining today\'s meeting. Um, let\'s start by discussing the user feedback.',
      analysis_results: {
        fillerWordsPerMinute: 6,
        confidenceScore: 75,
        structureScore: 80
      },
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      updated_at: new Date().toISOString()
    }
    this.meetings.set(testMeeting.id, testMeeting)

    // Create test practice module
    const testModule: MockPracticeModule = {
      id: 'module-789',
      user_id: testUser.id,
      source_meeting_id: testMeeting.id,
      title: 'Reducing Filler Words',
      type: 'FILLER_WORD_REDUCTION',
      difficulty: 'INTERMEDIATE',
      status: 'pending',
      content: {
        exercises: [
          { id: 'ex1', prompt: 'Practice your main recommendation without filler words' }
        ]
      },
      progress: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.practiceModules.set(testModule.id, testModule)
  }

  /**
   * Reset database to initial state
   */
  reset(): void {
    this.users.clear()
    this.meetings.clear()
    this.practiceModules.clear()
    this.practiceSessions.clear()
    this.seedDatabase()
  }

  // User operations
  getUser(id: string): MockUser | null {
    return this.users.get(id) || null
  }

  createUser(userData: Partial<MockUser>): MockUser {
    const user: MockUser = {
      id: `user-${Date.now()}`,
      email: userData.email || `test-${Date.now()}@example.com`,
      name: userData.name || 'Test User',
      role: userData.role || 'individual',
      subscription_status: userData.subscription_status || 'free',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      settings: userData.settings || {
        notifications: true,
        auto_analysis: true,
        privacy_mode: false
      },
      ...userData
    }
    this.users.set(user.id, user)
    return user
  }

  updateUser(id: string, updates: Partial<MockUser>): MockUser | null {
    const user = this.users.get(id)
    if (!user) return null

    const updatedUser = {
      ...user,
      ...updates,
      updated_at: new Date().toISOString()
    }
    this.users.set(id, updatedUser)
    return updatedUser
  }

  // Meeting operations
  getMeeting(id: string): MockMeeting | null {
    return this.meetings.get(id) || null
  }

  getUserMeetings(userId: string, limit = 20): MockMeeting[] {
    return Array.from(this.meetings.values())
      .filter(meeting => meeting.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
  }

  createMeeting(meetingData: Partial<MockMeeting>): MockMeeting {
    const meeting: MockMeeting = {
      id: `meeting-${Date.now()}`,
      user_id: meetingData.user_id || 'user-123',
      title: meetingData.title || 'Untitled Meeting',
      duration: meetingData.duration || 1800,
      platform: meetingData.platform || 'manual_upload',
      status: meetingData.status || 'processing',
      audio_url: meetingData.audio_url,
      transcript: meetingData.transcript,
      analysis_results: meetingData.analysis_results,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...meetingData
    }
    this.meetings.set(meeting.id, meeting)
    return meeting
  }

  updateMeeting(id: string, updates: Partial<MockMeeting>): MockMeeting | null {
    const meeting = this.meetings.get(id)
    if (!meeting) return null

    const updatedMeeting = {
      ...meeting,
      ...updates,
      updated_at: new Date().toISOString()
    }
    this.meetings.set(id, updatedMeeting)
    return updatedMeeting
  }

  // Practice module operations
  getPracticeModule(id: string): MockPracticeModule | null {
    return this.practiceModules.get(id) || null
  }

  getUserPracticeModules(userId: string, status?: string): MockPracticeModule[] {
    return Array.from(this.practiceModules.values())
      .filter(module => 
        module.user_id === userId && 
        (status ? module.status === status : true)
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  createPracticeModule(moduleData: Partial<MockPracticeModule>): MockPracticeModule {
    const module: MockPracticeModule = {
      id: `module-${Date.now()}`,
      user_id: moduleData.user_id || 'user-123',
      source_meeting_id: moduleData.source_meeting_id,
      title: moduleData.title || 'Practice Module',
      type: moduleData.type || 'FILLER_WORD_REDUCTION',
      difficulty: moduleData.difficulty || 'BEGINNER',
      status: moduleData.status || 'pending',
      content: moduleData.content || {},
      progress: moduleData.progress || 0,
      completed_at: moduleData.completed_at,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...moduleData
    }
    this.practiceModules.set(module.id, module)
    return module
  }

  updatePracticeModule(id: string, updates: Partial<MockPracticeModule>): MockPracticeModule | null {
    const module = this.practiceModules.get(id)
    if (!module) return null

    const updatedModule = {
      ...module,
      ...updates,
      updated_at: new Date().toISOString()
    }
    this.practiceModules.set(id, updatedModule)
    return updatedModule
  }

  // Practice session operations
  createPracticeSession(sessionData: Partial<MockPracticeSession>): MockPracticeSession {
    const session: MockPracticeSession = {
      id: `session-${Date.now()}`,
      module_id: sessionData.module_id || 'module-789',
      user_id: sessionData.user_id || 'user-123',
      exercise_id: sessionData.exercise_id || 'ex1',
      recording_url: sessionData.recording_url,
      transcript: sessionData.transcript,
      feedback: sessionData.feedback || {},
      score: sessionData.score || 75,
      duration: sessionData.duration || 300,
      completed_at: sessionData.completed_at || new Date().toISOString(),
      created_at: new Date().toISOString(),
      ...sessionData
    }
    this.practiceSessions.set(session.id, session)
    return session
  }

  getUserPracticeSessions(userId: string, moduleId?: string): MockPracticeSession[] {
    return Array.from(this.practiceSessions.values())
      .filter(session => 
        session.user_id === userId && 
        (moduleId ? session.module_id === moduleId : true)
      )
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
  }
}

// =============================================================================
// MOCK SUPABASE CLIENT
// =============================================================================

export class MockSupabaseClient {
  private database: MockSupabaseDatabase
  private currentUser: MockUser | null = null
  private authState: 'authenticated' | 'unauthenticated' = 'unauthenticated'

  constructor() {
    this.database = new MockSupabaseDatabase()
  }

  /**
   * Mock authentication
   */
  auth = {
    signUp: jest.fn(async (credentials: { email: string; password: string }) => {
      await this.simulateDelay()
      
      if (credentials.email === 'existing@example.com') {
        throw new Error('User already exists')
      }

      const user = this.database.createUser({
        email: credentials.email,
        name: credentials.email.split('@')[0]
      })

      this.currentUser = user
      this.authState = 'authenticated'

      return { data: { user }, error: null }
    }),

    signIn: jest.fn(async (credentials: { email: string; password: string }) => {
      await this.simulateDelay()

      if (credentials.password === 'wrongpassword') {
        throw new Error('Invalid credentials')
      }

      // Find or create user
      let user = Array.from(this.database['users'].values())
        .find(u => u.email === credentials.email)

      if (!user) {
        user = this.database.createUser({ email: credentials.email })
      }

      this.currentUser = user
      this.authState = 'authenticated'

      return { data: { user }, error: null }
    }),

    signOut: jest.fn(async () => {
      await this.simulateDelay()
      this.currentUser = null
      this.authState = 'unauthenticated'
      return { error: null }
    }),

    getUser: jest.fn(async () => {
      await this.simulateDelay()
      return { data: { user: this.currentUser }, error: null }
    }),

    onAuthStateChange: jest.fn((callback: (event: string, session: any) => void) => {
      // Simulate auth state change
      setTimeout(() => {
        callback(this.authState === 'authenticated' ? 'SIGNED_IN' : 'SIGNED_OUT', {
          user: this.currentUser
        })
      }, 10)

      return { data: { subscription: { unsubscribe: jest.fn() } } }
    })
  }

  /**
   * Mock database operations
   */
  from(table: string) {
    return {
      select: jest.fn((columns = '*') => ({
        eq: jest.fn((column: string, value: any) => ({
          single: jest.fn(async () => {
            await this.simulateDelay()
            
            switch (table) {
              case 'users':
                const user = this.database.getUser(value)
                return { data: user, error: user ? null : 'User not found' }
              
              case 'meetings':
                const meeting = this.database.getMeeting(value)
                return { data: meeting, error: meeting ? null : 'Meeting not found' }
              
              case 'practice_modules':
                const module = this.database.getPracticeModule(value)
                return { data: module, error: module ? null : 'Module not found' }
              
              default:
                return { data: null, error: 'Table not found' }
            }
          }),

          order: jest.fn((column: string, options?: { ascending: boolean }) => ({
            limit: jest.fn(async (count: number) => {
              await this.simulateDelay()

              switch (table) {
                case 'meetings':
                  const meetings = this.database.getUserMeetings(value, count)
                  return { data: meetings, error: null }
                
                case 'practice_modules':
                  const modules = this.database.getUserPracticeModules(value)
                    .slice(0, count)
                  return { data: modules, error: null }
                
                case 'practice_sessions':
                  const sessions = this.database.getUserPracticeSessions(value)
                    .slice(0, count)
                  return { data: sessions, error: null }
                
                default:
                  return { data: [], error: null }
              }
            })
          }))
        })),

        order: jest.fn((column: string, options?: { ascending: boolean }) => ({
          limit: jest.fn(async (count: number) => {
            await this.simulateDelay()
            return { data: [], error: null }
          })
        }))
      })),

      insert: jest.fn(async (data: any) => {
        await this.simulateDelay()

        let result
        switch (table) {
          case 'users':
            result = this.database.createUser(data)
            break
          case 'meetings':
            result = this.database.createMeeting(data)
            break
          case 'practice_modules':
            result = this.database.createPracticeModule(data)
            break
          case 'practice_sessions':
            result = this.database.createPracticeSession(data)
            break
          default:
            throw new Error(`Unknown table: ${table}`)
        }

        return { data: result, error: null }
      }),

      update: jest.fn((updates: any) => ({
        eq: jest.fn(async (column: string, value: any) => {
          await this.simulateDelay()

          let result
          switch (table) {
            case 'users':
              result = this.database.updateUser(value, updates)
              break
            case 'meetings':
              result = this.database.updateMeeting(value, updates)
              break
            case 'practice_modules':
              result = this.database.updatePracticeModule(value, updates)
              break
            default:
              throw new Error(`Unknown table: ${table}`)
          }

          return { data: result, error: result ? null : 'Record not found' }
        })
      })),

      delete: jest.fn(() => ({
        eq: jest.fn(async (column: string, value: any) => {
          await this.simulateDelay()
          // Simulate deletion (not implementing actual deletion for simplicity)
          return { data: null, error: null }
        })
      }))
    }
  }

  /**
   * Mock storage operations
   */
  storage = {
    from: jest.fn((bucket: string) => ({
      upload: jest.fn(async (path: string, file: File | Buffer) => {
        await this.simulateDelay(500) // Longer delay for file uploads
        
        if (file instanceof File && file.size > 100 * 1024 * 1024) {
          throw new Error('File too large')
        }

        return {
          data: { path: `${bucket}/${path}` },
          error: null
        }
      }),

      download: jest.fn(async (path: string) => {
        await this.simulateDelay()
        
        // Simulate file download
        const mockFile = new Blob(['mock file content'], { type: 'audio/mpeg' })
        return { data: mockFile, error: null }
      }),

      getPublicUrl: jest.fn((path: string) => ({
        data: { publicUrl: `https://mock-storage.com/${bucket}/${path}` }
      })),

      remove: jest.fn(async (paths: string[]) => {
        await this.simulateDelay()
        return { data: null, error: null }
      })
    }))
  }

  /**
   * Mock real-time subscriptions
   */
  channel(name: string) {
    return {
      on: jest.fn((event: string, filter: any, callback: (payload: any) => void) => {
        // Simulate real-time updates
        setTimeout(() => {
          callback({
            eventType: event,
            new: { id: 'new-record', status: 'completed' },
            old: {},
            errors: null
          })
        }, 100)
        return this
      }),

      subscribe: jest.fn(() => {
        return { unsubscribe: jest.fn() }
      })
    }
  }

  /**
   * Utility methods
   */
  private async simulateDelay(ms = 50): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getCurrentUser(): MockUser | null {
    return this.currentUser
  }

  setCurrentUser(user: MockUser | null): void {
    this.currentUser = user
    this.authState = user ? 'authenticated' : 'unauthenticated'
  }

  getDatabase(): MockSupabaseDatabase {
    return this.database
  }

  reset(): void {
    this.database.reset()
    this.currentUser = null
    this.authState = 'unauthenticated'
  }
}

// =============================================================================
// JEST SETUP UTILITIES
// =============================================================================

/**
 * Creates a mock Supabase client for testing
 */
export const createMockSupabase = (): MockSupabaseClient => {
  return new MockSupabaseClient()
}

/**
 * Setup function for common Supabase mocks
 */
export const setupSupabaseMocks = (): {
  mockSupabase: MockSupabaseClient
  resetMocks: () => void
} => {
  const mockSupabase = createMockSupabase()

  const resetMocks = () => {
    mockSupabase.reset()
    // Reset all jest mocks
    Object.values(mockSupabase.auth).forEach(mockFn => {
      if (jest.isMockFunction(mockFn)) {
        mockFn.mockClear()
      }
    })
  }

  return { mockSupabase, resetMocks }
}

/**
 * Test scenario helpers
 */
export const SUPABASE_TEST_SCENARIOS = {
  AUTHENTICATED_USER: (client: MockSupabaseClient) => {
    const user = client.getDatabase().getUser('user-123')
    client.setCurrentUser(user)
    return user
  },

  UNAUTHENTICATED: (client: MockSupabaseClient) => {
    client.setCurrentUser(null)
  },

  WITH_MEETINGS: (client: MockSupabaseClient, userId: string) => {
    const meeting1 = client.getDatabase().createMeeting({
      user_id: userId,
      title: 'Sprint Planning',
      duration: 3600,
      status: 'completed'
    })
    
    const meeting2 = client.getDatabase().createMeeting({
      user_id: userId,
      title: 'Product Review',
      duration: 1800,
      status: 'processing'
    })

    return [meeting1, meeting2]
  },

  WITH_PRACTICE_MODULES: (client: MockSupabaseClient, userId: string) => {
    const module1 = client.getDatabase().createPracticeModule({
      user_id: userId,
      title: 'Executive Presence',
      type: 'EXECUTIVE_PRESENCE',
      status: 'pending'
    })

    const module2 = client.getDatabase().createPracticeModule({
      user_id: userId,
      title: 'Filler Word Reduction',
      type: 'FILLER_WORD_REDUCTION',
      status: 'completed'
    })

    return [module1, module2]
  }
} as const

export default MockSupabaseClient

// =============================================================================
// TEST CASES FOR SUPABASE MOCKS
// =============================================================================

describe('Supabase Mock Service', () => {
  let mockSupabase: MockSupabaseClient
  let database: MockSupabaseDatabase

  beforeEach(() => {
    mockSupabase = new MockSupabaseClient()
    database = mockSupabase.getDatabase()
  })

  describe('Authentication', () => {
    it('should handle user sign up', async () => {
      const result = await mockSupabase.auth.signUp({
        email: 'newuser@example.com',
        password: 'password123'
      })

      expect(result.data.user).toBeDefined()
      expect(result.data.user.email).toBe('newuser@example.com')
      expect(result.error).toBeNull()
    })

    it('should handle user sign in', async () => {
      const result = await mockSupabase.auth.signIn({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(result.data.user).toBeDefined()
      expect(result.error).toBeNull()
    })

    it('should handle sign out', async () => {
      await mockSupabase.auth.signIn({ email: 'test@example.com', password: 'pass' })
      const result = await mockSupabase.auth.signOut()
      
      expect(result.error).toBeNull()
      expect(mockSupabase.getCurrentUser()).toBeNull()
    })
  })

  describe('Database Operations', () => {
    it('should create and retrieve users', () => {
      const userData = {
        email: 'testuser@example.com',
        name: 'Test User',
        role: 'individual' as const
      }

      const user = database.createUser(userData)
      expect(user.id).toBeDefined()
      expect(user.email).toBe(userData.email)

      const retrieved = database.getUser(user.id)
      expect(retrieved).toEqual(user)
    })

    it('should handle meeting operations', () => {
      const meetingData = {
        user_id: 'user-123',
        title: 'Test Meeting',
        duration: 3600,
        platform: 'google_meet' as const
      }

      const meeting = database.createMeeting(meetingData)
      expect(meeting.id).toBeDefined()
      expect(meeting.title).toBe(meetingData.title)

      const userMeetings = database.getUserMeetings('user-123')
      expect(userMeetings).toContain(meeting)
    })

    it('should handle practice module operations', () => {
      const moduleData = {
        user_id: 'user-123',
        title: 'Test Module',
        type: 'FILLER_WORD_REDUCTION' as const,
        difficulty: 'BEGINNER' as const
      }

      const module = database.createPracticeModule(moduleData)
      expect(module.id).toBeDefined()
      expect(module.type).toBe(moduleData.type)

      const userModules = database.getUserPracticeModules('user-123')
      expect(userModules).toContain(module)
    })
  })

  describe('Storage Operations', () => {
    it('should handle file uploads', async () => {
      const mockFile = new File(['test content'], 'test.mp3', { type: 'audio/mpeg' })
      const result = await mockSupabase.storage.from('audio').upload('test.mp3', mockFile)

      expect(result.data.path).toBeDefined()
      expect(result.error).toBeNull()
    })

    it('should handle file downloads', async () => {
      const result = await mockSupabase.storage.from('audio').download('test.mp3')
      expect(result.data).toBeInstanceOf(Blob)
      expect(result.error).toBeNull()
    })
  })

  describe('Real-time Subscriptions', () => {
    it('should handle channel subscriptions', () => {
      const channel = mockSupabase.channel('test-channel')
      const callback = jest.fn()

      channel.on('INSERT', {}, callback)
      const subscription = channel.subscribe()

      expect(subscription.unsubscribe).toBeDefined()
      // Callback should be called after timeout
      setTimeout(() => {
        expect(callback).toHaveBeenCalled()
      }, 150)
    })
  })
})