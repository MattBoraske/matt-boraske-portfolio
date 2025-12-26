# Timeline Improvements Design

**Date:** 2025-12-26
**Status:** Approved

## Overview

Standardize timeline logo sizes and add location field support to timeline entries.

## Goals

1. Make all timeline logos the same size for visual consistency
2. Add optional location field to timeline entries
3. Display location next to company name

## Design Decisions

### Logo Size Standardization

**Current State:**
- Education logos: `w-14 h-14` (56px)
- Work logos: `w-8 h-8` (32px)

**Solution:**
- Standardize all logos to `w-12 h-12` (48px)
- Remove conditional logic in parser
- Medium size balances visibility and space efficiency

### Location Field Support

**Markdown Format:**
Add optional `**Location:**` field to timeline entries:

```markdown
## CSL Behring - Data Scientist
**Date Range:** August 2023 - Present
**Type:** Work
**Current:** Yes
**Location:** King of Prussia, PA
```

**Parser Enhancement:**
Extract location using existing `getField()` helper and include in returned object.

**Display Format:**
Show location next to company name with bullet separator:
```
Company Name • Location
```

Uses subtle styling (opacity 0.7) to keep focus on company name while providing geographic context.

## Implementation Plan

### 1. Update Type Definition

File: `src/types/content.ts`
- Add `location?: string` to `Experience` interface

### 2. Update Parser

File: `src/utils/parseTimeline.ts`
- Change line 88: `logoSize: 'w-12 h-12'`
- Add `const location = getField('Location')` after line 75
- Add `location` to returned object

### 3. Update Component

File: `src/components/TimelineItem.astro`
- Add `location?: string` to Props interface
- Add `location` to destructuring
- Update company container to display location with separator
- Add CSS for `.location-separator` and `.location-text`

### 4. Update Content

File: `src/resources/timeline.md`
- Add `**Location:**` field to entries where applicable

## Trade-offs

**Logo Size:**
- Smaller than education logos (less prominent for schools)
- Larger than work logos (more prominent for companies)
- Chose medium as best balance for mixed content

**Location Display:**
- Considered three positions: next to company, below company, in date container
- Chose next to company to keep related information grouped
- Uses bullet separator consistent with terminal theme

## No Breaking Changes

- Location field is optional (backwards compatible)
- Logo size change is visual only
- Existing timeline entries work without modification
