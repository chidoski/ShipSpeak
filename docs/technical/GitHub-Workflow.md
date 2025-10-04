# GitHub Workflow Guide
## ShipSpeak Development Process

**Last Updated:** October 2025  
**Purpose:** Clear workflow for solo development with AI assistance

---

## 🎯 **The Team**

- **You** = The developer
- **Claude Code** = Your coding partner (in Cursor terminal)
- **Cursor AI Assistant** = Your GitHub manager (handles all Git operations)

---

## 🚀 **Feature Development Workflow**

### **For New Features (Major Development)**

#### **Step 1: Tell Cursor AI Assistant about your feature**
```
"Hey Cursor AI Assistant, I'm working on a new feature: [feature name]"
```

#### **Step 2: Cursor AI Assistant creates the branch**
```
I'll run: git checkout -b feature/[feature-name]
And confirm: "✅ Created feature branch: feature/[feature-name]"
```

#### **Step 3: You work with Claude Code**
```
"Hey Claude Code, please switch to the feature/[feature-name] branch"
[Then develop normally with Claude Code]
```

#### **Step 4: Tell Cursor AI Assistant to sync**
```
"Please sync my feature branch"
```

#### **Step 5: When feature is complete**
```
"Please merge my feature branch to main"
```

### **For Small Changes (Bug fixes, docs, config)**

#### **Step 1: Work directly on main branch**
```
[Just work normally with Claude Code on main branch]
```

#### **Step 2: Tell Cursor AI Assistant to sync**
```
"Please sync my changes to GitHub"
```

---

## 📝 **Real Examples**

### **Example 1: Chrome Extension Feature**
```
You: "Hey Cursor AI Assistant, I'm working on a new feature: chrome-extension"
Cursor AI: "✅ Created feature branch: feature/chrome-extension"
You: "Hey Claude Code, please switch to the feature/chrome-extension branch"
[Develop with Claude Code]
You: "Please sync my feature branch"
You: [when done] "Please merge my feature branch to main"
```

### **Example 2: Voice Coach Feature**
```
You: "Hey Cursor AI Assistant, I'm working on a new feature: voice-coach"
Cursor AI: "✅ Created feature branch: feature/voice-coach"
You: "Hey Claude Code, please switch to the feature/voice-coach branch"
[Develop with Claude Code]
You: "Please sync my feature branch"
You: [when done] "Please merge my feature branch to main"
```

### **Example 3: Small Fix (No Branch Needed)**
```
You: [just work on main branch with Claude Code]
You: "Please sync my changes to GitHub"
```

---

## 🤔 **When to Use Each Approach**

### **Use Feature Branches For:**
- ✅ New major features (Chrome extension, Voice Coach, etc.)
- ✅ Features that might need rollback
- ✅ Features you want to keep separate until complete
- ✅ Experimental features
- ✅ Features that might conflict with main

### **Use Main Branch For:**
- ✅ Small bug fixes
- ✅ Documentation updates
- ✅ Configuration changes
- ✅ Quick improvements
- ✅ Hotfixes

---

## 🛠️ **Available Commands**

### **Branch Management:**
- `"Create a feature branch for [name]"` - Creates new feature branch
- `"Please sync my feature branch"` - Pushes feature branch to GitHub
- `"Please merge my feature branch to main"` - Merges feature to main

### **General Sync:**
- `"Please sync my changes to GitHub"` - Pushes main branch changes
- `"Please pull any updates from GitHub"` - Pulls latest changes
- `"Please check if there are conflicts"` - Checks for merge conflicts

### **Status Checking:**
- `"What's my current git status?"` - Shows current branch and changes
- `"Show me recent commits"` - Displays recent commit history

---

## 🛡️ **Safety Features**

- **Automatic structure validation** - Ensures files stay in the right directories
- **Conflict resolution** - Handles any merge conflicts safely
- **Backup protection** - Never force-push without checking first
- **Status monitoring** - Checks your local changes before syncing
- **Branch verification** - Confirms you're on the right branch before operations

---

## 🆘 **Troubleshooting**

### **If Something Goes Wrong:**
Just tell Cursor AI Assistant what happened:
- "GitHub looks wrong again"
- "I can't push my changes"
- "There are merge conflicts"
- "I'm on the wrong branch"

### **Common Issues:**
- **Wrong branch**: "Please switch me to the correct branch"
- **Merge conflicts**: "Please resolve the merge conflicts"
- **Structure issues**: "Please fix the directory structure"

---

## 📋 **Quick Reference**

### **Starting a New Feature:**
1. Tell Cursor AI Assistant: "I'm working on a new feature: [name]"
2. Tell Claude Code: "Switch to the feature/[name] branch"
3. Develop with Claude Code
4. Tell Cursor AI Assistant: "Please sync my feature branch"
5. When done: "Please merge my feature branch to main"

### **Making Small Changes:**
1. Work with Claude Code on main branch
2. Tell Cursor AI Assistant: "Please sync my changes to GitHub"

### **Checking Status:**
1. Tell Cursor AI Assistant: "What's my current git status?"
2. Or run: `./scripts/git-status.sh`

---

## 🎯 **Best Practices**

- **Always commit frequently** - Don't wait until the end
- **Use descriptive commit messages** - "Add user authentication" not "fix stuff"
- **Test before syncing** - Make sure your code works locally
- **Ask for help** - If something seems wrong, just ask
- **Keep branches focused** - One feature per branch

---

*This workflow ensures smooth development while preventing the GitHub structure issues we've experienced. The key is clear communication between you, Claude Code, and Cursor AI Assistant.*
