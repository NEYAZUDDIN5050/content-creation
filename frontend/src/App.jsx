import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import AuthContext from './context/AuthContext';
import SubmitContentPage from './pages/SubmitContentPage';

function App() {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<PrivateRoute roles={['user', 'admin']} />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/submit" element={<SubmitContentPage />} />
          </Route>

          <Route element={<PrivateRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route
            path="/"
            element={
              isAuthenticated ? (
                user?.role === 'admin' ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/dashboard" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

