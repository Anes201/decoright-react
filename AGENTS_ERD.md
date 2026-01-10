---
title: DecoRight ERD (Supabase Optimized)
author: System Architect
version: 2.0
---

erDiagram
    %% ==================================================================================
    %%  IMPORTANT CONTEXT FOR AI AGENTS
    %% ==================================================================================
    %% 1. TARGET STACK: Flutter (Mobile/Web) + Supabase (PostgreSQL).
    %% 2. AUTHENTICATION: Use Supabase Auth. The 'PROFILES' table mirrors 'auth.users'.
    %% 3. PRIMARY KEYS: Use UUIDs (gen_random_uuid()) for all tables to ensure 
    %%    compatibility with Supabase Auth and easier data migration.
    %% 4. SECURITY: Row Level Security (RLS) is MANDATORY. 
    %%    - Users see only their own data.
    %%    - Admins see EVERYTHING.
    %% 5. RELIABILITY: This schema prioritizes stability over complex features.
    %% ==================================================================================

    %% ==========================================
    %% 1. USER MANAGEMENT (Public Profile)
    %% ==========================================
    PROFILES {
        uuid id PK "References auth.users.id (One-to-One). CASCADE DELETE."
        string email UK "Read-only copy from auth.users"
        string first_name "Required at signup"
        string last_name "Required at signup"
        string phone_number "Required contact info"
        string avatar_url "Storage bucket path"
        enum role "CLIENT, SUPER_ADMIN"
        datetime created_at
        datetime updated_at
    }

    %% ==========================================
    %% 2. PORTFOLIO SYSTEM (Gallery)
    %% ==========================================
    PROJECT {
        uuid id PK
        string title
        text description
        %% New Service Enum based on Client Specs
        enum service_type "INTERIOR_DESIGN, FIXED_DESIGN, DECOR_CONSULTATION, BUILDING_RENOVATION, FURNITURE_REQUEST"
        %% New Space Enum based on Client Specs
        enum space_type "HOUSES_AND_ROOMS, COMMERCIAL_SHOPS, SCHOOLS_AND_NURSERIES, OFFICES_RECEPTION, DORMITORY_LODGINGS"
        decimal area_sqm "Optional"
        string location "Optional"
        string main_image_url "Cover image"
        
        %% Visibility Control
        enum visibility "PUBLIC, AUTHENTICATED_ONLY, HIDDEN"
        %% PUBLIC: Visible to guests.
        %% AUTHENTICATED_ONLY: Visible only after login.
        %% HIDDEN: Draft/Archived (Admin only).

        date construction_start_date "Optional"
        date construction_end_date "Optional"
        datetime created_at
        datetime updated_at
    }

    PROJECT_IMAGE {
        uuid id PK
        uuid project_id FK
        string image_url
        boolean is_cover "Helper to quickly identify cover in lists"
        int sort_order
        datetime uploaded_at
    }

    %% ==========================================
    %% 3. SERVICE REQUESTS (The Core Loop)
    %% ==========================================
    SERVICE_REQUEST {
        uuid id PK
        string request_code UK "Readable ID for Humans (e.g. REQ-1024)"
        uuid client_id FK "Links to PROFILES.id"
        
        %% Core Classification
        enum service_type "INTERIOR_DESIGN, FIXED_DESIGN, DECOR_CONSULTATION, BUILDING_RENOVATION, FURNITURE_REQUEST"
        enum space_type "HOUSES_AND_ROOMS, COMMERCIAL_SHOPS, SCHOOLS_AND_NURSERIES, OFFICES_RECEPTION, DORMITORY_LODGINGS"
        
        %% Simplified Fields
        decimal area_sqm "Optional"
        string location "Required"
        text description "User's explanation"
        
        %% Workflow Status
        enum status "PENDING, UNDER_REVIEW, APPROVED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED"
        
        datetime created_at
        datetime updated_at
        datetime completed_at
    }

    REQUEST_ATTACHMENT {
        uuid id PK
        uuid request_id FK
        string file_url
        string file_name
        string file_type "IMAGE, PDF, DOCUMENT, CAD, 3D_MODEL" 
        %% NOTE: CAD = .dwg/.dxf, 3D_MODEL = .obj/.fbx
        datetime uploaded_at
    }

    %% ==========================================
    %% 4. COMMUNICATION SYSTEM (Chat)
    %% ==========================================
    CHAT_ROOM {
        uuid id PK
        uuid request_id FK "One Room per Request"
        boolean is_active "True by default. False if request is Completed/Cancelled"
        datetime created_at
        datetime updated_at
    }

    MESSAGE {
        uuid id PK
        uuid chat_room_id FK
        uuid sender_id FK "Links to PROFILES.id"
        
        enum message_type "TEXT, IMAGE, AUDIO, SYSTEM"
        %% TEXT: Standard text
        %% IMAGE: Standard image upload
        %% AUDIO: Voice note recording
        %% SYSTEM: Auto-generated (e.g., 'Request Approved') - Sender is NULL or Admin
        
        text content "Text body or empty if media"
        string media_url "URL for Image/Audio file"
        int duration_seconds "Only for AUDIO"
        
        boolean is_read
        datetime sent_at
    }

    %% ==========================================
    %% 5. SOCIAL & FEEDBACK (Simplified)
    %% ==========================================
    LIKE {
        uuid user_id PK_FK
        uuid project_id PK_FK
        datetime created_at
    }

    TESTIMONIAL {
        uuid id PK
        uuid user_id FK
        uuid project_id FK "Optional link to project"
        int rating "1-5"
        text comment
        boolean is_approved "Admin must approve before showing on Home"
        datetime created_at
    }

    %% ==========================================
    %% 6. ADMIN CMS (Web Panel Only)
    %% ==========================================
    SITE_SETTINGS {
        uuid id PK
        string key UK "contact_phone, contact_email, facebook_url, etc"
        text value
        string description "Helper text for Admin Panel UI"
        datetime updated_at
    }

    CONTACT_MESSAGE {
        uuid id PK
        %% For anonymous "Contact Us" form on Landing Page
        string name
        string email
        string phone
        string subject
        text message
        enum status "NEW, READ, ARCHIVED"
        datetime created_at
    }

    ADMIN_ACTIVITY {
        uuid id PK
        uuid admin_id FK
        enum action "STATUS_CHANGE, PROJECT_PUBLISH, SETTINGS_UPDATE"
        string target_table "SERVICE_REQUEST, PROJECT, SITE_SETTINGS"
        uuid target_id
        text details "JSON or Description of change"
        datetime created_at
    }

    %% ==========================================
    %% RELATIONSHIPS
    %% ==========================================

    %% User & Request
    PROFILES ||--o{ SERVICE_REQUEST : "submits"
    PROFILES ||--o{ LIKE : "likes_projects"
    PROFILES ||--o{ TESTIMONIAL : "writes"
    PROFILES ||--o{ MESSAGE : "sends"
    PROFILES ||--o{ ADMIN_ACTIVITY : "logs (if admin)"

    %% Service Request
    SERVICE_REQUEST ||--o{ REQUEST_ATTACHMENT : "has_files"
    SERVICE_REQUEST ||--|| CHAT_ROOM : "has_one_chat"

    %% Chat
    CHAT_ROOM ||--o{ MESSAGE : "contains"

    %% Project
    PROJECT ||--o{ PROJECT_IMAGE : "gallery"
    PROJECT ||--o{ LIKE : "has_likes"
    PROJECT ||--o{ TESTIMONIAL : "referenced_in"

    %% Admin
    PROFILES ||--o{ SITE_SETTINGS : "manages"
    PROFILES ||--o{ CONTACT_MESSAGE : "reads"