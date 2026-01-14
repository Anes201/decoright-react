
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
    {label: 'Analytics', path: PATHS.ADMIN.ROOT},

    {label: 'Chats', path: PATHS.ADMIN.CHAT},

    {label: 'Users', path: PATHS.ADMIN.USERS},
    {label: 'Service Requests', path: PATHS.ADMIN.REQUEST_SERVICE_LIST},
    {label: 'Create a Project', path: PATHS.ADMIN.PROJECT_CREATE},
    {label: 'Settings & Policies', path: PATHS.ADMIN.SETTINGS},
]

export const clientNavItems = [
    {label: 'Home', path: PATHS.CLIENT.ROOT},

    {label: 'Chats', path: PATHS.CLIENT.CHAT},

    {label: 'Request a Service', path: PATHS.CLIENT.REQUEST_SERVICE},
    {label: 'My Requests', path: PATHS.CLIENT.REQUEST_SERVICE_LIST},
    {label: 'Gallery', path: PATHS.GALLERY},

    {label: 'Projects', path: PATHS.PROJECT_LIST},
    {label: 'Services', path: PATHS.SERVICE_LIST},
    {label: 'Contact', path: PATHS.CONTACT},
]

export const publicNavItems = [
    {label: 'Home', path: PATHS.ROOT},

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
    {id:'DO146', projectType:'Redesign Office', thumbnail:image4, date:'Jan 2, 2026', status:'pending', status_label:'Pending', chat_url:'/chats/chatId',},
    {id:'DO137', projectType:'Redesign Office', thumbnail:image4, date:'Jan 2, 2026', status:'in_progress', status_label:'In Progress', chat_url:'/chats/chatId'},
    {id:'DO159', projectType:'Redesign Office', thumbnail:image4, date:'Jan 2, 2026', status:'canceled', status_label:'Canceled', chat_url:'/chats/chatId'},
    {id:'DO467', projectType:'Redesign Office', thumbnail:image4, date:'Jan 2, 2026', status:'complete', status_label:'Complete', chat_url:'/chats/chatId'},
    {id:'DO417', projectType:'Redesign Office', thumbnail:image4, date:'Jan 2, 2026', status:'rejected', status_label:'Rejected', chat_url:'/chats/chatId'},
];

import Children from "/public/showcases/IMG_3756.jpg"
import Clinics from "/public/showcases/IMG_3759.jpg"
import Shops from "/public/showcases/IMG_37554.jpg"
import Reception from "/public/showcases/IMG_3758.jpg"
import Offices from "/public/showcases/IMG_3760.jpg"
import Houses from "/public/showcases/IMG_3762.jpg"
import Cafes from "/public/showcases/IMG_3761.jpg"
import Schools from "/public/showcases/IMG_3754.jpg"
import { Activity } from "react"
import { ICONS } from "@/icons"

export const showcases = [
    {id:'1', title:"Children's rooms", alt: "children's rooms", src:Children, budget:"Popular"},
    {id:'2', title:"Clinics", alt: "clinics", src:Clinics},
    {id:'3', title:"Shops", alt: "shops", src:Shops},
    {id:'4', title:"Reception and waiting rooms", alt: "reception and waiting rooms", src:Reception},
    {id:'5', title:"Offices", alt: "offices", src:Offices, budget:"Top Rated"},
    {id:'7', title:"Houses", alt: "houses", src:Houses},
    {id:'8', title:"Cafes and small businesses", alt: "cafes and small businesses", src:Cafes},
    {id:'6', title:"Private schools and nurseries", alt: "private schools and nurseries", src:Schools},
]

export const topKPICards = [
    {id: '1', label:'Site visitors', data_value:'4250', value:'4,250'},
    {id: '2', label:'Total requests', data_value:'120', value:'120'},
    {id: '3', label:'Total completed requests', data_value:'108', value:'108'},
    {id: '4', label:'Total unique clients', data_value:'95', value:'95'},
    {id: '5', label:'Completion rate', data_value:'0.9', value:'90.0%'},
]

export const additionalKPICards = [
    {id: '1', label:'Requests per client', data_value:'1.27', value:'1.27'},
    {id: '2', label:'Daily avg requests', data_value:'10.4', value:'10.4 / day'},
    {id: '3', label:'Avg completion time', data_value:'4.2', value:'4.2 days'},
    {id: '4', label:'Request cancelation rate', data_value:'0.109', value:'10.9%'},
]

export const usersActivityLogs = [
    {
        id:'1',
        user:{
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab eum, quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id:'1',
        user:{
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id:'1',
        user:{
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'Created a new request',
        date: 'Jan 13, 11:43',
    },
    {
        id:'1',
        user:{
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id:'1',
        user:{
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id:'1',
        user:{
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id:'1',
        user:{
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id:'1',
        user:{
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id:'1',
        user:{
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id:'1',
        user:{
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id:'1',
        user:{
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id:'1',
        user:{
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id:'1',
        user:{
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id:'1',
        user:{
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id:'1',
        user:{
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id:'1',
        user:{
            full_name: 'Michael Pearson',
            img: images[7],
            role: 'Client'
        },
        content: 'quas amet iure iste rerum ex vero hic voluptates',
        date: 'Jan 13, 11:43',
    },
    {
        id:'1',
        user:{
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
    {id:'1', service_type:'Exterior Design', value:'98'},
    {id:'2', service_type:'Project Managing', value:'72'},
    {id:'3', service_type:'Restructuring Redesign', value:'65'},
    {id:'4', service_type:'Color Consultation', value:'45'},
    {id:'5', service_type:'Spaces Planning', value:'32'},
]

export const SocialMediaFields = [
    {id:'1', label: 'Facebook', placeholder: 'https://facebook.com/example/', icon: <ICONS.informationCircle/> },
    {id:'2', label: 'Facebook', placeholder: 'https://facebook.com/example/', icon: <ICONS.informationCircle/> },
    {id:'3', label: 'Facebook', placeholder: 'https://facebook.com/example/', icon: <ICONS.informationCircle/> },
    {id:'4', label: 'Facebook', placeholder: 'https://facebook.com/example/', icon: <ICONS.informationCircle/> },
    {id:'5', label: 'Facebook', placeholder: 'https://facebook.com/example/', icon: <ICONS.informationCircle/> },
]