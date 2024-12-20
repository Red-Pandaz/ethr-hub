// TODO:
// Try to fix rerender
// Commenting- self explanatory.
// Full deploy


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
          <main>
            <Routes>
              <Route path="/login" element={<LoginPage />} /> 
              <Route path="/error" element={<ErrorPage />} />
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
