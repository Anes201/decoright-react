# DecoRight Supabase Setup Guide & AI Coder TODOs

## Part 1: Steps to Start a Supabase Project

Follow these steps to initialize the project environment:

1.  **Create Account/Login**: Go to [supabase.com](https://supabase.com) and log in.
2.  **New Project**:
    *   Click "New Project".
    *   Select your organization.
    *   **Name**: `DecoRight`
    *   **Database Password**: Generate a strong password and **save it securely**.
    *   **Region**: Select the region closest to your target audience (e.g., Frankfurt/London for Algeria latency optimization, though Paris/Frankfurt are standard).
    *   Click "Create new project".
3.  **Wait for Provisioning**: It takes a minute or two to set up the database.
4.  **Get API Keys**:
    *   Go to **Settings** (cog icon) -> **API**.
    *   Copy the `Project URL`.
    *   Copy the `anon` / `public` key.
    *   (Optional for local dev) Copy the `service_role` key (keep this secret!).

## Part 2: TODO List for the AI Coder

Give this list to your AI coding assistant to implement the backend logic.

> **Context**: We are building the backend for "DecoRight" using Supabase. The Frontend/App will use these APIs.

### 1. Database Schema Implementation
- [ ] **Create Tables**: Run SQL to create `profiles`, `service_requests`, `messages`, and `portfolio_items` tables with appropriate types and constraints.
- [ ] **Define Enums**: Create PostgreSQL types for `user_role` ('admin', 'customer') and `request_status` ('Submitted', 'Under Review', etc.).
- [ ] **Set up Triggers**: Create a trigger on `auth.users` to automatically insert a row into `public.profiles` upon user signup.

### 2. Row Level Security (RLS) Policies
- [ ] **Enable RLS**: Enable RLS on all tables.
- [ ] **Profiles Policy**:
    - Users can read/update their own profile.
    - Admins can read all profiles.
- [ ] **Service Requests Policy**:
    - Customers can `insert` requests.
    - Customers can `select` only their own requests.
    - Admins can `select` and `update` all requests.
- [ ] **Messages Policy**:
    - Participants (Sender or Request Owner) can `select` and `insert`.
    - Admins can `select` and `insert` on any request.
- [ ] **Portfolio Policy**:
    - `select`: Public access (filter `is_public_guest` if unauthenticated).
    - `insert/update/delete`: Admin only.

### 3. Storage Configuration
- [ ] **Create Buckets**:
    - `request-files` (Private)
    - `portfolio-media` (Public)
- [ ] **Storage Policies**:
    - `request-files`: Allow upload/read if user owns the related request (or is admin).
    - `portfolio-media`: Allow public read. Allow admin upload/delete.

### 4. Realtime Configuration
- [ ] **Enable Realtime**: Go to Database -> Replication and enable replication for the `messages` table so chat works instantly.

### 5. Edge Functions (Optional/Advanced)
- [ ] (If needed) Create a function to send emails (though MVP says no notifications, keep in mind for future). *Skip for now.*

---
**SQL Snippet for AI Coder (Copy/Paste this to start context):**

```sql
-- Enums
create type user_role as enum ('customer', 'admin');
create type request_status as enum ('Submitted', 'Under Review', 'Waiting for Client Info', 'Approved', 'In Progress', 'Completed', 'Rejected');

-- Profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role user_role default 'customer',
  full_name text,
  created_at timestamptz default now()
);

-- Service Requests
create table service_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  service_type text not null,
  description text,
  status request_status default 'Submitted',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages
create table messages (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references service_requests(id) not null,
  sender_id uuid references profiles(id) not null,
  content text not null,
  created_at timestamptz default now()
);

-- Portfolio
create table portfolio_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  media_url text not null,
  media_type text check (media_type in ('image', 'video')),
  is_public_guest boolean default false,
  created_at timestamptz default now()
);
```
