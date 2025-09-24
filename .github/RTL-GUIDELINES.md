# RTL Guidelines for GYMovoo React Native App

## 📋 Overview

This document contains guidelines and lessons learned for implementing Right-to-Left (RTL) support in the GYMovoo fitness app, specifically for Hebrew text display.

## ✅ What Works in React Native RTL

### 1. Text Alignment

```typescript
// ✅ CORRECT - Use textAlign for Hebrew text
textStyle: {
  textAlign: "right", // Always right for Hebrew text
}

// ❌ INCORRECT - Don't use conditional alignment for Hebrew
textStyle: {
  textAlign: isRTL() ? "right" : "left", // This can cause issues
}
```

### 2. Flex Direction for Layouts

```typescript
// ✅ CORRECT - Use flexDirection for RTL layouts
containerStyle: {
  flexDirection: isRTL() ? "row-reverse" : "row",
}

// ✅ CORRECT - Use justifyContent for proper spacing
gridRow: {
  flexDirection: isRTL() ? "row-reverse" : "row",
  justifyContent: "space-between", // Ensures even distribution
}
```

### 3. Border Direction

```typescript
// ✅ CORRECT - Use borderStartWidth/borderEndWidth
borderStyle: {
  borderStartWidth: isRTL() ? 0 : 3,
  borderEndWidth: isRTL() ? 3 : 0,
  borderLeftColor: isRTL() ? "transparent" : theme.colors.primary,
  borderRightColor: isRTL() ? theme.colors.primary : "transparent",
}
```

### 4. Grid Direction

```typescript
// ✅ CORRECT - Use direction property in View style
workoutDaysGrid: {
  direction: isRTL() ? "rtl" : "ltr", // This works in View components
}
```

## ❌ What Doesn't Work in React Native RTL

### 1. writingDirection Property

```typescript
// ❌ INCORRECT - writingDirection doesn't exist in React Native
textStyle: {
  writingDirection: isRTL() ? "rtl" : "ltr", // This property doesn't exist
}
```

### 2. direction Property in StyleSheet

```typescript
// ❌ INCORRECT - direction in StyleSheet styles causes issues
textStyle: {
  direction: isRTL() ? "rtl" : "ltr", // Don't use this in text styles
}
```

## 🎯 Best Practices

### 1. Hebrew Text Alignment

For all Hebrew text, always use `textAlign: "right"`:

```typescript
// Headers
exercisesHeader: {
  textAlign: "right", // Always right for Hebrew
}

// Body text
exerciseName: {
  textAlign: "right", // Always right for Hebrew
}

// Descriptions
planDescription: {
  textAlign: "right", // Always right for Hebrew
}
```

### 2. Dynamic Grid Layout RTL Support

```typescript
// Grid container
workoutDaysGrid: {
  direction: isRTL() ? "rtl" : "ltr", // Works in View components
}

// Grid rows
gridRow: {
  flexDirection: isRTL() ? "row-reverse" : "row",
  justifyContent: "space-between", // Even distribution
}
```

### 3. Responsive Grid with RTL

```typescript
const gridConfig = useMemo(() => {
  // ... calculations ...

  return {
    columns,
    itemWidth: Math.max(itemWidth, 75),
    gap,
    workoutCount,
  };
}, [screenWidth, workoutPlan?.workouts]);
```

## 🔧 Common Fixes Applied

### Before (Problematic)

```typescript
exercisesHeader: {
  textAlign: isRTL() ? "right" : "left", // Can cause alignment issues
}
```

### After (Fixed)

```typescript
exercisesHeader: {
  textAlign: "right", // Always right for Hebrew text
}
```

## 📱 Components That Need RTL Consideration

### 1. Text Components

- All Hebrew text should use `textAlign: "right"`
- Exercise names, descriptions, instructions
- Headers and subheaders
- Tips and guidelines

### 2. Layout Components

- Grids and lists with multiple items
- Flex containers with directional layout
- Border decorations (use borderStart/borderEnd)

### 3. Dynamic Grids

- Use `flexDirection: isRTL() ? "row-reverse" : "row"`
- Use `justifyContent: "space-between"` for even spacing
- Avoid fixed widths, use `flex: 1` for responsive cards

## 🚫 Things to Avoid

1. **Don't** use `writingDirection` property
2. **Don't** use `direction` in text StyleSheet styles
3. **Don't** use conditional `textAlign` for Hebrew text
4. **Don't** assume RTL properties work the same as in web CSS

## ✅ Testing Checklist

- [ ] All Hebrew text aligns to the right
- [ ] Grid layouts flow right-to-left
- [ ] Borders appear on the correct side
- [ ] Icons and emojis don't interfere with text flow
- [ ] Responsive layouts work across different screen sizes
- [ ] No text overflow or clipping issues

## 📋 Files Updated for RTL

- `WorkoutPlansScreen.tsx` - Main workout planning screen with dynamic grid
- Grid styles, text alignment, and layout direction fixes applied

## 🎓 Key Lessons Learned

1. **React Native RTL is different from web CSS** - Properties like `writingDirection` don't exist
2. **Always test Hebrew text alignment** - Use `textAlign: "right"` consistently
3. **Flex layouts need careful handling** - Use `flexDirection` with `isRTL()` conditionals
4. **Grid systems require special attention** - Ensure proper spacing and direction
5. **Container direction vs text alignment** - These are separate concerns in React Native

---

_Last updated: September 24, 2025_
_App version: GYMovoo v1_
