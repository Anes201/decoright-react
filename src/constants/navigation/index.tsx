
import { PATHS } from "@/routers/Paths"
import { Chat, Cog, DocumentPlus, Home, PaintBrush, Phone, PuzzlePiece, QuestionMarkCircle, RectangleStack, Squares2x2 } from "@/icons";

// Admin navigation item list for menu
export const adminMenuNav = [
    { id: '1', label: 'Dashboard', key: 'dashboard', path: PATHS.ADMIN.ROOT, icon: null, description: 'Main administrative overview' },
    { id: '2', label: 'Analytics', key: 'analytics', path: PATHS.ADMIN.ANALYTICS, icon: null, description: 'Overview metrics, KPIs and site analytics' },
    { id: '3', label: 'Users & Activity', key: 'users', path: PATHS.ADMIN.USERS, icon: null, description: 'View and manage user accounts, roles and activity logs' },
    { id: '4', label: 'Service Requests', key: 'requests', path: PATHS.ADMIN.REQUEST_SERVICE_LIST, icon: null, description: 'Browse, filter and update service requests' },
    { id: '13', label: 'FAQ Management', key: 'faqs', path: PATHS.ADMIN.FAQ_LIST, icon: null, description: 'Manage frequently asked questions' },
    { id: '11', label: 'Settings', key: 'settings', path: PATHS.ADMIN.SETTINGS, icon: null, description: 'Application settings, preferences and integrations' },
]

// Admin Navigation Data (with support for nested items)
export const adminSideMenuNav = [
    { id: '1', label: 'Dashboard', key: 'dashboard', path: PATHS.ADMIN.ROOT, icon: null, description: 'Main administrative overview' },
    { id: '2', label: 'Analytics', key: 'analytics', path: PATHS.ADMIN.ANALYTICS, icon: null, description: 'Overview metrics, KPIs and site analytics' },

    { id: '3', label: 'Users & Activity', key: 'users', path: PATHS.ADMIN.USERS, icon: null, description: 'View and manage user accounts, roles and activity logs' },

    {
        id: '4', label: 'Service Request', key: 'service_request', icon: null, children: [
            { id: '4.1', label: 'Request List', key: 'request_list', path: PATHS.ADMIN.REQUEST_SERVICE_LIST, icon: null, description: 'Browse, filter and update service requests' },
        ], description: ''
    },


    {
        id: '12', label: 'Gallery Management', key: 'gallery_management', icon: null, children: [
            { id: '12.1', label: 'Gallery List', key: 'gallery_list', path: PATHS.ADMIN.GALLERY_LIST, icon: null, description: 'View and manage all your marketing gallery items.' },
            { id: '12.2', label: 'Add Gallery Item', key: 'add_gallery', path: PATHS.ADMIN.GALLERY_CREATE, icon: null, description: 'Add new marketing showcase items' },
        ], description: ''
    },

    {
        id: '8', label: 'Project Management', key: 'project_management', icon: null, children: [
            { id: '8.1', label: 'Project List', key: 'project_list', path: PATHS.ADMIN.PROJECT_LIST, icon: null, description: 'View and manage real company projects.' },
            { id: '8.2', label: 'Add Project', key: 'add_project', path: PATHS.ADMIN.PROJECT_CREATE, icon: null, description: 'Add new real-world projects' },
        ], description: ''
    },

    {
        id: '6', label: 'Services & Spaces', key: 'services_spaces', icon: null, children: [
            { id: '6.1', label: 'Service Types', key: 'service_types', path: PATHS.ADMIN.SERVICE_TYPES, icon: null, description: 'Manage generic service categories offered' },
            { id: '6.2', label: 'Space Types', key: 'space_types', path: PATHS.ADMIN.SPACE_TYPES, icon: null, description: 'Manage different space categories' },
        ], description: ''
    },

    {
        id: '13', label: 'FAQ Management', key: 'faq_management', icon: null, children: [
            { id: '13.1', label: 'FAQ List', key: 'faq_list', path: PATHS.ADMIN.FAQ_LIST, icon: null, description: 'View and manage all your frequently asked questions.' },
            { id: '13.2', label: 'Add FAQ', key: 'add_faq', path: PATHS.ADMIN.FAQ_CREATE, icon: null, description: 'Add new frequently asked questions' },
        ], description: ''
    },


    { id: '11', label: 'Settings', key: 'settings', path: PATHS.ADMIN.SETTINGS, icon: null, description: 'Application settings, preferences and integrations' },
]


export const clientMenuItems = [
    { label: 'Home', key: 'home', path: PATHS.CLIENT.ROOT, icon: Home , description: 'Return to the homepage' },
    { label: 'Messages', key: 'messages', path: PATHS.CLIENT.CHAT, icon: Chat , description: 'View and continue your conversations' },
    { label: 'Request Service', key: 'request_service', path: PATHS.CLIENT.REQUEST_SERVICE, icon: DocumentPlus , description: 'Start a new service request' },
    { label: 'My Requests', key: 'my_requests', path: PATHS.CLIENT.REQUEST_SERVICE_LIST, icon: RectangleStack , description: 'See the status of your service requests' },
    { label: 'Services', key: 'services', path: PATHS.SERVICE_LIST, icon: PuzzlePiece , description: 'Explore services we offer' },
    { label: 'Projects', key: 'projects', path: PATHS.PROJECT_LIST, icon: PaintBrush , description: 'Explore completed projects and case studies' },
    { label: 'Gallery', key: 'gallery', path: PATHS.GALLERY_LIST, icon: Squares2x2 , description: 'Browse our gallery and past work' },
    { label: 'FAQs', key: 'faqs', path: PATHS.FAQ_LIST, icon: QuestionMarkCircle , description: 'Frequently Asked Questions and support resources' },
    { label: 'Contact Us', key: 'contact_us', path: PATHS.CONTACT, icon: Phone , description: 'Get in touch with our team' },
    { label: 'Account Settings', key: 'account_settings', path: PATHS.CLIENT.ACCOUNT_SETTINGS, icon: Cog , description: 'Manage your profile, preferences, and account settings' },
]

export const publicMenuItems = [
    { label: 'Home', key: 'home', path: PATHS.ROOT, icon: Home , description: 'Landing page and highlights' },
    { label: 'Services', key: 'services', path: PATHS.SERVICE_LIST, icon: PuzzlePiece , description: 'Learn about available services' },
    { label: 'Projects', key: 'projects', path: PATHS.PROJECT_LIST, icon: PaintBrush , description: 'View public projects and case studies' },
    { label: 'Gallery', key: 'gallery', path: PATHS.GALLERY_LIST, icon: PuzzlePiece , description: 'View images and designs associated with projects.' },
    { label: 'FAQs', key: 'faqs', path: PATHS.FAQ_LIST, icon: QuestionMarkCircle , description: 'Frequently Asked Questions and support resources' },
    { label: 'Contact Us', key: 'contact_us', path: PATHS.CONTACT, icon: Phone , description: 'Contact information and form' },
]

export const LegalLinks = [
    { label: 'Terms & Conditions', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
]
