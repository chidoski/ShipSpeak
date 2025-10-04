# Test-Driven Development (TDD) Framework

## TDD Philosophy
We follow strict TDD practices with Red-Green-Refactor cycles:
1. **Red**: Write a failing test first
2. **Green**: Write minimal code to make test pass
3. **Refactor**: Improve code while keeping tests green

## Testing Stack
- **Unit Testing**: Jest + @testing-library/jest-dom
- **Integration Testing**: Supertest for API testing
- **E2E Testing**: Playwright for browser automation
- **AI Testing**: Custom test suite for model accuracy
- **Performance Testing**: Artillery for load testing

## TDD Workflow Example

### 1. Write Failing Test First
```typescript
// tests/unit/services/meeting-analysis.test.ts
describe('MeetingAnalysisService', () => {
  describe('generatePracticeModules', () => {
    it('should generate filler word reduction module when filler words exceed threshold', async () => {
      // Arrange
      const analysisResult = {
        fillerWordsPerMinute: 8, // Above threshold of 5
        confidenceScore: 85,
        timeToMainPoint: 45
      };
      
      // Act
      const modules = await meetingAnalysisService.generatePracticeModules(analysisResult);
      
      // Assert
      expect(modules).toHaveLength(1);
      expect(modules[0]).toEqual({
        type: 'FILLER_WORD_REDUCTION',
        title: 'Reducing Filler Words',
        exercises: expect.any(Array),
        estimatedDuration: 600, // 10 minutes
        difficulty: 'BEGINNER'
      });
    });
  });
});
```

### 2. Run Test (Should Fail)
```bash
npm run test:watch -- meeting-analysis.test.ts
# Test should fail because generatePracticeModules doesn't exist yet
```

### 3. Write Minimal Implementation
```typescript
// apps/api/src/services/meeting-analysis.service.ts
export class MeetingAnalysisService {
  async generatePracticeModules(analysisResult: AnalysisResult): Promise<PracticeModule[]> {
    const modules: PracticeModule[] = [];
    
    if (analysisResult.fillerWordsPerMinute > 5) {
      modules.push({
        type: 'FILLER_WORD_REDUCTION',
        title: 'Reducing Filler Words',
        exercises: [],
        estimatedDuration: 600,
        difficulty: 'BEGINNER'
      });
    }
    
    return modules;
  }
}
```

## Testing Conventions

### Test File Naming
```bash
# Unit tests
src/services/meeting-analysis.service.ts
tests/unit/services/meeting-analysis.service.test.ts

# Integration tests  
tests/integration/api/meeting-analysis.integration.test.ts

# E2E tests
tests/e2e/meeting-analysis.e2e.test.ts
```

### Test Structure Standards
```typescript
describe('ClassName or ModuleName', () => {
  // Setup
  beforeEach(() => {
    // Common setup for all tests
  });
  
  describe('methodName', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange
      const input = {};
      
      // Act  
      const result = method(input);
      
      // Assert
      expect(result).toBe(expectedValue);
    });
    
    it('should throw error when [invalid condition]', () => {
      // Arrange
      const invalidInput = {};
      
      // Act & Assert
      expect(() => method(invalidInput)).toThrow('Expected error message');
    });
  });
});
```

## AI/ML Testing Patterns
```typescript
// tests/unit/ai/speech-analysis.test.ts
describe('SpeechAnalysisService', () => {
  describe('analyzeAudio', () => {
    it('should detect filler words accurately', async () => {
      // Arrange
      const audioWithFillers = await loadTestAudio('sample-with-ums.wav');
      
      // Act
      const analysis = await speechAnalysisService.analyzeAudio(audioWithFillers);
      
      // Assert
      expect(analysis.fillerWords.count).toBe(5);
      expect(analysis.fillerWords.types).toContain('um');
      expect(analysis.fillerWords.timestamps).toHaveLength(5);
    });
  });
});
```

## Test Commands
```bash
# Run all tests
npm test

# Test-Driven Development workflow
npm run test:watch       # Watch mode for TDD
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:e2e         # End-to-end tests
npm run test:coverage    # Generate coverage report

# AI-specific testing
npm run test:ai          # AI model accuracy tests
npm run test:audio       # Audio processing pipeline tests
```