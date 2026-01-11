
import image1 from "/public/s1.jpg"
import image2 from "/public/s2.jpg"
import image3 from "/public/s3.jpg"
import image4 from "/public/s4.jpg"
import image5 from "/public/s5.jpg"
import image6 from "/public/s6.jpg"
import imgRoom1 from "/public/r1.svg"
import user from "/user.png"
import { PATHS } from "@/routers/Paths"

import SpacesPlaning from "/public/services/IMG_3766.jpg";
import ColorConsultation from "/public/services/IMG_3767.jpg";
import ExteriorDesign from "/public/services/IMG_3768.jpg";
import ProjectManaging from "/public/services/IMG_3771.jpg";
import RestructuringRedesign from "/public/services/IMG_3765.jpg";

export const images = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    imgRoom1,
    user,
]

export const userIsAuthenticated = true;
export const userIsStaff = true;
export const userPhoneIsVerified = false;

export const adminNavItems = [
    {label: 'Dashboard', path: PATHS.ADMIN.DASHBOARD},

    {label: 'Chats', path: PATHS.ADMIN.CHAT},

    {label: 'Users', path: PATHS.ADMIN.USERS},
    {label: 'Service Requests', path: PATHS.ADMIN.SERVICE_REQUEST_LIST},
    {label: 'Create a Project', path: PATHS.ADMIN.CREATE_PROJECT},
]

export const clientNavItems = [
    {label: 'Home', path: PATHS.CLIENT.ROOT},

    {label: 'Chats', path: PATHS.CLIENT.CHAT},

    {label: 'Request a Service', path: PATHS.CLIENT.SERVICE_REQUEST},
    {label: 'My Requests', path: PATHS.CLIENT.SERVICE_REQUEST_LIST},
    {label: 'Gallery', path: PATHS.CLIENT.GALLERY},

    {label: 'Projects', path: PATHS.PROJECT_LIST},
    {label: 'Services', path: PATHS.SERVICE_LIST},
    {label: 'Contact', path: PATHS.CONTACT},
]

export const publicNavItems = [
    {label: 'Home', path: PATHS.LANDING},

    {label: 'Projects', path: PATHS.PROJECT_LIST},
    {label: 'Services', path: PATHS.SERVICE_LIST},
    {label: 'Contact', path: PATHS.CONTACT},

    {label: 'Login', path: PATHS.LOGIN},
    {label: 'Sign Up', path: PATHS.SIGNUP},
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
    {label: 'Space Planning', value: 'space-planning', src: SpacesPlaning, description: 'Practical layouts and furniture plans that boost usability and circulation while matching your style.'},
    {label: 'Exterior Design', value: 'furniture-selection', src: ExteriorDesign, description: 'Make your home stand out — façades, landscaping, and outdoor lighting that look great and work well.'},
    {label: 'Color Consultation', value: 'color-consultation', src: ColorConsultation, description: 'Get tailored palettes and finish advice (with sample testing) to set the perfect mood for each room.'},
    {label: 'Project Management', value: 'project-management', src: ProjectManaging, description: 'We’ll coordinate contractors, schedules, and budgets so your project runs smoothly from start to finish.'},
    {label: 'Restructuring Redesign', value: 'redesign', src: RestructuringRedesign, description: 'Reconfigure layouts and structure to improve flow, safety, and comfort — smart changes that refresh your space.'},
]

export const serviceSpaceTypes = [
    {label: 'Interior Design', value: 'interior-design'},
    {label: 'Space Planning', value: 'space-planning'},
    {label: 'Furniture Selection', value: 'furniture-selection'},
    {label: 'Color Consultation', value: 'color-consultation'},
    {label: 'Project Management', value: 'project-management'},
    {label: 'Redesign', value: 'redesign'},
    {label: 'Interior Design', value: 'interior-design'},
    {label: 'Space Planning', value: 'space-planning'},
    {label: 'Furniture Selection', value: 'furniture-selection'},
    {label: 'Color Consultation', value: 'color-consultation'},
    {label: 'Project Management', value: 'project-management'},
    {label: 'Redesign', value: 'redesign'},
]

export const projectVisibility = [
    {label: 'Public', value: 'public'},
    {label: 'Private Clients Only', value: 'authenticated_only'},
    {label: 'Hidden', value: 'hidden'},
]

export const LegalLinks = [
    {label: 'Terms & Conditions', path:'/terms'},
    {label: 'Privacy Policy', path:'/privacy-policy'},
]

export const projects = [
        {
            title: 'Interior Design Furniture Selection & Project Management Decr Furniture Selection & Project Management Decr',
            date: '6 months ago',
            imgSrc: images[0]
        },

        {
            title: 'Furniture Selection Interior Design',
            date: '2 months ago',
            imgSrc: images[2]
        },

        {
            title: 'Interior Redesign & Color Consultation',
            date: '18 days ago',
            imgSrc: images[3]
        },

        {
            title: 'Space Planning & Color Consultation',
            date: '3 years ago',
            imgSrc: images[4]
        },

        {
            title: 'Project Management & Space Planning',
            date: '11 months ago',
            imgSrc: images[5]
        },

        {
            title: 'Redesign & Interior Design',
            date: '4 years ago',
            imgSrc: images[6]
        },

        {
            title: 'Furniture Selection & Redesign',
            date: '3 weeks ago',
            imgSrc: images[0]
        },

        {
            title: 'Color Consultation & Interior Design',
            date: '9 weeks ago',
            imgSrc: images[1]
        },

    ];

export const requests = [
    {id:'DO146', projectType:'Redesign Office', thumbnail:image4, date:'Jan 2, 2026', status:'pending', status_label:'Pending', chat_url:'/chats/chatId',},
    {id:'DO137', projectType:'Redesign Office', thumbnail:image4, date:'Jan 2, 2026', status:'in_progress', status_label:'In Progress', chat_url:'/chats/chatId'},
    {id:'DO159', projectType:'Redesign Office', thumbnail:image4, date:'Jan 2, 2026', status:'canceled', status_label:'Canceled', chat_url:'/chats/chatId'},
    {id:'DO467', projectType:'Redesign Office', thumbnail:image4, date:'Jan 2, 2026', status:'complete', status_label:'Complete', chat_url:'/chats/chatId'},
    {id:'DO417', projectType:'Redesign Office', thumbnail:image4, date:'Jan 2, 2026', status:'rejected', status_label:'Rejected', chat_url:'/chats/chatId'},
];
