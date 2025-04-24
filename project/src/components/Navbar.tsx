import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Store, Map, LogIn, LogOut, UserCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-emerald-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Store className="h-8 w-8" />
            <span className="text-xl font-bold">Smart Bazaar</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/map" className="flex items-center space-x-1 hover:text-emerald-200">
              <Map className="h-5 w-5" />
              <span>Find Vendors</span>
            </Link>
            
            {currentUser ? (
              <>
                {currentUser.isVendor && (
                  <Link to="/vendor-dashboard" className="flex items-center space-x-1 hover:text-emerald-200">
                    <Store className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-emerald-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 hover:text-emerald-200">
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;