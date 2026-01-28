
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

    PASSWORD_RESET: "/password/reset",
    PASSWORD_SENT: "/password/sent",

    CLIENT: {
        ROOT: "/",

        ACCOUNT_PROFILE: "/profile",
        ACCOUNT_SETTINGS: "/settings",

        REQUEST_SERVICE_LIST: "/request-service/list",
        REQUEST_SERVICE: "/request-service", // helper for dynamic links

        CHAT: "/client/chat/",
        CHAT_ROOM: "/client/chat/:id/",
        chatRoom: (id: string) => `/client/chat/${encodeURIComponent(id)}/`,

        VERIFY_PHONE: "/",

        PASSWORD_SET: "/password/set", // Set password in case of 3rd party sign up
        PASSWORD_CHANGE: "/password/change",
        PASSWORD_DONE: "/password/done", // After password has been changed or set up
    },

    ADMIN: {
        ROOT: "/admin",
        ANALYTICS: "/admin/analytics",

        CHAT: "/admin/chat",
        CHAT_ROOM: "/admin/chat/:id",

        USERS: "/admin/user/list",
        USER_DETAIL: "/admin/user/:id",
        userDetail: (id: string) => `/admin/user/${encodeURIComponent(id)}/`,

        SERVICE_LIST: "/admin/service/list",
        SERVICE_CREATE: "/admin/service/create",
        SERVICE_EDIT: "/admin/service/:id/edit",
        serviceEdit: (id: string) => `/admin/service/${encodeURIComponent(id)}/edit`,

        REQUEST_SERVICE_LIST: "/admin/service-request/list",
        REQUEST_SERVICE_DETAIL: "/admin/service-request/:id/",
        requestServiceDetail: (id: string) => `/admin/service-request/${encodeURIComponent(id)}/`,

        GALLERY_LIST: "/admin/gallery/list",
        GALLERY_CREATE: "/admin/gallery/:id",
        GALLERY_EDIT: "/admin/gallery/:slug/edit",
        galleryEdit: (id: string) => `/admin/gallery/${encodeURIComponent(id)}/edit`,

        PROJECT_LIST: "/admin/project/list",
        PROJECT_CREATE: "/admin/project/create",

        SETTINGS: "/admin/settings",
    },
} as const;
