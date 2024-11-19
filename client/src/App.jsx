// TODO:
// Channel Page- Thursday
// Channel List Page- Thurday
// Styling- Friday
// Commenting- Friday
// README- Friday
// Domain- Saturday/Sunday
// Droplet- Saturday/Sunday

// IF THERE IS TIME
// Subscribing/Unsubscribing from Channels
// Display user feed

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PostPage from './pages/PostPage';
import ChannelPage from './pages/ChannelPage';
import ChannelListPage from './pages/ChannelListPage'
import LoginPage from './pages/LoginPage'
import ErrorPage from './pages/ErrorPage'

function App() {
  return (
    <AuthProvider> 
      <Router>
        <div className="App">
          <h1>Welcome to Ether-Hub</h1>
          <main>
            <Routes>
              <Route path="/login" element={<LoginPage />} /> {/* Add Login Route */}
              <Route path="/error" element={<ErrorPage />} /> {/* Add Login Route */}
              <Route path="/posts/:postId" element={
                <ProtectedRoute>
                  <PostPage />
                </ProtectedRoute>
              } />
              <Route path="/channels/:channelId" element={
                <ProtectedRoute>
                  <ChannelPage />
                </ProtectedRoute>
              } />
              <Route path="/channels" element={
                <ProtectedRoute>
                  <ChannelListPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
