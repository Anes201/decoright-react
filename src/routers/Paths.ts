
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

    CLIENT: {
        ROOT: "/",
        PROFILE: "/profile",
        PROFILE_EDIT: "/profile-edit",
        SERVICE_REQUEST_LIST: "/service-request-list",
        SERVICE_REQUEST: "/service-request", // helper for dynamic links
        CHAT: "/chats",
        CHAT_ROOM: "/chats/:id",
        chatRoom: (id: string) => `/chat/${encodeURIComponent(id)}`,

        GALLERY: "/gallery",

        VERIFY_PHONE: "/",
    },

    ADMIN: {
        ROOT: "/admin/dashboard",
        DASHBOARD: "/admin/dashboard",
        CHAT: "/admin/chats",
        CHAT_ROOM: "/admin/chats/:id",
        USERS: "/admin/users",
        SERVICE_REQUEST_LIST: "/admin/service-request-list",
        CREATE_PROJECT: "/admin/create-project",
    },
} as const;
