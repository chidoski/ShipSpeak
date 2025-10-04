# Design System: ShipSpeak Platform
## Anthropic-Inspired Visual Language & Component Library

**Version:** 1.0  
**Date:** October 4, 2025  
**Document Type:** Design System Specification  
**Inspired By:** Anthropic's clean, thoughtful, sophisticated design language  

---

## Design Philosophy

### Core Principles

#### 1. Clarity Over Cleverness
- **Simple, readable interfaces** that prioritize user comprehension
- **Purposeful visual hierarchy** with clear information architecture
- **Minimal cognitive load** - users should focus on growth, not navigation

#### 2. Thoughtful Density
- **Information-rich but never overwhelming** - progressive disclosure
- **Generous whitespace** that lets content breathe
- **Strategic grouping** of related information

#### 3. Subtle Sophistication
- **Muted, professional color palette** that conveys expertise
- **Careful typography** with excellent readability
- **Understated elegance** appropriate for professional development

#### 4. Purposeful Motion
- **Minimal, meaningful animations** that guide attention
- **Smooth transitions** that feel natural, never distracting
- **Performance-conscious** motion that works well on all devices

---

## Color System

### Primary Palette
```scss
// Anthropic-inspired neutral foundation
:root {
  // Base colors - warm neutrals
  --color-background: hsl(30, 20%, 98%);     // #f9f8f6 - Warm white
  --color-surface: hsl(30, 10%, 96%);       // #f5f4f2 - Slightly darker surface
  --color-surface-hover: hsl(30, 8%, 94%);  // #f0efed - Hover state
  
  // Text colors - high contrast for accessibility
  --color-foreground: hsl(28, 8%, 12%);     // #1f1e1c - Near black
  --color-foreground-muted: hsl(27, 6%, 45%); // #6e6b67 - Muted text
  --color-foreground-subtle: hsl(26, 5%, 65%); // #a8a5a1 - Subtle text
  
  // Brand colors - muted and professional
  --color-primary: hsl(25, 65%, 55%);       // #d4884d - Muted orange
  --color-primary-hover: hsl(25, 65%, 50%); // #c17d42 - Darker hover
  --color-primary-muted: hsl(25, 65%, 95%); // #f7f3f0 - Very light tint
  
  // Semantic colors - accessible and clear
  --color-success: hsl(120, 30%, 45%);      // #5c8a5c - Muted green
  --color-warning: hsl(45, 70%, 60%);       // #e6c966 - Warm yellow
  --color-error: hsl(0, 45%, 55%);          // #c57373 - Muted red
  --color-info: hsl(210, 30%, 55%);         // #6b8db5 - Muted blue
  
  // Borders and dividers
  --color-border: hsl(30, 8%, 88%);         // #e2e0dd - Subtle borders
  --color-border-strong: hsl(30, 10%, 82%); // #d3d0cc - Stronger borders
}

// Dark mode adaptation (for future implementation)
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: hsl(28, 8%, 8%);     // #141312 - Dark background
    --color-surface: hsl(28, 8%, 12%);       // #1f1e1c - Dark surface
    --color-foreground: hsl(30, 20%, 95%);   // #f5f4f2 - Light text
    --color-primary: hsl(25, 65%, 65%);      // #e09960 - Brighter orange for dark
  }
}
```

### Company Accent Integration
```scss
// Dynamic company colors - applied contextually
.company-accent {
  --company-primary: var(--dynamic-company-color);
  --company-muted: var(--dynamic-company-color-10);
  --company-subtle: var(--dynamic-company-color-5);
}

// Usage examples
.company-card {
  border-left: 4px solid var(--company-muted);
  background: linear-gradient(to right, var(--company-subtle), transparent);
}

.company-badge {
  background-color: var(--company-muted);
  color: var(--company-primary);
  border: 1px solid var(--company-primary);
}
```

### Usage Guidelines
- **Primary color**: CTAs, active states, progress indicators
- **Company accents**: Subtle highlights, never overwhelming
- **Semantic colors**: Status indicators, alerts, success states
- **Neutrals**: 90% of the interface - text, backgrounds, borders

---

## Typography

### Font Stack
```scss
:root {
  // Primary font - Inter for excellent readability
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", 
               "Roboto", "Helvetica Neue", sans-serif;
  
  // Monospace - for code, data, and technical content
  --font-mono: "JetBrains Mono", "SF Mono", "Monaco", "Inconsolata", 
               "Roboto Mono", monospace;
  
  // Optional display font for headlines (if needed)
  --font-display: "Inter", var(--font-sans);
}
```

### Type Scale & Hierarchy
```scss
// Fluid typography - scales with viewport
:root {
  --text-xs: clamp(0.75rem, 0.7rem + 0.2vw, 0.8rem);    // 12-13px
  --text-sm: clamp(0.875rem, 0.8rem + 0.3vw, 0.95rem);  // 14-15px
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.1rem);   // 16-18px
  --text-lg: clamp(1.125rem, 1.05rem + 0.35vw, 1.3rem); // 18-21px
  --text-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);   // 20-24px
  --text-2xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);        // 24-32px
  --text-3xl: clamp(1.875rem, 1.5rem + 1.5vw, 2.5rem);  // 30-40px
  --text-4xl: clamp(2.25rem, 1.8rem + 2vw, 3rem);       // 36-48px
}

// Line heights for optimal readability
.text-xs { line-height: 1.4; }
.text-sm { line-height: 1.45; }
.text-base { line-height: 1.5; }
.text-lg { line-height: 1.55; }
.text-xl { line-height: 1.6; }
.text-2xl { line-height: 1.3; }
.text-3xl { line-height: 1.25; }
.text-4xl { line-height: 1.2; }
```

### Typography Classes
```scss
// Semantic typography classes
.heading-1 {
  font-size: var(--text-3xl);
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--color-foreground);
}

.heading-2 {
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--color-foreground);
}

.heading-3 {
  font-size: var(--text-xl);
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--color-foreground);
}

.body-large {
  font-size: var(--text-lg);
  font-weight: 400;
  color: var(--color-foreground);
}

.body {
  font-size: var(--text-base);
  font-weight: 400;
  color: var(--color-foreground);
}

.body-small {
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-foreground-muted);
}

.caption {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-foreground-subtle);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## Spacing & Layout

### Spacing Scale
```scss
:root {
  // 4px base unit with harmonious progression
  --space-0: 0;
  --space-1: 0.25rem;  // 4px
  --space-2: 0.5rem;   // 8px
  --space-3: 0.75rem;  // 12px
  --space-4: 1rem;     // 16px
  --space-5: 1.25rem;  // 20px
  --space-6: 1.5rem;   // 24px
  --space-8: 2rem;     // 32px
  --space-10: 2.5rem;  // 40px
  --space-12: 3rem;    // 48px
  --space-16: 4rem;    // 64px
  --space-20: 5rem;    // 80px
  --space-24: 6rem;    // 96px
  --space-32: 8rem;    // 128px
}
```

### Layout Grid
```scss
// Container widths
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.container-narrow {
  max-width: 800px;
}

.container-wide {
  max-width: 1400px;
}

// Responsive breakpoints
@media (min-width: 640px) {
  .container { padding: 0 var(--space-6); }
}

@media (min-width: 1024px) {
  .container { padding: 0 var(--space-8); }
}
```

---

## Component Library

### Buttons
```scss
// Base button styles
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  
  font-family: var(--font-sans);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  
  border: 1px solid transparent;
  border-radius: 8px;
  
  transition: all 0.15s ease;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// Button variants
.btn-primary {
  background-color: var(--color-primary);
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
}

.btn-secondary {
  background-color: var(--color-surface);
  color: var(--color-foreground);
  border-color: var(--color-border);
  
  &:hover:not(:disabled) {
    background-color: var(--color-surface-hover);
    border-color: var(--color-border-strong);
  }
}

.btn-ghost {
  background-color: transparent;
  color: var(--color-foreground-muted);
  
  &:hover:not(:disabled) {
    background-color: var(--color-surface);
    color: var(--color-foreground);
  }
}

// Button sizes
.btn-sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
}

.btn-md {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
}

.btn-lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-lg);
}
```

### Cards
```scss
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--color-border-strong);
  }
}

.card-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.card-content {
  padding: var(--space-6);
}

.card-footer {
  padding: var(--space-6);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-background);
}

// Company-themed card variant
.card-company {
  border-left: 4px solid var(--company-muted);
  background: linear-gradient(
    to right, 
    var(--company-subtle), 
    transparent 100px
  );
}
```

### Form Elements
```scss
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: 1.5;
  
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  
  transition: all 0.15s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-muted);
  }
  
  &::placeholder {
    color: var(--color-foreground-subtle);
  }
}

.label {
  display: block;
  margin-bottom: var(--space-2);
  
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-foreground);
}

.form-group {
  margin-bottom: var(--space-6);
}

.form-error {
  margin-top: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-error);
}
```

---

## Growth-Focused Components

### Progress Indicators
```scss
.progress-ring {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.progress-ring-circle {
  stroke: var(--color-border);
  stroke-width: 3;
  fill: transparent;
  transition: stroke-dasharray 0.5s ease;
}

.progress-ring-progress {
  stroke: var(--color-primary);
  stroke-width: 3;
  stroke-linecap: round;
  fill: transparent;
  transition: stroke-dasharray 0.5s ease;
}

.progress-ring-company {
  .progress-ring-progress {
    stroke: var(--company-primary);
  }
}

.progress-ring-text {
  position: absolute;
  font-weight: 600;
  font-size: var(--text-lg);
  color: var(--color-foreground);
}
```

### Growth Path Visualization
```scss
.growth-path {
  display: flex;
  align-items: center;
  padding: var(--space-6);
  background: linear-gradient(
    to right,
    var(--color-surface),
    var(--color-background),
    var(--color-surface)
  );
  border-radius: 12px;
}

.growth-milestone {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 20px;
    right: -50%;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      to right,
      var(--color-primary),
      var(--color-border)
    );
  }
}

.milestone-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-2);
  
  &.completed {
    background-color: var(--color-success);
  }
  
  &.current {
    background-color: var(--color-primary);
    box-shadow: 0 0 0 4px var(--color-primary-muted);
  }
  
  &.upcoming {
    background-color: var(--color-border);
    color: var(--color-foreground-subtle);
  }
}

.milestone-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-foreground-muted);
  text-align: center;
}
```

### Skill Gap Indicators
```scss
.skill-gap {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background-color: var(--color-surface);
  border-radius: 8px;
  margin-bottom: var(--space-3);
}

.skill-name {
  flex: 1;
  font-weight: 500;
  color: var(--color-foreground);
}

.skill-progress {
  flex: 2;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.skill-bar {
  flex: 1;
  height: 8px;
  background-color: var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}

.skill-bar-fill {
  height: 100%;
  background: linear-gradient(
    to right,
    var(--color-primary),
    var(--company-primary, var(--color-primary))
  );
  border-radius: 4px;
  transition: width 0.5s ease;
}

.skill-score {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-foreground-muted);
  min-width: 40px;
  text-align: right;
}
```

---

## Chart & Data Visualization

### Chart Theming
```scss
// Recharts custom theme variables
:root {
  --chart-grid: var(--color-border);
  --chart-text: var(--color-foreground-muted);
  --chart-primary: var(--color-primary);
  --chart-secondary: var(--color-info);
  --chart-success: var(--color-success);
  --chart-warning: var(--color-warning);
  --chart-error: var(--color-error);
}

// Chart container styling
.chart-container {
  background-color: var(--color-surface);
  border-radius: 12px;
  padding: var(--space-6);
  border: 1px solid var(--color-border);
}

.chart-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-foreground);
  margin-bottom: var(--space-4);
}

.chart-subtitle {
  font-size: var(--text-sm);
  color: var(--color-foreground-muted);
  margin-bottom: var(--space-6);
}
```

### Company Comparison Theme
```scss
.comparison-chart {
  .company-1 { stroke: var(--color-primary); fill: var(--color-primary); }
  .company-2 { stroke: var(--color-info); fill: var(--color-info); }
  .company-3 { stroke: var(--color-success); fill: var(--color-success); }
  .company-4 { stroke: var(--color-warning); fill: var(--color-warning); }
  .company-5 { stroke: var(--color-error); fill: var(--color-error); }
}

.chart-legend {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-4);
  font-size: var(--text-sm);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
```

---

## Responsive Design

### Mobile-First Approach
```scss
// Mobile defaults (320px+)
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
  padding: var(--space-4);
}

// Tablet (768px+)
@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr 300px;
    gap: var(--space-6);
    padding: var(--space-6);
  }
}

// Desktop (1024px+)
@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr 400px;
    gap: var(--space-8);
    padding: var(--space-8);
  }
}

// Large desktop (1440px+)
@media (min-width: 1440px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr 400px;
    max-width: 1600px;
    margin: 0 auto;
  }
}
```

### Component Responsive Patterns
```scss
// Responsive text sizing
.responsive-heading {
  font-size: var(--text-xl);
}

@media (min-width: 768px) {
  .responsive-heading {
    font-size: var(--text-2xl);
  }
}

@media (min-width: 1024px) {
  .responsive-heading {
    font-size: var(--text-3xl);
  }
}

// Responsive spacing
.section {
  padding: var(--space-8) 0;
}

@media (min-width: 768px) {
  .section {
    padding: var(--space-12) 0;
  }
}

@media (min-width: 1024px) {
  .section {
    padding: var(--space-16) 0;
  }
}
```

---

## Animation & Motion

### Transition Standards
```scss
// Standard easing curves
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}

// Standard durations
:root {
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
}

// Common transitions
.transition-fast {
  transition: all var(--duration-fast) var(--ease-out);
}

.transition-normal {
  transition: all var(--duration-normal) var(--ease-out);
}

.transition-slow {
  transition: all var(--duration-slow) var(--ease-out);
}
```

### Micro-interactions
```scss
// Hover states
.interactive:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

// Loading states
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading {
  animation: pulse 2s ease-in-out infinite;
}

// Success feedback
@keyframes scale-in {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.appear {
  animation: scale-in var(--duration-normal) var(--ease-out);
}
```

---

## Accessibility Standards

### Focus Management
```scss
// Custom focus ring
.focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-muted);
  border-color: var(--color-primary);
}

// Skip links
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-primary);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
  
  &:focus {
    top: 6px;
  }
}
```

### Screen Reader Support
```scss
// Visually hidden but available to screen readers
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// High contrast mode support
@media (prefers-contrast: high) {
  :root {
    --color-border: hsl(0, 0%, 50%);
    --color-border-strong: hsl(0, 0%, 30%);
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Implementation Guidelines

### CSS Architecture
```scss
// Organize CSS using ITCSS methodology
@import 'settings/variables';     // Design tokens
@import 'tools/mixins';          // Sass mixins
@import 'generic/reset';         // CSS reset
@import 'elements/typography';   // Base element styles
@import 'objects/layout';        // Layout patterns
@import 'components/buttons';    // UI components
@import 'utilities/spacing';     // Utility classes
```

### Component Development
1. **Start with design tokens** - use CSS variables
2. **Build semantic variants** - not just visual ones
3. **Include accessibility** from the beginning
4. **Test across devices** and screen sizes
5. **Document usage patterns** and examples

### Performance Considerations
- **Critical CSS inlined** for above-the-fold content
- **Non-critical CSS** loaded asynchronously
- **CSS variables** for dynamic theming without JS
- **Minimal animations** that don't block interactions

---

This design system provides the foundation for building a sophisticated, professional interface that supports PM growth journeys while maintaining the clean, thoughtful aesthetic inspired by Anthropic's design language.