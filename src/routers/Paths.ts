
export const PATHS = {
    LANDING: "/",
    ABOUT: "/about-us",

    SERVICE_LIST: "/service-list",

    PROJECT_LIST: "/project-list",
    PROJECT_DETAIL: "/client/projects/:slug",   // pattern for router
    projectDetail: (slug: string) => `/client/projects/${encodeURIComponent(slug)}`, // generator for links

    CONTACT: "/contact",

    LOGIN: "/login",
    SIGNUP: "/signup",
    VERIFY_OTP: "/verify-otp",

    CLIENT: {
        ROOT: "/",
        PROFILE: "/profile",
        PROFILE_EDIT: "/profile-edit",
        SERVICE_REQUEST_LIST: "/service-request-list",
        SERVICE_REQUEST: "/service-request", // helper for dynamic links
        CHAT: "/chats",
        CHAT_ROOM: "/chat/:id",
        chatRoom: (id: string) => `/chat/${encodeURIComponent(id)}`,

        GALLERY: "/gallery",
    },

    ADMIN: {
        ROOT: "/admin/dashboard",
        USERS: "/admin/users",
    },
} as const;
