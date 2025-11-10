# ShipSpeak
**Phase 2 Integration Contract**
Backend Integration & Production Infrastructure
Version 1.0
November 4, 2025
# Executive Overview
This Integration Contract defines the complete specifications for ShipSpeak Phase 2, which transforms the validated frontend experience from Phase 1 into a production-ready platform with real backend integrations. Phase 2 maintains the identical user interface while replacing all mock data with live services, enabling the platform to analyze actual meetings, generate real AI feedback, and provide genuine value to Product Managers.
## Product Evolution
Phase 1 successfully validated the user experience, learning flows, and value proposition with beta users. Users engaged with the complete product journey—from onboarding through meeting analysis to practice exercises and progress tracking—providing crucial feedback that informed refinements to the interface and user flows. Phase 2 builds directly on this validated foundation, preserving the successful UI patterns while connecting them to production infrastructure that enables real-world usage.
## Phase 2 Objectives
Duration:
4 weeks (36-44 development hours)
Outcome:
Production-ready platform processing real meetings, generating authentic AI analysis, and enabling paid user acquisition
Infrastructure:
Complete backend integration including authentication, database persistence, meeting platform connectivity, AI processing, and real-time synchronization
## Key Integration Areas
Authentication system transition from mock localStorage to Supabase with secure session management
Meeting platform integration enabling bots to join Zoom, Google Meet, and Microsoft Teams with configurable identity
Real-time transcription pipeline using Deepgram for accurate speech-to-text with speaker identification
AI analysis engine powered by OpenAI for generating personalized feedback, identifying patterns, and recommending learning paths
Database persistence layer in Supabase storing user profiles, meeting transcripts, practice recordings, progress metrics, and learning module completions
Practice recording pipeline capturing audio, transcribing with Deepgram, and generating AI feedback through OpenAI
## Development Philosophy
Phase 2 follows a systematic approach that preserves the validated user experience while methodically replacing each mock data source with its corresponding production integration. The UI remains unchanged from Phase 1—same components, same layouts, same interactions—ensuring the validated user experience translates seamlessly to production. This approach minimizes risk by maintaining working functionality throughout the integration process and enables incremental testing at each integration point.
The integration strategy prioritizes core user journeys, starting with authentication and database persistence before progressing to meeting intelligence and AI analysis. Each integration point is thoroughly tested in isolation before connecting to dependent systems, ensuring reliability and maintainability as the platform scales.
# Integration Architecture
Phase 2 establishes a robust technical foundation that supports the platform's core value proposition: providing Product Managers with private, intelligent coaching based on their real work. The architecture balances several critical requirements: maintaining user privacy and control over bot identity, processing meeting audio with high accuracy, generating insightful AI analysis, and persisting data reliably for progress tracking over time.
## Technology Stack
The selected technologies optimize for development velocity, cost-effectiveness during initial scale, and future extensibility as the platform grows. Each choice reflects lessons learned from the Phase 1 validation period and anticipated requirements for the first 100-500 users.
### Backend Infrastructure
Supabase (PostgreSQL + Auth + Real-time)
Supabase provides the foundational data layer, authentication system, and real-time synchronization capabilities. The managed PostgreSQL database stores all user data, meeting transcripts, practice recordings, and progress metrics with row-level security policies ensuring data privacy. Built-in authentication handles user signup, login, password reset, and session management with support for email/password and OAuth providers. Real-time subscriptions enable live updates to the dashboard as meetings complete processing or practice exercises receive feedback.
The database schema establishes clear relationships between entities: users own meetings and practice sessions, meetings contain transcript segments and feedback records, practice sessions link to exercises within learning modules. Indexes optimize common query patterns including meeting list retrieval, transcript display, and progress calculation. Migration scripts version control all schema changes, enabling safe deployment and rollback.
Vercel (Application Hosting + API Routes)
The Next.js application deploys to Vercel, providing automatic scaling, edge caching, and serverless function execution. API routes handle backend logic including webhook processing, AI analysis orchestration, and data aggregation for analytics. Edge functions serve static assets and cached content globally, reducing latency for international users. The deployment pipeline connects directly to the Git repository, automatically deploying preview environments for pull requests and production builds for merged code.
### Meeting Integration Layer
Recall.ai (Meeting Bot Platform)
Recall.ai serves as the meeting bot infrastructure, handling the complex logistics of joining virtual meetings across platforms. When a user connects their calendar, the system monitors for scheduled meetings matching their configured criteria (meeting type, participants, keywords). At the designated time, Recall.ai dispatches a bot instance that joins the meeting using the user's specified identity—whether a custom name, generic descriptor like 'Meeting Recorder,' or company-specific designation.
The bot captures high-quality audio streams from all participants throughout the meeting duration. Speaker separation occurs in real-time, enabling accurate attribution of statements to specific individuals. When the meeting concludes or the user's configured exit rules trigger (such as when the CEO joins a board meeting), the bot gracefully leaves and returns the raw audio data for transcription processing. The entire bot lifecycle—scheduling, joining, recording, exiting—operates autonomously without user intervention beyond initial configuration.
### Audio Processing Pipeline
Deepgram (Speech-to-Text Transcription)
Deepgram converts audio recordings into accurate text transcripts with speaker identification and timestamps. The service processes both meeting recordings from Recall.ai and practice exercise recordings captured through the browser. Advanced features include punctuation restoration, profanity filtering, and support for technical vocabulary common in product management discussions.
For meeting audio, Deepgram receives the multi-channel recording from Recall.ai, with each speaker on a separate audio channel. This enables precise speaker attribution in the transcript, critical for analyzing the user's specific communication patterns versus other participants. Transcription completes within minutes of meeting conclusion, with segments stored in the database linked to meeting records and speaker identifiers. Timestamps enable users to navigate to specific moments and facilitate pattern recognition across multiple meeting instances.
Practice exercise recordings follow a simplified path: browser-captured audio uploads to temporary storage, Deepgram transcribes the single-speaker content, and the resulting transcript feeds directly into AI analysis for immediate feedback generation. The entire pipeline completes in seconds, providing users with instant feedback on their practice attempts.
### AI Analysis Engine
OpenAI (GPT-4 Analysis & Feedback Generation)
OpenAI's GPT-4 powers the intelligent analysis that forms ShipSpeak's core value proposition. The AI analyzes transcripts through multiple specialized lenses, evaluating product sense, executive communication style, stakeholder management techniques, and technical translation clarity. Each analysis dimension follows a structured evaluation framework that considers the user's current career level and target progression.
For meeting analysis, the AI receives the complete transcript with speaker attribution, meeting context (type, participants, duration), and the user's profile information (current level, target level, previous meeting patterns). The analysis produces comprehensive feedback including overall scores, dimension-specific assessments, identified communication patterns, key moments with detailed explanations, and personalized module recommendations. The system generates Next Steps that connect meeting insights to specific learning actions, creating a cohesive development path.
Practice exercise feedback operates similarly but focuses on specific skills being practiced. The AI compares the user's response against the exercise's evaluation criteria, identifies strengths and improvement areas, and provides concrete suggestions for refinement. Cross-referencing with the user's meeting history enables feedback that connects practice to real-world application, reinforcing skill transfer.
# Phase 2A: Authentication & Data Foundation
Duration:
1 week (8-10 hours across 3 integration points)
Phase 2A establishes the foundational infrastructure that all subsequent integrations depend upon. The authentication system transitions from mock localStorage to production-grade Supabase auth, enabling secure user management and session handling. The database schema implementation creates the structure for persisting all user data, meeting records, and learning progress. These foundational elements must be rock-solid before any external integrations commence, as they form the bedrock of data security and system reliability.
## Supabase Authentication Integration
The authentication system replacement occurs systematically, preserving the exact user flows validated in Phase 1 while substituting real authentication for the mock implementation. Users experience identical signup and login interfaces, but behind the scenes, credentials are validated against Supabase auth rather than localStorage checks.
### User Registration Flow
When a user completes the signup form, the application invokes Supabase's signup method with their email and password. Supabase creates the user account, sends a verification email, and returns a session object containing the user ID and access tokens. The application stores this session in an HTTP-only cookie, protecting against XSS attacks while maintaining the ability to refresh tokens automatically.
The onboarding data collected during Phase 1—current role, target role, timeline, chosen path (meeting analysis vs practice)—now persists to the database immediately after account creation. A database trigger creates the user profile record upon auth user creation, ensuring data consistency. The profile table links to the auth user via the user ID, establishing the relationship that powers all subsequent data queries.
### Session Management
Session persistence operates transparently to users, maintaining logged-in state across browser sessions and page refreshes. The authentication system checks for valid sessions on application load, automatically refreshing expired tokens using the stored refresh token. If token refresh fails, the user redirects to the login page with their intended destination preserved for post-login redirect.
Protected routes leverage middleware that validates session presence before rendering content. Unauthenticated requests redirect to login with the original URL captured as a query parameter. After successful authentication, the system restores the user to their intended destination, maintaining context and preventing frustration from lost navigation.
### Password Reset Workflow
Users request password resets through a dedicated form that accepts their email address. Supabase sends a time-limited reset link to the provided email, containing a secure token. Clicking the link directs users to a password reset page where they enter their new password. The system validates the token, updates the password in Supabase auth, and automatically logs the user in with a fresh session.
## Database Schema Implementation
The database schema translates the application's data model into a normalized PostgreSQL structure optimized for query patterns observed during Phase 1 testing. The schema balances normalization for data integrity with denormalization for query performance, particularly for frequently accessed data like meeting lists and progress dashboards.
### User Profile Tables
The profiles table stores user-specific data including current role, target role, career timeline, onboarding path selection, and progress metrics. This table links to auth.users via the user ID, establishing the connection between authentication identity and application data. Row-level security policies ensure users can only access their own profile data, enforcing privacy at the database level.
User preferences for bot configuration—custom name, meeting type filters, exit rules—reside in a separate bot_configs table. This separation enables multiple bot configurations per user if needed in the future, though initially users maintain a single active configuration. The structure anticipates potential feature expansion without requiring schema migration.
### Meeting Data Structure
Meeting records capture essential metadata including title, scheduled time, actual duration, meeting type, and participant information. The meetings table links to users via the user_id foreign key, establishing ownership. Meeting status tracking—scheduled, in_progress, processing, completed, failed—enables status-based filtering and appropriate UI state display.
Transcript data lives in a separate transcript_segments table due to its volume and access patterns. Each segment represents a single speaker turn, containing the speaker ID, speaker name, text content, timestamp, and duration. Segments link to meetings via meeting_id, enabling efficient retrieval of complete transcripts while maintaining queryability for specific segments. Indexes on meeting_id and timestamp optimize transcript display queries.
Meeting analysis feedback stores in a meeting_feedback table with a one-to-one relationship to meetings. This table contains the overall score, dimension scores (product sense, communication, stakeholder management, technical translation), summary text, and JSON fields for structured data like identified patterns and key moments. Storing structured feedback as JSON balances flexibility for schema evolution with queryability for aggregation and filtering.
### Learning & Practice Data
Learning modules and exercises maintain a hierarchical structure: modules contain multiple exercises, exercises have specific prompts and evaluation criteria. The modules table defines each learning unit with metadata including title, category, difficulty, estimated duration, and relevance scoring factors. Exercises link to modules via module_id and include prompt text, time limits, format type (timed response, scenario-based, etc.), and evaluation criteria as structured data.
Practice sessions record user attempts at exercises, storing the recording URL, transcript text, overall score, criterion-specific scores, and detailed feedback. The practice_sessions table links to both users (via user_id) and exercises (via exercise_id), enabling tracking of individual progress through learning paths. Attempt numbering facilitates progress visualization, showing improvement across multiple practice sessions.
Module completion tracking uses a junction table connecting users to modules with completion status, best score achieved, last accessed timestamp, and number of exercises completed. This structure powers the progress dashboard's module completion view and informs personalized module recommendations based on partially completed content.
### Progress Tracking Schema
Career progression metrics aggregate from meeting feedback and practice sessions into a denormalized progress_snapshots table. Daily snapshots capture the user's current scores across all dimensions, consistency percentage toward target level, and trend indicators. This denormalization optimizes progress dashboard queries, which would otherwise require complex aggregations across meetings and practice sessions. A scheduled job generates snapshots nightly, ensuring dashboard performance remains responsive as data volume grows.
# Phase 2B: Meeting Intelligence Integration
Duration:
1.5 weeks (12-15 hours across 4 integration points)
Phase 2B implements the core value proposition of ShipSpeak: analyzing real work meetings to provide personalized coaching feedback. This phase connects calendar systems, deploys meeting bots, processes transcripts, and generates AI analysis—transforming raw meeting audio into actionable insights that help Product Managers advance their careers. The complexity lies in orchestrating multiple external services while maintaining reliability and user privacy throughout the pipeline.
## Calendar Integration & Bot Scheduling
Calendar connectivity enables the system to identify upcoming meetings that match user-configured criteria. When users complete the bot configuration wizard during onboarding or later in settings, they authorize ShipSpeak to access their calendar through OAuth flows with Google Calendar, Microsoft Outlook, or Zoom. The authorization grants read-only access to scheduled events, respecting user privacy by never modifying calendar data.
### Calendar Monitoring System
A background job polls connected calendars every 15 minutes, checking for upcoming meetings within the next 24 hours. For each discovered meeting, the system evaluates whether it matches the user's bot configuration: meeting type (board meeting, team meeting, customer call, etc.), participant presence or absence (join when specific people attend, skip when others present), and keyword matching in the meeting title or description.
Matching meetings generate bot scheduling records in the database, capturing the meeting platform (Zoom, Google Meet, Teams), join link, scheduled time, and the bot identity to use (custom name or preset). The system tracks scheduling status to prevent duplicate bot dispatches and enable users to view upcoming bot attendance through a calendar interface in the application.
### Smart Exit Rules Implementation
Users configure exit rules that define when bots should leave meetings automatically, preserving privacy in sensitive moments. The configuration interface allows specification of participant-based rules (leave when the CEO joins), keyword-based rules (exit if 'confidential' or 'private' mentioned in conversation), and time-based rules (maximum attendance duration).
During meeting attendance, the bot monitoring system evaluates exit conditions continuously. Participant-based rules trigger when new attendees join the meeting, comparing their identities against the exit list. Keyword detection operates on the real-time transcript stream, scanning each utterance for configured terms. When any exit condition activates, the bot leaves immediately and marks the meeting record with the exit reason for user reference.
## Meeting Bot Lifecycle
The bot lifecycle encompasses multiple phases from scheduling through completion, with each phase requiring coordination between ShipSpeak, Recall.ai, and the meeting platforms. Reliability mechanisms handle common failure scenarios including network issues, platform authentication changes, and unexpected meeting cancellations.
### Bot Deployment & Joining
Five minutes before scheduled meeting time, ShipSpeak sends a bot deployment request to Recall.ai containing the meeting join link, configured bot identity, and user-specific recording preferences (audio quality, speaker separation settings). Recall.ai provisions a bot instance and joins the meeting using the platform's guest join mechanism, appearing as a participant with the specified display name.
The bot's initial presence is minimal: no camera enabled, microphone muted, displaying the configured name. Meeting hosts receive no special notifications beyond seeing an additional participant join. If meeting admission controls require host approval, the bot waits in the lobby with its configured identity visible, allowing users to admit their bot as they would any other attendee.
### Audio Capture & Processing
Throughout meeting duration, the bot captures high-fidelity audio from all participants. Platform-specific audio routing ensures each speaker's audio stream remains separate, enabling accurate speaker attribution during transcription. The bot maintains connection stability through automatic reconnection logic that handles temporary network disruptions without losing significant audio content.
As audio accumulates, Recall.ai stores segments temporarily in encrypted storage. Speaker identification occurs in real-time using voice fingerprinting technology, associating each audio segment with a speaker ID. When multiple people speak simultaneously, the system prioritizes the user's audio if identifiable, ensuring their contributions receive accurate capture even during cross-talk.
### Meeting Conclusion & Handoff
Meeting conclusion triggers when the last participant leaves, the meeting host ends the session, or an exit rule activates. The bot gracefully disconnects, uploads the complete audio recording to Recall.ai's storage, and sends a webhook notification to ShipSpeak containing the audio file location, meeting metadata, speaker mapping, and duration.
ShipSpeak receives the webhook, updates the meeting record status to 'processing,' and initiates the transcription pipeline. The audio file downloads from Recall.ai's storage to ShipSpeak's processing queue, which feeds audio data to Deepgram for transcription. This handoff completes the bot's lifecycle, transitioning responsibility from meeting attendance to transcript generation.
## Transcript Generation Pipeline
Deepgram transcription converts meeting audio into structured text with speaker attribution, timestamps, and confidence scores. The pipeline processes recordings as they complete, generating transcripts within minutes of meeting conclusion to provide users with timely feedback on their communication.
### Audio Preprocessing
Before submitting to Deepgram, audio files undergo light preprocessing to optimize transcription accuracy. Silence detection identifies and removes extended quiet periods (longer than 3 seconds) to reduce processing cost and focus transcription on spoken content. Audio normalization adjusts volume levels to Deepgram's recommended range, compensating for participants with very quiet or very loud microphones.
Speaker audio channels separate into distinct streams based on the speaker mapping from Recall.ai. This separation enables Deepgram's speaker diarization feature to accurately attribute statements to specific individuals throughout the transcript. The user's audio channel receives special labeling to facilitate later identification in the transcript data structure.
### Deepgram Transcription Request
Audio submission to Deepgram includes configuration parameters tailored for product management meetings: enable punctuation restoration for natural reading, activate speaker diarization for multi-participant attribution, specify technical vocabulary common to PM discussions (terms like 'roadmap,' 'sprint,' 'user story'), and request confidence scores for assessing transcription reliability.
Deepgram processes the audio through its neural network models, returning a structured transcript containing segments, each with speaker identification, text content, start and end timestamps, and per-word confidence scores. Processing time varies with recording length but typically completes within 30-90 seconds for hour-long meetings.
### Transcript Structuring & Storage
Raw transcript data from Deepgram transforms into ShipSpeak's segment structure for database storage. Each speaker turn becomes a transcript segment linked to the meeting record, with speaker name resolved from the participant list, timestamp converted to display format, and text cleaned for presentation (removing filler words, stutters, and false starts where confidence scores indicate misrecognition).
User segments receive special marking in the database to facilitate filtering and analysis. Segments store with full-text search indexes enabling rapid keyword search across transcripts. The complete transcript structure—meeting header, participant list, segment sequence—replicates the validated Phase 1 display format, ensuring seamless UI integration.
## AI Analysis & Feedback Generation
OpenAI analysis transforms raw transcripts into structured feedback that guides user development. The analysis evaluates multiple dimensions of communication and product thinking, identifies patterns across meetings, highlights key moments for learning, and recommends personalized next steps connecting insights to action.
### Analysis Context Assembly
Before invoking OpenAI, the system assembles comprehensive context about the user and meeting. User profile data provides current role, target role, career timeline, and focus areas selected during onboarding. Historical meeting analysis offers comparison points, showing how current performance relates to recent meetings and identifying persistent patterns. Previous feedback establishes continuity, enabling the AI to reference earlier recommendations and assess whether the user applied past suggestions.
Meeting-specific context includes the complete transcript with speaker attribution, meeting type and participant roles, duration and scheduled purpose, and user-specific segments isolated for focused analysis. This context structures the AI's evaluation, ensuring feedback relevance to the user's specific situation and career goals.
### Multi-Dimensional Scoring
OpenAI evaluates four primary dimensions—Product Sense, Communication, Stakeholder Management, and Technical Translation—each scored on a 0-10 scale with decimal precision. Within each dimension, sub-components receive individual assessment: Product Sense breaks down into problem framing, user focus, market awareness, and data-driven decisions. Communication evaluates clarity, conciseness, structure, and confidence. Stakeholder Management assesses active listening, concern acknowledgment, and consensus building. Technical Translation examines complexity simplification, appropriate detail depth, and tech-business bridging.
Scoring calibrates against the user's current role and target role, providing career-level context. A Product Manager speaking at Senior PM level in 65% of responses receives feedback focused on achieving consistency rather than learning fundamentals. Scores include trend indicators comparing to recent meetings, showing whether specific dimensions are improving, stable, or regressing.
### Pattern Identification
The AI identifies recurring patterns in the user's communication, categorizing them as strengths (consistently demonstrated positive behaviors), improvement areas (techniques that need refinement), or missed opportunities (critical moments where better approaches would significantly improve outcomes). Each identified pattern includes specific transcript examples with timestamps, explanation of why the pattern matters, and recommendations for what to do differently.
Patterns persist across meetings when they recur, with the system tracking pattern history to show whether issues are resolving or persisting. A user who struggles with trade-off articulation in multiple consecutive board meetings receives increasingly specific feedback about this pattern, including practice exercises targeting the skill and template frameworks for improvement.
### Key Moment Annotation
Key moments represent specific exchanges in the meeting that exemplify learning opportunities. The AI identifies 5-8 moments per meeting, selecting instances where the user demonstrated strong skills or where alternative approaches would yield better outcomes. Each moment captures the context (what question was asked), the user's response, analysis of what worked well or poorly, and guidance on how to handle similar situations in future meetings.
Moments link directly to transcript segments, enabling users to review the exact exchange in context. The feedback explains why certain approaches succeed or fail, grounding abstract communication principles in concrete examples from the user's own work. This specificity makes improvement actionable, moving beyond generic advice to situation-specific guidance.
### Next Steps Generation
Every analysis concludes with 2-4 prioritized next steps connecting insights to concrete actions. Steps include practice exercises targeting identified gaps, frameworks to apply in upcoming meetings, examples to review and internalize, and progress metrics to track improvement. Each step specifies the time investment required, impact on career progression, and connection to specific meeting moments that motivated the recommendation.
High-impact next steps address skills currently blocking the user's advancement to their target level. Medium-impact steps refine already-adequate skills toward consistent excellence. The prioritization ensures users focus limited development time on changes that most accelerate their career progress, avoiding generic advice that doesn't match their specific growth edge.
# Phase 2C: Practice & Learning Integration
Duration:
1 week (8-10 hours across 3 integration points)
Phase 2C enables the practice loop where users build skills through structured exercises and receive immediate AI feedback. This phase implements audio recording capture, uploads recordings to storage, transcribes practice attempts with Deepgram, and generates personalized feedback through OpenAI. The tight feedback loop—record, transcribe, analyze, display results—completes in seconds, creating an engaging practice experience that reinforces learning.
## Browser Audio Recording
Audio recording operates entirely in the browser using the MediaRecorder API, avoiding the complexity and latency of streaming to external services. When users click 'Start Recording' for a practice exercise, the browser requests microphone permission (if not previously granted) and begins capturing audio. A visual waveform displays in real-time, confirming successful audio capture and providing feedback that their voice is registering.
### Recording Session Management
During recording, the timer tracks elapsed time against the exercise's time limit. Visual warnings appear at 10 seconds remaining, with the interface changing color to signal approaching cutoff. If users exceed the time limit, recording continues but the feedback notes the duration overage, as conciseness forms part of effective executive communication.
Users can pause mid-recording if needed to collect thoughts, though the timer continues to track total elapsed time. This flexibility accommodates natural thinking pauses while maintaining the challenge of time-constrained communication. Re-recording unlimited times encourages iterative improvement, with each attempt stored for progress tracking.
### Audio File Handling
When recording concludes, the browser generates an audio blob in WebM or MP4 format depending on browser support. The file uploads to Supabase Storage in a user-specific bucket organized by practice session ID. Upload progress displays to the user, with automatic retry logic handling temporary network issues.
Audio files store with expiration policies that automatically delete recordings after 90 days unless explicitly bookmarked by users for reference. This storage management balances the need for progress tracking against cost optimization for infrequently accessed practice recordings. Bookmarked recordings persist indefinitely, serving as reference examples of strong communication.
## Practice Transcription Pipeline
Practice exercise transcription follows a streamlined path optimized for speed. As soon as the audio file completes upload to Supabase Storage, a database trigger fires a webhook to the transcription service. The webhook payload contains the storage URL, user ID, exercise ID, and attempt number, providing context for the transcription job.
### Deepgram Processing for Practice Audio
Deepgram receives the audio file URL and configuration specific to single-speaker content: disable speaker diarization (only one speaker), enable punctuation and paragraph detection for readable output, apply product management vocabulary enhancements, and prioritize speed over ultra-high accuracy. These settings optimize for the 2-3 second transcription time critical for immediate feedback.
The transcription result returns with the complete text, timestamps for each word or phrase, and confidence scores indicating transcription reliability. Lower confidence scores trigger quality warnings, alerting users that background noise or unclear audio may have affected transcription accuracy and suggesting re-recording for better feedback.
### Transcript Storage & Display
The generated transcript stores in the practice_sessions table linked to the session record. Unlike meeting transcripts which segment by speaker turns, practice transcripts store as continuous text with timestamp markers every 5-10 seconds. This simpler structure reflects the single-speaker nature of practice recordings while maintaining enough granularity for moment-specific feedback annotations.
Display formatting applies automatic corrections for common transcription artifacts: capitalizing the first word of sentences, fixing obvious grammatical errors that stem from speech recognition limitations, and inserting paragraph breaks at natural thought transitions. These enhancements improve readability without altering the substantive content users spoke.
## Practice Feedback Generation
OpenAI analysis for practice exercises operates through a specialized prompt structure different from meeting analysis. The prompt provides the exercise scenario and evaluation criteria, the user's recorded response transcript, their career level information, and optionally their meeting performance patterns if available for cross-referencing. This context enables feedback that connects practice to real-world application.
### Criteria-Based Evaluation
Each exercise defines specific evaluation criteria relevant to the skill being practiced. A trade-off communication exercise evaluates answer-first structure, data-backed reasoning, trade-off articulation completeness, stakeholder acknowledgment, and conciseness. The AI scores each criterion independently on a 0-10 scale, explaining the score with specific transcript references.
Scoring calibrates against career level expectations: a Product Manager practicing executive communication receives feedback against PM standards, while a Senior PM practicing the same skill faces higher expectations. This calibration ensures feedback challenges users appropriately for their progression goals without discouraging early-level practitioners.
### Annotated Transcript Feedback
The transcript displays with inline annotations highlighting specific moments where the user demonstrated strong communication or where improvements would elevate the response. Green annotations mark strengths with explanations of what made those moments effective. Yellow annotations identify areas for refinement with specific suggestions. Red annotations call out critical missed elements that significantly impact the response quality.
Each annotation includes a 'better approach' example showing how to rephrase or restructure the problematic section. These examples demonstrate the improvement rather than merely describing it, providing concrete models for users to internalize and apply in future attempts.
### Expert Example Comparison
Practice feedback includes an expert example response to the same exercise, annotated to explain what makes it excellent. Users can toggle between their response and the expert version, comparing approaches and learning from the contrast. The expert example demonstrates career-level appropriate communication, showing what 'good' looks like for their target level.
Comparison facilitates pattern recognition: users notice structural differences (answer-first vs preamble-heavy), word choice variations (confident vs tentative language), and depth variations (specific vs vague). This pattern awareness transfers to their communication, improving not just this specific exercise but their overall approach to similar situations.
### Progress Tracking & Next Exercise Recommendations
Each practice attempt updates the user's progress records, tracking scores across multiple attempts to show improvement trajectories. Visual progress graphs display on the practice feedback page, showing how current performance compares to the user's baseline and previous attempts. Improvement trends validate that practice is working, reinforcing continued engagement.
The system recommends the next practice exercise based on current performance. If users struggle with a specific criterion, the recommendation suggests easier exercises targeting that skill before advancing to more complex scenarios. If users excel, recommendations skip to more challenging exercises that maintain appropriate difficulty for accelerated learners.
# Phase 2D: Real-Time Updates & Polish
Duration:
0.5 weeks (8-10 hours across 3 integration points)
Phase 2D polishes the production system through real-time updates, error handling, and performance optimization. These finishing touches transform a functional integration into a production-ready platform that handles edge cases gracefully, keeps users informed about processing status, and maintains responsive performance under realistic usage loads.
## Real-Time Status Updates
Supabase real-time subscriptions enable live status updates throughout the meeting and practice processing pipelines. When meetings transition from scheduled to in-progress to processing to completed, these state changes propagate immediately to the user's dashboard without requiring page refresh. Users see their meeting list update live as meetings complete, transcripts generate, and analysis finishes.
### Meeting Processing Status Stream
The meetings list page subscribes to database changes on the meetings table filtered to the current user. As meetings progress through stages—bot joined, recording in progress, transcription started, transcription complete, analysis running, analysis complete—each state transition triggers a real-time update. The UI reflects current status through badges and progress indicators, showing users exactly where each meeting stands in the pipeline.
Processing time estimates appear based on historical averages: transcription typically completes in 2-5 minutes for hour-long meetings, analysis generation takes 1-2 minutes. These estimates set expectations and reduce anxiety about when feedback will become available. Notifications fire when analysis completes, bringing users back to review fresh insights.
### Progress Dashboard Live Updates
The progress dashboard subscribes to changes across multiple tables: meeting_feedback for new analysis results, practice_sessions for completed exercises, module_progress for learning completions, and progress_snapshots for overall trajectory updates. As new data arrives, charts re-render with updated information, metrics increment, and recent highlights populate with fresh achievements.
This live updating creates a responsive feel that rewards engagement. Users who complete a practice exercise see their progress metrics update immediately, reinforcing the connection between action and advancement. The instant feedback loop encourages continued practice and exploration of learning modules.
## Error Handling & Recovery
Production systems face inevitable failures: API timeouts, bot join issues, transcription errors, analysis generation problems. Phase 2D implements comprehensive error handling that gracefully manages these situations, provides clear user communication, and enables manual intervention when automatic recovery fails.
### Meeting Bot Failure Scenarios
When bots fail to join meetings—due to incorrect meeting links, platform authentication issues, or admission denial—the system logs the failure with detailed error information, updates the meeting status to 'bot_failed,' and notifies users through in-app notification and email. The notification explains the likely cause (wrong link, meeting cancelled, admission required) and offers remediation steps: manually triggering a retry, updating meeting credentials, or adjusting bot configuration.
For meetings where bots successfully join but encounter mid-meeting issues (network disconnection, platform API changes), the system implements automatic reconnection attempts. If reconnection succeeds within 2 minutes, recording continues with minimal audio gap. If reconnection fails, the partial recording processes normally with a warning that complete meeting coverage may be missing.
### Transcription & Analysis Failures
Transcription failures typically stem from audio quality issues (excessive noise, very low volume) or API service disruptions. When Deepgram returns error responses, the system retries with adjusted audio preprocessing: noise reduction, volume normalization, or silence trimming. After three failed attempts, the system marks transcription as failed and prompts users to review the raw audio file manually.
AI analysis generation handles OpenAI rate limits and timeout errors through exponential backoff retry logic. If analysis fails after retries, the system queues the meeting for delayed processing during off-peak hours. Users receive notification that analysis is delayed with an estimated completion time, maintaining transparency about processing status.
### User-Facing Error Messages
Error messages balance technical accuracy with user-friendly language. Instead of 'Deepgram API returned 503,' users see 'Audio transcription temporarily unavailable. We'll automatically retry in a few minutes.' Actions users can take appear prominently: 'Try again now,' 'Use a different meeting,' or 'Contact support.' Error states never leave users stranded without options for moving forward.
## Performance Optimization
Production performance optimizations ensure the platform remains responsive as data accumulates and concurrent user activity increases. Query optimization, caching strategies, and background processing distribution prevent performance degradation as the user base scales from tens to hundreds of users.
### Database Query Optimization
Common query patterns—meeting list retrieval, transcript display, progress calculation—receive targeted indexes that accelerate lookup times. Composite indexes combine user_id with timestamp fields, enabling fast filtered queries that power the meetings list filters. Covering indexes on frequently accessed columns reduce database reads by including all needed data in the index itself.
Long transcript queries implement pagination to avoid loading thousands of segments simultaneously. The initial load fetches the first 50 segments with infinite scroll loading subsequent batches as users scroll through the transcript. This lazy loading maintains snappy initial render times regardless of total meeting length.
### Caching Strategies
Completed meeting feedback caches at the API layer since analysis rarely changes after generation. When users revisit meeting detail pages, the cached feedback loads instantaneously rather than re-fetching from the database. Cache invalidation occurs only when users manually request feedback regeneration, a rare occurrence.
Progress dashboard data aggregations cache with 1-hour expiration since precision is less critical than responsiveness. Users viewing their progress multiple times in quick succession receive cached results, reducing database load without meaningfully impacting data freshness. Cache warming jobs pre-compute common aggregations during off-peak hours, further accelerating dashboard loads.
### Background Job Distribution
Processing-intensive operations—AI analysis generation, audio transcription, progress snapshot calculation—execute as background jobs rather than blocking API requests. Job queues distribute workload across available compute capacity, preventing resource contention during peak usage periods. Priority queuing ensures practice exercise feedback (users actively waiting) processes before meeting analysis (asynchronous review).
Job retry logic with exponential backoff handles transient failures without overwhelming downstream services. Failed jobs store error details for debugging, enabling developers to identify and resolve systematic issues affecting processing reliability. Job monitoring dashboards provide visibility into queue depth, processing rates, and failure patterns.
# Production Readiness
Phase 2 completion delivers a production-ready platform capable of serving paying customers with real meetings, authentic analysis, and genuine value. The transition from Phase 1's validated mockups to Phase 2's functional integrations preserves the user experience while enabling actual coaching impact. This section outlines the verification steps, monitoring setup, and launch preparation that confirm production readiness.
## Integration Verification
Comprehensive testing validates each integration point before launch, ensuring reliability under real-world conditions. Testing covers happy paths, edge cases, error scenarios, and performance under load. Both automated tests and manual verification confirm that integrations function correctly and fail gracefully.
### End-to-End User Journey Testing
Test users complete the full platform journey: signing up through onboarding, configuring a meeting bot, attending a test meeting with bot participation, reviewing the generated transcript and feedback, completing practice exercises with recording and feedback, and tracking progress over multiple sessions. Each journey step verifies that data flows correctly between systems and users experience expected behavior.
Different user personas test variations: the Path A user who starts with meeting analysis, the Path B user who begins with practice exercises, the user who connects midway through their trial. Each persona validates specific integration paths, ensuring no gaps in the experience regardless of user choices.
### Integration Resilience Testing
Resilience testing deliberately introduces failures to verify graceful degradation and recovery: disconnecting network during audio upload, simulating Deepgram API unavailability, triggering OpenAI rate limits, corrupting audio files, and cancelling meetings after bot join. Each scenario validates that error handling works as designed, users receive appropriate notifications, and automatic recovery mechanisms function correctly.
## Monitoring & Observability
Production monitoring provides visibility into system health, integration performance, and user experience quality. Dashboards aggregate key metrics, alerting systems notify on anomalies, and logging infrastructure captures diagnostic information for troubleshooting. This observability enables proactive problem detection before users report issues.
### Key Performance Indicators
Core metrics track system health and user satisfaction: bot join success rate (target 95%+), transcription completion time (target <5 minutes per hour of audio), analysis generation time (target <2 minutes per meeting), practice feedback latency (target <10 seconds from recording stop to feedback display), and overall user engagement (meetings analyzed per week, practice sessions per user).
Error rates monitor integration reliability: failed bot joins, transcription errors, analysis generation failures, and audio upload failures. Alerting thresholds trigger notifications when error rates exceed acceptable levels, enabling rapid response to systematic issues affecting user experience.
### User Journey Analytics
Analytics track user progression through the platform: onboarding completion rates, first meeting analysis time, practice exercise engagement, module completion patterns, and retention over time. These metrics identify friction points in the user journey and inform product refinements that improve activation and retention.
Cohort analysis compares Path A users (meeting-first) versus Path B users (practice-first), measuring which onboarding path leads to better long-term engagement and skill development. These insights guide onboarding optimization and inform marketing messaging about the platform's entry points.
## Launch Preparation
Launch preparation encompasses final verification steps, user communication planning, support infrastructure setup, and contingency planning for potential issues. Successful launch requires both technical readiness and operational preparedness to support incoming users.
### Beta User Migration
Phase 1 beta users transition from mock data to real integrations through a coordinated migration. Email communication explains the upgrade, new capabilities enabled, and what users should expect. Existing accounts automatically upgrade with preserved profile information and progress tracking from Phase 1 practice attempts.
Beta users configure their meeting bots during first post-migration login, guided through the bot identity selection, meeting type filtering, and calendar connection. A tutorial highlights new real-meeting features while maintaining familiarity with the interface validated in Phase 1. Early feedback from beta users informs refinements before broader launch.
### Support Infrastructure
Support systems prepare to handle user questions and technical issues: documentation covers common troubleshooting scenarios (bot not joining, transcription accuracy, feedback interpretation), email support channels route questions to the development team, and in-app help provides contextual guidance on each page. An internal knowledge base documents integration architecture, error handling procedures, and debugging steps for rapid issue resolution.
### Phased Rollout Strategy
Launch proceeds in phases to manage risk and scale infrastructure appropriately. Phase 1: Beta users upgrade and validate production integrations with real meetings (10 users, 2 weeks). Phase 2: Controlled launch to first paid cohort through direct outreach (25-50 users, 4 weeks). Phase 3: Public launch with broader marketing once stability confirms and support processes refine (100+ users, ongoing).
This phased approach enables iteration based on real usage before scaling to larger audiences. Each phase validates infrastructure capacity, identifies edge cases for enhancement, and builds case studies demonstrating platform value for marketing purposes.
# Conclusion & Next Steps
Phase 2 transforms ShipSpeak from a validated prototype into a production platform that delivers genuine value to Product Managers developing their communication and product sense skills. The systematic integration of authentication, meeting bots, transcription, AI analysis, and practice feedback creates an end-to-end coaching experience that operates on real work rather than hypothetical scenarios.
## Phase 2 Achievements
Completing Phase 2 establishes the foundation for sustainable business growth. The platform now authenticates users securely through Supabase, deploys meeting bots with configurable identities that join real meetings, transcribes conversations with accurate speaker attribution, generates insightful AI feedback connecting communication patterns to career development, processes practice exercises with immediate feedback, and tracks progress over time with data-driven metrics. This infrastructure supports paid user acquisition, enables authentic testimonials from users experiencing real coaching impact, and provides the data foundation for product analytics that drive continuous improvement.
## Post-Launch Optimization (Phase 3)
Following successful Phase 2 launch, Phase 3 focuses on refinement and scale: enhancing AI analysis quality through prompt iteration and model fine-tuning based on user feedback, expanding meeting platform support beyond the initial three platforms, implementing payment processing for subscription management, building additional learning modules based on common user gaps, developing community features for peer learning, and optimizing infrastructure costs as usage scales. These enhancements build on the solid foundation established in Phases 1 and 2, extending platform capabilities while maintaining the core value proposition of private, intelligent coaching based on real work.
## Success Metrics
Phase 2 success evaluates across multiple dimensions: technical reliability (95%+ uptime, <5% error rate across integrations), user engagement (50%+ of users analyzing meetings weekly, 30%+ completing practice exercises monthly), skill development (measurable score improvements over 3-month periods), and business viability (conversion from trial to paid subscription, low churn rate indicating sustained value perception). These metrics validate that the integrated platform delivers on its promise to help Product Managers advance their careers through measurable communication and product sense improvement.
# Appendices
## Appendix A: Technology Stack Summary
Frontend:
Next.js 14 with App Router for application framework
React 18 for component architecture
TypeScript for type safety
Tailwind CSS for styling
MediaRecorder API for audio capture
Backend & Infrastructure:
Supabase for PostgreSQL database, authentication, and real-time subscriptions
Vercel for application hosting and serverless functions
Recall.ai for meeting bot deployment and audio capture
Deepgram for speech-to-text transcription
OpenAI GPT-4 for AI analysis and feedback generation
## Appendix B: Database Schema Overview
Core tables organized by functional area:
User Management:
profiles - user profile data and career information
bot_configs - meeting bot configuration and preferences
Meeting Intelligence:
meetings - meeting metadata and status
transcript_segments - individual speaker turns in transcripts
meeting_feedback - AI analysis and scores
Learning & Practice:
modules - learning module definitions
exercises - practice exercise specifications
practice_sessions - user practice attempts and feedback
module_progress - learning completion tracking
Progress Analytics:
progress_snapshots - daily aggregated metrics for dashboard performance
## Appendix C: API Integration Endpoints
Key integration points with external services:
Recall.ai:
POST /bots - deploy bot to meeting
GET /bots/{id} - retrieve bot status
DELETE /bots/{id} - terminate bot early
Webhook: POST /webhooks/recall - meeting completion notification
Deepgram:
POST /listen - submit audio for transcription
Returns structured transcript with speaker diarization
OpenAI:
POST /chat/completions - GPT-4 analysis generation
Structured prompts for meeting analysis and practice feedback
Calendar Providers:
OAuth flows for Google Calendar, Microsoft Outlook, Zoom
Event polling endpoints for meeting discovery
*End of Document*
