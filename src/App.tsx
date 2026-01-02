
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import { Home } from './pages/Home'
import { About } from './pages/About'
import { Services } from './pages/Services'
import { Contact } from './pages/Contact'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { ProjectsPage } from './pages/Projects'
import { ProjectPage } from './pages/Project'

import { VisitorLayout, CustomerLayout } from './components/layout/Layout'
import { ChatInboxPage, ChatMessagePage } from './pages/Chat'
import { ProfilePage } from './pages/Profile'
import { CustomerOrdersPage } from './pages/Orders'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route element={<VisitorLayout/>}>

            <Route path='/' element={<Home/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/contact' element={<Contact/>} />
            <Route path='/services' element={<Services/>} />
            <Route path='/projects' element={<ProjectsPage/>} />
            <Route path='/project' element={<ProjectPage/>} />

            <Route path='/login' element={<Login/>} />
            <Route path='/signup' element={<Signup/>} />

          </Route>

          <Route element={<CustomerLayout/>}>

            <Route path='/customer/chats' element={<ChatInboxPage/>} />
            <Route path='/customer/chats/chatId' element={<ChatMessagePage/>} />

            <Route path='/profile' element={<ProfilePage/>} />
            <Route path='/orders' element={<CustomerOrdersPage/>} />

          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
