
import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PATHS } from './Paths';
import PublicLayout from '@/layouts/PublicLayout';
import ClientLayout from '@/layouts/ClientLayout';
import AdminLayout from '@/layouts/AdminLayout';
import RequireAuth from '@/components/auth/RequireAuth';
import Spinner from '@/components/common/Spinner';
import RequireAdmin from '@/components/auth/RequireAdmin';

const Landing = lazy(() => import('@/pages/Public/Landing'));
const About = lazy(() => import('@/pages/Public/About'));
const Contact = lazy(() => import('@/pages/Public/Contact'));
const ServiceList = lazy(() => import('@/pages/Public/ServiceList'));
const ProjectList = lazy(() => import('@/pages/Public/ProjectList'));
const ProjectDetail = lazy(() => import('@/pages/Public/Project'));

const Signup = lazy(() => import('@/pages/Public/Signup'));
const Login = lazy(() => import('@/pages/Public/Login'));
const VerifyOTP = lazy(() => import('@/pages/VerifyOtp'));
const PasswordReset = lazy(() => import('@/pages/PasswordReset'));
const PasswordSent = lazy(() => import('@/pages/PasswordSent'));

const ChatRoom = lazy(() => import('@components/chat/ChatRoom'));

const ClientHome = lazy(() => import('@/pages/Client/Gallery'));
const ClientChat = lazy(() => import('@/pages/Client/Chat'));
const ClientGallery = lazy(() => import('@/pages/Client/Gallery'));
const ClientRequestList = lazy(() => import('@/pages/Client/RequestServiceList'));
const ClientRequestService = lazy(() => import('@/pages/Client/RequestService'));
const ClientAccountProfile = lazy(() => import('@/pages/Client/AccountProfile'));
const ClientAccountSettings = lazy(() => import('@/pages/Client/AccountSettings'));
const ClientPasswordChange = lazy(() => import('@/pages/Client/PasswordChange'));
const ClientPasswordSet = lazy(() => import('@/pages/Client/PasswordSet'));
const ClientPasswordDone = lazy(() => import('@/pages/Client/PasswordDone'));

const AdminDashboard = lazy(() => import('@/pages/Admin/Dashboard'));
const AdminChat = lazy(() => import('@/pages/Admin/Chat'));
const AdminUsers = lazy(() => import('@/pages/Admin/Users'));
const AdminServiceRequests = lazy(() => import('@/pages/Admin/requests/RequestServiceList'));
const AdminServiceRequest = lazy(() => import('@/pages/Admin/requests/RequestService'));
const AdminServiceList = lazy(() => import('@/pages/Admin/services/ServiceList'));
const AdminServiceCreate = lazy(() => import('@/pages/Admin/services/ServiceCreate'));
const AdminServiceEdit = lazy(() => import('@/pages/Admin/services/ServiceEdit'));
const AdminProjectCreate = lazy(() => import('@/pages/Admin/projects/ProjectCreate'));
const AdminProjectList = lazy(() => import('@/pages/Admin/projects/ProjectList'));
const AdminGalleryList = lazy(() => import('@/pages/Admin/gallery/GalleryList'));
const AdminGalleryCreate = lazy(() => import('@/pages/Admin/gallery/GalleryCreate'));
const AdminGalleryEdit = lazy(() => import('@/pages/Admin/gallery/GalleryEdit'));
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
        path: PATHS.GALLERY,
        element: <ClientGallery />,
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
        children:[
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
    element: (<RequireAdmin><AdminLayout /></RequireAdmin>),

    children: [
      {
        index: true,
        element: <AdminDashboard />,
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

      // Services
      {
        path: PATHS.ADMIN.SERVICE_LIST,
        element: <AdminServiceList />,
      },
      {
        path: PATHS.ADMIN.SERVICE_CREATE,
        element: <AdminServiceCreate />,
      },
      {
        path: PATHS.ADMIN.SERVICE_EDIT,
        element: <AdminServiceEdit />,
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
        path: PATHS.ADMIN.GALLERY_EDIT,
        element: <AdminGalleryEdit />,
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
        <Spinner size="lg"/>
      </div>
    }>
      <RouterProvider router={router}/>
    </Suspense>
  )
}