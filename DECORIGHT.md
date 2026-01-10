# DecoRight – Consolidated Project Specifications

## 0. Project Overview

**Project Name:** DecoRight\
**Type:** Service-request platform (not a marketplace)\
**Target:** Local Algerian decoration & interior design company\
**Phase:** Early customer engagement only

DecoRight is a lightweight web + mobile platform designed to manage *potential* customer interactions for a decoration agency. The platform’s job ends once both parties agree to proceed. After that, communication moves off-platform (email, face-to-face). No payments, no contracts, no heavy workflows. The platform exists to qualify leads, showcase work, and centralize early discussions.

---

## 1. Core Objectives

### Website / App Goals

- Showcase decoration & design services
- Display a curated portfolio of previous works
- Allow visitors to request services and book consultations
- Enable structured communication between visitors and the agency
- Maintain a professional digital presence
- Reduce manual coordination during early discussions

This is intentionally *not* a marketplace, CRM, or ERP.

---

## 2. User Roles & Permissions

### Roles

1. **Guest (Unauthenticated)**

   - View landing page
   - View limited portfolio items
   - Read testimonials and service descriptions
   - Sign up / log in

2. **Customer (Authenticated User)**

   - View extended portfolio
   - Submit service requests
   - Participate in chats related to their requests
   - Upload files related to their requests

3. **Admin (DecoRight Company)**

   - Full access to all data
   - Manage service requests and statuses
   - Chat with customers
   - Upload and manage portfolio items
   - View basic metrics

There are only two real actors: customers and admins. Everything else is noise.

---

## 3. Authentication & Access Control

- Email-based authentication
- Simple signup form (email + basic profile info)
- No social login required in MVP
- Authentication required to:
  - View full portfolio
  - Submit service requests
  - Use chat

---

## 4. Services Offered

### Service Types

The platform supports a fixed list of services:

- Interior Design
- Fixed Design
- Decor Consultation

### Pricing

- No pricing logic in the platform
- No estimates, no checkout, no invoices
- Pricing discussions happen exclusively via chat or external communication

---

## 5. Service Request Lifecycle

### Request Creation

- Customer submits a service request after authentication
- Request includes:
  - Selected service type
  - Optional description
  - Optional file uploads

### Request Statuses

Recommended lifecycle:

1. Submitted
2. Under Review
3. Waiting for Client Info
4. Approved
5. In Progress
6. Completed
7. Rejected

### Status Rules

- Status changes are **admin-only**
- Customers can view status but cannot modify it

---

## 6. Messaging / Chat System (MVP-Critical)

### Scope

- Chat is the primary interaction tool during early discussions
- Chat is always tied to a specific service request

### Behavior

- Real-time messaging preferred (WebSocket or equivalent)
- Both admin and customer can initiate messages
- Chat can start automatically when a request is submitted

### Storage

- Message history retained per request
- No archival or deletion logic in MVP

---

## 7. File Uploads & Storage

### Allowed File Types

- Images (JPEG, PNG, etc.)
- PDFs
- AutoCAD files

### Upload Context

- Files can be attached to chat messages or service requests

### Visibility Rules

- Files shared in chat are private (customer + admin only)
- Portfolio files are public

### Constraints

- File size and limits follow the chosen backend free-tier defaults
- No versioning or file history tracking

---

## 8. Portfolio Management

### Purpose

A simple gallery showcasing previous works to build trust and credibility.

### Rules

- Admin-only upload and management
- No approval workflow
- No linkage to real customer requests
- No categories or advanced filters
- Guest users see a limited number of items
- Authenticated users see more items

### Content

- Images only (initially)
- Videos
- Optional descriptions

---

## 9. Admin Dashboard

### Core Features

1. **Service Requests Management**

   - List all customer requests
   - View request details
   - Update request status
   - Access related chat

2. **Chat Interface**

   - Per-request chat view
   - File sharing

3. **Portfolio Management**

   - Upload new gallery items
   - Control visibility

4. **Basic Metrics**

   - Total number of requests
   - Conversion rate (e.g., submitted → approved)

No analytics theater. Just numbers that matter.

---

## 10. App vs Website Architecture

- Single backend
- Shared APIs between web and mobile app
- Identical feature set
- Web is the priority interface
- Admins can manage everything from both platforms

---

## 11. Payments

- No payment system
- No integrations
- No placeholders

This platform never touches money.

---

## 12. Notifications

- No notification system in MVP
- No email triggers
- No push notifications

All communication happens in-platform chat or externally.

---

## 13. SEO & Content Pages

### Content Scope

- Public pages: Home, Services, Limited Portfolio
- Authenticated pages: Extended Portfolio, Requests, Chat

### Blog / CMS

- Not a full CMS
- Admin-managed content only
- Low-frequency updates (portfolio additions)

### Localization

- English only in MVP
- Multilingual support planned for later phases

---

## 14. MVP Boundaries (Hard Limits)

Explicitly excluded from MVP:

- Payments
- Contracts
- Scheduling automation
- Notifications
- Advanced analytics
- CRM features
- Role complexity

If it doesn’t help initiate a conversation, it doesn’t belong here.

---

## 15. Success Criteria

The project is successful if:

- Visitors can understand services quickly
- Interested users can sign up and submit requests
- Admins can manage and respond to requests efficiently
- Early discussions move off-platform smoothly

Anything beyond that is scope creep wearing a fancy hat.

