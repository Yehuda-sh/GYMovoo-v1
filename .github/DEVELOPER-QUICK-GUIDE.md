# Developer Quick Guidelines - GYMovoo

## ⚡ Quick Rules Before Touching Any Code

### 🔍 Before You Code - ASK:

1. **"איך המידע מגיע?"** (How does the data arrive?)
   - Is it actually dynamic from userStore?
   - Don't assume, trace the data flow!

2. **"למה הפונקציה הזאת כל כך מורכבת?"** (Why is this function so complex?)
   - 50+ lines = suspicious
   - 100+ lines = definitely over-engineered
   - 200+ lines = needs immediate simplification

3. **"כמה מקומות משתמשים בזה?"** (How many places use this?)
   - 1 place = inline it or use simple logic
   - 2-3 places = maybe keep it
   - 5+ places = definitely keep it

4. **"יש כפילות?"** (Is there duplication?)
   - Same logic in multiple files = centralize NOW
   - Translation logic scattered = use equipmentTranslations.ts

## 🚨 Red Flags - STOP and Simplify:

- Custom hook with 100+ lines used in only 1 place
- Data extraction function with 200+ lines
- Multiple translation functions across files
- Supporting data formats that don't exist
- Complex validation for simple boolean checks

## ✅ Green Patterns - Keep Doing:

- Single source of truth (equipmentTranslations.ts)
- Simple boolean checks instead of complex hooks
- Dynamic data from userStore
- Clear, short functions with obvious purposes
- Centralized translation system

## 📊 Success Metrics:

- Function length: Aim for <20 lines for data processing
- File count: Remove files that serve single simple purposes
- Line reduction: 200+ lines → 20 lines is a win
- Clarity: If you need comments to explain logic, simplify the logic

## 🎯 Remember:

**"פשטות עדיפה על מורכבות"** (Simplicity is better than complexity)

Your code should be obvious to understand, not clever to write.

---

_Quick reference for GYMovoo developers_
