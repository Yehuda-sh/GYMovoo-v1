# Questionnaire Images Guide

This directory contains custom icons for the extended questionnaire system in GYMovoo. These images provide visual consistency and improved user experience for questionnaire sections and individual questions.

## Directory Structure

```
assets/questionnaire/
├── README.md                 # This guide
├── gender.png               # Gender selection question
├── height.png               # Height input question
├── weight.png               # Weight input question
├── age.png                  # Age range selection
├── goal.png                 # Training main goal
├── frequency.png            # Weekly workout frequency
├── duration.png             # Workout session duration
├── motivation.png           # Motivation factors
├── diet.png                 # Diet type selection
├── allergies.png            # Food allergies/sensitivities
└── [other question icons]   # Additional question-specific icons
```

## Image Specifications

### Technical Requirements

- **Format**: PNG with transparency support
- **Size**: 64x64 pixels (1x), 128x128 pixels (2x), 192x192 pixels (3x)
- **Color Depth**: 32-bit (RGBA)
- **Background**: Transparent
- **File Size**: Maximum 10KB per image for performance

### Visual Guidelines

- **Style**: Modern, minimalist line art
- **Color Scheme**:
  - Primary: #3B82F6 (blue)
  - Secondary: #6B7280 (gray)
  - Accent: #10B981 (green for positive actions)
  - Warning: #F59E0B (amber for important items)
- **Line Weight**: 2-3px for main elements, 1-2px for details
- **Corner Radius**: 8px for rectangular elements
- **Padding**: 8px minimum from image edges

### Icon Categories

#### Personal Details Icons

- **gender.png**: Male/female symbols or person silhouette
- **height.png**: Height measurement ruler or person with height indicator
- **weight.png**: Scale or weight symbol
- **age.png**: Calendar or clock representing age ranges

#### Goals & Commitment Icons

- **goal.png**: Target/bullseye or trophy symbol
- **frequency.png**: Calendar with highlighted days
- **duration.png**: Clock or stopwatch
- **motivation.png**: Lightning bolt or star burst

#### Nutrition Icons

- **diet.png**: Plate with fork/knife or healthy food symbols
- **allergies.png**: Warning triangle with food symbols

## Implementation Guidelines

### File Naming Convention

- Use descriptive lowercase names
- Separate words with underscores if needed
- Match the question ID when possible
- Add descriptive suffix for variants: `_outline.png`, `_filled.png`

### Integration with ExtendedQuestion Interface

```typescript
{
  id: "training_main_goal",
  question: "מה המטרה העיקרית שלך מהאימונים?",
  // ... other properties
  customIcon: "questionnaire/goal.png", // References this directory
}
```

### Fallback System

If custom icon is not found, the system falls back to:

1. Material Design Icons using the `icon` property
2. Default questionnaire icon
3. Generic question mark icon

## Design Consistency

### Color Usage

- Use consistent colors across all questionnaire icons
- Maintain contrast ratio of at least 4.5:1 for accessibility
- Consider both light and dark theme compatibility

### Visual Metaphors

- Use universally understood symbols
- Avoid culture-specific imagery that may not translate
- Prioritize clarity over artistic complexity
- Ensure icons work at small sizes (24x24px minimum)

## Accessibility Considerations

### Alt Text Support

All icons should have meaningful alternative text in the question interface:

```typescript
customIcon: "questionnaire/goal.png",
iconAlt: "מטרת אימון - סמל של מטרה", // Hebrew alt text
```

### High Contrast Mode

- Ensure icons remain visible in high contrast mode
- Use sufficient stroke weight and avoid thin lines
- Test with Windows High Contrast themes

### Screen Reader Compatibility

- Icons supplement text questions, never replace them
- Provide descriptive alt text in Hebrew
- Ensure questions make sense without visual icons

## File Organization

### Version Control

- Keep source files (AI, SVG) in separate design directory
- Export optimized PNGs to this assets directory
- Maintain changelog for icon updates

### Optimization

- Use tools like TinyPNG for file size optimization
- Ensure all images are properly compressed
- Remove unnecessary metadata

## Usage Examples

### Basic Question Icon

```typescript
{
  id: "gender",
  question: "מה המגדר שלך?",
  icon: "gender-male-female", // Fallback icon
  customIcon: "questionnaire/gender.png", // Custom icon
  // ... other properties
}
```

### Section Header Icon

```typescript
// In EXTENDED_QUESTIONNAIRE_INFO
sections: {
  personal: {
    title: "פרטים אישיים",
    icon: "questionnaire/personal_section.png",
    // ... other properties
  }
}
```

## Quality Checklist

Before adding new questionnaire icons:

- [ ] Icon follows size specifications (64x64px base)
- [ ] PNG format with transparency
- [ ] Consistent visual style with existing icons
- [ ] File size under 10KB
- [ ] Meaningful filename matching question context
- [ ] Works in both light and dark themes
- [ ] Visible at small sizes (24x24px)
- [ ] Alt text planned for accessibility
- [ ] No copyright issues with design
- [ ] Optimized and compressed properly

## Future Enhancements

### Planned Additions

- Animated icons for interactive questions
- Seasonal variations for engagement
- Progress indicators for questionnaire completion
- Category-specific icon sets

### Integration with Design System

- Align with main app iconography
- Consider integration with fitness tracking icons
- Maintain consistency with workout and nutrition visuals

---

**Note**: This questionnaire image system is part of the comprehensive GYMovoo visual identity. All icons should align with the app's Hebrew-first design approach and fitness-focused user experience.
