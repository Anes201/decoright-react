export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
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
                        isOneToOne: true
                        referencedRelation: "service_requests"
                        referencedColumns: ["id"]
                    },
                ]
            }
            contact_messages: {
                Row: {
                    created_at: string | null
                    email: string
                    id: string
                    message: string
                    name: string
                    phone: string | null
                    status: Database["public"]["Enums"]["contact_status"] | null
                    subject: string | null
                }
                Insert: {
                    created_at?: string | null
                    email: string
                    id?: string
                    message: string
                    name: string
                    phone?: string | null
                    status?: Database["public"]["Enums"]["contact_status"] | null
                    subject?: string | null
                }
                Update: {
                    created_at?: string | null
                    email?: string
                    id?: string
                    message?: string
                    name?: string
                    phone?: string | null
                    status?: Database["public"]["Enums"]["contact_status"] | null
                    subject?: string | null
                }
                Relationships: []
            }
            likes: {
                Row: {
                    created_at: string | null
                    project_id: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    project_id: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    project_id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "likes_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "likes_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            messages: {
                Row: {
                    chat_room_id: string
                    content: string
                    created_at: string | null
                    duration_seconds: number | null
                    id: string
                    is_read: boolean | null
                    media_url: string | null
                    message_type: Database["public"]["Enums"]["message_type_enum"]
                    sender_id: string
                    sent_at: string | null
                }
                Insert: {
                    chat_room_id: string
                    content: string
                    created_at?: string | null
                    duration_seconds?: number | null
                    id?: string
                    is_read?: boolean | null
                    media_url?: string | null
                    message_type: Database["public"]["Enums"]["message_type_enum"]
                    sender_id: string
                    sent_at?: string | null
                }
                Update: {
                    chat_room_id?: string
                    content?: string
                    created_at?: string | null
                    duration_seconds?: number | null
                    id?: string
                    is_read?: boolean | null
                    media_url?: string | null
                    message_type?: Database["public"]["Enums"]["message_type_enum"]
                    sender_id?: string
                    sent_at?: string | null
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
            portfolio_items: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: string
                    is_public_guest: boolean | null
                    media_type: string | null
                    media_url: string
                    title: string
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_public_guest?: boolean | null
                    media_type?: string | null
                    media_url: string
                    title: string
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_public_guest?: boolean | null
                    media_type?: string | null
                    media_url?: string
                    title?: string
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    created_at: string | null
                    full_name: string | null
                    id: string
                    phone: string | null
                    role: Database["public"]["Enums"]["user_role"] | null
                }
                Insert: {
                    created_at?: string | null
                    full_name?: string | null
                    id: string
                    phone?: string | null
                    role?: Database["public"]["Enums"]["user_role"] | null
                }
                Update: {
                    created_at?: string | null
                    full_name?: string | null
                    id?: string
                    phone?: string | null
                    role?: Database["public"]["Enums"]["user_role"] | null
                }
                Relationships: []
            }
            project_images: {
                Row: {
                    id: string
                    image_url: string
                    is_cover: boolean | null
                    project_id: string | null
                    sort_order: number | null
                    uploaded_at: string | null
                }
                Insert: {
                    id?: string
                    image_url: string
                    is_cover?: boolean | null
                    project_id?: string | null
                    sort_order?: number | null
                    uploaded_at?: string | null
                }
                Update: {
                    id?: string
                    image_url?: string
                    is_cover?: boolean | null
                    project_id?: string | null
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
                    area_sqm: number | null
                    construction_end_date: string | null
                    construction_start_date: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    location: string | null
                    main_image_url: string | null
                    service_type: Database["public"]["Enums"]["service_type"] | null
                    space_type: Database["public"]["Enums"]["space_type"] | null
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
                    service_type?: Database["public"]["Enums"]["service_type"] | null
                    space_type?: Database["public"]["Enums"]["space_type"] | null
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
                    service_type?: Database["public"]["Enums"]["service_type"] | null
                    space_type?: Database["public"]["Enums"]["space_type"] | null
                    title?: string
                    updated_at?: string | null
                    visibility?: Database["public"]["Enums"]["project_visibility"] | null
                }
                Relationships: []
            }
            service_requests: {
                Row: {
                    area_sqm: number | null
                    completed_at: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    location: string
                    request_code: string
                    service_type: Database["public"]["Enums"]["service_type"]
                    space_type: Database["public"]["Enums"]["space_type"]
                    status: Database["public"]["Enums"]["request_status"] | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    area_sqm?: number | null
                    completed_at?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    location: string
                    request_code: string
                    service_type: Database["public"]["Enums"]["service_type"]
                    space_type: Database["public"]["Enums"]["space_type"]
                    status?: Database["public"]["Enums"]["request_status"] | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    area_sqm?: number | null
                    completed_at?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    location?: string
                    request_code?: string
                    service_type?: Database["public"]["Enums"]["service_type"]
                    space_type?: Database["public"]["Enums"]["space_type"]
                    status?: Database["public"]["Enums"]["request_status"] | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "service_requests_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            site_settings: {
                Row: {
                    description: string | null
                    id: string
                    key: string
                    updated_at: string | null
                    value: string | null
                }
                Insert: {
                    description?: string | null
                    id?: string
                    key: string
                    updated_at?: string | null
                    value?: string | null
                }
                Update: {
                    description?: string | null
                    id?: string
                    key?: string
                    updated_at?: string | null
                    value?: string | null
                }
                Relationships: []
            }
            testimonials: {
                Row: {
                    comment: string | null
                    created_at: string | null
                    id: string
                    is_approved: boolean | null
                    project_id: string | null
                    rating: number | null
                    user_id: string | null
                }
                Insert: {
                    comment?: string | null
                    created_at?: string | null
                    id?: string
                    is_approved?: boolean | null
                    project_id?: string | null
                    rating?: number | null
                    user_id?: string | null
                }
                Update: {
                    comment?: string | null
                    created_at?: string | null
                    id?: string
                    is_approved?: boolean | null
                    project_id?: string | null
                    rating?: number | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "testimonials_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "testimonials_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
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
            service_type:
            | "INTERIOR_DESIGN"
            | "FIXED_DESIGN"
            | "DECOR_CONSULTATION"
            | "BUILDING_RENOVATION"
            | "FURNITURE_REQUEST"
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof (DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? (DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? DatabaseWithoutInternals[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
