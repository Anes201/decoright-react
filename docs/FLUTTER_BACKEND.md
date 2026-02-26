# DecoRight - Flutter Backend Documentation

This document provides a comprehensive backend and API reference for a Flutter developer rebuilding the customer-facing features of the DecoRight platform.

## 1. Project Overview
DecoRight is an Algerian interior design and decoration service platform. The Flutter application focuses exclusively on **Customer (Client)** features: browsing the portfolio, submitting service requests, and chatting with admins about those requests.

**Tech Stack:**
- **Database/Auth/Storage/Realtime:** Supabase
- **Backend Language:** Postgres (PL/pgSQL for RLS and RPCs)
- **API Style:** Direct Supabase Client (no custom REST/GraphQL wrapper)

## 2. Supabase Setup
- **Flutter Package:** `supabase_flutter`
- **Initialization:**
  ```dart
  await Supabase.initialize(
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
  );
  final supabase = Supabase.instance.client;
  ```
- **Authentication:** Handled automatically by the Supabase client via JWT. Persisted locally in secure storage.

## 3. Database Enums
Use these exact strings for filters and inserts.

- **`user_role`**: `customer`, `admin`
- **`request_status`**: `Submitted`, `Under Review`, `Waiting for Client Info`, `Approved`, `In Progress`, `Completed`, `Rejected`, `Cancelled`
- **`message_type_enum`**: `TEXT`, `IMAGE`, `AUDIO`, `SYSTEM`
- **`file_type_enum`**: `IMAGE`, `PDF`, `DOCUMENT`, `CAD`, `3D_MODEL`
- **`project_visibility`**: `PUBLIC`, `AUTHENTICATED_ONLY`, `HIDDEN`
- **`project_space_type`** (Legacy, mostly unused): `HOUSES_AND_ROOMS`, `COMMERCIAL_SHOPS`, `SCHOOLS_AND_NURSERIES`, `OFFICES_RECEPTION`, `DORMITORY_LODGINGS`

## 4. Database Schema (Customer-Facing)

### `profiles`
User profiles linked to `auth.users`.
- `id` (uuid, PK, FK to auth.users)
- `role` (user_role, default: 'customer')
- `full_name` (text)
- `email` (text)
- `phone` (text, unique, E.164 format: +213...)
- `phone_verified` (boolean, default: false)
- `is_active` (boolean, default: true)
- `created_at` / `updated_at` (timestamptz)

### `service_requests`
Customer submissions for design services.
- `id` (uuid, PK)
- `user_id` (uuid, FK to profiles)
- `service_type_id` (uuid, FK to service_types)
- `space_type_id` (uuid, FK to space_types)
- `description` (text)
- `location` (text)
- `width` (numeric)
- `height` (numeric)
- `duration` (integer, days)
- `status` (request_status, default: 'Submitted')
- `request_code` (text, unique, format: REQ-1234)
- `created_at` / `updated_at` (timestamptz)

### `chat_rooms`
One-to-one chat room per service request.
- `id` (uuid, PK)
- `request_id` (uuid, unique, FK to service_requests)
- `is_active` (boolean, default: true)
- `created_at` / `updated_at` (timestamptz)

### `messages`
Chat messages within a room.
- `id` (uuid, PK)
- `chat_room_id` (uuid, FK to chat_rooms)
- `request_id` (uuid, FK to service_requests)
- `sender_id` (uuid, FK to profiles)
- `content` (text)
- `message_type` (message_type_enum)
- `media_url` (text, nullable)
- `duration_seconds` (integer, for audio)
- `attachments` (jsonb, default: [])
- `is_read` (boolean, default: false)
- `created_at` (timestamptz)

### `request_attachments`
Files uploaded with a service request.
- `id` (uuid, PK)
- `request_id` (uuid, FK to service_requests)
- `file_url` (text)
- `file_name` (text)
- `file_type` (file_type_enum)
- `uploaded_at` (timestamptz)

### `projects`
Portfolio items.
- `id`, `slug` (unique)
- `title`, `title_ar`, `title_fr` (text)
- `description`, `description_ar`, `description_fr` (text)
- `location`, `location_ar`, `location_fr` (text)
- `service_type_id` (uuid, FK)
- `space_type_id` (uuid, FK)
- `main_image_url`, `thumbnail_url` (text)
- `visibility` (project_visibility)
- `view_count` (integer)
- `width`, `height` (numeric)
- `construction_start_date`, `construction_end_date` (date)

### `gallery_items`
Before/After comparison items.
- `id` (uuid, PK)
- `title`, `title_ar`, `title_fr`
- `description`, `description_ar`, `description_fr`
- `before_image_url`, `after_image_url`
- `visibility` (project_visibility)

### Support Tables
- `service_types` (id, name, display_name_en/ar/fr, image_url, is_active)
- `space_types` (id, name, display_name_en/ar/fr, is_active)
- `faqs` (id, question_en/ar/fr, answer_en/ar/fr, display_order, is_active)
- `site_settings` (id, key, value)
- `likes` (user_id, project_id)

## 5. Row Level Security (RLS)
- **Profiles**: Authenticated users can read/update their own profile.
- **Service Requests**: Users can insert their own, read their own, and update their own.
- **Chat Rooms**: Users can read rooms linked to their own requests.
- **Messages**: Users can read/insert messages for their own rooms.
- **Attachments**: Users can read/insert attachments for their own requests.
- **Portfolio/Gallery/FAQ**: Authenticated users can read anything that is not `HIDDEN`. Guests (anon) can only read `PUBLIC`.

## 6. Authentication Flows

### Signup
1. `supabase.auth.signUp(email: email, password: password, data: {'full_name': name, 'phone': normalizedPhone})`
2. Navigate to OTP Screen.
3. `supabase.auth.verifyOtp(email: email, token: token, type: OtpType.signup)`

### Login
`supabase.auth.signInWithPassword(email: email, password: password)`

### Password Reset
1. `supabase.auth.resetPasswordForEmail(email, redirectTo: 'app://reset-callback')`
2. Catch deep link → User is now in a "recovery session".
3. Check `supabase.auth.currentUser?.recoverySentAt != null`.
4. `supabase.auth.updateUser(UserAttributes(password: newPassword))`

### Phone Normalization (Algerian)
The React app uses a utility to normalize numbers before sending to Supabase:
- Remove all non-digits.
- If starts with `0` (e.g. `05...`), replace `0` with `+213`.
- If starts with `213`, add `+`.
- Final format: `+213XXXXXXXXX`.

## 7. Storage
**Bucket Name:** `request-attachments`

**Upload Paths:**
- Request Attachments: `attachments/${random_uuid}.${ext}`
- Chat Images: `${roomId}/${timestamp}.${ext}`
- Chat Audio: `${roomId}/${timestamp}.webm`

**Public URL:**
`https://[PROJECT_ID].supabase.co/storage/v1/object/public/request-attachments/${path}`

## 8. Realtime (Chat)
Subscriptions use `PostgresChangesPayload`.

**Channel Patterns:**
- Rooms List: `supabase.channel('chat_rooms_realtime').onPostgresChanges(table: 'chat_rooms', callback: ...)`
- Room Messages: `supabase.channel('room_messages_$roomId').onPostgresChanges(table: 'messages', filter: 'chat_room_id=eq.$roomId', callback: ...)`

## 9. Key API Operations (CRUD Patterns)

### Submit Request
```sql
-- Step 1: Insert Request
INSERT INTO service_requests (service_type_id, space_type_id, description, location, width, height, user_id, status, request_code)
VALUES (...) RETURNING id;

-- Step 2: Insert Chat Room (auto-created in React app service)
INSERT INTO chat_rooms (request_id, is_active) VALUES (request_id, true);

-- Step 3: Insert Attachments (if any)
INSERT INTO request_attachments (request_id, file_name, file_url, file_type) VALUES (...);
```

### Fetch Portfolio
```dart
supabase.from('projects')
  .select('*, project_images(*)')
  .in_('visibility', ['PUBLIC', if(isLoggedIn) 'AUTHENTICATED_ONLY'])
  .order('created_at', ascending: false);
```

### Fetch Chat Rooms
```dart
supabase.from('chat_rooms')
  .select('*, service_requests(*)')
  .order('updated_at', ascending: false);
```

### Send Message
```dart
supabase.from('messages').insert({
  'chat_room_id': roomId,
  'request_id': requestId,
  'sender_id': myId,
  'content': text,
  'message_type': 'TEXT',
});
```
