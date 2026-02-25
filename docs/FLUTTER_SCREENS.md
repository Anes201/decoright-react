# DecoRight - Flutter Screens Documentation

This document outlines all customer-facing screens to be implemented in the Flutter application.

## 1. App Navigation Structure
- **Public Stack**: Onboarding/Landing → Auth (Login/Signup/OTP/Forgot Password)
- **Main App Stack (Authenticated)**: Bottom Navigation Bar with 4 tabs:
  1. **Home** (Dashboard)
  2. **Requests** (My Service Requests)
  3. **Chat** (Room List)
  4. **Profile** (Account Details & Settings)

---

## 2. Public Screens

### Landing / Home
- **Route**: `/`
- **Purpose**: Brand introduction and guest navigation.
- **UI Elements**:
  - Hero section with high-quality background and CTA ("Get Started").
  - Services Preview (horizontal scroll or grid).
  - Portfolio Preview (latest 3-4 projects).
  - FAQ Preview (top 3 questions).
- **Actions**:
  - Tap "Get Started" → Signup/Login.
  - Tap Service → Service List.
  - Tap Project → Project Detail.

### Service List
- **Route**: `/services`
- **Data**: Fetch all `is_active=true` from `service_types`.
- **UI**: Grid of cards with service name (multi-lang) and image.
- **Actions**: Tap card → Navigate to Projects filtered by this service (optional) or back to CTA.

### Projects / Portfolio List
- **Route**: `/projects`
- **Data**: Fetch `projects` where `visibility` is `PUBLIC` (add `AUTHENTICATED_ONLY` if logged in).
- **UI**: 
  - Filter by Service Type (chip group).
  - Project cards with thumbnail, title, location, and metadata row (likes, views).
- **Actions**: Tap project → Project Detail.

### Project Detail
- **Route**: `/projects/:slug`
- **Data**: Fetch project by slug + `project_images`.
- **UI**:
  - Image carousel/slider.
  - Stats row: Location, Dimensions (W x H), Views, Likes, Date.
  - Description text (scrollable).
  - Like button (toggle `likes` table entry).
  - "Request Similar Service" button at bottom.
- **Actions**: Tap Like, Tap CTA.

### Gallery (Before/After)
- **Route**: `/gallery`
- **Data**: Fetch `gallery_items` where `visibility` matches auth state.
- **UI**: Vertical list of "Before/After" comparison cards (using a comparison slider widget).
- **Actions**: Slide to compare images.

### FAQ
- **Route**: `/faq`
- **Data**: Fetch all `is_active=true` from `faqs` sorted by `display_order`.
- **UI**: Searchable accordion list.

### Contact
- **Route**: `/contact`
- **Data**: Fetch phone, email, map, social links from `site_settings`.
- **UI**: Contact cards with icons. Tap-to-call/Tap-to-email functionality.

### Auth: Login / Signup / OTP
- **Login**: Email + Password. "Forgot Password" link.
- **Signup**: Name, Phone (normalized), Email, Password. Redirects to OTP.
- **OTP Screen**: 6-digit verification code. "Resend" button with 60s cooldown.
- **Forgot Password**: Email input → confirmation message.

---

## 3. Authenticated Customer Screens

### Client Home (Dashboard)
- **Route**: `/client`
- **UI**:
  - Personalized welcome (e.g., "Hello, [Name]").
  - Active Requests Summary (horizontal cards showing status of recent requests).
  - Quick Actions: "New Request", "Contact Support".
  - Recent Projects Carousel.

### My Requests List
- **Route**: `/client/requests`
- **Data**: `getMyRequests()` - all requests where `user_id = my_id`.
- **UI**: 
  - List of request cards with: Request Code, Service Type, Status Badge (color-coded), Date.
  - Status Badge mapping:
    - Blue: Submitted, Under Review
    - Yellow: Waiting for Client Info
    - Green: Approved, In Progress, Completed
    - Red: Rejected, Cancelled
- **Actions**: Tap card → Request Detail.

### Submit New Request
- **Route**: `/client/requests/new`
- **UI**: Multi-step or long-form:
  - Select Service Type (Dropdown/Grid).
  - Select Space Type (Dropdown).
  - Dimensions (Numeric Inputs: Width, Height).
  - Location (Text Input).
  - Description (Multi-line Text).
  - Attachments (File Picker for Images/PDFs).
- **Validation**: Required fields, positive numbers for dimensions.
- **Workflow**: Upload files to Storage first → Insert Request → Insert Attachments → Insert Chat Room.

### Request Detail
- **Route**: `/client/requests/:id`
- **UI**:
  - Header with Status and Request Code.
  - Metadata section (Service, Space, Dimensions, Location).
  - Description section.
  - Attachments Grid (tap to open/download).
  - Floating Action Button: "Open Chat".

### Chat List
- **Route**: `/client/chat`
- **UI**: List of rooms. Each item shows:
  - Service Request Title/Code.
  - Last message snippet.
  - Unread badge (count).
  - Timestamp.

### Chat Room
- **Route**: `/client/chat/:id`
- **UI**:
  - Header with Request title and status.
  - Message bubble list (Real-time).
  - Different bubble styles for Me vs Admin.
  - Support for IMAGE messages (tap to zoom).
  - Support for AUDIO messages (voice player widget).
  - Support for SYSTEM messages (centered text).
  - Input Bar: Text field, Image picker icon, Voice recording icon (hold to record).

### Account Profile & Settings
- **Profile**: Displays user info (Name, Email, Phone) and "Edit Profile" button.
- **Settings**:
  - Edit Full Name.
  - Edit Phone (with re-verification logic if changed).
  - Language Switcher (EN/AR/FR).
  - "Security" → Navigate to Password Change.
  - "Logout" button.

### Password Change / Set
- **Change**: Form with Current Password, New Password, Confirm New Password.
- **Set**: For users who logged in via recovery link. Just New Password + Confirm.

---

## 4. Key UX Flows
1. **Request Flow**: Home → New Request Form → Success Dialog → Auto-navigate to Request Detail → Open Chat.
2. **Chat Media**: Tap "+" → Pick Image → Show upload progress in bubble → Message appears once storage upload is finished.
3. **Voice Message**: Hold mic icon → Waveform/Timer appears → Release to send → `webm` file uploaded and sent as `AUDIO` type message.
4. **i18n Implementation**: Every screen must check `display_name_ar` or `title_fr` etc. based on the active app locale. If suffix is empty, fallback to English.
