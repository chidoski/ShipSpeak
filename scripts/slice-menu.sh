#!/bin/bash

# ShipSpeak Interactive Slice Menu
# Usage: ./scripts/slice-menu.sh

echo "🚀 ShipSpeak Slice Implementation Menu"
echo "======================================"

# Function to list slices for a phase
list_phase_slices() {
    local phase=$1
    echo ""
    echo "📋 Phase $phase Slices:"
    echo "----------------------"
    
    # List all slice prompts for the phase
    local slices=($(ls docs/skills/implementation-prompts/phase${phase}-slice*.md 2>/dev/null | sort))
    
    if [ ${#slices[@]} -eq 0 ]; then
        echo "❌ No slice prompts found for Phase $phase"
        return
    fi
    
    for i in "${!slices[@]}"; do
        local slice_file="${slices[$i]}"
        local slice_name=$(basename "$slice_file" .md | sed 's/phase[0-9]-slice[0-9]-[0-9]*-//' | sed 's/-/ /g')
        echo "  $((i+1)). $(basename "$slice_file" -prompt.md | sed 's/phase[0-9]-slice[0-9]-//')"
    done
}

# Function to show slice content
show_slice_content() {
    local slice_file=$1
    echo ""
    echo "📖 Slice Content:"
    echo "=================="
    cat "$slice_file"
    echo ""
    echo "💡 To execute this slice, copy the above content and:"
    echo "   1. Paste it into Claude Code directly, OR"
    echo "   2. Ask Claude: 'Please read and implement $(basename $slice_file)'"
    echo ""
}

# Main menu
while true; do
    echo ""
    echo "Select a Phase:"
    echo "1. Phase 1 - Frontend Foundation (15 slices)"
    echo "2. Phase 2 - Backend Infrastructure (10 slices)" 
    echo "3. Phase 3 - AI Integration (8 slices)"
    echo "4. Exit"
    echo ""
    read -p "Enter choice (1-4): " phase_choice

    case $phase_choice in
        1)
            list_phase_slices 1
            echo ""
            read -p "Enter slice number (or 0 to go back): " slice_num
            if [ "$slice_num" != "0" ] && [ "$slice_num" -gt 0 ] && [ "$slice_num" -le 15 ]; then
                slice_file=$(ls docs/skills/implementation-prompts/phase1-slice*.md 2>/dev/null | sort | sed -n "${slice_num}p")
                if [ -n "$slice_file" ]; then
                    show_slice_content "$slice_file"
                fi
            fi
            ;;
        2)
            list_phase_slices 2
            echo ""
            read -p "Enter slice number (or 0 to go back): " slice_num
            if [ "$slice_num" != "0" ] && [ "$slice_num" -gt 0 ] && [ "$slice_num" -le 10 ]; then
                slice_file=$(ls docs/skills/implementation-prompts/phase2-slice*.md 2>/dev/null | sort | sed -n "${slice_num}p")
                if [ -n "$slice_file" ]; then
                    show_slice_content "$slice_file"
                fi
            fi
            ;;
        3)
            list_phase_slices 3
            echo ""
            read -p "Enter slice number (or 0 to go back): " slice_num
            if [ "$slice_num" != "0" ] && [ "$slice_num" -gt 0 ] && [ "$slice_num" -le 8 ]; then
                slice_file=$(ls docs/skills/implementation-prompts/phase3-slice*.md 2>/dev/null | sort | sed -n "${slice_num}p")
                if [ -n "$slice_file" ]; then
                    show_slice_content "$slice_file"
                fi
            fi
            ;;
        4)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please try again."
            ;;
    esac
done