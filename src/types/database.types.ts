export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            admin_activities: {
                Row: {
                    id: string
                    admin_id: string | null
                    action: Database["public"]["Enums"]["admin_action"]
                    target_table: string
                    target_id: string | null
                    details: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    admin_id?: string | null
                    action: Database["public"]["Enums"]["admin_action"]
                    target_table: string
                    target_id?: string | null
                    details?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    admin_id?: string | null
                    action?: Database["public"]["Enums"]["admin_action"]
                    target_table?: string
                    target_id?: string | null
                    details?: string | null
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "admin_activities_admin_id_fkey"
                        columns: ["admin_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            chat_rooms: {
                Row: {
                    id: string
                    request_id: string | null
                    is_active: boolean | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    request_id?: string | null
                    is_active?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    request_id?: string | null
                    is_active?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "chat_rooms_request_id_fkey"
                        columns: ["request_id"]
                        isOneToOne: false
                        referencedRelation: "service_requests"
                        referencedColumns: ["id"]
                    },
                ]
            }
            contact_messages: {
                Row: {
                    id: string
                    name: string
                    email: string
                    phone: string | null
                    subject: string | null
                    message: string
                    status: Database["public"]["Enums"]["contact_status"]
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    phone?: string | null
                    subject?: string | null
                    message: string
                    status?: Database["public"]["Enums"]["contact_status"]
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    phone?: string | null
                    subject?: string | null
                    message?: string
                    status?: Database["public"]["Enums"]["contact_status"]
                    created_at?: string | null
                }
                Relationships: []
            }
            faqs: {
                Row: {
                    id: string
                    question_en: string
                    question_ar: string | null
                    question_fr: string | null
                    answer_en: string
                    answer_ar: string | null
                    answer_fr: string | null
                    display_order: number | null
                    is_active: boolean | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    question_en: string
                    question_ar?: string | null
                    question_fr?: string | null
                    answer_en: string
                    answer_ar?: string | null
                    answer_fr?: string | null
                    display_order?: number | null
                    is_active?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    question_en?: string
                    question_ar?: string | null
                    question_fr?: string | null
                    answer_en?: string
                    answer_ar?: string | null
                    answer_fr?: string | null
                    display_order?: number | null
                    is_active?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            gallery_items: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    before_image_url: string | null
                    after_image_url: string | null
                    visibility: Database["public"]["Enums"]["project_visibility"] | null
                    created_at: string | null
                    updated_at: string | null
                    title_ar: string | null
                    title_fr: string | null
                    description_ar: string | null
                    description_fr: string | null
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    before_image_url?: string | null
                    after_image_url?: string | null
                    visibility?: Database["public"]["Enums"]["project_visibility"] | null
                    created_at?: string | null
                    updated_at?: string | null
                    title_ar?: string | null
                    title_fr?: string | null
                    description_ar?: string | null
                    description_fr?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    before_image_url?: string | null
                    after_image_url?: string | null
                    visibility?: Database["public"]["Enums"]["project_visibility"] | null
                    created_at?: string | null
                    updated_at?: string | null
                    title_ar?: string | null
                    title_fr?: string | null
                    description_ar?: string | null
                    description_fr?: string | null
                }
                Relationships: []
            }
            likes: {
                Row: {
                    user_id: string
                    project_id: string
                    created_at: string | null
                }
                Insert: {
                    user_id: string
                    project_id: string
                    created_at?: string | null
                }
                Update: {
                    user_id?: string
                    project_id?: string
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "likes_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "likes_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            messages: {
                Row: {
                    id: string
                    request_id: string
                    sender_id: string | null
                    content: string
                    created_at: string | null
                    attachments: Json | null
                    chat_room_id: string | null
                    message_type: Database["public"]["Enums"]["message_type_enum"] | null
                    media_url: string | null
                    duration_seconds: number | null
                    is_read: boolean | null
                }
                Insert: {
                    id?: string
                    request_id: string
                    sender_id?: string | null
                    content: string
                    created_at?: string | null
                    attachments?: Json | null
                    chat_room_id?: string | null
                    message_type?: Database["public"]["Enums"]["message_type_enum"] | null
                    media_url?: string | null
                    duration_seconds?: number | null
                    is_read?: boolean | null
                }
                Update: {
                    id?: string
                    request_id?: string
                    sender_id?: string | null
                    content?: string
                    created_at?: string | null
                    attachments?: Json | null
                    chat_room_id?: string | null
                    message_type?: Database["public"]["Enums"]["message_type_enum"] | null
                    media_url?: string | null
                    duration_seconds?: number | null
                    is_read?: boolean | null
                }
                Relationships: [
                    {
                        foreignKeyName: "messages_chat_room_id_fkey"
                        columns: ["chat_room_id"]
                        isOneToOne: false
                        referencedRelation: "chat_rooms"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "messages_sender_id_fkey"
                        columns: ["sender_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "messages_request_id_fkey"
                        columns: ["request_id"]
                        isOneToOne: false
                        referencedRelation: "service_requests"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    id: string
                    role: Database["public"]["Enums"]["user_role"] | null
                    full_name: string | null
                    created_at: string | null
                    phone: string | null
                    updated_at: string | null
                    is_active: boolean | null
                    internal_notes: string | null
                    email: string | null
                    phone_verified: boolean | null
                }
                Insert: {
                    id: string
                    role?: Database["public"]["Enums"]["user_role"] | null
                    full_name?: string | null
                    created_at?: string | null
                    phone?: string | null
                    updated_at?: string | null
                    is_active?: boolean | null
                    internal_notes?: string | null
                    email?: string | null
                    phone_verified?: boolean | null
                }
                Update: {
                    id?: string
                    role?: Database["public"]["Enums"]["user_role"] | null
                    full_name?: string | null
                    created_at?: string | null
                    phone?: string | null
                    updated_at?: string | null
                    is_active?: boolean | null
                    internal_notes?: string | null
                    email?: string | null
                    phone_verified?: boolean | null
                }
                Relationships: []
            }
            project_images: {
                Row: {
                    id: string
                    project_id: string | null
                    image_url: string
                    is_cover: boolean | null
                    sort_order: number | null
                    uploaded_at: string | null
                }
                Insert: {
                    id?: string
                    project_id?: string | null
                    image_url: string
                    is_cover?: boolean | null
                    sort_order?: number | null
                    uploaded_at?: string | null
                }
                Update: {
                    id?: string
                    project_id?: string | null
                    image_url?: string
                    is_cover?: boolean | null
                    sort_order?: number | null
                    uploaded_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "project_images_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            projects: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    space_type: Database["public"]["Enums"]["space_type"] | null
                    location: string | null
                    main_image_url: string | null
                    visibility: Database["public"]["Enums"]["project_visibility"] | null
                    construction_start_date: string | null
                    construction_end_date: string | null
                    created_at: string | null
                    updated_at: string | null
                    service_type_id: string | null
                    space_type_id: string | null
                    slug: string | null
                    thumbnail_url: string | null
                    width: number | null
                    height: number | null
                    title_ar: string | null
                    title_fr: string | null
                    description_ar: string | null
                    description_fr: string | null
                    location_ar: string | null
                    location_fr: string | null
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    space_type?: Database["public"]["Enums"]["space_type"] | null
                    location?: string | null
                    main_image_url?: string | null
                    visibility?: Database["public"]["Enums"]["project_visibility"] | null
                    construction_start_date?: string | null
                    construction_end_date?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                    service_type_id?: string | null
                    space_type_id?: string | null
                    slug?: string | null
                    thumbnail_url?: string | null
                    width?: number | null
                    height?: number | null
                    title_ar?: string | null
                    title_fr?: string | null
                    description_ar?: string | null
                    description_fr?: string | null
                    location_ar?: string | null
                    location_fr?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    space_type?: Database["public"]["Enums"]["space_type"] | null
                    location?: string | null
                    main_image_url?: string | null
                    visibility?: Database["public"]["Enums"]["project_visibility"] | null
                    construction_start_date?: string | null
                    construction_end_date?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                    service_type_id?: string | null
                    space_type_id?: string | null
                    slug?: string | null
                    thumbnail_url?: string | null
                    width?: number | null
                    height?: number | null
                    title_ar?: string | null
                    title_fr?: string | null
                    description_ar?: string | null
                    description_fr?: string | null
                    location_ar?: string | null
                    location_fr?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "projects_service_type_id_fkey"
                        columns: ["service_type_id"]
                        isOneToOne: false
                        referencedRelation: "service_types"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "projects_space_type_id_fkey"
                        columns: ["space_type_id"]
                        isOneToOne: false
                        referencedRelation: "space_types"
                        referencedColumns: ["id"]
                    },
                ]
            }
            request_attachments: {
                Row: {
                    id: string
                    request_id: string | null
                    file_url: string | null
                    file_name: string | null
                    file_type: Database["public"]["Enums"]["file_type_enum"] | null
                    uploaded_at: string | null
                }
                Insert: {
                    id?: string
                    request_id?: string | null
                    file_url?: string | null
                    file_name?: string | null
                    file_type?: Database["public"]["Enums"]["file_type_enum"] | null
                    uploaded_at?: string | null
                }
                Update: {
                    id?: string
                    request_id?: string | null
                    file_url?: string | null
                    file_name?: string | null
                    file_type?: Database["public"]["Enums"]["file_type_enum"] | null
                    uploaded_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "request_attachments_request_id_fkey"
                        columns: ["request_id"]
                        isOneToOne: false
                        referencedRelation: "service_requests"
                        referencedColumns: ["id"]
                    },
                ]
            }
            service_requests: {
                Row: {
                    id: string
                    user_id: string | null
                    description: string | null
                    status: Database["public"]["Enums"]["request_status"]
                    created_at: string | null
                    updated_at: string | null
                    location: string | null
                    request_code: string
                    space_type: Database["public"]["Enums"]["space_type"] | null
                    service_type_id: string | null
                    space_type_id: string | null
                    width: number | null
                    height: number | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    description?: string | null
                    status: Database["public"]["Enums"]["request_status"]
                    created_at?: string | null
                    updated_at?: string | null
                    location?: string | null
                    request_code: string
                    space_type?: Database["public"]["Enums"]["space_type"] | null
                    service_type_id?: string | null
                    space_type_id?: string | null
                    width?: number | null
                    height?: number | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    description?: string | null
                    status?: Database["public"]["Enums"]["request_status"]
                    created_at?: string | null
                    updated_at?: string | null
                    location?: string | null
                    request_code?: string
                    space_type?: Database["public"]["Enums"]["space_type"] | null
                    service_type_id?: string | null
                    space_type_id?: string | null
                    width?: number | null
                    height?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "service_requests_service_type_id_fkey"
                        columns: ["service_type_id"]
                        isOneToOne: false
                        referencedRelation: "service_types"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "service_requests_space_type_id_fkey"
                        columns: ["space_type_id"]
                        isOneToOne: false
                        referencedRelation: "space_types"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "service_requests_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            service_types: {
                Row: {
                    id: string
                    name: string
                    display_name_en: string
                    display_name_ar: string | null
                    display_name_fr: string | null
                    description: string | null
                    is_active: boolean
                    image_url: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    display_name_en: string
                    display_name_ar?: string | null
                    display_name_fr?: string | null
                    description?: string | null
                    is_active?: boolean
                    image_url?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    display_name_en?: string
                    display_name_ar?: string | null
                    display_name_fr?: string | null
                    description?: string | null
                    is_active?: boolean
                    image_url?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            site_settings: {
                Row: {
                    id: string
                    key: string
                    value: string | null
                    description: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    key: string
                    value?: string | null
                    description?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    key?: string
                    value?: string | null
                    description?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            space_types: {
                Row: {
                    id: string
                    name: string
                    display_name_en: string
                    display_name_ar: string | null
                    display_name_fr: string | null
                    description: string | null
                    is_active: boolean | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    display_name_en: string
                    display_name_ar?: string | null
                    display_name_fr?: string | null
                    description?: string | null
                    is_active?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    display_name_en?: string
                    display_name_ar?: string | null
                    display_name_fr?: string | null
                    description?: string | null
                    is_active?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            testimonials: {
                Row: {
                    id: string
                    user_id: string | null
                    project_id: string | null
                    rating: number | null
                    comment: string | null
                    is_approved: boolean | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    project_id?: string | null
                    rating?: number | null
                    comment?: string | null
                    is_approved?: boolean | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    project_id?: string | null
                    rating?: number | null
                    comment?: string | null
                    is_approved?: boolean | null
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "testimonials_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "testimonials_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            admin_action: "STATUS_CHANGE" | "PROJECT_PUBLISH" | "SETTINGS_UPDATE"
            contact_status: "NEW" | "READ" | "ARCHIVED"
            file_type_enum: "IMAGE" | "PDF" | "DOCUMENT" | "CAD" | "3D_MODEL"
            message_type_enum: "TEXT" | "IMAGE" | "AUDIO" | "SYSTEM"
            project_visibility: "PUBLIC" | "AUTHENTICATED_ONLY" | "HIDDEN"
            request_status:
                | "Submitted"
                | "Under Review"
                | "Waiting for Client Info"
                | "Approved"
                | "In Progress"
                | "Completed"
                | "Rejected"
                | "Cancelled"
            space_type:
                | "HOUSES_AND_ROOMS"
                | "COMMERCIAL_SHOPS"
                | "SCHOOLS_AND_NURSERIES"
                | "OFFICES_RECEPTION"
                | "DORMITORY_LODGINGS"
            user_role: "customer" | "admin"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
