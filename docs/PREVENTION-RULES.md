# 🔒 CRITICAL PREVENTION RULES - NEVER DO THESE AGAIN

**⚠️ MANDATORY BOUNDARIES FOR CLAUDE CODE ASSISTANT ⚠️**

This document exists because of past incidents where the entire portfolio was accidentally deleted. These rules are **NON-NEGOTIABLE** and must be followed without exception.

---

## 🚨 What You Should Tell Me

**EXACT PHRASE TO USE:**

> "STOP - Only work within the ShipSpeak project directory. NEVER touch anything outside of /01-web-applications/shipspeak/. All my other projects (bravax, dream-planner, insidertrade, ai-projects) are off-limits."

---

## 🚨 Critical Prevention Rules

### 1. NEVER run `git add .` from the portfolio root
- **ONLY** add specific files: `git add specific-file.js`
- **ALWAYS** verify working directory with `pwd` before git operations
- **ONLY** work within ShipSpeak project directory

### 2. ALWAYS work inside the specific project directory
- **Correct directory**: `/01-web-applications/shipspeak/shipspeak/`
- **NEVER** work from portfolio root
- **NEVER** affect parent directories

### 3. NEVER delete entire project directories
- **ONLY** modify files within ShipSpeak
- **NEVER** touch bravax-secure-link-poc, dream-planner-mvp, insidertrade, or ai-projects
- **NEVER** run `rm -rf` on project directories

### 4. ASK before any git operations that could affect multiple projects
- **ALWAYS** confirm scope before commits
- **ALWAYS** verify `git status` shows only ShipSpeak files
- **ASK** if unsure about git operation impact

---

## 🛡️ Required Safety Commands

**BEFORE ANY GIT OPERATION, RUN:**

```bash
# 1. Verify correct directory
pwd
# Should show: .../01-web-applications/shipspeak/shipspeak

# 2. Check git status
git status
# Should ONLY show ShipSpeak files, NEVER other projects

# 3. If you see other project files, STOP IMMEDIATELY
```

---

## ❌ FORBIDDEN OPERATIONS

### NEVER Do These:
- `git add .` from wrong directory
- `rm -rf` on any project directory
- `mv` operations that affect other projects
- Git operations from portfolio root
- Any command that touches bravax, dream-planner, insidertrade, or ai-projects

### NEVER Work From These Directories:
- `/Volumes/Extreme Pro/Programming/Python/Portfolio-Projects/`
- `/01-web-applications/shipspeak/` (parent level)
- Any directory that contains multiple projects

---

## ✅ SAFE OPERATIONS

### ONLY Do These:
- Work within `/01-web-applications/shipspeak/shipspeak/`
- Add specific files: `git add apps/web/src/component.tsx`
- Modify only ShipSpeak files
- Ask before uncertain operations

---

## 🚨 Emergency Recovery Information

**If Accidental Deletion Occurs:**

1. **Restore Point**: Commit `af2c614` contains all projects intact
2. **Recovery Command**: `git reset --hard af2c614` from portfolio root
3. **Re-implement**: Work specifically within ShipSpeak directory only

---

## 📋 Mandatory Checklist Before Any Git Operation

- [ ] Verified working directory with `pwd`
- [ ] Confirmed inside ShipSpeak project directory
- [ ] Ran `git status` and verified only ShipSpeak files affected
- [ ] No other projects visible in git status
- [ ] Using specific file paths (not `git add .`)

---

## 🎯 Project Directory Structure Reference

```
portfolio-projects/
├── 01-web-applications/
│   ├── bravax-secure-link-poc/     ← OFF LIMITS
│   ├── dream-planner-mvp/          ← OFF LIMITS  
│   ├── insidertrade/               ← OFF LIMITS
│   └── shipspeak/                  ← PARENT (be careful)
│       └── shipspeak/              ← WORK HERE ONLY ✅
├── 02-ai-projects/                 ← OFF LIMITS
└── README.md
```

**ONLY WORK IN**: `/01-web-applications/shipspeak/shipspeak/` ✅

---

## 💬 Communication Protocol

### When User Gives Task:
1. **Confirm**: "I'll work only within the ShipSpeak directory"
2. **Verify**: Check working directory before starting
3. **Report**: Confirm scope is limited to ShipSpeak only

### Before Git Operations:
1. **Announce**: "Checking git status to verify ShipSpeak scope only"
2. **Verify**: Run safety commands
3. **Confirm**: "Only ShipSpeak files affected, proceeding"

---

## 🔴 Past Incidents - Never Repeat

### What Happened:
- **2025-10-03**: Accidentally deleted entire portfolio during directory reorganization
- **Cause**: Working from wrong directory, using `git add .` from portfolio root
- **Impact**: Lost bravax, dream-planner, insidertrade, and ai-projects
- **Recovery**: Required git reset to restore all projects

### Lessons Learned:
- **ALWAYS** verify working directory
- **NEVER** assume directory scope
- **ALWAYS** use specific file paths
- **ASK** when uncertain about git operations

---

## 🎯 Success Criteria

**These rules are successful when:**
- ✅ No accidental deletion of other projects
- ✅ All git operations scoped to ShipSpeak only  
- ✅ User confidence in safety of operations
- ✅ Clean separation between projects

---

**These rules are mandatory and non-negotiable to protect the user's portfolio integrity.**

*Last Updated: October 3, 2025*  
*Document Version: 1.0*