import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  Search,
  User,
  Upload,
  Bell,
  Home,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Download,
  Shield,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isAdmin = user?.is_staff || false;
  const [unreadCount, setUnreadCount] = useState(0);

  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);

  // Check if user is admin and fetch notifications
  useEffect(() => {
    if (user) {
      // Fetch notifications
      api
        .get("users/notifications/")
        .then((res) => {
          setNotifications(res.data);
          const unread = res.data.filter((n) => !n.is_read).length;
          setUnreadCount(unread);
        })
        .catch(() => {});
    } else {
      // Clear notifications when logged out (defer to next microtask to avoid synchronous setState in effect)
      Promise.resolve().then(() => {
        setNotifications([]);
        setUnreadCount(0);
      });
    }
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search functionality
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await api.get(`mods/?search=${query}&limit=5`);
        setSearchResults(response.data.results || []);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (id) => {
    try {
      await api.patch(`users/notifications/${id}/`, { is_read: true });
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.post("users/notifications/mark-all-read/");
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  // Navigation items
  const navItems = [
    { path: "/", label: "Home", icon: <Home size={18} /> },
    { path: "/mods", label: "Mods", icon: <Download size={18} /> },
    { path: "/categories", label: "Categories", icon: <Menu size={18} /> },
    { path: "/upload", label: "Upload", icon: <Upload size={18} /> },
    { path: "/forums", label: "Forums", icon: <MessageSquare size={18} /> },
  ];

  // Admin items
  const adminItems = [
    { path: "/admin/mods", label: "Mod Approvals", icon: <Shield size={18} /> },
    {
      path: "/admin/analytics",
      label: "Analytics",
      icon: <Settings size={18} />,
    },
    {
      path: "/admin/users",
      label: "User Management",
      icon: <User size={18} />,
    },
  ];

  // User menu items
  const userMenuItems = [
    { path: "/profile", label: "Profile", icon: <User size={16} /> },
    {
      path: "/account",
      label: "Account Settings",
      icon: <Settings size={16} />,
    },
    { path: "/my-mods", label: "My Mods", icon: <Upload size={16} /> },
    {
      path: "/collections",
      label: "Collections",
      icon: <Download size={16} />,
    },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-card border-b border-gray-800 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Navigation */}
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EM</span>
                </div>
                <span className="text-xl font-bold text-primary hidden sm:inline">
                  ETS2 MODS
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-8 md:flex md:space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors ${
                      location.pathname === item.path
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-2xl mx-4" ref={searchRef}>
              <form onSubmit={handleSubmitSearch} className="relative">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search mods, authors, categories..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() =>
                      searchQuery.length > 2 && setShowSearchResults(true)
                    }
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                        setShowSearchResults(false);
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                    {searchResults.map((mod) => (
                      <Link
                        key={mod.id}
                        to={`/mods/${mod.id}`}
                        className="block px-4 py-3 hover:bg-gray-800 border-b border-gray-800 last:border-b-0 transition-colors"
                        onClick={() => setShowSearchResults(false)}
                      >
                        <div className="font-medium text-white">
                          {mod.title}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          {mod.description}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-blue-400">
                            {mod.category?.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {mod.download_count} downloads
                          </span>
                        </div>
                      </Link>
                    ))}
                    <Link
                      to={`/search?q=${encodeURIComponent(searchQuery)}`}
                      className="block px-4 py-3 text-center text-blue-400 hover:bg-gray-800 border-t border-gray-800 font-medium"
                      onClick={() => setShowSearchResults(false)}
                    >
                      View all results
                    </Link>
                  </div>
                )}
              </form>
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center space-x-4">
              {/* Admin Panel Button */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center space-x-2 px-3 py-2 bg-purple-900 hover:bg-purple-800 rounded-lg text-sm font-medium transition-colors"
                >
                  <Shield size={16} />
                  <span>Admin</span>
                </Link>
              )}

              {/* Notifications */}
              {user && (
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg hover:bg-gray-800 relative transition-colors"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                      <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                        <h3 className="font-semibold text-white">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <Link
                              key={notification.id}
                              to={notification.link || "#"}
                              className={`block px-4 py-3 hover:bg-gray-800 border-b border-gray-800 last:border-b-0 transition-colors ${
                                !notification.is_read
                                  ? "bg-blue-900 bg-opacity-20"
                                  : ""
                              }`}
                              onClick={() =>
                                markNotificationAsRead(notification.id)
                              }
                            >
                              <div className="flex justify-between">
                                <p
                                  className={`${
                                    !notification.is_read
                                      ? "font-semibold text-white"
                                      : "text-gray-300"
                                  }`}
                                >
                                  {notification.message}
                                </p>
                                {!notification.is_read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full self-center"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(
                                  notification.created_at
                                ).toLocaleDateString()}
                              </p>
                            </Link>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-400">
                            No notifications
                          </div>
                        )}
                      </div>
                      <Link
                        to="/notifications"
                        className="block text-center py-3 text-blue-400 hover:bg-gray-800 border-t border-gray-800 font-medium"
                        onClick={() => setShowNotifications(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* User Menu */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.username}
                        className="w-8 h-8 rounded-full border-2 border-gray-700"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="hidden md:inline text-sm font-medium">
                      {user.username}
                    </span>
                    {user.modder_status === "verified" && (
                      <span className="hidden md:inline px-2 py-1 bg-yellow-900 text-yellow-200 text-xs rounded-full">
                        Verified
                      </span>
                    )}
                  </button>

                  {/* User Menu Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                      <div className="p-3 border-b border-gray-800">
                        <p className="font-semibold text-white">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                        {user.modder_status !== "regular" && (
                          <span className="inline-block mt-1 px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded-full">
                            {user.modder_status}
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-800 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>

                      {isAdmin && (
                        <>
                          <div className="border-t border-gray-800 pt-1">
                            <div className="px-4 py-2 text-xs text-gray-400 font-semibold">
                              Admin Panel
                            </div>
                            {adminItems.map((item) => (
                              <Link
                                key={item.path}
                                to={item.path}
                                className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-800 transition-colors"
                                onClick={() => setShowUserMenu(false)}
                              >
                                {item.icon}
                                <span>{item.label}</span>
                              </Link>
                            ))}
                          </div>
                        </>
                      )}

                      <div className="border-t border-gray-800">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-3 text-sm hover:bg-red-900 hover:text-red-100 transition-colors text-red-400"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Login/Register Buttons */
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium shadow-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800 animate-slideDown">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Admin items in mobile */}
              {isAdmin && (
                <>
                  <div className="pt-3 border-t border-gray-800">
                    <div className="px-3 py-2 text-xs text-gray-400 font-semibold">
                      Admin Panel
                    </div>
                    {adminItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-purple-900 transition-colors text-purple-200"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* User menu items in mobile */}
              {user ? (
                <>
                  <div className="pt-3 border-t border-gray-800">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg hover:bg-red-900 transition-colors text-red-400"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="pt-3 border-t border-gray-800 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-3 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors text-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-3 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all text-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
