# ShipSpeak
## Phase 1 Integration Contract
## AI-Powered Product Manager Leadership Development Platform
Version 1.0
November 4, 2025
# Executive Overview
This Integration Contract defines the complete specifications for ShipSpeak Phase 1, a frontend-first development phase focused on building a fully functional user experience with mock data. The primary objective is to create a production-ready interface that enables user validation before investing in backend infrastructure.
## Product Vision
ShipSpeak addresses a critical gap in Product Manager career development by providing a private, AI-powered coaching platform that analyzes real work meetings and delivers personalized feedback. The platform's core differentiator—bot discretion and complete user control over bot identity—transforms meeting analysis from a potentially stigmatizing tool into a genuinely private coaching experience.
## Phase 1 Objectives
**Duration: **4 weeks (44-54 development hours)
**Outcome: **Complete user experience with mock data ready for beta validation with 10 Product Managers
**Infrastructure: **Zero backend dependencies, all features operational with realistic mock data
### Key Deliverables
Two-path onboarding experience (analyze meetings OR start practicing)
Complete meeting intelligence system with transcript analysis and AI feedback
Personalized learning module library with practice exercises
Practice recording interface with immediate AI feedback
Comprehensive progress dashboard with career level tracking
Fully responsive mobile experience
## Development Methodology
Phase 1 follows a proven frontend-first approach that prioritizes user experience validation before infrastructure investment. This methodology, successfully applied in previous projects, enables rapid iteration cycles and meaningful user feedback without the complexity and cost of backend integrations.
**Core Principle: **Build the complete interface with realistic mock data that demonstrates every feature and user flow. Users should be able to click through the entire product experience, experiencing a fully functional system that appears production-ready.
**Validation Goal: **By week 4, beta users can evaluate the complete learning experience, provide feedback on user flows, and validate the value proposition—all before any backend infrastructure is built.
# Career Progression Framework
ShipSpeak's learning system is built around a structured career progression framework that maps specific communication and product sense skills to each level. This framework guides all product features, from meeting analysis to practice exercises to progress tracking.
## Framework Levels
### Product Owner → Product Manager
**Focus Areas:**
Learning basic product sense and user-centered thinking
Developing influence without authority with engineering teams
Communicating effectively with immediate stakeholders
Supporting decisions with data and user research
### Product Manager → Senior Product Manager
**Focus Areas:**
Strong executive communication (answer-first structure, conciseness)
Trade-off articulation with clear decision frameworks
Cross-functional leadership beyond immediate team
Strategic thinking that extends beyond individual features
### Senior PM → Group PM
**Focus Areas:**
Multi-product strategy and portfolio thinking
Organizational influence across multiple teams
Coaching and mentoring other Product Managers
Vision setting and roadmap planning at scale
### Group PM → Director of Product
**Focus Areas:**
Department-level strategy and resource allocation
Executive presence and confident communication with C-suite
Team building, culture development, and talent management
Business model thinking and P&L understanding
# Phase 1A: Foundation (Week 1)
**Duration: **10-12 hours across 3 implementation slices
Phase 1A establishes the foundational infrastructure and user experience elements that all subsequent features build upon. This includes the design system, authentication flows, navigation structure, and the innovative two-path onboarding that differentiates ShipSpeak's approach to PM development.
## Design System & Project Setup
The design system establishes visual consistency across the entire platform through carefully chosen colors, typography, spacing, and reusable components. Every interactive element—from buttons to cards to navigation—adheres to this system, creating a professional, cohesive user experience.
### Color Palette
The color system conveys information hierarchy and status through five primary categories:
**Primary Blue (#3B82F6): **Used for primary actions, links, and interactive elements that drive core user flows
**Success Green (#10B981): **Indicates positive outcomes, achievements, and strong performance (scores 8-10)
**Warning Yellow (#F59E0B): **Highlights areas for improvement and moderate performance (scores 6-8)
**Error Red (#EF4444): **Signals critical issues, missed opportunities, and low performance (scores below 6)
**Neutral Grays (#F9FAFB to #111827): **Creates visual hierarchy from backgrounds to text, with 8 distinct shades
### Typography System
Typography establishes information hierarchy through size and weight variations:
**Font Family: **Inter or similar modern sans-serif, optimized for screen readability
**Size Scale: **9 distinct sizes from 12px (small labels) to 48px (page titles), following a consistent ratio
**Weight Scale: **Four weights (400 regular, 500 medium, 600 semibold, 700 bold) for different emphasis levels
### Spacing & Layout
Consistent spacing creates visual rhythm and improves scannability:
**Base Unit: **4px, all spacing is a multiple of this base (4, 8, 12, 16, 24, 32, 48, 64, 96)
**Border Radius: **Three sizes—4px (small), 8px (medium), 12px (large)—plus 9999px for circular elements
**Maximum Width: **1440px for main content, ensuring optimal reading experience on large displays
## Application Layout Structure
The application uses a three-part layout that provides persistent navigation and context while maximizing content area:
### Sidebar Navigation
The left sidebar remains fixed throughout the application, providing constant access to primary navigation:
**Width: **240px on desktop, collapses to bottom navigation bar on mobile devices
**Top Section: **ShipSpeak logo with brand identity
**Navigation Links: **Five primary sections with icons—Dashboard, Meetings, Practice, Progress, Settings
**Active State: **Current page highlighted with blue background and bold text
**Bottom Section: **User profile with avatar, name, and current role badge
### Header Bar
The header provides contextual information and actions for the current page:
**Height: **64px, remains sticky at the top when scrolling
**Left Section: **Dynamic page title that updates based on current route
**Center Section: **Reserved for future search functionality
**Right Section: **Career level badge (clickable to view framework), notification bell, and user menu dropdown
### Main Content Area
The content area dynamically displays page-specific information:
**Layout: **Fills remaining space between sidebar and right edge, with 24px padding on all sides
**Maximum Width: **1440px, horizontally centered for optimal reading on large displays
**Scrolling: **Independent vertical scrolling while sidebar and header remain fixed
## Two-Path Onboarding Experience
The onboarding flow represents a critical product innovation that addresses different user readiness levels and preferences. Rather than forcing all users through a single path, ShipSpeak offers two distinct entry points into the platform, each optimized for different use cases and comfort levels.
### Onboarding Philosophy
The two-path approach acknowledges that Product Managers arrive at ShipSpeak with varying levels of readiness and different preferences for how they want to begin. Some users prefer to dive into practice immediately, establishing a baseline and building skills right away. Others prefer to start with analysis of their actual work, getting immediate feedback on real meeting performance. By offering both paths equally and allowing users to add the alternative later, ShipSpeak removes friction from the getting-started experience.
### Initial Steps (Common to Both Paths)
Before the path selection, all users complete three foundational steps:
**Step 1: Account Creation**
Users provide their name, email, and password. The form validates email format and requires passwords to be at least 8 characters with at least one number. A checkbox requires agreement to Terms of Service and Privacy Policy before account creation is enabled.
**Step 2: Role Identification**
Users select their current role from five options: Product Owner, Product Manager, Senior Product Manager, Group Product Manager, or Director of Product. An optional field allows them to specify their company, with autocomplete suggestions for common tech companies. This information establishes the baseline for all subsequent learning and progress tracking.
**Step 3: Career Goal Setting**
Users define where they want to be in their career, selecting a target role that must be equal to or higher than their current role. A visual representation shows their journey (Current Level → Target Level) with an arrow between them. They also select their timeline: 6 months, 1 year, 2 years, or "Just exploring." This establishes the framework for personalized learning recommendations and progress tracking.
### Path Selection Interface
After completing the initial steps, users see a carefully designed fork in the road. The interface presents both options side-by-side with equal visual weight, ensuring neither path appears as the "default" or "better" choice. Each path card includes a distinct icon, clear title, explanatory description, three benefit bullet points with icons, and a prominent action button.
### Path A: Analyze My Real Meetings
This path targets users who want immediate, personalized insights based on their actual work:
**Value Proposition**
First insights arrive within 24 hours of their next meeting
Analysis reflects their actual communication style, not hypothetical scenarios
Learning recommendations are personalized to their specific gaps and patterns
**Bot Configuration Wizard**
Selecting this path launches a three-step wizard that configures the meeting bot. Step one focuses on bot identity: users can choose from preset names ("Executive Assistant," "Meeting Recorder," "My Notetaker") or enter a custom name. A clear explanation states "This is how it will appear to others in your meetings," emphasizing the discretion aspect.
Step two allows users to specify which meeting types the bot should join. The interface presents a multi-select list with checkmarks, with Board meetings, Cross-functional planning, and Customer/stakeholder meetings recommended and pre-checked. Team meetings and 1:1s are available but unchecked by default, with a note that "1:1s usually too intimate" for bot recording.
Step three handles calendar connection through OAuth buttons for Zoom, Google Meet, and Microsoft Teams. A clear permission explanation describes what access the bot needs and why. Upon completion, users see a "Your bot is ready!" success message before being redirected to their dashboard, which displays a "Waiting for your first meeting..." state.
### Path B: Start Practicing Now
This path appeals to users who want to start learning immediately without calendar integration:
**Value Proposition**
Learning begins within 2 minutes of account creation
Skills develop immediately through structured practice
Baseline assessment provides starting point for progress tracking
**Baseline Exercise Sequence**
Selecting this path initiates a structured baseline assessment consisting of three timed exercises totaling approximately 5 minutes. Each exercise presents a realistic PM scenario with specific constraints and a recording timer.
**Exercise 1: Product Prioritization (60 seconds)**
Prompt: "You have 3 features to build but only capacity for 1 this quarter. Explain your choice to your CEO." This exercise evaluates answer-first structure, data-backed reasoning, and trade-off articulation.
**Exercise 2: Stakeholder Question Response (90 seconds)**
Prompt: "Engineering says your timeline is unrealistic. How do you respond in a planning meeting?" This tests stakeholder management, concern acknowledgment, and maintaining relationships under pressure.
**Exercise 3: Trade-off Explanation (60 seconds)**
Prompt: "The board asks why you chose speed over quality. Explain your reasoning." This assesses technical-business translation and executive communication style.
After completing all three exercises, a processing screen displays "Analyzing your baseline..." with an animated loading indicator. The system generates preliminary scores across four dimensions: Product Sense, Communication, Stakeholder Management, and Technical Translation. Results are presented on a dedicated page titled "Here's where you are now" with a prominent call-to-action: "Start your personalized learning path." A secondary option reads "Want even more personalized learning? Connect your calendar."
### Mock Authentication System
Phase 1 implements a complete authentication experience using browser localStorage to simulate real authentication behavior. When a user signs up, the system generates a unique user ID, stores their profile information (email, name, current role, target role, timeline, and onboarding path choice), and creates a mock authentication token. Login validation checks the entered email against stored user data and returns appropriate success or error messages.
Protected routes automatically redirect unauthenticated users to the login page, while authenticated users are redirected away from login and signup pages to their dashboard. Session persistence works across page refreshes through localStorage, with the user object and token remaining available until explicitly cleared. Phase 2 will replace this mock system with Supabase authentication while maintaining the identical user interface and flow.
## Dashboard Foundation
The dashboard serves as the user's home base after login, providing an at-a-glance overview of their journey and clear paths to the platform's primary features. In Phase 1, the dashboard displays in an empty state that clearly communicates the product's value while motivating users to take their first actions.
### Welcome Section
The top of the dashboard provides personalized context:
**Greeting: **"Welcome back, [Name]" personalizes the experience using the name from their profile
**Current Level Badge: **Displays their role (e.g., "Product Manager") in a styled badge
**Progress Indicator: **Shows "→ Senior PM (65% ready)" visualizing progress toward their target level
### Quick Statistics
Four cards display key metrics in the empty state:
Total meetings analyzed: 0
Practice sessions completed: 0
Skills improving: 0
Days streak: 0
These cards establish the metrics users will track over time, setting expectations for what the platform measures. As users engage with meetings and practice exercises, these numbers will increment, providing tangible evidence of progress.
### Empty State Components
The dashboard presents three empty state cards that explain what will appear in each section and provide clear calls-to-action:
**Recent Meetings (Empty)**
Icon: Calendar; Heading: "No meetings analyzed yet"; Description: "Connect your Zoom or Google Calendar to start getting insights on your communication"; Action: "Connect calendar" button
**Recommended Modules (Empty)**
Icon: Book; Heading: "Your personalized learning path"; Description: "Complete your first meeting or practice session to get customized module recommendations"; Action: "Browse all modules" link
**Getting Started Card**
Two prominent action buttons: "Connect your calendar to start analyzing meetings" and "Start your first practice exercise." This card respects their onboarding choice while making the alternative path easily accessible.
### Career Level Visualization
The header displays a clickable career level badge that opens a modal showing the complete framework. The modal presents the user's current position in the PM career ladder, the skills required for each level, and the specific areas they need to develop to reach their target level. This framework view is accessible from any page, providing constant context for their learning journey.
# Phase 1B: Meeting Intelligence (Week 2)
**Duration: **12-15 hours across 3 implementation slices
Phase 1B builds the core meeting analysis experience that demonstrates ShipSpeak's value proposition. Users can view their meeting history, dive deep into transcripts with speaker identification, and receive comprehensive AI-generated feedback with actionable next steps. All functionality operates on realistic mock data that simulates the complete meeting intelligence workflow.
## Meeting List & Discovery
The meeting list serves as the primary interface for accessing past meeting analysis. The design emphasizes scannability, allowing users to quickly locate specific meetings while understanding their performance at a glance through visual indicators.
### List View Display
Each meeting appears as a horizontal card with five distinct sections:
**Date Section (Fixed Width ~120px)**
Large text displays the date ("Nov 1"), small text shows the time ("2:00 PM"), and below that, relative time appears ("3 days ago"). This consistent left-anchored date column allows users to scan chronologically through their meeting history.
**Meeting Information Section (Flexible Width)**
The title appears in bold 18px text ("Q4 Board Meeting"), followed by a color-coded meeting type badge ("Board Meeting" in distinct color). Below the title, participant avatars stack horizontally with slight overlap, showing up to 5 faces as 32px circles. If more than 5 participants attended, a "+3 more" indicator appears. Hovering any avatar reveals a tooltip with the participant's full name. The duration displays with an icon: "62 minutes."
**Score Section (Fixed Width ~100px)**
A circular gauge prominently displays the overall score (7.5/10) with color-coding: green for 8-10, yellow for 6-8, red below 6. Below the gauge, a trend indicator shows change from previous similar meetings: "↑ +0.8" in green or "↓ -0.5" in red. This immediate visual feedback helps users understand their improvement trajectory.
### Grid View Alternative
Users can toggle to a grid view where meetings appear as vertical cards approximately 300px wide. Each card prominently features the score badge at the top, followed by the meeting title, date and time, participant avatars (fewer visible due to space), meeting type badge, and a "View" button. The grid view allows users to see more meetings at once while maintaining the essential information hierarchy.
### Filtering & Search
Three filtering mechanisms help users find specific meetings:
**Meeting Type Filter**
A dropdown multi-select allows filtering by Board Meeting, Team Meeting, 1:1, Customer Call, Planning Session, or All-Hands. Each option shows the count of meetings of that type in parentheses ("Board Meeting (3)"). Selected types appear as removable chips below the search bar, with an X icon to quickly remove filters.
**Date Range Filter**
Preset options include Today, This week, This month, Last 30 days, and Custom range. Selecting Custom opens a date picker with start and end date inputs. The active date range appears as a chip in the filter bar.
**Participant Filter**
An autocomplete text input shows participant name suggestions as users type. Multiple participants can be selected, with each appearing as a chip. This allows queries like "Show me all meetings where both Sarah and David were present."
**Search Functionality**
The search input filters meetings in real-time as users type, searching both meeting titles and participant names. A 300ms debounce prevents excessive filtering while typing. If no meetings match the search query, a clear empty state appears: "No results for '[query]'" with a button to clear the search.
### Sorting Options
A dropdown in the header allows reordering the meeting list:
Newest first (default)
Oldest first
Highest score (for celebrating wins)
Lowest score (for identifying areas needing work)
Longest duration
Most recent (by when meeting occurred)
### Mock Meeting Data
Phase 1 includes 10 carefully crafted mock meetings representing realistic variety:
**Meeting Types: **Board meetings, team planning sessions, 1:1s, customer calls, all-hands meetings
**Participant Counts: **From intimate 2-person 1:1s to 15-person all-hands
**Durations: **Quick 15-minute check-ins to comprehensive 90-minute strategy sessions
**Scores: **Distributed across high (8-9), medium (6-7), and low (4-5) ranges
**Time Range: **Spanning the past 30 days to demonstrate trend analysis
This variety ensures that filtering, sorting, and search functionality can be fully demonstrated and validated by users without requiring real meeting data.
## Meeting Detail & Transcript
The meeting detail page transforms a recorded conversation into an interactive learning experience. Users see exactly what was said, who said it, and how their communication patterns aligned with best practices for their career level.
### Page Structure
The page uses a two-column layout with the transcript occupying 60% of the width on the left and the AI feedback panel filling the remaining 40% on the right. On mobile devices, these columns stack vertically with the transcript first, followed by feedback. A sticky header at the top provides persistent context and navigation.
### Meeting Header
The header contains essential meeting context:
**Back Button: **Returns to meeting list with preserved filters and scroll position
**Meeting Title: **Editable on hover, allowing users to rename meetings for easier reference
**Metadata Row: **Date and time ("Friday, November 1, 2025 at 2:00 PM"), duration ("62 minutes"), meeting type badge ("Board Meeting")
**Participant List: **Expanded view showing all participants with avatar, name, and role. The user's entry is highlighted or marked with "(You)"
**Action Buttons: **"Add notes," "Share," and "Export transcript" for post-meeting workflows
### Transcript Display
The transcript presents the conversation as a series of speaker turns, each clearly attributed and timestamped. The design prioritizes readability while providing rich context about communication patterns.
**Segment Structure**
Each segment begins with the speaker's avatar (consistent throughout for that person), their name in bold, their role in smaller gray text below the name, and the timestamp in format "14:32". The spoken text follows, formatted with appropriate line breaks for readability. Segments can contain single sentences or multiple paragraphs depending on how long that person spoke.
**User Highlighting**
The user's own speaking turns have a subtle blue background highlight, making it easy to scan through the transcript and focus on their contributions. Their name appears in bold with slightly larger font weight than other participants.
**Key Moment Markers**
Certain segments have a colored left border and an inline icon indicating a significant learning moment:
**Green Border: **Strong example of best practice ("Great answer-first structure here")
**Yellow Border: **Area for improvement ("Trade-offs mentioned but not explored")
**Red Border: **Missed opportunity ("Didn't address CEO's constraint concern")
Clicking a key moment marker expands inline feedback explaining the significance of that moment and providing specific guidance on what worked well or what could be improved. These moments link to corresponding entries in the feedback panel for deeper analysis.
### Transcript Controls
A control bar above the transcript provides several navigation and filtering options:
**Search Within Transcript: **Highlights all matching text as users type, shows match count ("3 results"), and provides next/previous buttons to jump between matches
**Speaker Filter: **Dropdown allows showing all speakers (default), only the user, a specific individual, or only segments with key moments
**Jump to Timestamp: **Text input accepting "14:32" format that scrolls to and highlights that segment
### Interaction Capabilities
The transcript supports several interactive features:
**Hover Actions: **Hovering any segment reveals "Copy" and "Link to this moment" actions
**Copy Segment: **Copies the text to clipboard for use in notes, emails, or documentation
**Link Generation: **Creates a shareable URL that opens this meeting and scrolls to the specific timestamp, enabling precise references in team discussions
### Mock Transcript Data
The mock transcript for the Q4 Board Meeting contains 40-50 segments representing a realistic board meeting conversation. The user (Sarah Chen, Product Manager) speaks 8-10 times throughout the 62-minute meeting, responding to questions, presenting recommendations, and participating in discussions. The conversation demonstrates natural back-and-forth with multiple participants, varied segment lengths from brief acknowledgments to detailed explanations, and six key moments strategically placed to illustrate strengths (3), areas for improvement (2), and a missed opportunity (1).
Example conversation flow demonstrates realistic board meeting dynamics. The CEO opens by asking for roadmap recommendations. Sarah responds with a clear recommendation backed by data: focusing on mobile checkout flow, API performance, and analytics dashboard, with specific conversion rate statistics supporting the mobile priority. This segment receives a green key moment marker noting the strong answer-first structure with data backing. The CFO follows with a revenue impact question, and Sarah provides specific financial projections and timeline estimates. When a board member asks why mobile checkout takes priority over API work, Sarah's response mentions trade-offs but doesn't fully explore the implications, receiving a yellow marker suggesting more explicit acknowledgment of engineering concerns would strengthen the communication.
## AI Feedback Panel with Next Steps
The feedback panel transforms meeting transcripts into actionable learning by analyzing communication patterns, scoring performance across multiple dimensions, and providing specific next steps for improvement. This panel represents the core intelligence of ShipSpeak, demonstrating how the platform identifies gaps and personalizes learning.
### Overall Assessment Section
The top of the panel displays a large circular gauge (180px diameter) showing the overall communication score. The center displays the score in large bold text ("7.5") with a colored ring that fills proportionally from 0 to 10, using a gradient from red (poor) through yellow (moderate) to green (excellent). Below the gauge, a trend indicator shows change from the last similar meeting: "↑ +0.8 from last meeting" in green with an upward arrow, or "↓ -0.5 from last meeting" in red with a downward arrow.
A 2-3 sentence summary provides immediate, specific feedback: "You demonstrated strong product thinking and data-backed decision making. Your answer-first structure kept the conversation focused. Main opportunity: exploring trade-offs more thoroughly with stakeholders." This summary captures the essence of the analysis before users dive into detailed breakdowns.
The career level assessment shows progress toward the target level: "Speaking at Senior PM level in 65% of responses" with a progress bar filled to 65%. A tooltip explains: "To consistently speak at Senior PM level, focus on trade-off articulation." This persistent reminder connects every meeting to the user's career goals.
### Dimension Score Breakdown
An expandable section titled "Score Breakdown" displays four dimension cards. When collapsed, each shows just the dimension name, score, and trend. When expanded, each dimension reveals 3-4 subcomponent scores that explain how the overall dimension score was calculated.
**Product Sense (8.0/10)**
Subcomponents: Problem Framing 8.5/10 ✓, User Focus 7.8/10 ✓, Market Awareness 7.7/10 ✓, Data-Driven Decisions 8.3/10 ✓
**Communication (7.2/10)**
Subcomponents: Clarity 8.0/10 ✓, Conciseness 7.5/10 ✓, Structure 6.5/10 ⚠️, Confidence 7.0/10 ✓
**Stakeholder Management (7.3/10)**
Subcomponents: Active Listening 7.8/10 ✓, Addressing Concerns 6.5/10 ⚠️, Building Consensus 7.5/10 ✓
**Technical Translation (7.8/10)**
Subcomponents: Simplifying Complexity 8.0/10 ✓, Appropriate Depth 7.5/10 ✓, Bridging Tech/Business 8.0/10 ✓
Green checkmarks indicate strong performance, while yellow warning icons highlight areas needing attention. This granular breakdown helps users understand exactly which skills drive their overall scores.
### Communication Patterns
The "What We Noticed" section organizes observations into three categories, each with a distinct color scheme and set of actionable insights:
**Strengths (Green Section)**
Lists positive patterns with specific examples:
"Answer-first structure (4 of 5 responses): You consistently led with your recommendation before explaining rationale. This kept the board focused. Examples: 14:35, 18:45, 26:10"
"Data-backed claims (all recommendations): Every recommendation included specific metrics or research findings. This builds credibility. Examples: 14:35 (conversion rates), 22:15 (user research)"
**Areas to Improve (Yellow Section)**
Highlights improvement opportunities with direct links to recommended learning:
"Incomplete trade-off exploration (2 instances): You mentioned alternative options but didn't fully explore the downsides or constraints. Board members asked follow-up questions that could have been addressed. Examples: 22:15, 31:40. → Recommended module: 'Communicating Trade-offs to Executives'"
**Missed Opportunities (Red Section)**
Identifies significant gaps that had clear impact:
"Didn't directly answer the CEO's question about eng confidence: David asked about engineering team buy-in. You mentioned Alex's comfort but didn't share his specific feedback or concerns. Bringing that detail would have shown stronger stakeholder alignment. Example: 16:00. → Practice: 'Answer the question directly, then provide context'"
### Key Moments Interactive List
The "8 Key Moments from This Meeting" section provides a sortable list of significant learning opportunities. Users can sort by "Strengths first" or "Areas to improve first" depending on whether they want to celebrate wins or focus on development.
Each moment card contains the timestamp and context, a summary of the user's response, detailed feedback on what went well and/or what to improve, and a suggested action or module. For positive moments, the card includes phrases like "This is Senior PM level communication. Great example to reference." For improvement moments, the card provides a "Better approach" section showing how the response could be strengthened.
Example moment card: "🟡 22:15 - Trade-off discussion. Context: James asked about mobile vs API priority. Your response: 'Both are important, but mobile checkout gives us faster ROI...' What went well: Acknowledged both options, Explained reasoning. What to improve: Could have been more explicit about API risks, Engineering team concerns weren't surfaced. Better approach: 'Mobile gives faster ROI, but I want to be transparent about the API trade-off: we're building tech debt that will slow us down in Q2. Alex's team is comfortable managing it short-term, but we need to tackle it in Q1.' → Practice this: 'Communicating Trade-offs' module. [View in transcript →]"
### Module Recommendations
The "Personalized Learning Path" section presents 2-3 module cards specifically selected based on the gaps identified in this meeting. Each card explains why the module is relevant, what skills it develops, the time commitment, and the relevance match percentage.
Example module card: "🎯 Communicating Trade-offs to Executives. Why this matters: You mentioned trade-offs in this meeting but didn't fully explore downsides. Board members asked follow-up questions that could have been preempted. What you'll learn: The 'Option-Impact-Risk' framework, How to surface constraints proactively, Practice with realistic scenarios. Time: 15 minutes | Difficulty: Intermediate | Relevance: 92% match to your gaps. [Start module →]"
### Next Steps Section
The bottom of the feedback panel presents 2-4 prioritized action items under the heading "Your Development Plan from This Meeting." Each step is numbered and includes an impact indicator (⭐ High Impact, ⭐⭐ Medium Impact), a clear title describing the action, explanation of why this step matters tied to specific meeting moments, the gap or strength being addressed, time estimate when applicable, and primary and sometimes secondary action buttons.
**Next Step Example 1: Practice Trade-off Communication (High Impact)**
Why: Based on moments at 22:15 and 31:40 where trade-offs weren't fully explored, practice the 'Option-Impact-Risk' framework. Your gap: You mentioned options but didn't explore downsides, causing board members to ask follow-up questions. [Start Practice Exercise →]
**Next Step Example 2: Apply This Framework in Your Next Board Meeting**
Before your next board meeting, prepare trade-offs for each recommendation using this template: Option A: [Benefit] but [Constraint/Risk], Option B: [Benefit] but [Constraint/Risk], My recommendation: [Choice] because [Reasoning]. This Senior PM-level skill will prevent follow-up questions and demonstrate strategic thinking. [Save Framework Template →] [Set Reminder →]
**Next Step Example 3: Review Your Strong Example**
Your opening at 14:35 was Senior PM level communication. Save this as a reference for answer-first structure. What made it strong: Clear recommendation upfront, Data-backed reasoning, Framed in business impact terms. [Bookmark This Moment →] [See Similar Examples →]
**Next Step Example 4: Track Progress (Ongoing)**
We'll monitor your trade-off communication in future meetings. Your goal: Show this skill in 80% of responses within 3 meetings. Current: 40% of responses showed trade-off exploration. Target: 80% (Senior PM level). [View Progress Dashboard →]
### Next Steps Design Principles
The next steps follow a specific prioritization logic:
**High Impact First: **The biggest gap blocking career progression appears at the top
**Quick Wins Included: **Something achievable in 2-5 minutes to build momentum
**Application Step: **How to use the learning in real work, not just practice
**Progress Tracking: **Clear metric to measure improvement over time
Each next step can be marked complete with a checkbox, creating a sense of progression and accomplishment. This completion tracking feeds into the overall progress dashboard, showing users how they're acting on feedback over time.
# Phase 1C: Learning Modules & Practice (Week 3)
**Duration: **12-15 hours across 4 implementation slices
Phase 1C creates the learning and practice system that closes the gap between meeting insights and skill development. Users discover personalized learning modules based on their meeting patterns, work through structured content that teaches frameworks and best practices, record practice responses with realistic PM scenarios, and receive immediate AI feedback on their performance. The entire learning loop operates with mock data while demonstrating the complete value proposition.
## Module Library & Personalization
The module library serves as the learning hub where users discover content tailored to their specific needs. Rather than presenting a generic catalog, the system prioritizes modules based on gaps identified in meeting analysis, career level requirements, and user-selected focus areas from onboarding.
### Library Organization
The main page displays the heading "Your Learning Path" with a subheader explaining "Personalized modules based on your meetings and career goals." Navigation tabs allow filtering by category: All Modules, Recommended for You (default), Product Sense, Executive Communication, Stakeholder Management, Technical Translation, and Trade-off Articulation. A sort dropdown offers ordering by Priority, Duration (shortest first), or Difficulty level.
### Module Card Design
Each module appears as a card with several information layers:
**Priority Badge: **⭐⭐⭐ High Impact, ⭐⭐ Medium Impact, or ⭐ Low Impact based on user's specific gaps
**Title: **Clear, outcome-focused name like "Communicating Trade-offs to Executives"
**Metadata: **Difficulty badge (Beginner/Intermediate/Advanced) and duration ("15 minutes")
**Personalized Reason: **"Based on your Q4 board meeting, you mentioned trade-offs but didn't fully explore downsides" with link to specific meeting
**Learning Outcomes: **3-4 bullet points describing specific skills: "The 'Option-Impact-Risk' framework," "How to surface constraints proactively," etc.
**Relevance Score: **"92% match to your gaps" showing algorithmic fit
**Progress Indicator: **Not Started, In Progress with percentage, or Completed ✓
**Career Level Tag: **"Critical for PM → Senior PM transition" when relevant
**Action Button: **"Start Module" or "Continue Module" depending on progress state
### Module Categories
The library contains 15-20 modules organized across five skill categories, each targeting specific career progression needs:
**Product Sense & Strategy**
User Problem Framing
Market Opportunity Sizing
Competitive Positioning
Product Vision Communication
Metrics that Matter
**Executive Communication**
Answer-First Structure
Communicating with C-Suite
Presenting to Boards
Executive Updates
Saying No to Stakeholders
**Stakeholder Management**
Building Consensus
Managing Conflicting Priorities
Influence Without Authority
Stakeholder Mapping
Concern Acknowledgment
**Technical Translation**
Explaining Technical Concepts to Non-Technical Audiences
Bridging Engineering and Business
Architecture Decision Communication
Technical Feasibility Discussion
Scope Negotiation with Engineering
**Trade-off Articulation**
The Option-Impact-Risk Framework
Speed vs Quality Decisions
Feature Prioritization Communication
Resource Constraint Discussion
Strategic Trade-offs
### Personalization Algorithm
Module priority is determined through several weighted factors:
**Gap Severity: **Skills scoring below 7.0 in meetings receive highest weight
**Career Relevance: **Skills required for target level but not current level are prioritized
**Pattern Frequency: **Issues appearing in multiple meetings indicate systematic gaps
**User Preferences: **Focus areas selected during onboarding influence recommendations
This algorithm ensures that "Recommended for You" always shows the most impactful learning opportunities, while the full catalog remains browsable for users who want to explore beyond their immediate gaps.
## Module Content Structure
Each module follows a consistent structure that moves users from understanding the problem through learning a framework to practicing application. The content balances theoretical knowledge with practical examples, ensuring users can immediately apply what they learn.
### Module Header
The top of the module page displays a back button to the module library, the module title ("Communicating Trade-offs to Executives"), difficulty and duration metadata ("Intermediate • 15 minutes"), and a progress bar showing completion ("2 of 5 exercises completed"). A prominent callout explains "Why this matters for you," connecting the module directly to the user's specific meeting patterns: "In your Q4 board meeting, you presented options without fully exploring downsides. This module will help you communicate trade-offs more effectively."
### Learn Tab Content
The Learn tab contains four sequential sections that build understanding:
**Section 1: The Problem**
Opens with a real example from the user's meetings when available, explains why this skill matters for career progression ("Senior PMs are expected to proactively address trade-offs"), and lists common mistakes PMs make ("Presenting only your preferred option," "Mentioning alternatives without explaining why you didn't choose them," "Failing to acknowledge constraints").
**Section 2: The Framework**
Introduces the "Option-Impact-Risk" framework with a visual diagram. Provides a detailed example breakdown: "Option A: Build mobile app. Impact: +$2M ARR, 60% of users on mobile. Risk: 6-month timeline, delays API work. Option B: Focus on API performance. Impact: Better enterprise scalability. Risk: No immediate revenue, mobile gap continues. My recommendation: Mobile app first because [Clear reasoning with trade-off acknowledgment]."
**Section 3: Best Practices**
Lists do's and don'ts, shows an example of strong trade-off communication with annotations explaining what makes it effective, and contrasts with an example of weak trade-off communication, pointing out specific problems to avoid.
**Section 4: Apply to Your Work**
Provides a downloadable template for next board meeting preparation, a checklist of elements to include in trade-off discussions, and guidance on handling common board questions with this framework.
### Practice Tab Content
The Practice tab displays a list of 5-8 exercises designed to build mastery of the module's framework. Each exercise card shows:
Exercise number and title ("Exercise 1: Product Prioritization Trade-off")
Format badge ("Timed Response • 60 seconds" or "Scenario-Based" or "Compare & Improve")
Difficulty indicator (Beginner/Intermediate/Advanced)
Time estimate ("5 minutes")
Preview of scenario (first 2 lines)
Completion status (Not started / In progress / Completed ✓)
"Start Exercise" button that launches the practice interface
### Exercise Format Types
Exercises come in three distinct formats, each testing different aspects of skill application:
**Type 1: Timed Response (60-90 seconds)**
Presents a clear prompt with realistic PM scenario, includes specific constraints and success criteria, starts a countdown timer, records audio response, and generates immediate transcript with AI feedback. Example: "You're presenting to your board. You have capacity for one major initiative this quarter: either mobile checkout (high revenue potential) or API performance (technical debt). In 60 seconds, present your recommendation and explicitly explain the trade-offs."
**Type 2: Scenario-Based (Multi-turn)**
Creates an interactive scenario with decision points. User responds to different stakeholders' questions or concerns. Scenario branches based on their choices, demonstrating consequences. Summary feedback highlights which responses were most effective. Example: "You're in a planning meeting. You've recommended focusing on mobile checkout over API work. Engineering Lead: 'I'm concerned about API technical debt. This will cause problems in Q2.' How do you respond? A) Acknowledge concern and explain trade-off, B) Defend your decision with data, C) Suggest a compromise. [Record your response or select →]"
**Type 3: Compare and Improve**
Shows two versions of the same communication (weak and strong), asks user to identify what makes one better through multiple choice or free response, then challenges them to record their own improved version incorporating the best practices. Example: "Version A (Weak): 'I think we should do mobile. API can wait.' Version B (Strong): 'I recommend mobile checkout first. While API performance is important, mobile gives us faster ROI ($2M ARR). We'll build technical debt, but Alex's team can manage it short-term. We'll tackle API in Q1.' What makes Version B stronger? [Analysis] Now record your own version: [Start Recording →]"
## Practice Recording Interface
The practice recording interface creates a focused, professional environment for users to rehearse their PM communication skills. The design emphasizes clarity, providing all necessary context while minimizing distractions during the recording process.
### Pre-Recording State
Before recording begins, users see the complete exercise setup. The header shows module breadcrumb navigation ("Trade-off Communication > Exercise 2"), exercise title ("Present Product Prioritization to Board"), and format metadata ("Timed Response • 60 seconds").
The exercise prompt appears in a large, prominent card with distinct sections: Scenario (👥 icon with meeting context), Context (what the audience cares about, key constraints, what must be addressed), Your Task (highlighted instruction with time limit reminder and success criteria), and a collapsible Tips section containing the relevant framework, key points to hit ("State your recommendation first," "Explain each option's impact," "Acknowledge what you're NOT doing," "Show you understand constraints"), and common pitfalls to avoid.
A "Ready" section at the bottom provides a microphone test button (plays back a brief audio sample to confirm the mic works), a large primary "Start Recording" button, and optional secondary actions: "View example response" (shows a strong example with annotations) and "Skip exercise" for users who want to return later.
### Recording State
When recording begins, the interface simplifies to minimize cognitive load. The exercise prompt condenses to a single line at the top, always visible for reference. A large recording indicator displays a pulsing red dot with "Recording..." text. The timer shows elapsed time against the limit: "00:34 / 01:00" in normal color, turning orange with 10 seconds remaining, and red if the time limit is exceeded.
A real-time audio visualizer occupies the center of the screen, showing a waveform or circular level meter that responds to the user's voice. This visual feedback confirms the microphone is capturing audio and helps users maintain consistent volume. Control buttons appear at the bottom: a large "Stop" button as the primary action, an optional "Pause" button, and a "Cancel" link for abandoning the recording.
When 10 seconds remain, a countdown appears ("10... 9... 8...") to help users wrap up their response. If the time limit is reached, the system automatically stops recording, ensuring consistency in timed exercises.
### Review State
After recording stops, users immediately see their performance. Audio playback controls include play/pause button, scrubbing timeline, duration display ("01:07"), and volume control. The system generates a transcript instantly in Phase 1 (mock generation), displaying the full text with timestamps every 10 seconds in a scrollable container.
An evaluation preview provides quick feedback without requiring navigation to a separate page. It shows an initial assessment ("You hit 3 of 4 key points"), lists what they included with checkmarks ("✓ Clear recommendation," "✓ Acknowledged trade-offs," "✓ Explained reasoning") and what they missed with X marks ("✗ Didn't address engineering concerns"), and displays an estimated score ("7.5/10 - not final").
Action buttons allow three paths forward: Primary button "Get Full Feedback" navigates to the complete feedback page with detailed analysis, secondary button "Record Again" returns to pre-recording state for another attempt (unlimited re-recordings allowed), and tertiary link "Save for Later" stores the recording and exits.
### Technical Implementation
Phase 1 uses browser-native capabilities to create a fully functional recording experience:
**Audio Capture: **Browser MediaRecorder API for audio capture
**Permissions: **Microphone permission handling with clear explanation of why access is needed
**Format: **WebM or MP4 depending on browser support
**Transcription: **Instant mock transcription in Phase 1 (will be replaced with Deepgram API in Phase 2)
**Visual Feedback: **Real-time audio level visualization using Web Audio API
**Auto-save: **If user closes tab during recording, attempt is saved and can be resumed
## Practice Feedback Display
The practice feedback page closes the learning loop by providing detailed analysis of the user's performance, comparing it to their meeting patterns, and recommending specific next steps. This feedback demonstrates improvement over time and connects practice exercises back to real-world application.
### Overall Assessment
The top of the feedback page displays essential context: back button to the module, exercise title ("Product Prioritization Trade-off"), attempt number if multiple recordings exist ("Attempt 2 of 3"), and date/time stamp ("Today at 2:34 PM").
A large score gauge shows performance ("7.8/10") with color-coded visualization. If this isn't the user's first attempt, an improvement indicator appears: "+0.5 from previous attempt" in green with upward arrow. A quick summary provides specific feedback: "Strong improvement! You clearly stated your recommendation and explained trade-offs. Main opportunity: address stakeholder concerns more proactively."
For users who completed the baseline assessment during onboarding, a comparison shows growth: "When you started: 6.5/10. Now: 7.8/10." A progress bar visualizes this improvement, making advancement tangible and motivating.
### Annotated Transcript
The transcript section displays the user's complete response with inline annotations highlighting key moments. Each annotation uses color-coded markers to indicate type:
Green annotations mark strong moments: "[00:00] 'I recommend we prioritize mobile checkout this quarter.' 🟢 Strong opening: Clear recommendation upfront (answer-first structure)." These reinforce effective techniques and build confidence.
Yellow annotations identify areas for improvement: "[00:15] 'The alternative is API performance work, which is important for long-term scalability.' 🟡 Acknowledgment but incomplete: You mentioned the alternative but didn't explain why you're deprioritizing it. Board members would likely ask 'Why not API?' Better approach: 'API work is crucial, but mobile gives us faster ROI. We're building technical debt, but the engineering team can manage it short-term.'"
Red annotations highlight missing elements: "[00:25] 'We'll tackle API work in Q1 next year.' 🔴 Missing: No acknowledgment of engineering team's concerns about technical debt. Bringing this up proactively shows stakeholder awareness. Add: 'Alex's team is comfortable with this plan, though they've flagged that we need to address API by Q1.'"
### Evaluation Criteria Breakdown
The feedback includes scores for each evaluation criterion specific to the exercise. For a trade-off communication exercise, the criteria might include:
**Answer-First Structure: 9.0/10 ✓**
You led with your recommendation before explaining. This keeps executives focused and demonstrates confidence.
**Data-Backed Reasoning: 8.5/10 ✓**
Strong use of specific metrics ($2M ARR, traffic patterns). Quantification builds credibility with data-driven leaders.
**Trade-off Articulation: 7.0/10 ⚠️**
You mentioned alternatives but didn't fully explore downsides. Board members would likely ask follow-up questions. Being proactive prevents this.
**Stakeholder Acknowledgment: 6.5/10 ⚠️**
Engineering concerns weren't addressed proactively. Bringing this up shows you've done your homework and understand team dynamics.
**Conciseness: 8.0/10 ✓**
Response was appropriately brief for a board meeting. Executives appreciate respect for their time.
### Comparison to Real Meetings
If the user has meeting data, the feedback includes a comparison showing how practice performance relates to real-world patterns. This section demonstrates transfer of learning from practice to application.
Example comparison: "Your Communication Patterns. In your Q4 board meeting: Answer-first: Used in 4 of 5 responses ✓, Trade-off articulation: Mentioned but incomplete (2 instances), Stakeholder acknowledgment: Delayed response to concerns. In this practice: Answer-first: ✓ Strong (improved), Trade-off articulation: ⚠️ Better but still incomplete, Stakeholder acknowledgment: Missing (focus area). 🎯 Key insight: You're improving on structure and data-backing, but trade-off exploration remains your growth area. Practice 2 more exercises in this module to build consistency."
### Expert Example Reference
A model response demonstrates Senior PM-level execution of the same exercise. Annotations explain what makes each element effective, showing users the target they're working toward. A toggle allows comparing their response side-by-side with the expert version, highlighting specific differences in structure, language, and completeness.
### Next Steps from Practice
The feedback concludes with 2-3 prioritized action items:
**Practice More: **"You're mentioning trade-offs but not fully exploring them. Try Exercise 3: 'Handling Board Questions on Trade-offs' [Start Exercise 3 →]"
**Study Best Practices: **"The expert response above shows how to proactively address concerns. Study the stakeholder acknowledgment section. [Bookmark Example →]"
**Apply in Real Work: **"Before your next board meeting, prepare trade-offs using the Option-Impact-Risk template. [Download Template →]"
# Phase 1D: Progress & Career Tracking (Week 4)
**Duration: **10-12 hours across 5 implementation slices
Phase 1D creates the progress visualization and tracking systems that demonstrate tangible career advancement. Users see their skill development over time, understand their position on the career ladder, and receive actionable insights about their learning patterns. This phase also includes settings, help documentation, mobile optimization, and final testing to ensure the complete Phase 1 experience is ready for beta user validation.
## Progress Dashboard
The progress dashboard serves as the central hub for understanding career development, visualizing skill growth, and tracking learning activities. Unlike the main dashboard which emphasizes current actions, the progress dashboard focuses on historical trends and forward momentum.
### Career Level Progress Visualization
The most prominent element at the top of the page shows the user's journey from current to target level. A horizontal progress bar spans the width of the content area, with their current level ("Product Manager") on the left and target level ("Senior PM") on the right. A marker at 65% position indicates their current progress, with the number prominently displayed: "Speaking at Senior PM level in 65% of responses."
Below the progress bar, a breakdown shows progress across four skill dimensions:
✓ Product Sense: 100% - Already at Senior PM level
✓ Technical Translation: 95% - Nearly consistent
⚠️ Communication: 70% - Improving steadily
⚠️ Stakeholder Management: 60% - Focus area
This granular view helps users understand exactly which skills are holding back their progression. A trend indicator shows movement over the past month: "↑ +12% this month" in green. The next milestone provides a concrete near-term goal: "Reach 75% by completing Trade-off module and applying in next 2 board meetings."
### Skill Radar Chart
A multi-dimensional radar chart visualizes the user's current skill profile across five dimensions: Product Sense (8.2/10), Communication (7.5/10), Stakeholder Management (7.0/10), Technical Translation (8.0/10), and Trade-off Articulation (6.8/10). Three overlaid shapes provide comparative context:
**Solid Line (Blue): **Current skill levels
**Dotted Line (Gray): **Levels 30 days ago, showing growth trajectory
**Dashed Line (Green): **Target level benchmark (Senior PM), indicating where they need to be
This visualization makes improvement instantly visible—the gap between current and 30-days-ago demonstrates growth, while the gap between current and target shows remaining work. Hovering over any point reveals exact scores and change amounts.
### Performance Trends
Two side-by-side line charts show performance over time:
**Chart 1: Meeting Performance Over Time**
Displays overall scores from the last 10 meetings on a line chart. X-axis shows meeting dates, Y-axis shows scores from 0-10. A trend line indicates whether performance is improving, stable, or declining. Annotations mark notable meetings: "Q4 Board Meeting - 7.5" appears as a dot on the line with a label. Users can hover over any point to see the meeting title, date, and score, then click to navigate to that meeting's detail page.
**Chart 2: Practice Performance Over Time**
Shows scores from all practice attempts with similar visual treatment. This chart demonstrates the learning curve—typically starting lower than meeting performance but improving rapidly as users internalize frameworks. Comparing the two charts reveals whether practice is translating to meeting improvement, a key validation of the learning system's effectiveness.
### Module Completion Tracking
The dashboard displays learning progress organized into three categories:
**Completed Modules**
Lists finished modules with completion date and best score achieved:
✓ Answer-First Structure - Completed Oct 28 - Score: 8.5
✓ Data-Backed Reasoning - Completed Oct 30 - Score: 9.0
✓ Executive Communication - Completed Nov 1 - Score: 7.8
**In Progress Modules**
Shows modules currently being worked on with completion percentage and current score:
⏳ Trade-off Communication - 60% complete - Current: 7.2
⏳ Stakeholder Acknowledgment - 30% complete - Current: 6.8
**Recommended Modules**
Displays suggested modules not yet started with impact level:
📌 Handling Board Objections - Not started - High impact
📌 Technical Feasibility - Not started - Medium impact
📌 Saying No Gracefully - Not started - Medium impact
### Recent Highlights
A "This Week's Highlights" section automatically generates notable achievements and concerns:
🎉 First Senior PM-level score on Trade-off Communication (8.5): In your planning meeting, you proactively addressed engineering concerns. This is a breakthrough for you. [View meeting →]
✓ Consistency improving: 4 of 5 meetings this week showed answer-first structure (up from 60% last week)
✓ Completed 3 practice exercises: You're building the habit. Keep it up!
⚠️ Stakeholder Management dropped slightly: Last 2 meetings showed delayed acknowledgment of concerns. This might be stress-related. Try the 'Active Listening' module.
### Weekly Insights
AI-generated analysis synthesizes patterns across the past week:
**Strengths:**
"Your data-backed reasoning continues to be exceptional. Every recommendation you made this week included specific metrics. This is Senior PM level and should be maintained."
**Improvement Area:**
"Trade-off articulation is your current growth edge. You're mentioning alternatives but not fully exploring constraints. This appeared in 3 of 4 meetings."
**Recommendation:**
"Complete the Trade-off Communication module (60% done) and practice Exercise 4-5 before your next board meeting. This skill is critical for your PM → Senior PM transition."
**Meeting-to-Practice Connection:**
"You practiced stakeholder acknowledgment on Tuesday, then successfully applied it in Wednesday's planning meeting. This is excellent transfer of learning. Keep practicing before high-stakes meetings."
### Date Range Control
A date range selector in the header allows viewing progress over different timeframes: Last 7 days, Last 30 days (default), Last 90 days, or All time. Changing this range updates all charts, statistics, and insights to reflect the selected period, helping users zoom in on recent changes or zoom out to see long-term trends.
# Phase 1 Completion & Validation
The completion of Phase 1 marks a critical milestone: a fully functional user experience ready for validation by beta users. The final week of Phase 1 focuses on polish, testing, and preparing the product for meaningful user feedback.
## Remaining Implementation Slices
Four additional slices complete the Phase 1 experience:
**Slice 12: Settings & Preferences (3 hours)**
Implements user profile editing (name, email, role, career goals), notification preferences (email notifications for new insights, weekly summaries, module recommendations), privacy settings (data retention, meeting history visibility, practice recording storage), and account management (password change, account deletion with confirmation). Settings use consistent form patterns established earlier in the project and respect the design system.
**Slice 13: Help & Onboarding Tours (2 hours)**
Creates in-app help documentation covering core features, interactive product tours using tooltips and highlights that guide new users through key workflows, contextual tooltips appearing on first use of features, and an FAQ section addressing common questions about bot discretion, career progression framework, and learning methodology. Help content uses the same clear, friendly tone established throughout the product.
**Slice 14: Mobile Responsive Polish (3 hours)**
Optimizes all pages for mobile devices, ensuring touch-friendly interactions (larger tap targets, appropriate spacing), mobile navigation patterns (sidebar collapses to bottom navigation, simplified header), performance optimization on mobile networks (lazy loading, optimized images), and testing across different device sizes and orientations. The two-column layouts become single-column stacks, tables become scrollable cards, and all forms remain fully functional on small screens.
**Slice 15: Testing & Bug Fixes (2-3 hours)**
Conducts cross-browser testing (Chrome, Safari, Firefox, Edge), addresses edge cases and error states throughout the application, implements performance optimizations for smooth interactions, and completes final QA ensuring all acceptance criteria from Slices 1-14 are met. This slice includes creating a comprehensive test checklist covering every major user flow and interaction pattern.
## Beta Validation Objectives
Upon completion of Phase 1, the product is ready for validation with 10 beta Product Managers. The validation process focuses on qualitative feedback rather than technical functionality, since all features operate on mock data.
### Key Validation Questions
Beta users will help answer critical product questions:
**Onboarding & First Impressions**
Does the two-path onboarding clearly communicate the value proposition?
Do users understand the bot discretion differentiator?
Is the career progression framework motivating and clear?
**Meeting Intelligence**
Does the feedback feel accurate and actionable?
Are the key moments correctly identified?
Do the next steps provide clear guidance?
Is the transcript interface easy to navigate?
**Learning & Practice**
Are module recommendations well-targeted to their gaps?
Is the practice recording interface comfortable to use?
Does practice feedback help them improve?
Do they feel motivated to complete exercises?
**Progress & Career Tracking**
Can they understand their current position and trajectory?
Does the career level visualization resonate?
Are the insights meaningful and actionable?
**Overall Value**
Would they use this product with their real meetings?
What's the strongest value proposition?
What features or flows feel confusing or unnecessary?
What's missing that would make this a must-have product?
## Success Criteria for Phase 1
Phase 1 is considered successful when:
All 15 slices are implemented with acceptance criteria met
The complete user journey from signup through onboarding, meeting analysis, learning modules, practice exercises, and progress tracking is functional with mock data
10 mock meetings with varied types, participants, and scores are available for exploration
15-20 learning modules with practice exercises are accessible and completable
The application is responsive and functional on mobile devices
Cross-browser compatibility is verified (Chrome, Safari, Firefox)
Beta users can click through every feature without encountering dead ends or error states
User feedback confirms the product solves a real problem for Product Managers
Clear product priorities for Phase 2 emerge from user feedback
## Transition to Phase 2
Following successful validation, Phase 2 will replace mock data with real integrations while preserving the validated user experience:
**Backend Infrastructure**
Supabase database for user data, meetings, transcripts, exercises, and progress
Authentication system replacing mock localStorage implementation
API routes for data operations currently handled by mock functions
**Meeting Intelligence Integration**
Calendar integration (Zoom, Google Meet, Microsoft Teams)
Bot deployment and meeting joining logic
Deepgram for real-time transcription
OpenAI API for meeting analysis and feedback generation
**Practice System Integration**
Audio storage for practice recordings
Deepgram transcription for practice responses
OpenAI analysis for practice feedback generation
The frontend-first methodology ensures that Phase 2 development focuses purely on infrastructure connections rather than UX iteration, significantly reducing the risk of rework and accelerating the path to a production-ready product.
# Appendix: Core Data Structures
This appendix documents the key data structures that underpin the ShipSpeak platform. Phase 1 implements these as TypeScript interfaces with mock data generation. Phase 2 will map these same structures to Supabase database tables and API responses.
## User & Profile
interface User {
  id: string;
  email: string;
  name: string;
  current_role: 'product_owner' | 'product_manager' | 
    'senior_pm' | 'group_pm' | 'director';
  target_role: string;
  timeline_months: number;
  focus_areas: string[];
  onboarding_path: 'analyze_meetings' | 'start_practicing';
  created_at: string;
}
## Meeting Data
interface Meeting {
  id: string;
  user_id: string;
  title: string;
  date: string;
  duration_minutes: number;
  meeting_type: 'board_meeting' | 'team_meeting' | 
    'one_on_one' | 'customer_call' | 'planning';
  participants: Participant[];
  preliminary_scores: DimensionScores;
  score_trend: number;
  key_moments_count: number;
  has_transcript: boolean;
  has_feedback: boolean;
  tags: string[];
}
## Transcript Segment
interface TranscriptSegment {
  id: string;
  meeting_id: string;
  speaker: {
    id: string;
    name: string;
    role: string;
    is_user: boolean;
  };
  text: string;
  timestamp: string;
  timestamp_seconds: number;
  duration_seconds: number;
  key_moment?: {
    type: 'strength' | 'improvement' | 'missed_opportunity';
    feedback: string;
    related_skill: string;
  };
}
## Meeting Feedback
interface MeetingFeedback {
  meeting_id: string;
  overall_score: number;
  trend: number;
  summary: string;
  career_assessment: CareerAssessment;
  dimension_scores: {
    product_sense: DimensionScore;
    communication: DimensionScore;
    stakeholder_management: DimensionScore;
    technical_translation: DimensionScore;
  };
  patterns: {
    strengths: Pattern[];
    improvements: Pattern[];
    missed_opportunities: Pattern[];
  };
  key_moments: KeyMoment[];
  recommended_modules: RecommendedModule[];
  next_steps: NextStep[];
}
## Learning Module
interface Module {
  id: string;
  title: string;
  category: 'product_sense' | 'communication' | 
    'stakeholder_mgmt' | 'technical_translation' | 
    'tradeoff_articulation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_minutes: number;
  impact_for_user: 'high' | 'medium' | 'low';
  relevance_score: number;
  recommendation_reason?: {
    personalized_message: string;
    related_meeting_id?: string;
    gap_identified: string;
  };
  what_you_learn: string[];
  career_level_tags: string[];
  exercises: Exercise[];
  user_progress: {
    status: 'not_started' | 'in_progress' | 'completed';
    completion_percentage: number;
  };
}
## Practice Exercise
interface Exercise {
  id: string;
  module_id: string;
  order: number;
  title: string;
  format: 'timed_response' | 'scenario_based' | 
    'compare_improve';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_minutes: number;
  prompt: {
    scenario: string;
    context: string;
    task: string;
    constraints?: string[];
  };
  time_limit_seconds?: number;
  evaluation_criteria: string[];
  user_completion: {
    status: 'not_started' | 'in_progress' | 'completed';
    attempts: number;
    best_score?: number;
  };
}
## Progress Data
interface UserProgress {
  user_id: string;
  current_role: string;
  target_role: string;
  career_progress: {
    overall_percentage: number;
    consistency_at_target_level: number;
    trend_last_30_days: number;
    skill_breakdown: SkillProgress[];
  };
  skill_scores: {
    skill: string;
    current: number;
    thirty_days_ago: number;
    target_benchmark: number;
  }[];
  meeting_performance: MeetingPerformance[];
  practice_performance: PracticePerformance[];
  recent_highlights: Highlight[];
  weekly_insights: WeeklyInsights;
}
# Document Conclusion
This Integration Contract provides comprehensive specifications for ShipSpeak Phase 1, detailing every feature, component, interaction, and data structure necessary to build a complete frontend experience with mock data. The document is designed to be descriptive rather than prescriptive, explaining what needs to be built and why, while leaving implementation details flexible.
## Using This Document
Development teams should use this contract as the authoritative source for feature specifications. The detailed descriptions of user interfaces, data structures, and interaction patterns ensure consistency across all implementation slices. When questions arise about feature behavior or edge cases, the contract provides context for making informed decisions that align with the product vision.
## Phase 1 Success Metrics
The success of Phase 1 will be measured by:
**Implementation Completeness: **All 15 slices delivered with acceptance criteria met
**User Experience Quality: **Beta users can navigate the entire product without confusion or friction
**Value Validation: **Product Managers confirm the platform addresses a real career development need
**Differentiation Clarity: **Users understand and appreciate the bot discretion differentiator
**Learning System Validation: **The connection between meeting analysis, module recommendations, and practice exercises feels cohesive
**Phase 2 Readiness: **Clear priorities established for which features to integrate with real backends first
## Next Steps
Upon approval of this Integration Contract, development can begin immediately using the slice-based implementation methodology. Each slice represents 4-8 hours of focused work with clear deliverables and acceptance criteria. The granular breakdown enables efficient parallel development and precise progress tracking.
Accompanying this contract, detailed Slice Prompts will provide even more granular implementation guidance for each of the 15 slices. These prompts will include step-by-step build instructions, component hierarchies, mock data generation logic, and specific code considerations while maintaining the descriptive rather than prescriptive approach.
The culmination of Phase 1 will be a production-quality user experience that validates ShipSpeak's value proposition before significant infrastructure investment, de-risking the product development process and ensuring that Phase 2 development builds on validated user needs.
*— End of Integration Contract —*
