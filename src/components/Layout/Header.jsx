import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { FaCarSide, FaUserCircle, FaChevronDown } from 'react-icons/fa';

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4 flex-col md:flex-row gap-4">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <FaCarSide className="text-3xl text-blue-600 group-hover:animate-bounce-slow transition-all" />
            <h1 className="text-2xl font-bold">
              Smart<span className="text-blue-600">Driving</span>
            </h1>
          </div>
          
          {/* Navigation */}
          <nav>
            <ul className="flex gap-4 md:gap-8">
              <li><Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</Link></li>
              <li><Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Dashboard</Link></li>
              <li><Link to="/courses" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Courses</Link></li>
              <li><Link to="/questions" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Practice</Link></li>
            </ul>
          </nav>

          {/* User Actions */}
          <div className="flex gap-3 items-center">
            {currentUser ? (
              <div className="relative">
                <div 
                  className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <FaUserCircle className="text-xl" />
                  <span className="font-medium">{currentUser.name.split(' ')[0]}</span>
                  <FaChevronDown className={`text-sm transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg min-w-[200px] overflow-hidden animate-fade-in-up z-50">
                    <Link to="/profile" className="block px-4 py-3 hover:bg-gray-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                      <FaUserCircle className="inline mr-2" /> My Profile
                    </Link>
                    <Link to="/dashboard" className="block px-4 py-3 hover:bg-gray-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                      Dashboard
                    </Link>
                    <hr className="my-1" />
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-red-600">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="btn-outline">
                  Login
                </button>
                <button onClick={() => navigate('/signup')} className="btn-primary">
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;