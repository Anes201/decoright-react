
import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PATHS } from './Paths';
import PublicLayout from '@/layouts/PublicLayout';
import ClientLayout from '@/layouts/ClientLayout';
import AdminLayout from '@/layouts/AdminLayout';
import RequireAuth from '@/components/auth/RequireAuth';
import { ChatRoom } from '@/components/chat/ChatView';
import Spinner from '@/components/ui/Spinner';

const Landing = lazy(() => import('@/pages/Public/Landing'));
const About = lazy(() => import('@/pages/Public/About'));
const Contact = lazy(() => import('@/pages/Public/Contact'));
const ServiceList = lazy(() => import('@/pages/Public/ServiceList'));
const ProjectList = lazy(() => import('@/pages/Public/ProjectList'));
const ProjectDetail = lazy(() => import('@/pages/Public/Project'));

const Signup = lazy(() => import('@/pages/Public/Signup'));
const Login = lazy(() => import('@/pages/Public/Login'));
const VerifyOTP = lazy(() => import('@/pages/VerifyOtp'));

const ClientHome = lazy(() => import('@/pages/Client/Gallery'));
const ClientChat = lazy(() => import('@/pages/Client/Chat'));
const ClientGallery = lazy(() => import('@/pages/Client/Gallery'));
const ClientRequestList = lazy(() => import('@/pages/Client/RequestServiceList'));
const ClientRequestService = lazy(() => import('@/pages/Client/RequestService'));
const ClientProfile = lazy(() => import('@/pages/Client/Profile'));
const ClientProfileEdit = lazy(() => import('@/pages/Client/ProfileEdit'));

const AdminDashboard = lazy(() => import('@/pages/Admin/Dashboard'));
const AdminChat = lazy(() => import('@/pages/Admin/Chat'));
const AdminUsers = lazy(() => import('@/pages/Admin/Users'));
const AdminServiceRequests = lazy(() => import('@/pages/Admin/RequestServiceList'));
const AdminProjectCreate = lazy(() => import('@/pages/Admin/ProjectCreate'));
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
      },
      {
        path: PATHS.CLIENT.PROFILE,
        element: <ClientProfile />,
      },
      {
        path: PATHS.CLIENT.PROFILE_EDIT,
        element: <ClientProfileEdit />,
      }
    ]
  },

  // ADMIN ROUTES
  {
    path: PATHS.ADMIN.ROOT,
    element: (<RequireAuth><AdminLayout /></RequireAuth>),
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
      {
        path: PATHS.ADMIN.USERS,
        element: <AdminUsers />,
      },
      {
        path: PATHS.ADMIN.REQUEST_SERVICE_LIST,
        element: <AdminServiceRequests />,
      },
      {
        path: PATHS.ADMIN.PROJECT_CREATE,
        element: <AdminProjectCreate />,
      },
      {
        path: PATHS.ADMIN.SETTINGS,
        element: <AdminSettings />,
      },
    ]
  }
]);

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center w-full h-hero"><Spinner className="w-8 h-8" /></div>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}