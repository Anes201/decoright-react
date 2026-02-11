
import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PATHS } from './Paths';
import PublicLayout from '@/layouts/PublicLayout';
import ClientLayout from '@/layouts/ClientLayout';
import AdminLayout from '@/layouts/AdminLayout';
import RequireAuth from '@/components/auth/RequireAuth';
import Spinner from '@/components/common/Spinner';

const Landing = lazy(() => import('@/pages/public/Landing'));
const About = lazy(() => import('@/pages/public/About'));
const Contact = lazy(() => import('@/pages/public/Contact'));
const ServiceList = lazy(() => import('@/pages/public/ServiceList'));
const ProjectList = lazy(() => import('@/pages/public/ProjectList'));
const ProjectDetail = lazy(() => import('@/pages/public/ProjectDetail'));
const FAQList = lazy(() => import('@/pages/public/FAQList'));

const Signup = lazy(() => import('@/pages/public/Signup'));
const Login = lazy(() => import('@/pages/public/Login'));
const VerifyOTP = lazy(() => import('@/pages/VerifyOtp'));
const PasswordReset = lazy(() => import('@/pages/PasswordReset'));
const PasswordSent = lazy(() => import('@/pages/PasswordSent'));

const ChatRoom = lazy(() => import('@/components/chat/ChatRoom'));

const ClientHome = lazy(() => import('@/pages/client/GalleryPortfolioList'));
const ClientChat = lazy(() => import('@/pages/client/Chat'));
const ClientGalleryPortfolioList = lazy(() => import('@/pages/client/GalleryPortfolioList'));
const ClientRequestList = lazy(() => import('@/pages/client/RequestServiceList'));
const ClientRequestService = lazy(() => import('@/pages/client/RequestService'));
const ClientAccountProfile = lazy(() => import('@/pages/client/AccountProfile'));
const ClientAccountSettings = lazy(() => import('@/pages/client/AccountSettings'));
const ClientPasswordChange = lazy(() => import('@/pages/client/PasswordChange'));
const ClientPasswordSet = lazy(() => import('@/pages/client/PasswordSet'));
const ClientPasswordDone = lazy(() => import('@/pages/client/PasswordDone'));

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



      // Settings
      {
        path: PATHS.ADMIN.SETTINGS,
        element: <AdminSettings />,
      },
    ]
  }
]);

export default function AppRoutes() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center w-full h-hero">
        <Spinner size="lg" />
      </div>
    }>
      <RouterProvider router={router} />
    </Suspense>
  )
}