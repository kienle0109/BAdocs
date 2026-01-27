# Superseding Implementation Plan - Supabase Integration

## Goal
Migrate the existing local application (SQLite) to a scalable cloud architecture using Supabase (PostgreSQL) and implement secure Authentication.

## User Actions Required
> [!IMPORTANT]
> You must create a Supabase project and provide the credentials before we start Phase 2.
>
> 1. Go to [Supabase](https://supabase.com/) and create a project.
> 2. Get your **Project URL** and **anon public key**.
> 3. Get your **Transaction connection pooler string** (Settings -> Database -> Connection string -> Prisma).

## Architecture Changes
1.  **Database**: Migrate `prisma/schema.prisma` from `sqlite` to `postgresql`.
2.  **Auth**: Implement Supabase Auth (Email/Password) replacing any local logic.
3.  **Middleware**: Add Next.js middleware to manage sessions and protect routes.

## Execution Phases

### Phase 1: Database Migration (Agent: Database Architect)
-   **Dependencies**: Install `pg` (if needed for scripts) or just rely on Prisma.
-   **Configuration**:
    -   Update `.env` with `DATABASE_URL` and `DIRECT_URL`.
    -   Update `prisma/schema.prisma` provider to `postgresql`.
-   **Migration**:
    -   Run `npx prisma migrate dev --name init_supabase` to create tables in Supabase.

### Phase 2: Core Integration (Agent: Backend Specialist)
-   **Dependencies**: Install `@supabase/supabase-js` and `@supabase/ssr`.
-   **Utilities**:
    -   `utils/supabase/client.ts`: Browser client.
    -   `utils/supabase/server.ts`: Server client (cookies).
    -   `utils/supabase/middleware.ts`: Session management.
-   **Middleware**: Create `middleware.ts` to refresh sessions.

### Phase 3: UI & Auth Flow (Agent: Frontend Specialist)
-   **Pages**:
    -   `app/login/page.tsx`: Login/Signup form.
    -   `app/auth/callback/route.ts`: Auth callback handler.
-   **Components**:
    -   Update `Header.tsx` to show User Profile / Logout button.
    -   Protect `new/page.tsx` and `srs/from-brd/page.tsx` (redirect to login if unauthenticated).

## Verification Plan
1.  **DB Check**: Verify tables exist in Supabase Dashboard.
2.  **Auth Check**: Sign up a new user, verify user in Supabase Auth.
3.  **Session Check**: Reload page, ensure user stays logged in.
4.  **Protection Check**: Try accessing `/new` incognito, expect redirect to `/login`.
