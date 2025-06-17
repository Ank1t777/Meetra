import React from 'react'
import { Routes, Route, Navigate } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CallPage from './pages/CallPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import toast, { Toaster } from 'react-hot-toast';
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';


const App = () => {

  //tanstack query crash course

  const { isLoading, authUser } = useAuthUser();

  if(isLoading) return <PageLoader />

  return (
    <div className='h-screen' data-theme="coffee">
      <button onClick={() => toast.success('Welcome to Meetra')
      }>Create a Toast</button>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to='/' />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to='/login' />} />
        <Route path="/call" element={authUser ? <CallPage /> : <Navigate to='/login' />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to='/login' />} />
        <Route path="/onboarding" element={authUser ? <OnboardingPage /> : <Navigate to='/login' />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
