import {
  faArrowLeft,
  faUser,
  faSignOutAlt,
  faBars,
  faTimes,
  faKey,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearToken } from '@store/slices/authSlice';
import { useLogoutMutation } from '@api/authApi';

const HeaderUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = useLogoutMutation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { email } = useSelector((state) => state.auth.user || {});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
      if (!event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const canGoBack =
    location.pathname !== '/dashboard' && window.history.state && window.history.state.idx > 0;

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // ignore error
    }
    dispatch(clearToken());
    navigate('/login');
    setShowUserMenu(false);
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setShowUserMenu(!showUserMenu);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? 'bg-white/95 shadow-lg backdrop-blur-sm' : 'shadow-md'
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center transition-transform hover:scale-105"
              >
                <img
                  src="/vku-text-logo.svg"
                  alt="VKU Logo"
                  className="hidden h-8 w-auto sm:h-10 lg:block"
                />
                <img
                  src="/mini-logo.png"
                  alt="VKU Logo"
                  className="block h-8 w-auto sm:h-10 lg:hidden"
                />
              </Link>
            </div>

            <div className="hidden items-center space-x-4 sm:flex">
              {canGoBack && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 hover:text-gray-800"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                  <span className="hidden md:inline">Quay lại</span>
                </button>
              )}

              <div className="user-menu-container relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                  </div>
                  <span className="hidden md:inline">Tài khoản</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-2">
                      <p className="text-sm font-medium text-gray-800">Tài khoản của tôi</p>
                      <p className="text-xs text-gray-500">{email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/change-password');
                        setShowUserMenu(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faKey} className="h-4 w-4 text-gray-500" />
                      Đổi mật khẩu
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:hidden">
              {canGoBack && (
                <button
                  onClick={handleBack}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={toggleMobileMenu}
                className="mobile-menu-container flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white sm:hidden">
            <div className="space-y-3 px-4 py-3">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Tài khoản của tôi</p>
                  <p className="text-xs text-gray-500">{email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigate('/change-password');
                  setIsMobileMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faKey} className="h-4 w-4 text-gray-500" />
                Đổi mật khẩu
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </header>

      {isMobileMenuOpen && (
        <div
          className="bg-opacity-25 fixed inset-0 z-40 bg-black sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default HeaderUser;
