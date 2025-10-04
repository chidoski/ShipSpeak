# ShipSpeak Development Workflow

## 🎯 Division of Labor

### You (Claude Code) - Development
- ✅ **Edit files** in `/Volumes/Extreme Pro/Programming/Python/Portfolio-Projects/01-web-applications/shipspeak/`
- ✅ **Add new features** and make changes
- ✅ **Test your code** locally
- ✅ **Commit changes** when ready: `git add . && git commit -m "your message"`

### Me (Claude) - GitHub Management
- ✅ **Handle all GitHub sync** operations
- ✅ **Prevent structure issues** like the one we just fixed
- ✅ **Resolve conflicts** safely
- ✅ **Maintain proper directory nesting**

## 🚀 How to Develop Features

### For Simple Features (Most Common)
1. **Develop on main branch** - just work normally
2. **Commit changes**: `git add . && git commit -m "Add feature X"`
3. **Tell me**: "Please sync my changes to GitHub"

### For Complex Features (Major features)
1. **Create feature branch**: `./scripts/create-feature.sh "feature-name"`
2. **Develop on the branch** - work normally
3. **Commit changes**: `git add . && git commit -m "Add feature X"`
4. **Tell me**: "Please sync my feature branch"
5. **When done**: "Please merge my feature branch to main"

## 🔄 How to Sync with GitHub

### Option 1: Simple Request
Just tell me: **"Please sync my changes to GitHub"**

### Option 2: Check Status First
Run the status checker:
```bash
./scripts/git-status.sh
```

### Option 3: Specific Instructions
Tell me what you want to do:
- "Please push my latest changes"
- "Please pull any updates from GitHub"
- "Please check if there are conflicts"
- "Please create a feature branch for [name]"
- "Please merge my feature branch to main"

## 🛡️ Safety Features

- **Automatic structure validation** - I'll ensure files stay in the right directories
- **Conflict resolution** - I'll handle any merge conflicts safely
- **Backup protection** - I'll never force-push without checking first
- **Status monitoring** - I can check your local changes before syncing

## 📝 Example Workflow

1. **You**: Make changes to ShipSpeak code
2. **You**: Commit locally: `git add . && git commit -m "Add new feature"`
3. **You**: Tell me: "Please sync my changes to GitHub"
4. **Me**: Check status, resolve any issues, push safely
5. **Me**: Confirm: "✅ Changes synced successfully!"

## ⚠️ What to Avoid

- ❌ Don't run `git push` directly (let me handle it)
- ❌ Don't run `git pull` if there are conflicts (I'll resolve them)
- ❌ Don't worry about GitHub structure (I'll maintain it)

## 🆘 If Something Goes Wrong

Just tell me what happened and I'll fix it:
- "GitHub looks wrong again"
- "I can't push my changes"
- "There are merge conflicts"

I'll diagnose and fix the issue safely!
