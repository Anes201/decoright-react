
import image1 from "/public/s1.jpg"
import image2 from "/public/s2.jpg"
import image3 from "/public/s3.jpg"
import image4 from "/public/s4.jpg"
import image5 from "/public/s5.jpg"
import image6 from "/public/s6.jpg"
import imgRoom1 from "/public/r1.svg"
import user from "/user.png"

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

export const navItems = [
    {label: 'Home', path: '/'},
    {label: 'Projects', path: '/projects'},
    {label: 'Services', path: '/services'},
    {label: 'Contact', path: '/contact'},

    {label: 'My Requests', path: '/request-service-list'},
    {label: 'Gallery', path: '/gallery'},

    {label: 'Login', path: '/login'},
    {label: 'Sign Up', path: '/signup'},

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
        project_url: '/project'
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
        project_url: '/project'
    },
    {
        label: 'Office', value: 'office',
        images: [image6, image2, 'image3', image4],
        checklist: [
            'Customized interior design solutions',
            'Selection of furniture and decor',
        ],
        project_url: '/project'
    },
    {
        label: 'Hospitality', value: 'hospitality',
        images: [image6, image2, 'image3', image4],
        checklist: [
            'Customized interior design solutions',
            'Expert space planning and layout optimization',
            'Comprehensive project management',
        ],
        project_url: '/project'
    },
    // { label: 'Retail', value: 'retail', icon: 'retail' },
    // { label: 'Residential', value: 'residential', icon: 'residential' },
    // { label: 'Commercial', value: 'commercial', icon: 'commercial' },
    // { label: 'Office', value: 'office', icon: 'office' },
    // { label: 'Hospitality', value: 'hospitality', icon: 'hospitality' },
    // { label: 'Retail', value: 'retail', icon: 'retail' },
]

export const serviceTypes = [
    {label: 'Interior Design', value: 'interior-design', imgSrc: image1},
    {label: 'Space Planning', value: 'space-planning', imgSrc: image2},
    {label: 'Furniture Selection', value: 'furniture-selection', imgSrc: image3},
    {label: 'Color Consultation', value: 'color-consultation', imgSrc: image4},
    {label: 'Project Management', value: 'project-management', imgSrc: image5},
    {label: 'Redesign', value: 'redesign', imgSrc: image6},
    {label: 'Interior Design', value: 'interior-design', imgSrc: image1},
    {label: 'Space Planning', value: 'space-planning', imgSrc: image2},
    {label: 'Furniture Selection', value: 'furniture-selection', imgSrc: image3},
    {label: 'Color Consultation', value: 'color-consultation', imgSrc: image4},
    {label: 'Project Management', value: 'project-management', imgSrc: image5},
    {label: 'Redesign', value: 'redesign', imgSrc: image6},
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


export const chatList = [
    {fullName: 'John Salem', lastMessageDate:'15:43', lastMessage: 'Hello world sounds like a start for something great!', url: '/customer/chats/chatId'},
    {fullName: 'Somdelo Lorem', lastMessageDate:'22:06', lastMessage: 'How about this one ?', url: '/customer/chats/chatId'},
    {fullName: 'John Salem', lastMessageDate:'15:43', lastMessage: 'Hello world sounds like a start for something great!', url: '/customer/chats/chatId'},
    {fullName: 'Somdelo Lorem', lastMessageDate:'22:06', lastMessage: 'How about this one ?', url: '/customer/chats/chatId'},
    {fullName: 'John Salem', lastMessageDate:'15:43', lastMessage: 'Hello world sounds like a start for something great!', url: '/customer/chats/chatId'},
    {fullName: 'Somdelo Lorem', lastMessageDate:'22:06', lastMessage: 'How about this one ?', url: '/customer/chats/chatId'},
    {fullName: 'John Salem', lastMessageDate:'15:43', lastMessage: 'Hello world sounds like a start for something great!', url: '/customer/chats/chatId'},
    {fullName: 'Somdelo Lorem', lastMessageDate:'22:06', lastMessage: 'How about this one ?', url: '/customer/chats/chatId'},
    {fullName: 'John Salem', lastMessageDate:'15:43', lastMessage: 'Hello world sounds like a start for something great!', url: '/customer/chats/chatId'},
    {fullName: 'Somdelo Lorem', lastMessageDate:'22:06', lastMessage: 'How about this one ?', url: '/customer/chats/chatId'},
    {fullName: 'John Salem', lastMessageDate:'15:43', lastMessage: 'Hello world sounds like a start for something great!', url: '/customer/chats/chatId'},
    {fullName: 'Somdelo Lorem', lastMessageDate:'22:06', lastMessage: 'How about this one ?', url: '/customer/chats/chatId'},
    {fullName: 'John Salem', lastMessageDate:'15:43', lastMessage: 'Hello world sounds like a start for something great!', url: '/customer/chats/chatId'},
    {fullName: 'Somdelo Lorem', lastMessageDate:'22:06', lastMessage: 'How about this one ?', url: '/customer/chats/chatId'},
    {fullName: 'John Salem', lastMessageDate:'15:43', lastMessage: 'Hello world sounds like a start for something great!', url: '/customer/chats/chatId'},
    {fullName: 'Somdelo Lorem', lastMessageDate:'22:06', lastMessage: 'How about this one ?', url: '/customer/chats/chatId'},
    {fullName: 'John Salem', lastMessageDate:'15:43', lastMessage: 'Hello world sounds like a start for something great!', url: '/customer/chats/chatId'},
    {fullName: 'Somdelo Lorem', lastMessageDate:'22:06', lastMessage: 'How about this one ?', url: '/customer/chats/chatId'},


];

export const orders = [
    {id:'DO146', projectType:'Redesign Office', thumbnail:image4, date:'Jan 2, 2026', status:'pending', status_label:'Pending', chat_url:'/customer/chats/chatId',},
    {id:'DO147', projectType:'Redesign Office', thumbnail:image4, date:'Jan 2, 2026', status:'in_progress', status_label:'In Progress', chat_url:'/customer/chats/chatId'},
    {id:'DO159', projectType:'Redesign Office', thumbnail:image4, date:'Jan 2, 2026', status:'canceled', status_label:'Canceled', chat_url:'/customer/chats/chatId'},
    {id:'DO447', projectType:'Redesign Office', thumbnail:image4, date:'Jan 2, 2026', status:'complete', status_label:'Complete', chat_url:'/customer/chats/chatId'},
    {id:'DO447', projectType:'Redesign Office', thumbnail:image4, date:'Jan 2, 2026', status:'rejected', status_label:'Rejected', chat_url:'/customer/chats/chatId'},
];

