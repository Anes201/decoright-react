
export const PATHS = {
    ROOT: "/",
    ABOUT: "/about-us",

    SERVICE_LIST: "/service-list",
    GALLERY_LIST: "/gallery",
    PROJECT_LIST: "/project-list",
    PROJECT_DETAIL: "/projects/:slug",
    projectDetail: (slug: string) => `/projects/${encodeURIComponent(slug)}/`,
    // projectType: (slug: string) => `/projects/${encodeURIComponent(slug)}`, // generator for links

    FAQ_LIST: "/faqs",

    CONTACT: "/contact",

    LOGIN: "/login",
    SIGNUP: "/signup",

    VERIFY_OTP: "/verify-otp",

    PASSWORD_RESET: "/password/reset",
    PASSWORD_SENT: "/password/sent",

    PRIVACY_POLICY: "/",

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
        ROOT: "/admin/",
        ANALYTICS: "/admin/analytics",
        ACTIVITY_LOG: "/admin/activity-log",

        CHAT: "/admin/chat",
        CHAT_ROOM: "/admin/chat/:id",
        chatRoom: (id: string) => `/admin/chat/${encodeURIComponent(id)}/`,

        USERS: "/admin/user/list",
        USER_DETAIL: "/admin/user/:id",
        userDetail: (id: string) => `/admin/user/${encodeURIComponent(id)}/`,

        SERVICE_LIST: "/admin/service-list",
        SERVICE_CREATE: "/admin/service-create",
        SERVICE_UPDATE: "/admin/service/:id/edit",
        serviceUpdate: (slug: string) => `/admin/service/${encodeURIComponent(slug)}/edit`,
        SERVICE_SPACE_LIST: "/admin/service-space/list",
        serviceSpaceListItem: (id: string) => `/admin/service-space/list#${encodeURIComponent(id)}`,
        SERVICE_SPACE_CREATE: "/admin/service-space/create",
        SERVICE_SPACE_UPDATE: "/admin/service-space/:id/edit",
        serviceSpaceUpdate: (slug: string) => `/admin/service-space/${encodeURIComponent(slug)}/edit`,

        SERVICE_TYPES: "/admin/service-types",
        SPACE_TYPES: "/admin/space-types",

        GALLERY_LIST: "/admin/gallery/list",
        GALLERY_CREATE: "/admin/gallery/create",
        GALLERY_UPDATE: "/admin/gallery/:id/edit",
        galleryUpdate: (id: string) => `/admin/gallery/${encodeURIComponent(id)}/edit`,

        PROJECT_LIST: "/admin/project/list",
        PROJECT_CREATE: "/admin/project/create",
        PROJECT_UPDATE: "/admin/project/:id/edit",
        projectUpdate: (id: string) => `/admin/project/${encodeURIComponent(id)}/edit`,

        REQUEST_SERVICE_LIST: "/admin/service-request/list",
        REQUEST_SERVICE_DETAIL: "/admin/service-request/:id/",
        requestServiceDetail: (id: string) => `/admin/service-request/${encodeURIComponent(id)}/`,

        FAQ_LIST: "/admin/faq/list",
        FAQ_CREATE: "/admin/faq/create",
        FAQ_UPDATE: "/admin/faq/:id/edit",
        faqUpdate: (id: string) => `/admin/faq/${encodeURIComponent(id)}/edit`,

        SETTINGS: "/admin/settings",
    },
} as const;
