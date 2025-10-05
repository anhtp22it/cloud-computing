import React, { useState, useEffect, useRef } from 'react';
import { faUser, faSignOutAlt, faBars, faTimes, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearToken } from '@store/slices/authSlice';
import { useLogoutMutation } from '@api/authApi';
import { rootApi } from '@api/rootApi';

function MobileMenu({ open, onClose, email, handleLogout, handleChangePassword }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Đóng menu" />
      <div
        className="animate-slideInRight absolute top-0 right-0 h-full w-64 bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="mb-4 inline-flex items-center justify-center rounded-lg p-2 text-2xl font-bold text-[#c52032] hover:bg-gray-100"
          aria-label="Đóng"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="mb-3 flex items-center gap-3 px-1 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Tài khoản của tôi</p>
            <p className="max-w-[160px] truncate text-xs text-gray-500">{email}</p>
          </div>
        </div>

        <nav className="mt-2 flex flex-col gap-2">
          <NavLink
            to="/admin/events"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 font-semibold transition ${
                isActive
                  ? 'bg-[#223b73] text-white'
                  : 'text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]'
              }`
            }
            onClick={onClose}
          >
            Quản lý sự kiện
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 font-semibold transition ${
                isActive
                  ? 'bg-[#ffd012] text-[#223b73]'
                  : 'text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]'
              }`
            }
            onClick={onClose}
          >
            Quản lý người dùng
          </NavLink>

          <NavLink
            to="/admin/donvi"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 font-semibold transition ${
                isActive
                  ? 'bg-[#223b73] text-white'
                  : 'text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]'
              }`
            }
            onClick={onClose}
          >
            Quản lý tên đơn vị
          </NavLink>

          <button
            onClick={handleChangePassword}
            className="inline-flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faKey} className="h-4 w-4 text-gray-500" />
            Đổi mật khẩu
          </button>

          <button
            onClick={handleLogout}
            className="mt-4 inline-flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
            Đăng xuất
          </button>
        </nav>
      </div>
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const { email } = useSelector((state) => state.auth.user || {});

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (showAdminMenu && userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowAdminMenu(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [showAdminMenu]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => (document.body.style.overflow = '');
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      //
    }
    dispatch(rootApi.util.resetApiState());
    dispatch(clearToken());
    navigate('/login', { replace: true });
    setShowAdminMenu(false);
    setMenuOpen(false);
  };

  const handleChangePassword = () => {
    navigate('/change-password');
    setShowAdminMenu(false);
    setMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-all duration-300 ${
        isScrolled ? 'bg-white/95 shadow-lg backdrop-blur-sm' : 'shadow'
      }`}
      style={{ padding: '12px 0' }}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4">
        <div className="text-lg font-bold text-[#223b73]">🎉 Event Admin</div>

        <nav className="ml-auto hidden items-center gap-2 md:flex md:gap-4">
          <NavLink
            to="/admin/events"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 font-semibold transition ${
                isActive
                  ? 'bg-[#223b73] text-white'
                  : 'text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]'
              }`
            }
          >
            Quản lý sự kiện
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 font-semibold transition ${
                isActive
                  ? 'bg-[#ffd012] text-[#223b73]'
                  : 'text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]'
              }`
            }
          >
            Quản lý người dùng
          </NavLink>

          {/* New link to DonVi management (desktop) */}
          <NavLink
            to="/admin/donvi"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 font-semibold transition ${
                isActive
                  ? 'bg-[#ffd012] text-[#223b73]'
                  : 'text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]'
              }`
            }
          >
            Quản lý tên đơn vị
          </NavLink>

          {/* User dropdown */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setShowAdminMenu((s) => !s)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
              aria-haspopup="menu"
              aria-expanded={showAdminMenu}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
              </div>
              <span className="hidden md:inline">Tài khoản</span>
            </button>

            {showAdminMenu && (
              <div
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-xl"
                role="menu"
              >
                <div className="border-b border-gray-100 px-4 py-2">
                  <p className="text-sm font-medium text-gray-800">Tài khoản của tôi</p>
                  <p className="truncate text-xs text-gray-500">{email}</p>
                </div>
                <button
                  onClick={handleChangePassword}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                  role="menuitem"
                >
                  <FontAwesomeIcon icon={faKey} className="h-4 w-4 text-gray-500" />
                  Đổi mật khẩu
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                  role="menuitem"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Nút hamburger (mobile) */}
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        email={email}
        handleLogout={handleLogout}
        handleChangePassword={handleChangePassword}
      />
    </header>
  );
}
