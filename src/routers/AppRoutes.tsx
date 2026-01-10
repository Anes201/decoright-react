
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PATHS } from './Paths';
import PublicLayout from '@/layouts/PublicLayout';
import ClientLayout from '@/layouts/ClientLayout';
import AdminLayout from '@/layouts/AdminLayout';

const Landing = lazy(() => import('@/pages/Public/Landing'));
const About = lazy(() => import('@/pages/Public/About'));
const Contact = lazy(() => import('@/pages/Public/Contact'));
const ServiceList = lazy(() => import('@/pages/Public/ServiceList'));
const ProjectList = lazy(() => import('@/pages/Public/ProjectList'));
const Project = lazy(() => import('@/pages/Public/Project'));

const Signup = lazy(() => import('@/pages/Public/Signup'));
const Login = lazy(() => import('@/pages/Public/Login'));
const Verify = lazy(() => import('@/pages/Public/VerifyOtpPage'));

const ClientHome = lazy(() => import('@/pages/Client/Gallery'));
const ClientChat = lazy(() => import('@/pages/Client/Chat'));
const ClientChatRoom = lazy(() => import('@/pages/Client/Chat'));
const ClientGallery = lazy(() => import('@/pages/Client/Gallery'));
const ClientRequestList = lazy(() => import('@/pages/Client/RequestList'));
const ClientRequest = lazy(() => import('@/pages/Client/Request'));
const ClientProfile = lazy(() => import('@/pages/Client/Profile'));
const ClientProfileEdit = lazy(() => import('@/pages/Client/ProfileEdit'));


const AdminDashboard = lazy(() => import('@/pages/Admin/Dashboard'));
const AdminUsers = lazy(() => import('@/pages/Admin/UserList'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* public routes */}
        <Route element={<PublicLayout />}>
          <Route path={PATHS.LANDING} element={<Landing />} />
          <Route path={PATHS.ABOUT} element={<About />} />
          <Route path={PATHS.CONTACT} element={<Contact />} />
          <Route path={PATHS.SERVICE_LIST} element={<ServiceList />} />
          <Route path={PATHS.PROJECT_LIST} element={<ProjectList />} />
          <Route path={PATHS.PROJECT_DETAIL} element={<Project />} />

          <Route path={PATHS.LOGIN} element={<Login />} />
          <Route path={PATHS.SIGNUP} element={<Signup />} />
          <Route path={PATHS.VERIFY_OTP} element={<Verify />} />
        </Route>

        {/* client routes */}
        <Route element={<ClientLayout />}>
          <Route element={<ClientHome />} path={PATHS.CLIENT.ROOT} />
          <Route element={<ClientRequestList />} path={PATHS.CLIENT.SERVICE_REQUEST_LIST} />
          <Route element={<ClientRequest />} path={PATHS.CLIENT.SERVICE_REQUEST} />
          <Route element={<ClientGallery />} path={PATHS.CLIENT.GALLERY} />
          <Route element={<ClientChat />} path={PATHS.CLIENT.CHAT} />
          <Route element={<ClientChatRoom />} path={PATHS.CLIENT.CHAT_ROOM} />
          <Route element={<ClientProfile />} path={PATHS.CLIENT.PROFILE} />
          <Route element={<ClientProfileEdit />} path={PATHS.CLIENT.PROFILE_EDIT} />
        </Route>

        {/* admin routes */}
        <Route element={<AdminLayout />}>
          <Route element={<AdminDashboard />} path={PATHS.ADMIN.ROOT} />
          <Route element={<AdminUsers />} path={PATHS.ADMIN.USERS} />
        </Route>

        {/* fallback for unknown routes */}
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </Suspense>
  );
}
