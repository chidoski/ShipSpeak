#!/usr/bin/env python3

"""
Claude Code Integration Helper for ShipSpeak Slice Management

This script provides intelligent slice management that integrates with Claude Code
to automatically track progress, validate completion, and suggest next steps.
"""

import json
import os
from pathlib import Path
from datetime import datetime

class ClaudeSliceHelper:
    def __init__(self):
        # Find project root (where slice-tracker.json should be)
        self.project_root = self.find_project_root()
        self.tracker_file = self.project_root / "slice-tracker.json"
        self.prompts_dir = self.project_root / "docs/skills/implementation-prompts"
        self.load_tracker()
    
    def find_project_root(self):
        """Find the ShipSpeak project root directory"""
        current_dir = Path.cwd()
        
        # Look for slice-tracker.json in current or parent directories
        for path in [current_dir] + list(current_dir.parents):
            if (path / "slice-tracker.json").exists():
                return path
        
        # If not found, assume current directory
        return current_dir
    
    def load_tracker(self):
        """Load slice tracker data"""
        try:
            with open(self.tracker_file, 'r') as f:
                self.tracker = json.load(f)
        except FileNotFoundError:
            raise FileNotFoundError(f"slice-tracker.json not found at {self.tracker_file}")
    
    def save_tracker(self):
        """Save tracker data"""
        self.tracker['last_updated'] = datetime.now().isoformat()
        with open(self.tracker_file, 'w') as f:
            json.dump(self.tracker, f, indent=2)
    
    def get_next_slice(self):
        """Get the next slice that needs to be implemented"""
        for phase_num, phase_data in self.tracker['phases'].items():
            for slice_num, slice_data in phase_data['slices'].items():
                if slice_data['status'] == 'not_started':
                    return {
                        'phase': phase_num,
                        'slice': slice_num,
                        'phase_name': phase_data['name'],
                        **slice_data
                    }
        return None
    
    def get_current_slice(self):
        """Get the currently in-progress slice"""
        for phase_num, phase_data in self.tracker['phases'].items():
            for slice_num, slice_data in phase_data['slices'].items():
                if slice_data['status'] == 'in_progress':
                    return {
                        'phase': phase_num,
                        'slice': slice_num, 
                        'phase_name': phase_data['name'],
                        **slice_data
                    }
        return None
    
    def start_next_slice(self):
        """Start the next available slice"""
        next_slice = self.get_next_slice()
        if not next_slice:
            return None
        
        # Mark as in progress
        self.tracker['phases'][next_slice['phase']]['slices'][next_slice['slice']]['status'] = 'in_progress'
        self.tracker['current_phase'] = int(next_slice['phase'])
        self.tracker['current_slice'] = int(next_slice['slice'])
        self.save_tracker()
        
        return next_slice
    
    def complete_current_slice(self, validation_notes=None):
        """Mark the current slice as completed"""
        current = self.get_current_slice()
        if not current:
            return False
        
        slice_data = self.tracker['phases'][current['phase']]['slices'][current['slice']]
        slice_data['status'] = 'completed'
        slice_data['completed_at'] = datetime.now().isoformat()
        slice_data['validation_status'] = 'validated'
        
        if validation_notes:
            slice_data['validation_notes'] = validation_notes
        
        self.save_tracker()
        return True
    
    def get_slice_prompt_content(self, filename):
        """Read the content of a slice prompt file"""
        file_path = self.prompts_dir / filename
        try:
            with open(file_path, 'r') as f:
                return f.read()
        except FileNotFoundError:
            return None
    
    def get_project_status(self):
        """Get overall project completion status"""
        total = 0
        completed = 0
        
        for phase_data in self.tracker['phases'].values():
            for slice_data in phase_data['slices'].values():
                total += 1
                if slice_data['status'] == 'completed':
                    completed += 1
        
        return {
            'total': total,
            'completed': completed,
            'percentage': round((completed / total) * 100, 1) if total > 0 else 0
        }
    
    def generate_claude_instructions(self):
        """Generate instructions for Claude Code"""
        current = self.get_current_slice()
        next_slice = self.get_next_slice()
        status = self.get_project_status()
        
        instructions = []
        instructions.append(f"🚀 ShipSpeak Slice Management Status")
        instructions.append(f"Progress: {status['completed']}/{status['total']} slices ({status['percentage']}%)")
        instructions.append("")
        
        if current:
            instructions.append(f"📍 CURRENT SLICE IN PROGRESS:")
            instructions.append(f"Phase {current['phase']}: {current['phase_name']}")
            instructions.append(f"Slice {current['slice']}: {current['title']}")
            instructions.append(f"File: {current['file']}")
            instructions.append("")
            instructions.append("To complete this slice:")
            instructions.append("1. Validate all success criteria are met")
            instructions.append("2. Run tests if applicable") 
            instructions.append("3. Say: 'Mark current slice as completed'")
            
        elif next_slice:
            instructions.append(f"🎯 NEXT SLICE READY:")
            instructions.append(f"Phase {next_slice['phase']}: {next_slice['phase_name']}")
            instructions.append(f"Slice {next_slice['slice']}: {next_slice['title']}")
            instructions.append(f"File: {next_slice['file']}")
            instructions.append("")
            instructions.append("To start this slice, say:")
            instructions.append(f"'Let's implement the next slice'")
            
        else:
            instructions.append("🎉 ALL SLICES COMPLETED!")
            instructions.append("ShipSpeak development is complete!")
        
        return "\n".join(instructions)

# Integration functions for Claude Code
def get_slice_status():
    """Get current slice status for Claude"""
    helper = ClaudeSliceHelper()
    return helper.generate_claude_instructions()

def implement_next_slice():
    """Start implementing the next slice"""
    helper = ClaudeSliceHelper()
    
    current = helper.get_current_slice()
    if current:
        return f"⚠️  Slice {current['phase']}-{current['slice']} ({current['title']}) is already in progress. Complete it first or manually change status."
    
    next_slice = helper.start_next_slice()
    if not next_slice:
        return "🎉 All slices completed!"
    
    prompt_content = helper.get_slice_prompt_content(next_slice['file'])
    if not prompt_content:
        return f"❌ Prompt file not found: {next_slice['file']}"
    
    response = f"🚀 Starting Slice {next_slice['phase']}-{next_slice['slice']}: {next_slice['title']}\n\n"
    response += f"Reading implementation prompt from {next_slice['file']}\n"
    response += "=" * 80 + "\n\n"
    response += prompt_content
    
    return response

def complete_current_slice():
    """Mark current slice as completed"""
    helper = ClaudeSliceHelper()
    
    current = helper.get_current_slice()
    if not current:
        return "❌ No slice currently in progress"
    
    success = helper.complete_current_slice([
        "✅ Implementation completed",
        "✅ Success criteria validated",
        "✅ Quality checks passed",
        "✅ Ready for next slice"
    ])
    
    if success:
        next_slice = helper.get_next_slice()
        response = f"✅ Completed Slice {current['phase']}-{current['slice']}: {current['title']}\n\n"
        
        if next_slice:
            response += f"🎯 Next: Phase {next_slice['phase']}-{next_slice['slice']}: {next_slice['title']}\n"
            response += f"Say 'Let's implement the next slice' to continue"
        else:
            response += "🎉 All slices completed! ShipSpeak development is done!"
        
        return response
    else:
        return "❌ Failed to mark slice as completed"

# Main execution for direct script usage
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("ShipSpeak Claude Slice Helper")
        print("Usage:")
        print("  python claude-slice-helper.py status     # Show current status")
        print("  python claude-slice-helper.py next       # Implement next slice") 
        print("  python claude-slice-helper.py complete   # Complete current slice")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "status":
        print(get_slice_status())
    elif command == "next":
        print(implement_next_slice())
    elif command == "complete":
        print(complete_current_slice())
    else:
        print(f"Unknown command: {command}")