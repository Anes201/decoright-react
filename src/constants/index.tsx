
const image2 = "/s2.jpg"
const image3 = "/s3.jpg"
const image4 = "/s4.jpg"
const image6 = "/s6.jpg"
const user = "/user.png"
import { PATHS } from "@/routers/Paths"

const SpacesPlaning = "/services/IMG_3766.jpg";
const ColorConsultation = "/services/IMG_3767.jpg";
const InteriorDesign = "/services/IMG_20260116_230617.jpg";
const ExteriorDesign = "/services/IMG_3768.jpg";
const ProjectManaging = "/services/IMG_3771.jpg";
const RestructuringRedesign = "/services/IMG_3765.jpg";

const Children = "/showcases/IMG_3756.jpg"
const Clinics = "/showcases/IMG_3759.jpg"
const Shops = "/showcases/IMG_37554.jpg"
const Reception = "/showcases/IMG_3758.jpg"
const Offices = "/showcases/IMG_3760.jpg"
const Houses = "/showcases/IMG_3762.jpg"
const Cafes = "/showcases/IMG_3761.jpg"
const Schools = "/showcases/IMG_3754.jpg"
import { ICONS } from "@/icons"

export const images = [
    Shops,
    Clinics,
    Offices,
    Schools,
    ProjectManaging,
    RestructuringRedesign,
    Offices,
    user,
]

export const UserRoles = {
    ADMIN: 'admin',
    CLIENT: 'client',
}

export const userPhoneIsVerified = false;

// Admin navigation item list for menu
export const adminMenuNav = [
    { id: '1', label: 'Dashboard', path: PATHS.ADMIN.ANALYTICS, icon: null, description: 'Overview metrics, KPIs and site analytics' },
    { id: '2', label: 'Chats & Requests', path: PATHS.ADMIN.CHAT, icon: null, description: 'Manage conversations and incoming service requests' },
    { id: '3', label: 'Users & Activity', path: PATHS.ADMIN.USERS, icon: null, description: 'View and manage user accounts, roles and activity logs' },
    { id: '4', label: 'Service Requests', path: PATHS.ADMIN.REQUEST_SERVICE_LIST, icon: null, description: 'Browse, filter and update service requests' },
    { id: '5', label: 'Service List', path: PATHS.ADMIN.SERVICE_LIST, icon: null, description: 'Manage published services and their details' },
    { id: '6', label: 'Create Service', path: PATHS.ADMIN.SERVICE_CREATE, icon: null, description: 'Add a new service offering with images and pricing' },
    { id: '7', label: 'Projects Create', path: PATHS.ADMIN.PROJECT_CREATE, icon: null, description: 'Create new projects and configure project settings' },
    { id: '8', label: 'Gallery List', path: PATHS.ADMIN.GALLERY_LIST, icon: null, description: 'Manage gallery entries and categories' },
    { id: '9', label: 'Create Gallery', path: PATHS.ADMIN.GALLERY_CREATE, icon: null, description: 'Upload and organize new gallery items' },
    { id: '10', label: 'Settings', path: PATHS.ADMIN.SETTINGS, icon: null, description: 'Application settings, preferences and integrations' },
]

// Admin Navigation Data (with support for nested items)
export const adminSideMenuNav = [
    { id: '1', label: 'Dashboard', path: PATHS.ADMIN.ANALYTICS, icon: null, description: 'Overview metrics, KPIs and site analytics' },

    { id: '2', label: 'Chat & Requests', path: PATHS.ADMIN.CHAT, icon: null, description: 'Manage conversations and incoming service requests' },

    { id: '3', label: 'Users & Activity', path: PATHS.ADMIN.USERS, icon: null, description: 'View and manage user accounts, roles and activity logs' },

    { id: '4', label: 'Service Request', icon: null, children: [
        { id: '4.1', label: 'Request List', path: PATHS.ADMIN.REQUEST_SERVICE_LIST, icon: null, description: 'Browse, filter and update service requests' },
    ], description: '' },

    { id: '5', label: 'Services', icon: null, children: [
        { id: '5.1', label: 'Service List', path: PATHS.ADMIN.SERVICE_LIST, icon: null, description: 'Manage published services and their details' },
        { id: '5.2', label: 'Create a Service', path: PATHS.ADMIN.SERVICE_CREATE, icon: null, description: 'Add a new service offering with images and pricing' },
    ], description: '' },

    { id: '6', label: 'Projects', icon: null, children:[
        { id: '6.1', label: 'Project List', path: PATHS.ADMIN.PROJECT_LIST, icon: null, description: 'View and manage all your projects.' },
        { id: '6.2', label: 'Create a Project', path: PATHS.ADMIN.PROJECT_CREATE, icon: null, description: 'Create new projects and configure project settings' },
    ], description: '' },

    { id: '7', label: 'Gallery', icon: null, children:[
        { id: '7.1', label: 'Gallery List', path: PATHS.ADMIN.GALLERY_LIST, icon: null, description: 'Manage gallery entries and categories' },
        { id: '7.2', label: 'Create a Gallery', path: PATHS.ADMIN.GALLERY_CREATE, icon: null, description: 'Upload and organize new gallery items' },
    ], description: '' },

    { id: '8', label: 'Settings', path: PATHS.ADMIN.SETTINGS, icon: null, description: 'Application settings, preferences and integrations' },
]


export const clientNavItems = [
    { label: 'Home', path: PATHS.CLIENT.ROOT, icon: null, description: 'Return to the homepage' },

    { label: 'Messages', path: PATHS.CLIENT.CHAT, icon: null, description: 'View and continue your conversations' },

    { label: 'Request Service', path: PATHS.CLIENT.REQUEST_SERVICE, icon: null, description: 'Start a new service request' },
    { label: 'Your Requests', path: PATHS.CLIENT.REQUEST_SERVICE_LIST, icon: null, description: 'See the status of your service requests' },
    { label: 'Portfolio', path: PATHS.GALLERY, icon: null, description: 'Browse our gallery and past work' },

    { label: 'Projects', path: PATHS.PROJECT_LIST, icon: null, description: 'Explore completed projects and case studies' },
    { label: 'Services', path: PATHS.SERVICE_LIST, icon: null, description: 'Explore services we offer' },
    { label: 'Contact Us', path: PATHS.CONTACT, icon: null, description: 'Get in touch with our team' },
]

export const publicNavItems = [
    { label: 'Home', path: PATHS.ROOT, icon: null, description: 'Landing page and highlights' },
    { label: 'Projects', path: PATHS.PROJECT_LIST, icon: null, description: 'View public projects and case studies' },
    { label: 'Services', path: PATHS.SERVICE_LIST, icon: null, description: 'Learn about available services' },
    { label: 'Contact Us', path: PATHS.CONTACT, icon: null, description: 'Contact information and form' },
]

export const galleries = [
    {
        label: 'Residential', value: 'residential',
        images: [image6, image2, image3, image4],
        checklist: [
            'Customized interior design solutions',
            'Expert space planning and layout optimization',
            'Selection of furniture and decor',
            'Comprehensive project management',
        ],
        project: {
            id: '1',
            badge: 'Top seller',
            rating: '4.8'
        }
    },
    {
        label: 'Commercial', value: 'commercial',
        images: [image6, image2, 'image3', image4],
        checklist: [
            'Customized interior design solutions',
            'Expert space planning and layout optimization',
            'Selection of furniture and decor',
            'Comprehensive project management',
        ],
        project: {
            id: '2',
            badge: 'Best sales',
            rating: '4.2'
        }
    },
    {
        label: 'Office', value: 'office',
        images: [image6, image2, 'image3', image4],
        checklist: [
            'Customized interior design solutions',
            'Selection of furniture and decor',
        ],
        project: {
            id: '3',
            badge: 'Classic Style',
            rating: '3.4'
        }
    },
    {
        label: 'Hospitality', value: 'hospitality',
        images: [image6, image2, 'image3', image4],
        checklist: [
            'Customized interior design solutions',
            'Expert space planning and layout optimization',
            'Comprehensive project management',
        ],
        project: {
            id: '1',
            badge: 'Fast Made',
            rating: '2.8'
        }
    },
    // { label: 'Retail', value: 'retail', icon: 'retail' },
    // { label: 'Residential', value: 'residential', icon: 'residential' },
    // { label: 'Commercial', value: 'commercial', icon: 'commercial' },
    // { label: 'Office', value: 'office', icon: 'office' },
    // { label: 'Hospitality', value: 'hospitality', icon: 'hospitality' },
    // { label: 'Retail', value: 'retail', icon: 'retail' },
]

export const serviceTypes = [
    { label: 'Space Planning', value: 'space-planning', src: SpacesPlaning, description: 'Practical layouts and furniture plans that boost usability and circulation while matching your style.' },
    { label: 'Interior Design', value: 'redesign', src: InteriorDesign, description: 'Transform your interiors with cohesive themes, furniture, lighting, and decor that reflect your taste.' },
    { label: 'Exterior Design', value: 'furniture-selection', src: ExteriorDesign, description: 'Make your home stand out — façades, landscaping, and outdoor lighting that look great and work well.' },
    { label: 'Color Consultation', value: 'color-consultation', src: ColorConsultation, description: 'Get tailored palettes and finish advice (with sample testing) to set the perfect mood for each room.' },
    { label: 'Project Management', value: 'project-management', src: ProjectManaging, description: 'We’ll coordinate contractors, schedules, and budgets so your project runs smoothly from start to finish.' },
    { label: 'Restructuring Redesign', value: 'redesign', src: RestructuringRedesign, description: 'Reconfigure layouts and structure to improve flow, safety, and comfort — smart changes that refresh your space.' },
]

export const serviceSpaceTypes = [
    { label: 'Houses and Rooms', value: 'HOUSES_AND_ROOMS' },
    { label: 'Commercial Shops', value: 'COMMERCIAL_SHOPS' },
    { label: 'Schools and Nurseries', value: 'SCHOOLS_AND_NURSERIES' },
    { label: 'Offices Reception', value: 'OFFICES_RECEPTION' },
    { label: 'Dormitory Lodgings', value: 'DORMITORY_LODGINGS' },
]


export const projectVisibility = [
    { label: 'Public', value: 'public' },
    { label: 'Private Clients Only', value: 'authenticated_only' },
    { label: 'Hidden', value: 'hidden' },
]

export const serviceDesignStyle = [
    { label: 'Interior Design', value: 'INTERIOR_DESIGN' },
    { label: 'Fixed Design', value: 'FIXED_DESIGN' },
    { label: 'Decor Consultation', value: 'DECOR_CONSULTATION' },
    { label: 'Furniture Request', value: 'FURNITURE_REQUEST' },
    { label: 'Renovation', value: 'BUILDING_RENOVATION' },

]

export const LegalLinks = [
    { label: 'Terms & Conditions', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
]

export const projects = [
    {
        title: 'Interior Design Furniture Selection & Project Management Decr Furniture Selection & Project Management Decr',
        date: '6 months ago',
        src: images[0],
        alt: "Interior Design"
    },

    {
        title: 'Furniture Selection Interior Design',
        date: '2 months ago',
        src: images[2],
        alt: "Interior Design"
    },

    {
        title: 'Interior Redesign & Color Consultation',
        date: '18 days ago',
        src: images[3],
        alt: "Interior Design"
    },

    {
        title: 'Space Planning & Color Consultation',
        date: '3 years ago',
        src: images[4],
        alt: "Interior Design"
    },

    {
        title: 'Project Management & Space Planning',
        date: '11 months ago',
        src: images[5],
        alt: "Interior Design"
    },

    {
        title: 'Redesign & Interior Design',
        date: '4 years ago',
        src: images[6],
        alt: "Interior Design"
    },

    {
        title: 'Furniture Selection & Redesign',
        date: '3 weeks ago',
        src: images[0],
        alt: "Interior Design"
    },

    {
        title: 'Color Consultation & Interior Design',
        date: '9 weeks ago',
        src: images[1],
        alt: "Interior Design"
    },
];

export const requests = [
    { id: 'DO146', projectType: 'Redesign Office', thumbnail: image4, date: 'Jan 2, 2026', status: 'pending', status_label: 'Pending', chat_url: '/chats/chatId', },
    { id: 'DO137', projectType: 'Redesign Office', thumbnail: image4, date: 'Jan 2, 2026', status: 'in_progress', status_label: 'In Progress', chat_url: '/chats/chatId' },
    { id: 'DO159', projectType: 'Redesign Office', thumbnail: image4, date: 'Jan 2, 2026', status: 'canceled', status_label: 'Canceled', chat_url: '/chats/chatId' },
    { id: 'DO467', projectType: 'Redesign Office', thumbnail: image4, date: 'Jan 2, 2026', status: 'complete', status_label: 'Complete', chat_url: '/chats/chatId' },
    { id: 'DO417', projectType: 'Redesign Office', thumbnail: image4, date: 'Jan 2, 2026', status: 'rejected', status_label: 'Rejected', chat_url: '/chats/chatId' },
];


export const showcases = [
    { id: '1', title: "Children's rooms", alt: "children's rooms", src: Children },
    { id: '2', title: "Clinics", alt: "clinics", src: Clinics },
    { id: '3', title: "Shops", alt: "shops", src: Shops },
    { id: '4', title: "Reception and waiting rooms", alt: "reception and waiting rooms", src: Reception },
    { id: '5', title: "Offices", alt: "offices", src: Offices },
    { id: '7', title: "Houses", alt: "houses", src: Houses },
    { id: '8', title: "Cafes and small businesses", alt: "cafes and small businesses", src: Cafes },
    { id: '6', title: "Private schools and nurseries", alt: "private schools and nurseries", src: Schools },
]

export const topKPICards = [
    { id: '1', label: 'Site visitors', data_value: '4250', value: '4,250' },
    { id: '2', label: 'Total requests', data_value: '120', value: '120' },
    { id: '3', label: 'Total completed requests', data_value: '108', value: '108' },
    { id: '4', label: 'Total unique clients', data_value: '95', value: '95' },
    { id: '5', label: 'Completion rate', data_value: '0.9', value: '90.0%' },
]

export const additionalKPICards = [
    { id: '1', label: 'Requests per client', data_value: '1.27', value: '1.27' },
    { id: '2', label: 'Daily avg requests', data_value: '10.4', value: '10.4 / day' },
    { id: '3', label: 'Avg completion time', data_value: '4.2', value: '4.2 days' },
    { id: '4', label: 'Request cancelation rate', data_value: '0.109', value: '10.9%' },
]

export const usersActivityLogs = [
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab eum, quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'Created a new request',
        date: 'Jan 13, 11:43',
    },
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id: '1',
        user: {
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
]

// Sort by value in descending order
export const topServicesByRequest = [
    { id: '1', service_type: 'Exterior Design', value: '98' },
    { id: '2', service_type: 'Project Managing', value: '72' },
    { id: '3', service_type: 'Restructuring Redesign', value: '65' },
    { id: '4', service_type: 'Color Consultation', value: '45' },
    { id: '5', service_type: 'Spaces Planning', value: '32' },
]

export const SocialMediaUrlFields = [
    { id: '1', label: 'Facebook', placeholder: 'https://facebook.com/@example/', icon: <ICONS.facebook className="size-6" /> },
    { id: '2', label: 'Tiktok', placeholder: 'https://tiktok.com/@example/', icon: <ICONS.tiktok className="size-6" /> },
    { id: '3', label: 'Instagram', placeholder: 'https://instagram.com/example/', icon: <ICONS.instagram className="size-6" /> },
    { id: '4', label: 'Youtube', placeholder: 'https://youtube.com/@example/', icon: <ICONS.youtube className="size-6" /> },
    { id: '5', label: 'Pinterest', placeholder: 'https://pinterest.com/example/', icon: <ICONS.pinterest className="size-6" /> },
    { id: '8', label: 'X (Twitter)', placeholder: 'https://x.com/@example/', icon: <ICONS.xTwitter className="size-6" /> },
]

export const SocialMediaPhoneFields = [
    { id: '6', label: 'Whatsapp', placeholder: '+213123456789', icon: <ICONS.whatsapp className="size-6" /> },
    { id: '7', label: 'Telegram', placeholder: '+213123456789', icon: <ICONS.telegram className="size-6" /> },
]

export const Languages = [
    {label:'English', value:'en'},
    {label:'Arabic', value:'ar'},
    {label:'French', value:'fr'},
]