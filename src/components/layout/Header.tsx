import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Sparkles, 
  Flame, 
  Zap, 
  ShieldCheck,
  Edit3,
  Menu,
  X,
  Home,
  BookOpen,
  Building2,
  FileText,
  Youtube,
  Newspaper,
  ShoppingBag,
  Bookmark,
  Trophy,
  User as UserIcon,
  LogOut,
  Crown,
  Info,
  ChevronDown,
  Landmark,
  Scale,
  FileDown,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isUserAdmin, OFFICIAL_ADMIN_EMAIL } from '../../utils/sanitizer';
import { NavigationTab } from '../../types';
import { DbService } from '../../services/dbService';
import { StorageService } from '../../services/storageService';
import { PWAHeaderInstallButton } from '../pwa/PWAInstallPrompt';
import { GlobalHeaderSearchBar } from './GlobalHeaderSearchBar';

// =========================================================================
// Official Banking Tayari Nepal Inline SVG Component
// Rendered directly inline to guarantee 0ms latency, no broken image assets,
// and exact Navy Blue (#0B2046) & Crimson Red (#C8102E) branding.
// =========================================================================
export const BankingTayariLogoSvg: React.FC<{ 
  className?: string; 
  showMotto?: boolean;
}> = ({ 
  className = 'h-10 md:h-12 w-auto object-contain',
  showMotto = true
}) => {
  return (
    <svg 
      viewBox={showMotto ? "0 0 980 320" : "0 0 980 240"} 
      fill="none" 
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Banking Tayari Nepal Logo"
    >
      {/* ===== 1. LEFT EMBLEM: Stylized 'B' with Book, Pen, and Red Flourish ===== */}
      <g id="emblem-group" transform="translate(10, 8)">
        <path 
          d="M 28 6 L 176 6 C 220 6, 256 30, 256 74 C 256 110, 226 134, 184 142 C 228 152, 258 184, 258 226 C 258 244, 250 260, 238 274 C 228 266, 214 260, 196 258 C 226 244, 238 226, 238 208 C 238 174, 210 152, 166 152 L 76 152 L 76 248 L 28 248 Z" 
          fill="#0B2046" 
        />
        <path 
          d="M 76 40 L 168 40 C 190 40, 208 52, 208 72 C 208 92, 190 106, 168 106 L 76 106 Z" 
          fill="#FFFFFF" 
        />
        <path d="M 12 306 C 45 286, 86 276, 128 274 C 128 264, 128 256, 128 248 C 76 252, 38 266, 12 306 Z" fill="#0B2046" />
        <path d="M 20 282 C 52 262, 90 252, 130 249 C 130 241, 130 234, 130 226 C 84 230, 48 244, 20 282 Z" fill="#0B2046" />
        <path d="M 32 258 C 62 238, 98 228, 132 224 C 132 216, 132 210, 132 202 C 90 206, 56 218, 32 258 Z" fill="#0B2046" />
        <path d="M 136 302 C 178 282, 222 260, 260 216 C 260 242, 246 272, 218 292 C 190 308, 160 308, 136 302 Z" fill="#C8102E" />
        <path d="M 138 281 C 170 263, 206 244, 238 216 C 238 232, 228 254, 208 270 C 184 284, 160 286, 138 281 Z" fill="#C8102E" />
        <g transform="translate(94, 142)">
          <path 
            d="M 42 0 L 12 74 C 12 106, 24 133, 42 153 C 60 133, 72 106, 72 74 L 42 0 Z" 
            fill="#FFFFFF" 
            stroke="#0B2046" 
            strokeWidth="3.5" 
            strokeLinejoin="round" 
          />
          <circle cx="42" cy="74" r="6.5" fill="#0B2046" />
          <line x1="42" y1="67" x2="42" y2="4" stroke="#0B2046" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 26 76 C 26 96, 33 114, 42 128 C 51 114, 58 96, 58 76" fill="none" stroke="#0B2046" strokeWidth="2.5" />
        </g>
      </g>

      {/* ===== 2. RIGHT BRAND TYPOGRAPHY ===== */}
      <g transform="translate(295, 12)">
        <text 
          x="0" 
          y="126" 
          fill="#0B2046" 
          fontSize="136" 
          fontWeight="900" 
          letterSpacing="1"
          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
        >
          BANKING
        </text>
        <rect x="0" y="150" width="670" height="82" rx="4" fill="#C8102E" />
        <text 
          x="335" 
          y="210" 
          fill="#FFFFFF" 
          fontSize="46" 
          fontWeight="800" 
          textAnchor="middle" 
          letterSpacing="11"
          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
        >
          TAYARI NEPAL
        </text>

        {showMotto && (
          <g transform="translate(6, 256)">
            <g transform="translate(0, 0)">
              <circle cx="26" cy="26" r="26" fill="none" stroke="#0B2046" strokeWidth="4.5" />
              <path d="M 14 18 C 19 16, 24 17, 26 19 C 28 17, 33 16, 38 18 L 38 34 C 33 32, 28 33, 26 35 C 24 33, 19 32, 14 34 Z" fill="#0B2046" />
              <line x1="26" y1="19" x2="26" y2="35" stroke="#FFFFFF" strokeWidth="2" />
              <text x="66" y="35" fill="#0B2046" fontSize="23" fontWeight="800" letterSpacing="2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                PREPARE
              </text>
            </g>
            <line x1="218" y1="6" x2="218" y2="48" stroke="#0B2046" strokeWidth="2.5" />
            <g transform="translate(242, 0)">
              <circle cx="26" cy="26" r="26" fill="none" stroke="#C8102E" strokeWidth="4.5" />
              <path d="M 36 15 L 39 18 L 25 32 L 18 35 L 21 28 Z" fill="#0B2046" />
              <path d="M 16 36 C 22 34, 30 36, 36 31" fill="none" stroke="#C8102E" strokeWidth="2.5" strokeLinecap="round" />
              <text x="66" y="35" fill="#0B2046" fontSize="23" fontWeight="800" letterSpacing="2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                PRACTICE
              </text>
            </g>
            <line x1="472" y1="6" x2="472" y2="48" stroke="#C8102E" strokeWidth="2.5" />
            <g transform="translate(496, 0)">
              <circle cx="26" cy="26" r="26" fill="none" stroke="#0B2046" strokeWidth="4.5" />
              <rect x="17" y="29" width="4.5" height="9" fill="#0B2046" rx="1" />
              <rect x="24" y="23" width="4.5" height="15" fill="#0B2046" rx="1" />
              <rect x="31" y="17" width="4.5" height="21" fill="#0B2046" rx="1" />
              <path d="M 17 23 L 26 15 L 37 11 M 32 11 L 37 11 L 37 16" fill="none" stroke="#0B2046" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="66" y="35" fill="#0B2046" fontSize="23" fontWeight="800" letterSpacing="2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                SUCCEED
              </text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
};

export const Header: React.FC = () => {
  const { 
    user, 
    theme, 
    toggleTheme, 
    language,
    setLanguage,
    toggleLanguage,
    t,
    tText,
    setIsSearchOpen, 
    setIsAiModalOpen,
    setIsNotificationsOpen,
    notifications,
    unreadNotificationsCount,
    activeTab,
    setActiveTab,
    setIsProfileModalOpen,
    openAdminWithSecurityCheck,
    isAdminAuthenticated,
    purchases,
    bookmarks,
    logout,
    openLoginModal,
    quizSubCategory,
    selectQuizSubCategory,
    openCompleteSyllabusPdf
  } = useApp();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isMobileSangathitOpen, setIsMobileSangathitOpen] = useState<boolean>(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);

  const isGuest = !user?.email || Boolean(user?.isGuest);

  // Force immediate re-render when auth changes so admin button and user profile update instantly
  const [, setForceUpdate] = useState(0);
  useEffect(() => {
    const handleAuthEvent = () => setForceUpdate(n => n + 1);
    window.addEventListener('btn:profile-updated', handleAuthEvent);
    window.addEventListener('btn:user-login', handleAuthEvent);
    window.addEventListener('btn:logout', handleAuthEvent);
    return () => {
      window.removeEventListener('btn:profile-updated', handleAuthEvent);
      window.removeEventListener('btn:user-login', handleAuthEvent);
      window.removeEventListener('btn:logout', handleAuthEvent);
    };
  }, []);

  // Visibility logic for the Admin button: ONLY when strictly authorized admin (nvisit9@gmail.com) is logged in
  const isAdmin = Boolean(user?.email && isUserAdmin(user.email));
  const isPro = DbService.isUserPro(user);

  const unreadCount = typeof unreadNotificationsCount === 'number' 
    ? unreadNotificationsCount 
    : (notifications || []).filter(n => !n.read).length;

  // Dynamic user session bindings:
  const emailPrefix = user?.email ? user.email.split('@')[0] : '';
  const displayName = isGuest
    ? tText('अतिथि', 'Guest')
    : (user?.displayName || (user?.name && user.name !== 'विद्यार्थी' ? user.name : (emailPrefix || tText('परीक्षार्थी', 'Candidate'))));
  const userEmail = isGuest ? '' : (user?.email || '');
  const photoURL = user?.photoURL || user?.avatarUrl || (isGuest ? '/default-avatar.png' : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0B2046&color=fff&size=256`);

  const drawerNavItems: { tab: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { tab: 'home', label: tText('गृहपृष्ठ', 'Home'), icon: Home },
    { tab: 'learn', label: tText('अध्ययन तथा पाठ्यक्रम', 'Learn & Syllabus'), icon: BookOpen, badge: 'CORE', badgeColor: 'bg-sky-600 text-white' },
    { tab: 'practice', label: tText('वस्तुगत परीक्षा अभ्यास', 'Practice Center'), icon: Award, badge: '५० MCQs', badgeColor: 'bg-emerald-600 text-white' },
    { tab: 'mock-tests', label: tText('पूर्ण मोक टेस्ट (-२०%)', 'Full Mock Tests'), icon: Award, badge: '-20%', badgeColor: 'bg-rose-600 text-white' },
    { tab: 'banks', label: tText('संस्थागत बैंक हब (NRB/RBB/NBL)', 'Bank Preparation Hub'), icon: Landmark },
    { tab: 'vacancies', label: tText('खुला पदपूर्ति तथा सूचना', 'Vacancies & Notices'), icon: Building2, badge: 'OPEN', badgeColor: 'bg-emerald-600 text-white' },
    { tab: 'store', label: tText('डिजिटल पुस्तक स्टोर', 'Digital Store'), icon: ShoppingBag, badge: 'BOOKS', badgeColor: 'bg-amber-500 text-white' },
    { tab: 'library', label: tText('मेरो पुस्तकालय', 'My Library'), icon: BookOpen },
    { tab: 'mistakes', label: tText('गल्ती पुस्तिका (Mistake Book)', 'Mistake Book'), icon: FileText, badge: 'REVIEW', badgeColor: 'bg-rose-600 text-white' },
    { tab: 'revision', label: tText('रिभिजन तालिका', 'Spaced Revision'), icon: ShieldCheck, badge: 'DUE', badgeColor: 'bg-amber-600 text-white' },
    { tab: 'dashboard', label: tText('विद्यार्थी ड्यासबोर्ड', 'My Dashboard'), icon: UserIcon },
    { tab: 'current-affairs', label: tText('समसामयिक मामिला', 'Current Affairs'), icon: Newspaper },
    { tab: 'portal', label: tText('एकीकृत बैंकिङ पोर्टल', 'Hybrid Portal'), icon: Landmark, badge: 'LIVE', badgeColor: 'bg-rose-600 text-white' },
    { tab: 'notes-hub', label: tText('बैंकिङ्ग नोट्स हब (LaTeX + PDF)', 'Banking Notes Hub'), icon: BookOpen },
    { tab: 'bookmarks', label: tText('बुकमार्कहरू', 'Bookmarks'), icon: Bookmark, badge: (bookmarks || []).length > 0 ? (bookmarks || []).length : undefined },
    { tab: 'profile', label: tText('मेरो प्रोफाइल', 'My Profile'), icon: UserIcon },
    { tab: 'contact', label: tText('सम्पर्क तथा सहयोग', 'Contact & Support'), icon: Info }
  ];

  const handleDrawerNavigate = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsMobileDrawerOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm(tText('के तपाईं लगआउट गर्न चाहनुहुन्छ?', 'Are you sure you want to log out?'))) {
      setIsMobileDrawerOpen(false);
      logout();
    }
  };

  return (
    <>
      <header 
        className="sticky top-0 z-30 backdrop-blur-md bg-white/98 text-[#0F172A] border-b border-slate-200/80 transition-all shadow-xs"
      >
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            
            {/* Left section: Mobile Hamburger Drawer Trigger & Brand */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                id="mobile-drawer-toggle-btn"
                onClick={() => setIsMobileDrawerOpen(true)}
                className="xl:hidden min-h-[38px] min-w-[38px] p-2 text-[#0F172A] bg-white hover:bg-slate-100 rounded-xl flex items-center justify-center cursor-pointer transition active:scale-95 shrink-0 border border-slate-200 shadow-2xs"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0F172A' }}
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 text-[#0F172A] header-nav-icon" style={{ color: '#0F172A' }} />
              </button>

              {/* Official Brand Identity - Exact Official Full Logo (Responsive, object-contain, no cropping or distortion) */}
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="flex items-center focus:outline-hidden cursor-pointer shrink-0 py-1"
                title={tText('बैंकिङ्ग तयारी नेपाल', 'Banking Tayari Nepal')}
                aria-label="Banking Tayari Nepal Home"
              >
                <img 
                  src="/logo.svg" 
                  alt="Banking Tayari Nepal" 
                  className="h-8 xs:h-8.5 sm:h-9 md:h-10 lg:h-11 w-auto max-w-[130px] sm:max-w-[160px] md:max-w-[185px] lg:max-w-[210px] object-contain select-none transition-transform hover:scale-[1.02]"
                  style={{ aspectRatio: '1050 / 340' }}
                  loading="eager"
                />
              </button>
            </div>

            {/* Center Navigation: Clean, Generous Whitespace, Subtle Indicator */}
            <nav className="hidden xl:flex items-center gap-1 font-medium text-[13px]">
              {[
                { tab: 'learn', label: tText('सिकाई', 'Learn') },
                { tab: 'practice', label: tText('अभ्यास', 'Practice') },
                { tab: 'mock-tests', label: tText('मक टेस्ट', 'Mock Tests') },
                { tab: 'current-affairs', label: tText('समसामयिक', 'Current Affairs') },
                { tab: 'vacancies', label: tText('विज्ञापन', 'Vacancies') },
                { tab: 'store', label: tText('डिजिटल स्टोर', 'Store') },
              ].map(item => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    type="button"
                    onClick={() => setActiveTab(item.tab as NavigationTab)}
                    className={`px-3 py-1.5 rounded-lg transition-all relative cursor-pointer ${
                      isActive
                        ? 'text-[#0B2046] font-bold bg-slate-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#0B2046] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Controls: Search, Language, Notifications, Profile */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Search Trigger Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label={tText('खोज्नुहोस्', 'Search')}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition active:scale-95 cursor-pointer shadow-2xs"
                title="Search (⌘K)"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span className="hidden md:inline font-medium">Search</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono font-semibold bg-white border border-slate-200 rounded text-slate-400">⌘K</kbd>
              </button>

              {/* Bilingual Language Switcher */}
              <div 
                id="header-language-toggle"
                className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 shrink-0"
                title="Language"
              >
                <button
                  type="button"
                  onClick={() => setLanguage('ne')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    language === 'ne'
                      ? 'bg-[#0B2046] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  नेपा
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-[#0B2046] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Notification Bell with Badge */}
              <button
                id="header-notification-btn"
                onClick={() => setIsNotificationsOpen(true)}
                aria-label="Notifications"
                className="min-h-[38px] min-w-[38px] p-2 relative text-[#0F172A] bg-white hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center cursor-pointer transition focus:outline-hidden active:scale-95 shrink-0 shadow-2xs"
                title={`सूचनाहरू (${unreadCount} नपढिएका)`}
              >
                <Bell className="w-4 h-4 text-slate-700 header-nav-icon" />
                {unreadCount > 0 && (
                  <span 
                    id="header-notification-badge"
                    className="absolute top-1 right-1 flex items-center justify-center min-w-[15px] h-[15px] px-1 text-[9px] font-black font-mono text-white bg-[#C8102E] rounded-full border-2 border-white shadow-xs"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Admin Gate (if authenticated) */}
              {isAdmin && (
                <button
                  id="header-admin-btn"
                  onClick={openAdminWithSecurityCheck}
                  className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer shrink-0 ${
                    isAdminAuthenticated 
                      ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-amber-400'
                  }`}
                  title={tText(`प्रशासक प्यानल`, `Admin Panel`)}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Admin</span>
                </button>
              )}

              {/* Header Profile Section & Trigger */}
              {isGuest ? (
                <div className="flex items-center gap-1.5 pl-1.5 sm:pl-3 border-l border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => openLoginModal()}
                    id="header-login-btn"
                    className="min-h-[38px] px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 active:scale-95 text-slate-800 text-xs font-bold transition cursor-pointer shrink-0"
                    title={tText('लगइन गर्नुहोस्', 'Login')}
                  >
                    <span>{tText('लगइन', 'Login')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('learn')}
                    id="header-get-started-btn"
                    className="hidden sm:flex min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#0B2046] hover:bg-[#153468] active:scale-95 text-white text-xs font-bold shadow-xs items-center gap-1.5 transition cursor-pointer shrink-0"
                    title={tText('तयारी सुरु गर्नुहोस्', 'Get Started')}
                  >
                    <span>{tText('सुरु गर्नुहोस्', 'Get Started')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(true)}
                    className="hidden md:block p-1 rounded-xl hover:bg-slate-100 transition cursor-pointer shrink-0"
                    title={tText('अतिथि प्रोफाइल हेर्नुहोस्', 'View Guest Profile')}
                  >
                    <img 
                      src={photoURL} 
                      alt={displayName} 
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border border-slate-300 object-cover shadow-2xs"
                    />
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  id="header-profile-btn"
                  className="min-h-[44px] flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors border-l pl-2 sm:pl-3 ml-0.5 sm:ml-1 border-slate-200 group text-left cursor-pointer active:scale-95"
                  title={`${displayName} - ${tText('प्रोफाइल सम्पादन', 'Edit Profile')}`}
                >
                  <div className="text-right hidden sm:block max-w-[140px]">
                    <div className="flex items-center justify-end gap-1.5">
                      <p className="text-xs text-slate-900 font-bold group-hover:text-blue-700 transition truncate" title={displayName}>
                        {displayName}
                      </p>
                      {isPro && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-black tracking-wider border border-amber-300 flex items-center gap-0.5" title="Banking Tayari Pro Active">
                          <Crown className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          <span>PRO</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 truncate" title={userEmail || tText('विद्यार्थी', 'Student')}>
                      {userEmail || user?.targetExam?.split(' ')[0] || tText('विद्यार्थी', 'Student')}
                    </p>
                  </div>
                  
                  <div className="relative">
                    <img 
                      src={photoURL} 
                      alt={displayName} 
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 sm:w-8 sm:h-8 rounded-full border border-slate-300 object-cover shadow-2xs transition-transform group-hover:scale-105"
                    />
                    {user && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                </button>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          SLEEK COLLAPSIBLE MOBILE SLIDE-OVER DRAWER (SaaS Level)
          Provides quick, clean navigation on mobile screens without header clutter.
          ========================================================================= */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200">
          
          {/* Backdrop blur overlay */}
          <div 
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" 
          />

          {/* Sliding Drawer Container - Clean Light */}
          <div className="relative w-4/5 max-w-xs bg-white text-slate-800 h-full shadow-2xl flex flex-col z-10 border-r border-slate-200 animate-in slide-in-from-left duration-200">
            
            {/* Drawer Top Bar: Brand Logo & Close Button */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <div className="bg-[#0B2046]/5 px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <img 
                  src="/logo.svg" 
                  alt="Banking Tayari Nepal" 
                  className="h-7 w-auto max-w-[140px] object-contain select-none"
                  style={{ aspectRatio: '1050 / 340' }}
                  loading="eager"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active User Identity Card inside Mobile Drawer */}
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img 
                  src={photoURL} 
                  alt={displayName} 
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border border-slate-300 shadow-2xs"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {displayName}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    {userEmail || tText('विद्यार्थी खाता', 'Student Account')}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {isPro ? (
                      <span className="px-1.5 py-0.2 text-[10px] font-black bg-amber-100 text-amber-900 rounded border border-amber-300 flex items-center gap-1">
                        <Crown className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        <span>PRO</span>
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 text-[10px] font-bold bg-white text-slate-700 rounded border border-slate-300">
                        FREE
                      </span>
                    )}
                    <span className="px-1.5 py-0.2 text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 rounded">
                      Lvl {user.level || 1}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {user.xp} XP
                    </span>
                  </div>
                </div>
              </div>

              {isGuest ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    openLoginModal();
                  }}
                  className="w-full mt-3 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{tText('लगइन / खाता खोल्नुहोस्', 'Login / Register')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full mt-3 py-1.5 px-3 rounded-xl bg-white border border-slate-300 hover:border-blue-400 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{tText('प्रोफाइल सम्पादन गर्नुहोस्', 'Edit Profile')}</span>
                </button>
              )}
            </div>

            {/* Quick Action: Download Complete Syllabus PDF in Mobile Drawer */}
            <div className="p-3 bg-emerald-50/70 border-b border-emerald-200/80">
              <button
                type="button"
                id="mobile-drawer-download-pdf-btn"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  openCompleteSyllabusPdf();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white text-xs font-black flex items-center justify-between shadow-xs transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileDown className="w-4 h-4 text-emerald-200" />
                  <span>{tText('पूर्ण पाठ्यक्रम PDF डाउनलोड', 'Download Complete Syllabus PDF')}</span>
                </div>
                <span className="px-1.5 py-0.2 text-[9px] font-black bg-white/20 text-white rounded">
                  A4 • 10P
                </span>
              </button>
            </div>

            {/* Navigation List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
              {drawerNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;

                if (item.tab === 'quiz') {
                  return (
                    <div key={item.tab} className="space-y-1">
                      <div className="flex items-center w-full">
                        <button
                          type="button"
                          id="mobile-drawer-sangathit-parent"
                          onClick={() => {
                            setIsMobileSangathitOpen(!isMobileSangathitOpen);
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                            isActive 
                              ? 'bg-blue-50 text-blue-900 border border-blue-200 shadow-xs' 
                              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-1">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                            <span className="truncate">{tText('१. संगठित संस्था एकीकृत प्रिटेस्ट', '1. Public Enterprises Pre-Test')}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className="p-1 rounded-md text-slate-500 hover:text-slate-800"
                            >
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileSangathitOpen ? 'rotate-180 text-blue-600' : ''}`} />
                            </span>
                          </div>
                        </button>
                      </div>

                      {/* Mobile Collapsible Sub-menu Structure */}
                      <div
                        id="mobile-sangathit-submenu"
                        className={`overflow-hidden transition-all duration-200 ease-in-out ${
                          isMobileSangathitOpen ? 'max-h-96 opacity-100 py-1 space-y-1' : 'max-h-0 opacity-0 pointer-events-none'
                        }`}
                      >
                        {/* 1. संगठित संस्था Pre-Test */}
                        <button
                          type="button"
                          id="mobile-submenu-sangathit"
                          onClick={() => {
                            selectQuizSubCategory('sangathit');
                            setIsMobileDrawerOpen(false);
                          }}
                          className={`w-full flex items-center justify-between py-2.5 px-3 pl-6 rounded-lg text-xs transition cursor-pointer ${
                            isActive && quizSubCategory === 'sangathit'
                              ? 'bg-blue-50 text-[#1E40AF] font-black border-l-4 border-[#1E40AF]'
                              : 'text-slate-800 hover:text-[#1E40AF] hover:bg-slate-50 font-bold'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Building2 className={`w-4 h-4 shrink-0 ${isActive && quizSubCategory === 'sangathit' ? 'text-[#1E40AF]' : 'text-slate-600'}`} />
                            <div className="text-left truncate">
                              <p className="truncate">{tText('१. संगठित संस्था Pre-Test (५० सेट)', '1. Public Enterprises Pre-Test (50 Sets)')}</p>
                            </div>
                          </div>
                        </button>

                        {/* 2. बैंकिङ्ग परीक्षा तयारी */}
                        <button
                          type="button"
                          id="mobile-submenu-banking"
                          onClick={() => {
                            selectQuizSubCategory('banking');
                            setIsMobileDrawerOpen(false);
                          }}
                          className={`w-full flex items-center justify-between py-2.5 px-3 pl-6 rounded-lg text-xs transition cursor-pointer ${
                            isActive && quizSubCategory === 'banking'
                              ? 'bg-blue-50 text-[#1E40AF] font-black border-l-4 border-[#1E40AF]'
                              : 'text-slate-800 hover:text-[#1E40AF] hover:bg-slate-50 font-bold'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Landmark className={`w-4 h-4 shrink-0 ${isActive && quizSubCategory === 'banking' ? 'text-[#1E40AF]' : 'text-slate-600'}`} />
                            <div className="text-left truncate">
                              <p className="truncate">{tText('२. बैंकिङ्ग सेवा (NRB, RBB, NBL, ADBL)', '2. Banking Service (NRB, RBB, NBL, ADBL)')}</p>
                            </div>
                          </div>
                        </button>

                        {/* 3. निजामती/लोकसेवा तयारी */}
                        <button
                          type="button"
                          id="mobile-submenu-loksewa"
                          onClick={() => {
                            selectQuizSubCategory('loksewa');
                            setIsMobileDrawerOpen(false);
                          }}
                          className={`w-full flex items-center justify-between py-2.5 px-3 pl-6 rounded-lg text-xs transition cursor-pointer ${
                            isActive && quizSubCategory === 'loksewa'
                              ? 'bg-blue-50 text-[#1E40AF] font-black border-l-4 border-[#1E40AF]'
                              : 'text-slate-800 hover:text-[#1E40AF] hover:bg-slate-50 font-bold'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Scale className={`w-4 h-4 shrink-0 ${isActive && quizSubCategory === 'loksewa' ? 'text-[#1E40AF]' : 'text-slate-600'}`} />
                            <div className="text-left truncate">
                              <p className="truncate">{tText('३. निजामती/लोकसेवा तयारी', '3. Civil Service / PSC Preparation')}</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.tab}
                    type="button"
                    onClick={() => handleDrawerNavigate(item.tab)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-[13px] font-bold transition cursor-pointer group ${
                      isActive 
                        ? 'bg-blue-50 text-[#1E40AF] border-l-4 border-[#1E40AF] font-black shadow-xs' 
                        : 'text-slate-900 hover:text-[#1E40AF] hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-[#1E40AF]' : 'text-slate-600 group-hover:text-[#1E40AF]'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Admin Button inside Drawer */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    openAdminWithSecurityCheck();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 transition mt-2 border border-amber-200"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>{tText('प्रशासक प्यानल (Admin PIN)', 'Admin Panel (PIN)')}</span>
                </button>
              )}
            </div>

            {/* Drawer Bottom Controls: Language & Logout */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs font-bold text-slate-700">
                  {tText('भाषा (Language)', 'Language')}
                </span>
                <div className="flex items-center p-0.5 rounded-lg bg-white border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setLanguage('ne')}
                    className={`px-2 py-1 rounded-md text-xs font-bold transition ${
                      language === 'ne' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    🇳🇵 नेपाली
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 rounded-md text-xs font-bold transition ${
                      language === 'en' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-rose-200"
              >
                <LogOut className="w-4 h-4" />
                <span>{tText('खाता लगआउट गर्नुहोस्', 'Log Out')}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Global Search Modal Overlay - Clean Light Theme */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col p-4 animate-fadeIn md:hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#1E40AF]" />
              <h3 className="text-sm font-bold text-[#0F172A]">ऐन, कानुन तथा बैंक नोट्स खोज</h3>
            </div>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="pt-3 flex-1 overflow-y-auto">
            <GlobalHeaderSearchBar 
              isMobileModal 
              onClose={() => setIsMobileSearchOpen(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
};
