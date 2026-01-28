
export const PATHS = {
    ROOT: "/",
    ABOUT: "/about-us",

    SERVICE_LIST: "/service-list",

    PROJECT_LIST: "/project-list",
    PROJECT_DETAIL: "/projects/:slug",   // pattern for router
    projectDetail: (slug: string) => `/projects/${encodeURIComponent(slug)}`, // generator for links
    projectType: (slug: string) => `/projects/${encodeURIComponent(slug)}`, // generator for links

    CONTACT: "/contact",
    GALLERY: "/gallery",

    LOGIN: "/login",
    SIGNUP: "/signup",
    VERIFY_OTP: "/verify-otp",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",

    CLIENT: {
        ROOT: "/",
        PROFILE: "/profile",
        PROFILE_EDIT: "/profile/edit",
        REQUEST_SERVICE_LIST: "/request-service/list",
        REQUEST_SERVICE: "/request-service", // helper for dynamic links
        CHAT: "chats/",
        CHAT_ROOM: "chats/:id",
        chatRoom: (id: string) => `/chat/${encodeURIComponent(id)}`,


        VERIFY_PHONE: "/",
    },

    ADMIN: {
        ROOT: "/admin/",
        ANALYTICS: "analytics/",
        CHAT: "chats/",
        CHAT_ROOM: "chats/:id/",
        USERS: "/admin/users/",
        REQUEST_SERVICE_LIST: "/admin/request-service/list/",
        SERVICE_TYPES: "/admin/service-types/",
        SPACE_TYPES: "/admin/space-types/",
        PROJECTS: "/admin/projects/",
        SETTINGS: "/admin/settings/",
    },
} as const;
