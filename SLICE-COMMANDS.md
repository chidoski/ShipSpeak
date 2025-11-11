# ShipSpeak Slice Management Commands

Use these simple commands in Claude Code to manage slice development:

## Core Commands

### `slice status`
Shows current project progress and next slice to implement

### `let's implement the next slice`
Automatically reads and implements the next slice prompt

### `mark current slice as completed`
Marks the current slice as completed after validation

## Smart Workflow

The system automatically:
- ✅ **Tracks Progress**: Knows which slices are done/in-progress/pending
- ✅ **Validates Completion**: Checks success criteria before marking complete
- ✅ **Suggests Next Steps**: Always knows what to do next
- ✅ **Prevents Duplicates**: Won't let you start a slice that's already done
- ✅ **Maintains State**: Remembers where you left off

## Example Workflow

```
User: "slice status"
Claude: Shows Phase 1, Slice 1 is ready

User: "let's implement the next slice" 
Claude: Reads phase1-slice1-1-foundation-prompt.md and implements it

User: "mark current slice as completed"
Claude: Validates completion, marks done, shows Phase 1, Slice 2 is next

User: "let's implement the next slice"
Claude: Reads phase1-slice1-2-authentication-prompt.md and implements it
```

## Implementation Details

- **Slice Tracker**: `slice-tracker.json` maintains state
- **Prompt Directory**: `docs/skills/implementation-prompts/`
- **Validation**: Each slice has success criteria that must be met
- **Progress**: 33 total slices across 3 phases

## Phase Overview

- **Phase 1**: Frontend Foundation (15 slices)
- **Phase 2**: Backend Infrastructure (10 slices)  
- **Phase 3**: AI Integration (8 slices)

Total: 33 slices for complete ShipSpeak implementation