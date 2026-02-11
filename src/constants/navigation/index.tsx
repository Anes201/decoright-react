
import { PATHS } from "@/routers/Paths"
import { useTranslation } from "react-i18next"

// Admin navigation item list for menu
export const adminMenuNav = [
    { id: '1', label: 'Dashboard', path: PATHS.ADMIN.ANALYTICS, icon: null, description: 'Overview metrics, KPIs and site analytics' },
    { id: '3', label: 'Users & Activity', path: PATHS.ADMIN.USERS, icon: null, description: 'View and manage user accounts, roles and activity logs' },
    { id: '4', label: 'Service Requests', path: PATHS.ADMIN.REQUEST_SERVICE_LIST, icon: null, description: 'Browse, filter and update service requests' },
    { id: '11', label: 'Settings', path: PATHS.ADMIN.SETTINGS, icon: null, description: 'Application settings, preferences and integrations' },
]

// Admin Navigation Data (with support for nested items)
export const adminSideMenuNav = [
    { id: '1', label: 'Dashboard', path: PATHS.ADMIN.ANALYTICS, icon: null, description: 'Overview metrics, KPIs and site analytics' },

    { id: '3', label: 'Users & Activity', path: PATHS.ADMIN.USERS, icon: null, description: 'View and manage user accounts, roles and activity logs' },

    {
        id: '4', label: 'Service Request', icon: null, children: [
            { id: '4.1', label: 'Request List', path: PATHS.ADMIN.REQUEST_SERVICE_LIST, icon: null, description: 'Browse, filter and update service requests' },
        ], description: ''
    },


    {
        id: '12', label: 'Gallery Management', icon: null, children: [
            { id: '12.1', label: 'Gallery List', path: PATHS.ADMIN.GALLERY_LIST, icon: null, description: 'View and manage all your marketing gallery items.' },
            { id: '12.2', label: 'Add Gallery Item', path: PATHS.ADMIN.GALLERY_CREATE, icon: null, description: 'Add new marketing showcase items' },
        ], description: ''
    },

    {
        id: '8', label: 'Project Management', icon: null, children: [
            { id: '8.1', label: 'Project List', path: PATHS.ADMIN.PROJECT_LIST, icon: null, description: 'View and manage real company projects.' },
            { id: '8.2', label: 'Add Project', path: PATHS.ADMIN.PROJECT_CREATE, icon: null, description: 'Add new real-world projects' },
        ], description: ''
    },

    {
        id: '6', label: 'Services & Spaces', icon: null, children: [
            { id: '6.1', label: 'Service Types', path: PATHS.ADMIN.SERVICE_TYPES, icon: null, description: 'Manage generic service categories offered' },
            { id: '6.2', label: 'Space Types', path: PATHS.ADMIN.SPACE_TYPES, icon: null, description: 'Manage different space categories' },
        ], description: ''
    },


    { id: '11', label: 'Settings', path: PATHS.ADMIN.SETTINGS, icon: null, description: 'Application settings, preferences and integrations' },
]


export const clientMenuItems = [
    { label: 'Home', path: PATHS.CLIENT.ROOT, icon: null, description: 'Return to the homepage' },

    { label: 'Messages', path: PATHS.CLIENT.CHAT, icon: null, description: 'View and continue your conversations' },

    { label: 'Request Service', path: PATHS.CLIENT.REQUEST_SERVICE, icon: null, description: 'Start a new service request' },
    { label: 'Your Requests', path: PATHS.CLIENT.REQUEST_SERVICE_LIST, icon: null, description: 'See the status of your service requests' },
    { label: 'Gallery', path: PATHS.GALLERY_LIST, icon: null, description: 'Browse our gallery and past work' },

    { label: 'Projects', path: PATHS.PROJECT_LIST, icon: null, description: 'Explore completed projects and case studies' },
    { label: 'Services', path: PATHS.SERVICE_LIST, icon: null, description: 'Explore services we offer' },
    { label: 'Contact Us', path: PATHS.CONTACT, icon: null, description: 'Get in touch with our team' },
]

export const publicMenuItems = () => {
    const { t } = useTranslation(['common', 'nav'])
    return [
        { label: t('nav:home'), path: PATHS.ROOT, icon: null, description: t('nav:home_description') },
        { label: t('nav:project_list'), path: PATHS.PROJECT_LIST, icon: null, description: t('nav:project_list_description') },
        { label: t('nav:service_list'), path: PATHS.SERVICE_LIST, icon: null, description: t('nav:service_list_description') },
        { label: t('nav:gallery_list'), path: PATHS.GALLERY_LIST, icon: null, description: t('nav:gallery_list_description') },
        { label: t('nav:help_faq'), path: PATHS.FAQ_LIST, icon: null, description: t('nav:help_faq_description') },
        { label: t('nav:contact'), path: PATHS.CONTACT, icon: null, description: t('nav:contact_description') },
    ]
}

export const languages = () => {
    const { t } = useTranslation(['common'])
    return [
        { label: t('common:languages.english'), value: 'en', icon: null, },
        { label: t('common:languages.arabic'), value: 'ar', icon: null, },
        { label: t('common:languages.french'), value: 'fr', icon: null, },
    ]
}


export const LegalLinks = [
    { label: 'Terms & Conditions', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
]
