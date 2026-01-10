
import image1 from "/public/s1.jpg"
import image2 from "/public/s2.jpg"
import image3 from "/public/s3.jpg"
import image4 from "/public/s4.jpg"
import image5 from "/public/s5.jpg"
import image6 from "/public/s6.jpg"
import imgRoom1 from "/public/r1.svg"
import user from "/user.png"
import { PATHS } from "@/routers/Paths"

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



export const clientNavItems = [
    { label: 'Home', path: PATHS.CLIENT.ROOT },

    { label: 'Chats', path: PATHS.CLIENT.CHAT },

    { label: 'Request a Service', path: PATHS.CLIENT.SERVICE_REQUEST_LIST },
    { label: 'My Requests', path: PATHS.CLIENT.SERVICE_REQUEST },
    { label: 'Gallery', path: PATHS.CLIENT.GALLERY },

    { label: 'Projects', path: PATHS.PROJECT_LIST },
    { label: 'Services', path: PATHS.SERVICE_LIST },
    { label: 'Contact', path: PATHS.CONTACT },
]

export const publicNavItems = [
    { label: 'Home', path: PATHS.LANDING },

    { label: 'Projects', path: PATHS.PROJECT_LIST },
    { label: 'Services', path: PATHS.SERVICE_LIST },
    { label: 'Contact', path: PATHS.CONTACT },
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
    { label: 'Interior Design', value: 'interior-design', imgSrc: image1 },
    { label: 'Space Planning', value: 'space-planning', imgSrc: image2 },
    { label: 'Furniture Selection', value: 'furniture-selection', imgSrc: image3 },
    { label: 'Color Consultation', value: 'color-consultation', imgSrc: image4 },
    { label: 'Project Management', value: 'project-management', imgSrc: image5 },
    { label: 'Redesign', value: 'redesign', imgSrc: image6 },
]


export const serviceSpaceTypes = [
    { label: 'Houses and Rooms', value: 'HOUSES_AND_ROOMS' },
    { label: 'Commercial Shops', value: 'COMMERCIAL_SHOPS' },
    { label: 'Schools and Nurseries', value: 'SCHOOLS_AND_NURSERIES' },
    { label: 'Offices Reception', value: 'OFFICES_RECEPTION' },
    { label: 'Dormitory Lodgings', value: 'DORMITORY_LODGINGS' },
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

