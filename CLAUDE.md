# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npx tsc --noEmit     # Type check without emitting

# Database
npx prisma generate              # Regenerate Prisma client (also runs on npm install)
npx prisma migrate dev --name X  # Create and apply migration
npx prisma studio                # Open database GUI
```

## Architecture

ScheduleMe is a Next.js 16 App Router application connecting students with teachers for private lesson scheduling.

### Core Domain Model

- **User/Teacher**: Has many Calendars. Uses email/password auth via NextAuth.js v5 (JWT strategy).
- **Calendar**: Teacher-created schedule with a unique shareable `code`. Defines `allowedGrades` (7-12), `maxStudentsPerSlot`, and `isActive` status.
- **AvailabilitySlot**: Recurring weekly availability (dayOfWeek + periodNumber). Unique per calendar.
- **Booking**: Student reservation linking a specific date to an AvailabilitySlot.

### Key Business Rules

Booking validation in `src/app/api/bookings/route.ts` (POST handler):
1. Date must match slot's dayOfWeek
2. Student grade must be in calendar's allowedGrades
3. Date cannot be in the past
4. **24-hour rule**: Bookings must be made at least 24 hours in advance
5. **Grade-exclusive**: Once a grade books a slot+date, only that same grade can book it
6. Capacity check against maxStudentsPerSlot
7. Duplicate name prevention per slot+date

Checks 5-7 run inside a Prisma `$transaction` for race-condition safety.

### Tech Stack

- **Prisma v7** with `@prisma/adapter-pg` (requires `Pool` from `pg`). Generated client at `src/generated/prisma/client`.
- **NextAuth v5 beta** with Credentials provider and PrismaAdapter.
- **Zod v4** for validation (import from `zod/v4`).
- **Tailwind CSS v4** with custom theme variables in `globals.css`.

### Route Structure

- `/` - Landing page (student code input + teacher login links)
- `/login`, `/register` - Teacher auth (route group `(auth)`)
- `/dashboard` - Protected teacher area (middleware at `src/middleware.ts`)
- `/dashboard/calendars/new` - 4-step calendar creation wizard
- `/dashboard/calendars/[calendarId]` - Calendar detail with bookings
- `/calendar/[code]` - Public student view (monthly calendar, click-to-book)

### API Routes

- `GET/POST /api/calendars` - List/create calendars (teacher auth required)
- `GET/PUT/DELETE /api/calendars/[calendarId]` - Calendar CRUD (teacher auth required)
- `GET /api/calendars/by-code/[code]` - Public calendar lookup by code
- `GET /api/bookings?calendarId&startDate&endDate` - Fetch bookings for month view
- `POST /api/bookings` - Create booking (public, validates against all business rules)
- `DELETE /api/bookings/[bookingId]` - Cancel booking (teacher auth required)

### Component Organization

- `src/components/ui/` - Reusable primitives (Button, Input, Card, Modal, Header, etc.)
- `src/components/features/` - Domain-specific components organized by feature:
  - `auth/` - LoginForm, RegisterForm
  - `dashboard/` - CalendarCard, delete buttons
  - `calendar-wizard/` - Step1-4 components for calendar creation
  - `student/` - MonthlyCalendarView, DayCell, SlotBadge, BookingForm

## Header Component

**ALL pages in the application MUST include the Header component at the top for consistent branding.**

### Variants

The Header component supports two variants:

#### Simple Variant (default)
Centered layout with logo and subtitle. Use for public pages.

```tsx
import Header from "@/components/ui/Header";

// For: home, login, register, student calendar pages
<Header />
```

#### Dashboard Variant
3-column layout with navigation. Use for authenticated dashboard pages.

```tsx
import Header from "@/components/ui/Header";

// For: dashboard pages (already configured in dashboard/layout.tsx)
<Header
  variant="dashboard"
  userName={session.user.name}
  logoutForm={<form>...</form>}
/>
```

Layout:
- **RIGHT**: Logo + CalendarIcon + subtitle
- **CENTER**: Navigation links (הלוחות שלי, צור לוח)
- **LEFT**: User name + logout button

### Props

```tsx
interface HeaderProps {
  variant?: "simple" | "dashboard";  // default: "simple"
  userName?: string | null;          // for dashboard variant
  logoutForm?: ReactNode;            // for dashboard variant
}
```

### Features
- Purple gradient background with calendar icon
- "ScheduleMe" branding with Hebrew subtitle
- Sticky positioning (stays at top on scroll)
- Links to home page when clicked
- RTL-aware layout

### Important
- The Header component is **required** on ALL pages
- For dashboard pages, the layout already includes the Header with `variant="dashboard"`
- For public pages, use the simple variant (default)
- Do not create custom headers - always use the Header component

## Hebrew Localization

This application uses **Hebrew (עברית)** for all user-facing text. The UI is configured for right-to-left (RTL) layout.

### Key Requirements for Future Development

1. **All user-facing text must be in Hebrew** - do not add English text to the UI
2. **Keep code in English** - variable names, function names, and comments remain in English
3. **Email placeholders are an exception** - keep email examples like "teacher@school.com" in English

### Grade Labels (שכבות)

Use Hebrew letters for grade labels, not numbers:

| Grade | Hebrew Label |
|-------|--------------|
| 7 | שכבה ז' |
| 8 | שכבה ח' |
| 9 | שכבה ט' |
| 10 | שכבה י' |
| 11 | שכבה י"א |
| 12 | שכבה י"ב |

Helper functions in `src/lib/utils.ts`:
- `formatGrade(grade)` - returns full label (e.g., "שכבה ז'")
- `formatGradeShort(grade)` - returns short label (e.g., "ז'")

### Hour Labels (שעות)

Format: `שעה` + number (e.g., "שעה 1", "שעה 2")

Use `formatHour(periodNumber)` from `src/lib/utils.ts`.

### Day Names

Hebrew day names are defined in `DAY_NAMES` constant in `src/lib/utils.ts`:
- יום ראשון (Sunday)
- יום שני (Monday)
- יום שלישי (Tuesday)
- יום רביעי (Wednesday)
- יום חמישי (Thursday)
- יום שישי (Friday)
- שבת (Saturday)

Short versions for calendar headers: `DAY_NAMES_SHORT` = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"]

### Month Names

Hebrew month names are defined in `MONTH_NAMES` constant in `src/lib/utils.ts`:
ינואר, פברואר, מרץ, אפריל, מאי, יוני, יולי, אוגוסט, ספטמבר, אוקטובר, נובמבר, דצמבר
