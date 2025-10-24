# Fixes Applied to PAR Enterprise Backend

## Date/Time Issues (Calendar Fix)

### Problem 1: Timezone Conversion Bug
The calendar was selecting a different date than what was picked due to timezone conversion issues. When converting JavaScript Date objects to ISO strings using `.toISOString()`, the date was being shifted by timezone offset hours, causing the wrong date to be sent to the backend and displayed in exports.

### Problem 2: UI Display Mismatch
When clicking "Sep 18" in the calendar, the dashboard was showing "Week: 2025-09-12" (the actual backend data week) instead of showing "Week: Sep 18" (the selected date). This was confusing because users expected to see the date they selected, even if the data shown is from the nearest available week.

### Solution

**Fix 1: Timezone-safe date formatting**
Created a helper function `formatDateLocal()` that formats dates as YYYY-MM-DD without timezone conversion:

```typescript
const formatDateLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
```

**Fix 2: Display selected date in UI**
Changed the KPI card and header to display `formatDateLocal(selectedDate)` instead of `currentKPI.week` or `backendSnapshot.week`. This ensures:
- The UI shows the date YOU selected (e.g., "2025-09-18")
- The data displayed is from the nearest available week in the Excel (e.g., Sep 12's data)
- Users know exactly which date they're viewing, even if the actual data comes from a nearby week

**Example:**
```
BEFORE:
- Click calendar → "Sep 18"
- Dashboard shows → "Week: 2025-09-12" (confusing! ❌)

AFTER:
- Click calendar → "Sep 18"  
- Dashboard shows → "Week: 2025-09-18" (what you selected! ✅)
- Data shown → From Sep 12 (nearest available data in Excel)
```

### Files Modified
- `Frontend/src/components/PARDashboard.tsx`:
  - Added `formatDateLocal()` helper function
  - Updated `fetchWithDateContext()` to use `formatDateLocal(date)` instead of `date.toISOString().split('T')[0]`
  - Updated `handleDownload()` export URL generation to use `formatDateLocal(selectedDate)`
  - Updated download filename generation to use `formatDateLocal(selectedDate)`
  - **Updated KPI card "Week" badge to display selected date instead of backend's week**
  - **Updated header "Selected Week" to show user's chosen date**

## Configuration Issues

### 1. Dockerfile Port Mismatch
**Problem**: Dockerfile set `ENV PORT=10000` but gunicorn was binding to port 8050
**Fix**: Changed gunicorn command from `-b 0.0.0.0:8050` to `-b 0.0.0.0:10000`

### 2. Missing Python Dependencies
**Problem**: `requirements.txt` was missing dependencies for PDF and PNG exports
**Fix**: Added `reportlab` and `matplotlib` to `requirements.txt`

### 3. Frontend API Port Mismatch
**Problem**: `Frontend/src/components/lib/api.ts` was using port 8050 instead of 10000
**Fix**: Changed localhost port from `http://127.0.0.1:8050` to `http://127.0.0.1:10000`

## Files Changed

1. `Frontend/src/components/PARDashboard.tsx` - Fixed date timezone conversion
2. `Dockerfile` - Fixed port binding
3. `requirements.txt` - Added missing dependencies
4. `Frontend/src/components/lib/api.ts` - Fixed port mismatch

## Testing Recommendations

1. Test calendar date selection with various timezones
2. Test exports (PDF, PNG, Excel) to verify correct dates in filenames and content
3. Test deployment with Docker to ensure port configuration works
4. Verify all export formats work correctly with the new dependencies

## Backend Changes Summary

No backend logic changes were needed. The backend was already correctly handling date strings in YYYY-MM-DD format. The issue was entirely in the frontend's date-to-string conversion.

