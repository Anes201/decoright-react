
import { Facebook, Instagram, Pinterest, Tiktok, Telegram, Whatsapp, XTwitter, Youtube } from "@/icons";

const userProfile = "/user.png"
// const SpacesPlaning = "/services/IMG_3766.jpg";
// const ColorConsultation = "/services/IMG_3767.jpg";
// const InteriorDesign = "/services/IMG_20260116_230617.jpg";
// const ExteriorDesign = "/services/IMG_3768.jpg";
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

export const images = [
    Shops,
    Clinics,
    Offices,
    Schools,
    ProjectManaging,
    RestructuringRedesign,
    Offices,
    userProfile,
]

// export const gallery = [
//     {
//         id: '1',
//         label: 'Residential', value: 'residential',
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur unde excepturi magnam cum labore laboriosam ad obcaecati provident laborum!",
//         images: { before: image6, after: image2 },
//         checklist: [
//             'Customized interior design solutions',
//             'Expert space planning and layout optimization',
//             'Selection of furniture and decor',
//             'Comprehensive project management',
//         ],
//         service: "Restructuring Redesign",
//         space: "Houses and Rooms",
//     },
//     {
//         id: '2',
//         label: 'Commercial', value: 'commercial',
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur unde excepturi accusamus consequatur? Consequuntur odio similique ratione qui laudantium! Quos atque distinctio, magnam cum labore laboriosam ad obcaecati provident laborum!",
//         images: { before: image4, after: image3 },
//         checklist: [
//             'Customized interior design solutions',
//             'Expert space planning and layout optimization',
//             'Selection of furniture and decor',
//             'Comprehensive project management',
//         ],
//         service: "Interior Design",
//     },
//     {
//         id: '3',
//         label: 'Office', value: 'office',
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.adipisicing elit. Aspernatur unde excepturi accusamus consequatur? Aspernatur unde excepturi accusamus consequatur? Consequuntur adipisicing elit. Aspernatur unde excepturi accusamus consequatur? odio similique ratione qui laudantium! Quos atque distinctio, magnam cum labore laboriosam ad obcaecati provident laborum!",
//         images: { before: image2, after: image6 },
//         checklist: [
//             'Customized interior design solutions',
//             'Selection of furniture and decor',
//         ],
//         service: "Restructuring Redesign",
//         space: "Houses and Rooms",
//     },
//     {
//         label: 'Hospitality', value: 'hospitality',
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. odio similique ratione qui laudantium! Quos atque distinctio, magnam cum labore laboriosam ad obcaecati provident laborum!",
//         images: { before: image4, after: image6 },
//         checklist: [
//             'Customized interior design solutions',
//             'Expert space planning and layout optimization',
//             'Comprehensive project management',
//         ],
//         id: '1',
//         service: "Restructuring Redesign",
//         space: "Houses and Rooms",
//         rating: '2.8'

//     },
//     // { label: 'Retail', value: 'retail', icon: 'retail' },
//     // { label: 'Residential', value: 'residential', icon: 'residential' },
//     // { label: 'Commercial', value: 'commercial', icon: 'commercial' },
//     // { label: 'Office', value: 'office', icon: 'office' },
//     // { label: 'Hospitality', value: 'hospitality', icon: 'hospitality' },
//     // { label: 'Retail', value: 'retail', icon: 'retail' },
// ]

// export const serviceTypes = [
//     { id: '1', label: 'Space Planning', value: 'space-planning', src: SpacesPlaning, description: 'Practical layouts and furniture plans that boost usability and circulation while matching your style.' },
//     { id: '2', label: 'Interior Design', value: 'redesign', src: InteriorDesign, description: 'Transform your interiors with cohesive themes, furniture, lighting, and decor that reflect your taste.' },
//     { id: '3', label: 'Exterior Design', value: 'furniture-selection', src: ExteriorDesign, description: 'Make your home stand out — façades, landscaping, and outdoor lighting that look great and work well.' },
//     { id: '4', label: 'Color Consultation', value: 'color-consultation', src: ColorConsultation, description: 'Get tailored palettes and finish advice (with sample testing) to set the perfect mood for each room.' },
//     { id: '5', label: 'Restructuring Redesign', value: 'project-management', src: ProjectManaging, description: 'We’ll coordinate contractors, schedules, and budgets so your project runs smoothly from start to finish.' },
//     { id: '6', label: 'Restructuring Redesign', value: 'redesign', src: RestructuringRedesign, description: 'Reconfigure layouts and structure to improve flow, safety, and comfort — smart changes that refresh your space.' },
// ]

// export const serviceSpaceTypes = [
//     { id: '1', label: 'Houses and Rooms', value: 'HOUSES_AND_ROOMS' },
//     { id: '2', label: 'Commercial Shops', value: 'COMMERCIAL_SHOPS' },
//     { id: '3', label: 'Schools and Nurseries', value: 'SCHOOLS_AND_NURSERIES' },
//     { id: '4', label: 'Offices Reception', value: 'OFFICES_RECEPTION' },
//     { id: '5', label: 'Restructuring Redesign', value: 'DORMITORY_LODGINGS' },
// ]

export const userRoles = {
    ADMIN: 'admin',
    CLIENT: 'client',
}

export const projectVisibilityStags = [
    { id: '1', label: 'Public', value: 'PUBLIC' },
    { id: '2', label: 'Clients', value: 'AUTHENTICATED_ONLY' },
    { id: '3', label: 'Hidden', value: 'HIDDEN' },
]

export const serviceStatus = [
    { id: '1', label: 'Active', value: 'active' },
    { id: '2', label: 'Inactive', value: 'inactive' },
]

export const serviceSpaceStatus = [
    { id: '1', label: 'Active', value: 'active' },
    { id: '2', label: 'Inactive', value: 'inactive' },
]

export const serviceDesignStyle = [
    { label: 'Interior Design', value: 'INTERIOR_DESIGN' },
    { label: 'Fixed Design', value: 'FIXED_DESIGN' },
    { label: 'Decor Consultation', value: 'DECOR_CONSULTATION' },
    { label: 'Furniture Request', value: 'FURNITURE_REQUEST' },
    { label: 'Renovation', value: 'BUILDING_RENOVATION' },

]

export const LegalLinks = [
    { label: 'Terms & Conditions', key: 'terms', path: '/terms' },
    { label: 'Privacy Policy', key: 'privacy', path: '/privacy-policy' },
]

// export const projects = [
//     {
//         id: '1',
//         title: 'Interior Design Furniture Selection & Project Management Decr Furniture Selection & Project Management Decr',
//         date: '6 months ago',
//         src: images[0],
//         alt: "Interior Design",
//         service_type: "Space Planning",
//         service_space_type: "Houses and Rooms",
//         stage: { label: 'Clients', value: 'clients' },
//         views: 121,
//         likes: 64,
//         created_at: '2026-02-01T17:35:29.707536+00:00',
//         updated_at: '2026-02-01T17:35:29.707536+00:00',
//     },

//     {
//         id: '2',
//         title: 'Furniture Selection Interior Design',
//         date: '2 months ago',
//         src: images[2],
//         alt: "Interior Design",
//         service_type: "Interior Design",
//         service_space_type: "Commercial Shops",
//         stage: { label: 'Hidden', value: 'hidden' },
//         views: 762,
//         likes: 441,
//         created_at: '2026-01-27T10:16:39.502926+00:00',
//         updated_at: '2026-02-01T17:35:29.707536+00:00',
//     },

//     {
//         id: '3',
//         title: 'Interior Redesign & Color Consultation',
//         date: '18 days ago',
//         src: images[3],
//         alt: "Interior Design",
//         service_type: "Space Planning",
//         service_space_type: "Schools and Nurseries",
//         stage: { label: 'Clients', value: 'clients' },
//         views: 92,
//         likes: 419,
//         created_at: '2026-01-27T10:16:39.502926+00:00',
//         updated_at: '2026-02-01T17:35:29.707536+00:00',
//     },

//     {
//         id: '4',
//         title: 'Space Planning & Color Consultation',
//         date: '3 years ago',
//         src: images[4],
//         alt: "Interior Design",
//         service_type: "Space Planning",
//         service_space_type: "Houses and Rooms",
//         stage: { label: 'Public', value: 'public' },
//         views: 363,
//         likes: 93,
//         created_at: '2026-01-27T10:23:53.719066+00:00',
//         updated_at: '2026-02-01T17:35:29.707536+00:00',
//     },

//     {
//         id: '5',
//         title: 'Project Management & Space Planning',
//         date: '11 months ago',
//         src: images[5],
//         alt: "Interior Design",
//         service_type: "Exterior Design",
//         service_space_type: "Houses and Rooms",
//         stage: { label: 'Public', value: 'public' },
//         views: 244,
//         likes: 41,
//         created_at: '2026-02-01T17:35:29.707536+00:00',
//         updated_at: '2026-02-01T17:35:29.707536+00:00',
//     },

//     {
//         id: '6',
//         title: 'Redesign & Interior Design',
//         date: '4 years ago',
//         src: images[6],
//         alt: "Interior Design",
//         service_type: "Interior Design",
//         service_space_type: "Restructuring Redesign",
//         stage: { label: 'Public', value: 'public' },
//         views: 162,
//         likes: 13,
//         created_at: '2026-04-27T10:23:53.719066+00:00',
//         updated_at: '2026-06-01T17:35:29.707536+00:00',
//     },

//     {
//         id: '7',
//         title: 'Furniture Selection & Redesign',
//         date: '3 weeks ago',
//         src: images[0],
//         alt: "Interior Design",
//         service_type: "Space Planning",
//         service_space_type: "Restructuring Redesign",
//         stage: { label: 'Clients', value: 'clients' },
//         views: 762,
//         likes: 413,
//         created_at: '2026-01-27T10:21:53.719066+00:00',
//         updated_at: '2026-02-01T17:35:29.707536+00:00',
//     },

//     {
//         id: '8',
//         title: 'Color Consultation & Interior Design',
//         date: '9 weeks ago',
//         src: images[1],
//         alt: "Interior Design",
//         service_type: "Restructuring Redesign",
//         service_space_type: "Houses and Rooms",
//         stage: { label: 'Public', value: 'public' },
//         views: 762,
//         likes: 413,
//         created_at: '2026-01-27T10:23:53.719066+00:00',
//         updated_at: '2026-01-27T10:23:53.719066+00:00',
//     },
// ];

export const showcases = [
    { id: '1', title: "Children's rooms", key: "childrens_rooms", alt: "children's rooms", src: Children },
    { id: '2', title: "Clinics", key: "clinics", alt: "clinics", src: Clinics },
    { id: '3', title: "Shops", key: "shops", alt: "shops", src: Shops },
    { id: '4', title: "Reception and waiting rooms", key: "reception_waiting", alt: "reception and waiting rooms", src: Reception },
    { id: '5', title: "Offices", key: "offices", alt: "offices", src: Offices },
    { id: '7', title: "Houses", key: "houses", alt: "houses", src: Houses },
    { id: '8', title: "Cafes and small businesses", key: "cafes_small_businesses", alt: "cafes and small businesses", src: Cafes },
    { id: '6', title: "Private schools and nurseries", key: "private_schools_nurseries", alt: "private schools and nurseries", src: Schools },
]


export const SocialMediaUrlFields = [
    { id: '1', label: 'Facebook', placeholder: 'https://facebook.com/@example/', icon: Facebook  },
    { id: '2', label: 'Tiktok', placeholder: 'https://tiktok.com/@example/', icon: Tiktok  },
    { id: '3', label: 'Instagram', placeholder: 'https://instagram.com/example/', icon: Instagram  },
    { id: '4', label: 'Youtube', placeholder: 'https://youtube.com/@example/', icon: Youtube  },
    { id: '5', label: 'Pinterest', placeholder: 'https://pinterest.com/example/', icon: Pinterest  },
    { id: '8', label: 'X (Twitter)', placeholder: 'https://x.com/@example/', icon: XTwitter  },
]

export const SocialMediaPhoneFields = [
    { id: '6', label: 'Whatsapp', placeholder: '+213123456789', icon: Whatsapp  },
    { id: '7', label: 'Telegram', placeholder: '+213123456789', icon: Telegram  },
]

export const allowedLocales = ['en', 'fr', 'ar']

export const languageChoices = [
    { id: 'en', label: 'English', key: 'english', value: 'en', icon: null, },
    { id: 'fr', label: 'French', key: 'french', value: 'fr', icon: null, },
    { id: 'ar', label: 'Arabic', key: 'arabic', value: 'ar', icon: null, },
]