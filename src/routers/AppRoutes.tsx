
import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PATHS } from './Paths';
import PublicLayout from '@/layouts/PublicLayout';
import ClientLayout from '@/layouts/ClientLayout';
import AdminLayout from '@/layouts/AdminLayout';
import RequireAuth from '@/components/auth/RequireAuth';
import Spinner from '@/components/common/Spinner';
import { useTranslation } from 'react-i18next';

const Landing = lazy(() => import('@/pages/Public/Landing'));
const About = lazy(() => import('@/pages/Public/About'));
const Contact = lazy(() => import('@/pages/Public/Contact'));
const ServiceList = lazy(() => import('@/pages/Public/ServiceList'));
const ProjectList = lazy(() => import('@/pages/Public/ProjectList'));
const ProjectDetail = lazy(() => import('@/pages/Public/ProjectDetail'));
const FAQList = lazy(() => import('@/pages/Public/FAQList'));

const Signup = lazy(() => import('@/pages/Public/Signup'));
const Login = lazy(() => import('@/pages/Public/Login'));
const VerifyOTP = lazy(() => import('@/pages/VerifyOtp'));
const PasswordReset = lazy(() => import('@/pages/PasswordReset'));
const PasswordSent = lazy(() => import('@/pages/PasswordSent'));

const ChatRoom = lazy(() => import('@/components/chat/ChatRoom'));

const ClientHome = lazy(() => import('@/pages/Public/GalleryList'));
const ClientChat = lazy(() => import('@/pages/Client/Chat'));
const ClientGalleryPortfolioList = lazy(() => import('@/pages/Public/GalleryList'));
const ClientRequestList = lazy(() => import('@/pages/Client/RequestServiceList'));
const ClientRequestService = lazy(() => import('@/pages/Client/RequestService'));
const ClientAccountProfile = lazy(() => import('@/pages/Client/AccountProfile'));
const ClientAccountSettings = lazy(() => import('@/pages/Client/AccountSettings'));
const ClientPasswordChange = lazy(() => import('@/pages/Client/PasswordChange'));
const ClientPasswordSet = lazy(() => import('@/pages/Client/PasswordSet'));
const ClientPasswordDone = lazy(() => import('@/pages/Client/PasswordDone'));

const AdminDashboard = lazy(() => import('@/pages/Admin/Dashboard'));
const AdminDashboardHome = lazy(() => import('@/pages/Admin/DashboardHome'));
const AdminChat = lazy(() => import('@/pages/Admin/Chat'));
const AdminUsers = lazy(() => import('@/pages/Admin/Users'));
const AdminServiceRequests = lazy(() => import('@/pages/Admin/requests/RequestServiceList'));
const AdminServiceRequest = lazy(() => import('@/pages/Admin/requests/RequestService'));
const AdminProjectList = lazy(() => import('@/pages/Admin/projects/ProjectList'));
const AdminProjectCreate = lazy(() => import('@/pages/Admin/projects/ProjectCreate'));
const AdminProjectUpdate = lazy(() => import('@/pages/Admin/projects/ProjectUpdate'));

const AdminGalleryList = lazy(() => import('@/pages/Admin/gallery/GalleryList'));
const AdminGalleryCreate = lazy(() => import('@/pages/Admin/gallery/GalleryCreate'));
const AdminGalleryUpdate = lazy(() => import('@/pages/Admin/gallery/GalleryUpdate'));

const AdminServiceTypes = lazy(() => import('@/pages/Admin/ServiceTypes'));
const AdminSpaceTypes = lazy(() => import('@/pages/Admin/SpaceTypes'));

const AdminFAQList = lazy(() => import('@/pages/Admin/faqs/FAQList'));
const AdminFAQCreate = lazy(() => import('@/pages/Admin/faqs/FAQCreate'));
const AdminFAQUpdate = lazy(() => import('@/pages/Admin/faqs/FAQUpdate'));

const AdminSettings = lazy(() => import('@/pages/Admin/Settings'));

const router = createBrowserRouter([

  // Public Layout
  {
    path: PATHS.ROOT,
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: PATHS.ABOUT,
        element: <About />,
      },
      {
        path: PATHS.CONTACT,
        element: <Contact />,
      },
      {
        path: PATHS.SERVICE_LIST,
        element: <ServiceList />,
      },
      {
        path: PATHS.PROJECT_LIST,
        element: <ProjectList />,
      },
      {
        path: PATHS.PROJECT_DETAIL,
        element: <ProjectDetail />,
      },
      {
        path: PATHS.FAQ_LIST,
        element: <FAQList />,
      },
      {
        path: PATHS.GALLERY_LIST,
        element: <ClientGalleryPortfolioList />,
      },
      {
        path: PATHS.LOGIN,
        element: <Login />,
      },
      {
        path: PATHS.SIGNUP,
        element: <Signup />,
      },
      {
        path: PATHS.VERIFY_OTP,
        element: <VerifyOTP />,
      },
      {
        path: PATHS.PASSWORD_RESET,
        element: <PasswordReset />,
      },
      {
        path: PATHS.PASSWORD_SENT,
        element: <PasswordSent />,
      },
    ]
  },

  // AUTH CLIENT ROUTES
  {
    path: PATHS.CLIENT.ROOT,
    element: (<RequireAuth><ClientLayout /></RequireAuth>),
    children: [
      {
        index: true,
        element: <ClientHome />,
      },
      {
        path: PATHS.CLIENT.REQUEST_SERVICE_LIST,
        element: <ClientRequestList />,
      },
      {
        path: PATHS.CLIENT.REQUEST_SERVICE,
        element: <ClientRequestService />,
      },
      {
        path: PATHS.CLIENT.CHAT,
        element: <ClientChat />,
        children: [
          {
            path: PATHS.CLIENT.CHAT_ROOM,
            element: <ChatRoom />
          },
        ]
      },
      {
        path: PATHS.CLIENT.ACCOUNT_PROFILE,
        element: <ClientAccountProfile />,
      },
      {
        path: PATHS.CLIENT.ACCOUNT_SETTINGS,
        element: <ClientAccountSettings />,
      },

      // Password
      {
        path: PATHS.CLIENT.PASSWORD_SET,
        element: <ClientPasswordSet />,
      },
      {
        path: PATHS.CLIENT.PASSWORD_CHANGE,
        element: <ClientPasswordChange />,
      },
      {
        path: PATHS.CLIENT.PASSWORD_DONE,
        element: <ClientPasswordDone />,
      },
    ]
  },


  // * ADMIN ROUTES
  {
    path: PATHS.ADMIN.ROOT,
    element: (<RequireAuth role="admin"><AdminLayout /></RequireAuth>),
    children: [
      {
        index: true,
        element: <AdminDashboardHome />,
      },
      {
        path: PATHS.ADMIN.ANALYTICS,
        element: <AdminDashboard />,
      },
      {
        path: PATHS.ADMIN.CHAT,
        element: <AdminChat />,
        children: [
          {
            path: PATHS.ADMIN.CHAT_ROOM,
            element: <ChatRoom />
          }
        ]
      },

      // Users
      {
        path: PATHS.ADMIN.USERS,
        element: <AdminUsers />,
      },

      // Request Services
      {
        path: PATHS.ADMIN.REQUEST_SERVICE_LIST,
        element: <AdminServiceRequests />,
      },
      {
        path: PATHS.ADMIN.REQUEST_SERVICE_DETAIL, // Request Overview
        element: <AdminServiceRequest />,
      },


      // Projects
      {
        path: PATHS.ADMIN.PROJECT_LIST,
        element: <AdminProjectList />,
      },
      {
        path: PATHS.ADMIN.PROJECT_CREATE,
        element: <AdminProjectCreate />,
      },
      {
        path: PATHS.ADMIN.PROJECT_UPDATE,
        element: <AdminProjectUpdate />,
      },

      // Gallery
      {
        path: PATHS.ADMIN.GALLERY_LIST,
        element: <AdminGalleryList />,
      },
      {
        path: PATHS.ADMIN.GALLERY_CREATE,
        element: <AdminGalleryCreate />,
      },
      {
        path: PATHS.ADMIN.GALLERY_UPDATE,
        element: <AdminGalleryUpdate />,
      },

      {
        path: PATHS.ADMIN.SERVICE_TYPES,
        element: <AdminServiceTypes />,
      },
      {
        path: PATHS.ADMIN.SPACE_TYPES,
        element: <AdminSpaceTypes />,
      },

      // FAQs
      {
        path: PATHS.ADMIN.FAQ_LIST,
        element: <AdminFAQList />,
      },
      {
        path: PATHS.ADMIN.FAQ_CREATE,
        element: <AdminFAQCreate />,
      },
      {
        path: PATHS.ADMIN.FAQ_UPDATE,
        element: <AdminFAQUpdate />,
      },

      // Settings
      {
        path: PATHS.ADMIN.SETTINGS,
        element: <AdminSettings />,
      },
    ]
  }
]);

export default function AppRoutes() {

  const { t } = useTranslation();

  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center gap-2 w-full h-hero">
        <Spinner size="lg" />
        <span className="text-sm"> {t('common.loading_moment')} </span>
      </div>
    }>
      <RouterProvider router={router} />
    </Suspense>
  )
}