# UI_SCREENS.md - Visual Description & Flow

## 1. Public Website (Guest Access)
**A. Landing Page (Home)**
- **Header**: Logo (DecoRight), Navigation (Home, Portfolio, Services, Contact), CTA Button ("Client Login").
- **Hero Section**: High-quality background image, bold text: "Elevate Your Space in Algeria", Button: "Start Your Project".
- **Services Grid**: 3 Cards showing the Service Types (Interior, Renovation, etc.).
- **Portfolio Teaser**: A 2x2 grid of "Featured" public projects.
- **Footer**: Social links, Contact info, Copyright.

**B. Public Portfolio**
- **Filter Bar**: Filter by Category (Service Type) or Space Type.
- **Grid**: Masonry layout of project images.
- **Modal**: Clicking an image opens a modal with the full description and "Related Images".

---

## 2. Client Portal (Authenticated)
**A. Client Dashboard**
- **Welcome**: "Welcome back, [Name]".
- **Active Requests**: A list of cards showing current status (e.g., "Kitchen Renovation - PENDING").
- **Action**: Big Floating Action Button (FAB) or Card: "New Request".

**B. New Request Wizard**
- **Step 1: Details**: Dropdown for Service Type, Dropdown for Space Type, Input for Location, Textarea for Description.
- **Step 2: Attachments**: File uploader (Drag & drop) for images/PDFs.
- **Step 3: Review**: Summary screen -> Submit.

**C. Request Detail View (The Chat)**
- **Left/Top**: Status bar (Pending -> Approved -> In Progress).
- **Center**: The Chat Interface.
    - Message bubbles (Right = Me, Left = Admin).
    - System bubbles (Gray center = "Request Created", "Status changed to Approved").
- **Input Area**: Text field, Paperclip icon (Upload), Mic icon (Audio - optional for Web MVP).

---

## 3. Admin Panel (Web Only - CRITICAL)
*Note: This area is protected. Only users with `role: 'SUPER_ADMIN'` can enter.*

**A. Admin Dashboard (Command Center)**
- **Stats Row**: "Total Requests", "Pending Action", "Active Projects".
- **The Kanban Board**: Columns representing Status (Pending, Under Review, In Progress, Completed).
    - Drag and drop requests between columns to change status.

**B. Request Manager**
- Clicking a card in Kanban opens a split view:
    - **Left**: Chat with Client (Realtime).
    - **Right**: Request Details (Budget, Area, Files).
    - **Actions**: Buttons to "Approve", "Reject", "Cancel".
    - **Internal Notes**: A text area for Admin-only notes (not visible to client).

**C. CMS / Portfolio Manager**
- **Upload**: Button to upload multiple images.
- **Form**: Title, Description, Date, Visibility (Public/Private).
- **List**: Table view of all projects with Edit/Delete buttons.