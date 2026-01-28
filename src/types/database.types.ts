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
                    action: Database["public"]["Enums"]["admin_action"]
                    admin_id: string | null
                    created_at: string | null
                    details: string | null
                    id: string
                    target_id: string | null
                    target_table: string
                }
                Insert: {
                    action: Database["public"]["Enums"]["admin_action"]
                    admin_id?: string | null
                    created_at?: string | null
                    details?: string | null
                    id?: string
                    target_id?: string | null
                    target_table: string
                }
                Update: {
                    action?: Database["public"]["Enums"]["admin_action"]
                    admin_id?: string | null
                    created_at?: string | null
                    details?: string | null
                    id?: string
                    target_id?: string | null
                    target_table?: string
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
                    created_at: string | null
                    id: string
                    is_active: boolean | null
                    request_id: string | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    request_id?: string | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    request_id?: string | null
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
            messages: {
                Row: {
                    attachment_url: string | null
                    chat_room_id: string | null
                    content: string
                    created_at: string | null
                    id: string
                    is_read: boolean | null
                    sender_id: string | null
                    type: Database["public"]["Enums"]["message_type_enum"] | null
                }
                Insert: {
                    attachment_url?: string | null
                    chat_room_id?: string | null
                    content: string
                    created_at?: string | null
                    id?: string
                    is_read?: boolean | null
                    sender_id?: string | null
                    type?: Database["public"]["Enums"]["message_type_enum"] | null
                }
                Update: {
                    attachment_url?: string | null
                    chat_room_id?: string | null
                    content?: string
                    created_at?: string | null
                    id?: string
                    is_read?: boolean | null
                    sender_id?: string | null
                    type?: Database["public"]["Enums"]["message_type_enum"] | null
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
                ]
            }
            profiles: {
                Row: {
                    created_at: string | null
                    full_name: string | null
                    id: string
                    internal_notes: string | null
                    is_active: boolean | null
                    phone: string | null
                    role: Database["public"]["Enums"]["user_role"] | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    full_name?: string | null
                    id: string
                    internal_notes?: string | null
                    is_active?: boolean | null
                    phone?: string | null
                    role?: Database["public"]["Enums"]["user_role"] | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    full_name?: string | null
                    id?: string
                    internal_notes?: string | null
                    is_active?: boolean | null
                    phone?: string | null
                    role?: Database["public"]["Enums"]["user_role"] | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            project_images: {
                Row: {
                    uploaded_at: string | null
                    id: string
                    image_url: string
                    is_cover: boolean | null
                    project_id: string | null
                    sort_order: number | null
                }
                Insert: {
                    uploaded_at?: string | null
                    id?: string
                    image_url: string
                    is_cover?: boolean | null
                    project_id?: string | null
                    sort_order?: number | null
                }
                Update: {
                    uploaded_at?: string | null
                    id?: string
                    image_url?: string
                    is_cover?: boolean | null
                    project_id?: string | null
                    sort_order?: number | null
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
            portfolio_items: {
                Row: {
                    id: string
                    title: string | null
                    description: string | null
                    media_url: string | null
                    media_type: string | null
                    is_public_guest: boolean | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    title?: string | null
                    description?: string | null
                    media_url?: string | null
                    media_type?: string | null
                    is_public_guest?: boolean | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    title?: string | null
                    description?: string | null
                    media_url?: string | null
                    media_type?: string | null
                    is_public_guest?: boolean | null
                    created_at?: string | null
                }
                Relationships: []
            }
            request_attachments: {
                Row: {
                    id: string
                    request_id: string | null
                    file_name: string | null
                    file_url: string | null
                    file_type: Database["public"]["Enums"]["file_type_enum"] | null
                    uploaded_at: string | null
                }
                Insert: {
                    id?: string
                    request_id?: string | null
                    file_name?: string | null
                    file_url?: string | null
                    file_type?: Database["public"]["Enums"]["file_type_enum"] | null
                    uploaded_at?: string | null
                }
                Update: {
                    id?: string
                    request_id?: string | null
                    file_name?: string | null
                    file_url?: string | null
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
            projects: {
                Row: {
                    area_sqm: number | null
                    construction_end_date: string | null
                    construction_start_date: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    location: string | null
                    main_image_url: string | null
                    service_type: string | null
                    service_type_id: string | null
                    slug: string | null
                    space_type: string | null
                    space_type_id: string | null
                    thumbnail_url: string | null
                    title: string
                    updated_at: string | null
                    visibility: Database["public"]["Enums"]["project_visibility"] | null
                }
                Insert: {
                    area_sqm?: number | null
                    construction_end_date?: string | null
                    construction_start_date?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    location?: string | null
                    main_image_url?: string | null
                    service_type?: string | null
                    service_type_id?: string | null
                    slug?: string | null
                    space_type?: string | null
                    space_type_id?: string | null
                    thumbnail_url?: string | null
                    title: string
                    updated_at?: string | null
                    visibility?: Database["public"]["Enums"]["project_visibility"] | null
                }
                Update: {
                    area_sqm?: number | null
                    construction_end_date?: string | null
                    construction_start_date?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    location?: string | null
                    main_image_url?: string | null
                    service_type?: string | null
                    service_type_id?: string | null
                    slug?: string | null
                    space_type?: string | null
                    space_type_id?: string | null
                    thumbnail_url?: string | null
                    title?: string
                    updated_at?: string | null
                    visibility?: Database["public"]["Enums"]["project_visibility"] | null
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
            service_requests: {
                Row: {
                    area_sqm: number | null
                    created_at: string | null
                    description: string | null
                    id: string
                    location: string | null
                    request_code: string
                    service_type: string | null
                    service_type_id: string | null
                    space_type: string | null
                    space_type_id: string | null
                    status: Database["public"]["Enums"]["request_status"]
                    updated_at: string | null
                    user_id: string | null
                }
                Insert: {
                    area_sqm?: number | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    location?: string | null
                    request_code: string
                    service_type?: string | null
                    service_type_id?: string | null
                    space_type?: string | null
                    space_type_id?: string | null
                    status: Database["public"]["Enums"]["request_status"]
                    updated_at?: string | null
                    user_id?: string | null
                }
                Update: {
                    area_sqm?: number | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    location?: string | null
                    request_code?: string
                    service_type?: string | null
                    service_type_id?: string | null
                    space_type?: string | null
                    space_type_id?: string | null
                    status?: Database["public"]["Enums"]["request_status"]
                    updated_at?: string | null
                    user_id?: string | null
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
                    created_at: string | null
                    description: string | null
                    display_name_ar: string | null
                    display_name_en: string
                    display_name_fr: string | null
                    id: string
                    image_url: string | null
                    is_active: boolean
                    name: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    display_name_ar?: string | null
                    display_name_en: string
                    display_name_fr?: string | null
                    id?: string
                    image_url?: string | null
                    is_active?: boolean
                    name: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    display_name_ar?: string | null
                    display_name_en?: string
                    display_name_fr?: string | null
                    id?: string
                    image_url?: string | null
                    is_active?: boolean
                    name?: string
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
                    created_at: string | null
                    description: string | null
                    display_name_ar: string | null
                    display_name_en: string
                    display_name_fr: string | null
                    id: string
                    is_active: boolean | null
                    name: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    display_name_ar?: string | null
                    display_name_en: string
                    display_name_fr?: string | null
                    id?: string
                    is_active?: boolean | null
                    name: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    display_name_ar?: string | null
                    display_name_en?: string
                    display_name_fr?: string | null
                    id?: string
                    is_active?: boolean | null
                    name?: string
                    updated_at?: string | null
                }
                Relationships: []
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
