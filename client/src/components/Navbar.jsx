import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, PlusCircle, LogOut, Shield, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Wrench size={20} />
          </div>
          <span className="brand-text">Campus<strong>Fix</strong></span>
        </Link>

        {isAuthenticated ? (
          <nav className="navbar-nav">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              All Issues
            </Link>

            {user?.role !== 'admin' && (
              <Link
                to="/my-tickets"
                className={`nav-link ${location.pathname === '/my-tickets' ? 'active' : ''}`}
              >
                My Tickets
              </Link>
            )}

            <Link to="/new-ticket" className="btn btn-primary btn-sm">
              <PlusCircle size={16} />
              <span>Report Issue</span>
            </Link>

            <div className="user-profile">
              <div className="user-meta">
                <span className="user-name">{user?.name}</span>
                <span className="user-dept">{user?.department}</span>
              </div>

              <span className={`role-pill ${user?.role === 'admin' ? 'role-admin' : 'role-student'}`}>
                {user?.role === 'admin' ? (
                  <>
                    <Shield size={12} /> Admin
                  </>
                ) : (
                  <>
                    <UserIcon size={12} /> Student
                  </>
                )}
              </span>

              <button
                onClick={handleLogout}
                className="btn-icon"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </nav>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
