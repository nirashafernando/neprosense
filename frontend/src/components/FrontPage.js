import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../logo.png";
import api from "../lib/axios";

const FrontPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState({
    reports: [],
    recipients: [],
    donors: []
  });
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  const profileRef = useRef(null);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('globalSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfile]);

  // Debounced search function
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        performSearch(searchQuery);
      } else {
        setSearchResults({ reports: [], recipients: [], donors: [] });
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Perform search across all entities
  const performSearch = async (query) => {
    setIsSearching(true);
    try {
      const searchLower = query.toLowerCase();
      
      // Search reports
      const reportsResponse = await api.get('/predictions/my-predictions');
      const reports = reportsResponse.data.success ? reportsResponse.data.data : [];
      const matchedReports = reports.filter(report => {
        const reportId = report._id?.slice(-8).toUpperCase();
        const recipientId = report.recipientId?.recipientId;
        return reportId?.toLowerCase().includes(searchLower) ||
               recipientId?.toLowerCase().includes(searchLower);
      }).slice(0, 5);

      // Search recipients
      const recipientsResponse = await api.get('/recipients');
      const recipients = recipientsResponse.data.success ? recipientsResponse.data.data : [];
      const matchedRecipients = recipients.filter(recipient => 
        recipient.recipientId?.toLowerCase().includes(searchLower) ||
        recipient.name?.toLowerCase().includes(searchLower)
      ).slice(0, 5);

      // Search donors
      const donorsResponse = await api.get('/donors');
      const donors = donorsResponse.data.success ? donorsResponse.data.data : [];
      const matchedDonors = donors.filter(donor =>
        donor.donorId?.toLowerCase().includes(searchLower) ||
        donor.name?.toLowerCase().includes(searchLower)
      ).slice(0, 5);

      setSearchResults({
        reports: matchedReports,
        recipients: matchedRecipients,
        donors: matchedDonors
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ reports: [], recipients: [], donors: [] });
    } finally {
      setIsSearching(false);
    }
  };

  // Add to search history
  const addToSearchHistory = (query) => {
    if (!query.trim()) return;
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('globalSearchHistory', JSON.stringify(newHistory));
  };

  const menuItems = [
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      label: "Dashboard",
      path: "/app/dashboard",
      active: location.pathname === "/app/dashboard" || location.pathname === "/app" || location.pathname === "/app/",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      label: "Make Prediction",
      path: "/app/make-prediction",
      active: location.pathname === "/app/make-prediction",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      label: "Matching Results",
      path: "/app/matching-results",
      active: location.pathname === "/app/matching-results",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      label: "Reports",
      path: "/app/reports",
      active: location.pathname === "/app/reports",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      label: "Admin Profile",
      path: "/app/admin-profile",
      active: location.pathname === "/app/admin-profile",
    },
  ];

  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/app" || currentPath === "/app/" || currentPath === "/app/dashboard") return "Dashboard";
    if (currentPath === "/app/make-prediction") return "Make Prediction";
    if (currentPath === "/app/matching-results") return "Matching Results";
    if (currentPath === "/app/reports") return "Reports";
    if (currentPath === "/app/model-transparency") return "Model Transparency";
    if (currentPath === "/app/admin-profile") return "Admin Profile";
    return "Intelligent Donor Matching";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToSearchHistory(searchQuery.trim());
      // Navigate to reports page with search query
      navigate('/app/reports', { state: { searchQuery: searchQuery.trim() } });
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  // Navigate to specific result
  const navigateToResult = (type, item) => {
    addToSearchHistory(searchQuery.trim());
    setShowSearchResults(false);
    setSearchQuery("");

    if (type === 'report') {
      navigate('/app/reports', { state: { searchQuery: item._id?.slice(-8).toUpperCase() } });
    } else if (type === 'recipient') {
      navigate('/app/make-prediction', { state: { recipientId: item.recipientId } });
    } else if (type === 'donor') {
      navigate('/app/make-prediction', { state: { donorId: item.donorId } });
    }
  };

  const getTotalResults = () => {
    return searchResults.reports.length + searchResults.recipients.length + searchResults.donors.length;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-medical-700 text-white flex flex-col min-h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-medical-600">
          <button onClick={() => navigate("/home")} className="w-full cursor-pointer">
            <div className="flex flex-col items-center space-y-3 hover:opacity-80 transition-opacity">
              {/* Logo Image */}
              <img
                src={logo}
                alt="Intelligent Donor Matching Logo"
                className="w-30 h-30 object-contain"
              />
              <div className="text-center">
                <p className="text-white text-lg font-bold"> Donor Matching System</p>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${item.active
                    ? "bg-medical-600 text-white shadow-lg"
                    : "text-medical-100 hover:bg-medical-600 hover:text-white"
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info at Bottom */}
        <div className="p-6 border-t border-medical-600 bg-medical-800">
          <div className="flex items-center space-x-3">
            <div className="bg-medical-600 p-2 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-medical-200 text-xs">{user?.role || 'Role'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Left side - Title */}
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                {getCurrentPageTitle()}
              </h1>
              <span className="text-sm bg-medical-100 text-medical-700 px-3 py-1 rounded-full font-medium">
                Active
              </span>
            </div>

            {/* Center - Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search patients, reports, or data..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(true);
                    }}
                    onFocus={() => setShowSearchResults(true)}
                    onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults({ reports: [], recipients: [], donors: [] });
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {showSearchResults && (searchQuery.length > 0 || searchHistory.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    {isSearching && (
                      <div className="p-4 text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-medical-600"></div>
                        <p className="text-sm text-gray-600 mt-2">Searching...</p>
                      </div>
                    )}

                    {!isSearching && searchQuery.length > 0 && getTotalResults() === 0 && (
                      <div className="p-4 text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-gray-600">No results found for "{searchQuery}"</p>
                      </div>
                    )}

                    {!isSearching && getTotalResults() > 0 && (
                      <div className="p-2">
                        {/* Reports Section */}
                        {searchResults.reports.length > 0 && (
                          <div className="mb-3">
                            <div className="px-3 py-2 flex items-center gap-2">
                              <svg className="w-4 h-4 text-medical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Reports</span>
                            </div>
                            {searchResults.reports.map((report, idx) => (
                              <button
                                key={idx}
                                onClick={() => navigateToResult('report', report)}
                                className="w-full px-3 py-2 hover:bg-medical-50 rounded-lg text-left transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      Report #{report._id?.slice(-8).toUpperCase()}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Recipient: {report.recipientId?.recipientId || 'N/A'}
                                    </p>
                                  </div>
                                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                    {report.status || 'Completed'}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Recipients Section */}
                        {searchResults.recipients.length > 0 && (
                          <div className="mb-3">
                            <div className="px-3 py-2 flex items-center gap-2">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Recipients</span>
                            </div>
                            {searchResults.recipients.map((recipient, idx) => (
                              <button
                                key={idx}
                                onClick={() => navigateToResult('recipient', recipient)}
                                className="w-full px-3 py-2 hover:bg-blue-50 rounded-lg text-left transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {recipient.recipientId}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {recipient.name || 'Patient'} • Age: {recipient.age || 'N/A'}
                                    </p>
                                  </div>
                                  <span className="text-xs text-blue-600 font-medium">
                                    View →
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Donors Section */}
                        {searchResults.donors.length > 0 && (
                          <div className="mb-2">
                            <div className="px-3 py-2 flex items-center gap-2">
                              <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Donors</span>
                            </div>
                            {searchResults.donors.map((donor, idx) => (
                              <button
                                key={idx}
                                onClick={() => navigateToResult('donor', donor)}
                                className="w-full px-3 py-2 hover:bg-rose-50 rounded-lg text-left transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {donor.donorId}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {donor.name || 'Donor'} • Blood: {donor.bloodType || 'N/A'}
                                    </p>
                                  </div>
                                  <span className="text-xs text-rose-600 font-medium">
                                    View →
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* View All Results */}
                        <button
                          onClick={(e) => handleSearch(e)}
                          className="w-full px-3 py-2 mt-2 bg-medical-600 hover:bg-medical-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          View All Results ({getTotalResults()})
                        </button>
                      </div>
                    )}

                    {/* Search History */}
                    {!isSearching && searchQuery.length === 0 && searchHistory.length > 0 && (
                      <div className="p-2">
                        <div className="px-3 py-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Recent Searches</span>
                        </div>
                        {searchHistory.slice(0, 5).map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSearchQuery(item);
                              searchInputRef.current?.focus();
                            }}
                            className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-left transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="text-sm text-gray-700">{item}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Right side - Actions and Profile */}
            <div className="flex items-center space-x-4">
              {/* Profile Icon */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-medical-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <svg
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                      showProfile ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50">
                    <div className="p-3 border-b border-slate-200">
                      <p className="text-sm font-semibold text-slate-800">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {user?.email || ''}
                      </p>
                      <span className="inline-block mt-1.5 text-xs font-medium text-medical-600 bg-medical-50 px-2 py-0.5 rounded">
                        {user?.role || 'Clinician'}
                      </span>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => {
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-md font-medium text-sm transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
