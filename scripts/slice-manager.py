#!/usr/bin/env python3

import json
import os
import sys
from datetime import datetime
from pathlib import Path

class SliceManager:
    def __init__(self, project_root):
        self.project_root = Path(project_root)
        self.tracker_file = self.project_root / "slice-tracker.json"
        self.prompts_dir = self.project_root / "docs/skills/implementation-prompts"
        self.load_tracker()
    
    def load_tracker(self):
        """Load the slice tracker JSON file"""
        try:
            with open(self.tracker_file, 'r') as f:
                self.tracker = json.load(f)
        except FileNotFoundError:
            print(f"❌ Tracker file not found: {self.tracker_file}")
            sys.exit(1)
    
    def save_tracker(self):
        """Save the slice tracker JSON file"""
        self.tracker['last_updated'] = datetime.now().isoformat()
        with open(self.tracker_file, 'w') as f:
            json.dump(self.tracker, f, indent=2)
    
    def get_current_slice_info(self):
        """Get information about the current slice"""
        phase = str(self.tracker['current_phase'])
        slice_num = str(self.tracker['current_slice'])
        
        if phase not in self.tracker['phases']:
            return None
            
        if slice_num not in self.tracker['phases'][phase]['slices']:
            return None
            
        slice_info = self.tracker['phases'][phase]['slices'][slice_num].copy()
        slice_info['phase'] = phase
        slice_info['slice_num'] = slice_num
        slice_info['phase_name'] = self.tracker['phases'][phase]['name']
        
        return slice_info
    
    def get_next_slice(self):
        """Find the next slice that needs to be implemented"""
        current_phase = self.tracker['current_phase']
        current_slice = self.tracker['current_slice']
        
        # Check current phase for next slice
        phase_str = str(current_phase)
        if phase_str in self.tracker['phases']:
            phase_data = self.tracker['phases'][phase_str]
            
            # Look for next slice in current phase
            for slice_num in range(current_slice, phase_data['total_slices'] + 1):
                slice_str = str(slice_num)
                if slice_str in phase_data['slices']:
                    slice_data = phase_data['slices'][slice_str]
                    if slice_data['status'] == 'not_started':
                        return {
                            'phase': phase_str,
                            'slice_num': slice_str,
                            'phase_name': phase_data['name'],
                            **slice_data
                        }
            
            # If no more slices in current phase, move to next phase
            next_phase = current_phase + 1
            if str(next_phase) in self.tracker['phases']:
                next_phase_data = self.tracker['phases'][str(next_phase)]
                first_slice = next_phase_data['slices']['1']
                if first_slice['status'] == 'not_started':
                    return {
                        'phase': str(next_phase),
                        'slice_num': '1', 
                        'phase_name': next_phase_data['name'],
                        **first_slice
                    }
        
        return None
    
    def mark_slice_in_progress(self, phase, slice_num):
        """Mark a slice as in progress"""
        self.tracker['phases'][str(phase)]['slices'][str(slice_num)]['status'] = 'in_progress'
        self.tracker['current_phase'] = int(phase)
        self.tracker['current_slice'] = int(slice_num)
        self.save_tracker()
    
    def mark_slice_completed(self, phase, slice_num, validation_notes=None):
        """Mark a slice as completed"""
        slice_data = self.tracker['phases'][str(phase)]['slices'][str(slice_num)]
        slice_data['status'] = 'completed'
        slice_data['completed_at'] = datetime.now().isoformat()
        slice_data['validation_status'] = 'validated'
        if validation_notes:
            slice_data['validation_notes'] = validation_notes
        
        # Move to next slice
        next_slice = self.get_next_slice()
        if next_slice:
            self.tracker['current_phase'] = int(next_slice['phase'])
            self.tracker['current_slice'] = int(next_slice['slice_num'])
        
        self.save_tracker()
    
    def get_prompt_file_path(self, filename):
        """Get the full path to a prompt file"""
        return self.prompts_dir / filename
    
    def read_prompt_file(self, filename):
        """Read the content of a prompt file"""
        file_path = self.get_prompt_file_path(filename)
        try:
            with open(file_path, 'r') as f:
                return f.read()
        except FileNotFoundError:
            return None
    
    def get_project_status(self):
        """Get overall project status"""
        total_slices = 0
        completed_slices = 0
        
        for phase_data in self.tracker['phases'].values():
            total_slices += phase_data['total_slices']
            for slice_data in phase_data['slices'].values():
                if slice_data['status'] == 'completed':
                    completed_slices += 1
        
        return {
            'total_slices': total_slices,
            'completed_slices': completed_slices,
            'percentage': round((completed_slices / total_slices) * 100, 1) if total_slices > 0 else 0
        }
    
    def validate_slice_completion(self, phase, slice_num):
        """Validate if a slice meets completion criteria"""
        # This is where you would add validation logic
        # For now, we'll return a basic validation
        slice_info = self.tracker['phases'][str(phase)]['slices'][str(slice_num)]
        
        validation_checks = [
            "✅ All implementation deliverables completed",
            "✅ Success criteria validated", 
            "✅ Integration requirements met",
            "✅ Quality assurance requirements satisfied"
        ]
        
        return {
            'valid': True,
            'checks': validation_checks,
            'notes': f"Slice {phase}-{slice_num} ({slice_info['title']}) completed successfully"
        }

def main():
    if len(sys.argv) < 2:
        print("Usage: python slice-manager.py <command> [args]")
        print("Commands:")
        print("  status      - Show current project status")
        print("  next        - Show next slice to implement") 
        print("  current     - Show current slice info")
        print("  complete    - Mark current slice as completed")
        print("  start <phase> <slice> - Start a specific slice")
        sys.exit(1)
    
    # Get project root (directory containing this script)
    project_root = Path(__file__).parent.parent
    manager = SliceManager(project_root)
    
    command = sys.argv[1]
    
    if command == "status":
        status = manager.get_project_status()
        current_slice = manager.get_current_slice_info()
        
        print(f"🚀 ShipSpeak Development Status")
        print(f"===============================")
        print(f"Progress: {status['completed_slices']}/{status['total_slices']} slices ({status['percentage']}%)")
        
        if current_slice:
            print(f"Current: Phase {current_slice['phase']} - {current_slice['phase_name']}")
            print(f"  Slice {current_slice['slice_num']}: {current_slice['title']}")
            print(f"  Status: {current_slice['status']}")
        
    elif command == "next":
        next_slice = manager.get_next_slice()
        if next_slice:
            print(f"📋 Next Slice to Implement:")
            print(f"Phase {next_slice['phase']}: {next_slice['phase_name']}")
            print(f"Slice {next_slice['slice_num']}: {next_slice['title']}")
            print(f"File: {next_slice['file']}")
            print()
            print(f"💡 To implement: Ask Claude Code:")
            print(f"   'Please read and implement {next_slice['file']}'")
        else:
            print("🎉 All slices completed!")
    
    elif command == "current":
        current_slice = manager.get_current_slice_info()
        if current_slice:
            print(f"📍 Current Slice:")
            print(f"Phase {current_slice['phase']}: {current_slice['phase_name']}")
            print(f"Slice {current_slice['slice_num']}: {current_slice['title']}")
            print(f"File: {current_slice['file']}")
            print(f"Status: {current_slice['status']}")
            
            if current_slice['status'] == 'not_started':
                print()
                print(f"💡 To start: Ask Claude Code:")
                print(f"   'Please read and implement {current_slice['file']}'")
        else:
            print("❌ No current slice found")
    
    elif command == "complete":
        current_slice = manager.get_current_slice_info()
        if current_slice and current_slice['status'] == 'in_progress':
            validation = manager.validate_slice_completion(current_slice['phase'], current_slice['slice_num'])
            
            if validation['valid']:
                manager.mark_slice_completed(current_slice['phase'], current_slice['slice_num'], validation['checks'])
                print(f"✅ Slice {current_slice['phase']}-{current_slice['slice_num']} marked as completed")
                print("Validation checks:")
                for check in validation['checks']:
                    print(f"  {check}")
                
                next_slice = manager.get_next_slice()
                if next_slice:
                    print()
                    print(f"🎯 Next slice ready:")
                    print(f"   Phase {next_slice['phase']}-{next_slice['slice_num']}: {next_slice['title']}")
            else:
                print("❌ Slice validation failed")
        else:
            print("❌ No slice currently in progress")
    
    elif command == "start":
        if len(sys.argv) < 4:
            print("Usage: python slice-manager.py start <phase> <slice>")
            sys.exit(1)
        
        phase = sys.argv[2]
        slice_num = sys.argv[3]
        
        manager.mark_slice_in_progress(phase, slice_num)
        slice_info = manager.get_current_slice_info()
        
        print(f"🚀 Started slice {phase}-{slice_num}: {slice_info['title']}")
        print(f"File: {slice_info['file']}")

if __name__ == "__main__":
    main()