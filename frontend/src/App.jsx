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

  //tanstack query 

  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if(isLoading) return <PageLoader />

  console.log(`authenticate: ${isAuthenticated}`);
  console.log(`onboard: ${isOnboarded}`);

  return (
    <div className='h-screen' data-theme="dark">
      <button onClick={() => toast.success('Welcome to Meetra')
      }>Create a Toast</button>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated && isOnboarded ? (
              <HomePage />
            ) : (
              <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
            )
          } 
        />
        <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to='/' />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to='/' />} />
        <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to='/login' />} />
        <Route path="/call" element={isAuthenticated ? <CallPage /> : <Navigate to='/login' />} />
        <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to='/login' />} />
        <Route path="/onboarding" element={isAuthenticated ? <OnboardingPage /> : <Navigate to='/login' />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
