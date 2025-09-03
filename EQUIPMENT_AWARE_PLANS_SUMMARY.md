# Equipment-Aware Workout Plans

## Overview

The system generates intelligent workout plans based on user's available equipment:

- Filters exercises based on available equipment
- Provides equipment substitutions when needed
- Falls back to bodyweight exercises
- Integrates with existing Supabase data flow

## Core Files

- `src/utils/equipmentCatalog.ts` - Equipment taxonomy and substitution logic
- `src/stores/userStore.ts` - Equipment data access
- `src/screens/workout/services/workoutLogicService.ts` - Equipment-aware filtering
- `src/utils/__tests__/equipmentCatalog.test.ts` - Test suite (24 tests)

## Key Features

**Equipment Normalization:** Handles synonyms and variations (`["dumbbells", "free weights"]` → `['dumbbell']`)

**Smart Substitutions:** Machine exercises substitute with dumbbells, cables with bands, etc.

**Availability Scoring:** Perfect match vs. substitution scoring for exercise selection

**Type Safety:** Full TypeScript support with EquipmentTag union types

## Architecture

**Equipment Catalog:** 23+ equipment types with synonym mapping and substitution hierarchy

**Integration:** Works with existing questionnaire flow and Supabase data

**Testing:** Comprehensive coverage including normalization, availability checking, substitutions, and edge cases

## Usage

User equipment is retrieved from questionnaire data, exercises are filtered and scored based on equipment compatibility, with smart substitutions applied when needed.

Equipment substitution rules are configurable with priority ordering (e.g., machine → cable → dumbbell → bodyweight).
