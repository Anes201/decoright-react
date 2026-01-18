[
  {
    "table_name": "admin_activities",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "admin_activities",
    "column_name": "admin_id",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "table_name": "admin_activities",
    "column_name": "action",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO"
  },
  {
    "table_name": "admin_activities",
    "column_name": "target_table",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "admin_activities",
    "column_name": "target_id",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "table_name": "admin_activities",
    "column_name": "details",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "admin_activities",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "chat_rooms",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "chat_rooms",
    "column_name": "request_id",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "table_name": "chat_rooms",
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES"
  },
  {
    "table_name": "chat_rooms",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "chat_rooms",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "contact_messages",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "contact_messages",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "contact_messages",
    "column_name": "email",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "contact_messages",
    "column_name": "phone",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "contact_messages",
    "column_name": "subject",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "contact_messages",
    "column_name": "message",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "contact_messages",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES"
  },
  {
    "table_name": "contact_messages",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "likes",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "likes",
    "column_name": "project_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "likes",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "messages",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "messages",
    "column_name": "request_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "messages",
    "column_name": "sender_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "messages",
    "column_name": "topic",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "messages",
    "column_name": "extension",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "messages",
    "column_name": "content",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "messages",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "messages",
    "column_name": "payload",
    "data_type": "jsonb",
    "is_nullable": "YES"
  },
  {
    "table_name": "messages",
    "column_name": "event",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "messages",
    "column_name": "attachments",
    "data_type": "jsonb",
    "is_nullable": "YES"
  },
  {
    "table_name": "messages",
    "column_name": "chat_room_id",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "table_name": "messages",
    "column_name": "private",
    "data_type": "boolean",
    "is_nullable": "YES"
  },
  {
    "table_name": "messages",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "messages",
    "column_name": "message_type",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES"
  },
  {
    "table_name": "messages",
    "column_name": "inserted_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "messages",
    "column_name": "media_url",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "messages",
    "column_name": "duration_seconds",
    "data_type": "integer",
    "is_nullable": "YES"
  },
  {
    "table_name": "messages",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "portfolio_items",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "portfolio_items",
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "portfolio_items",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "portfolio_items",
    "column_name": "media_url",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "portfolio_items",
    "column_name": "media_type",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "portfolio_items",
    "column_name": "is_public_guest",
    "data_type": "boolean",
    "is_nullable": "YES"
  },
  {
    "table_name": "portfolio_items",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "profiles",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "profiles",
    "column_name": "role",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES"
  },
  {
    "table_name": "profiles",
    "column_name": "full_name",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "profiles",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "profiles",
    "column_name": "phone",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "project_images",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "project_images",
    "column_name": "project_id",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "table_name": "project_images",
    "column_name": "image_url",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "project_images",
    "column_name": "is_cover",
    "data_type": "boolean",
    "is_nullable": "YES"
  },
  {
    "table_name": "project_images",
    "column_name": "sort_order",
    "data_type": "integer",
    "is_nullable": "YES"
  },
  {
    "table_name": "project_images",
    "column_name": "uploaded_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "projects",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "projects",
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "projects",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "projects",
    "column_name": "service_type",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES"
  },
  {
    "table_name": "projects",
    "column_name": "space_type",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES"
  },
  {
    "table_name": "projects",
    "column_name": "area_sqm",
    "data_type": "numeric",
    "is_nullable": "YES"
  },
  {
    "table_name": "projects",
    "column_name": "location",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "projects",
    "column_name": "main_image_url",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "projects",
    "column_name": "visibility",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES"
  },
  {
    "table_name": "projects",
    "column_name": "construction_start_date",
    "data_type": "date",
    "is_nullable": "YES"
  },
  {
    "table_name": "projects",
    "column_name": "construction_end_date",
    "data_type": "date",
    "is_nullable": "YES"
  },
  {
    "table_name": "projects",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "projects",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "request_attachments",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "request_attachments",
    "column_name": "request_id",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "table_name": "request_attachments",
    "column_name": "file_url",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "request_attachments",
    "column_name": "file_name",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "request_attachments",
    "column_name": "file_type",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO"
  },
  {
    "table_name": "request_attachments",
    "column_name": "uploaded_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "service_requests",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "service_requests",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "service_requests",
    "column_name": "service_type",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "service_requests",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "service_requests",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES"
  },
  {
    "table_name": "service_requests",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "service_requests",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "service_requests",
    "column_name": "duration",
    "data_type": "integer",
    "is_nullable": "YES"
  },
  {
    "table_name": "service_requests",
    "column_name": "area_sqm",
    "data_type": "numeric",
    "is_nullable": "YES"
  },
  {
    "table_name": "service_requests",
    "column_name": "location",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "service_requests",
    "column_name": "request_code",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "service_requests",
    "column_name": "space_type",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES"
  },
  {
    "table_name": "site_settings",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "site_settings",
    "column_name": "key",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "site_settings",
    "column_name": "value",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "site_settings",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "site_settings",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "testimonials",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "testimonials",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "table_name": "testimonials",
    "column_name": "project_id",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "table_name": "testimonials",
    "column_name": "rating",
    "data_type": "integer",
    "is_nullable": "YES"
  },
  {
    "table_name": "testimonials",
    "column_name": "comment",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "testimonials",
    "column_name": "is_approved",
    "data_type": "boolean",
    "is_nullable": "YES"
  },
  {
    "table_name": "testimonials",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  }
]