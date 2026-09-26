import React from 'react';
import { 
  Home, 
  BookOpen, 
  HelpCircle, 
  Newspaper, 
  User as UserIcon 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, user } = useApp();

  const emailPrefix = user?.email ? user.email.split('@')[0] : '';
  const displayName = user?.displayName || (user?.name && user.name !== 'विद्यार्थी' ? user.name : (emailPrefix || 'परीक्षार्थी'));
  const photoURL = user?.photoURL || user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0B2046&color=fff&size=128`;

  interface BottomNavItem {
    tab: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }

  const navItems: BottomNavItem[] = [
    { tab: 'home', label: 'Home', icon: Home },
    { tab: 'learn', label: 'Learn', icon: BookOpen },
    { tab: 'practice', label: 'Practice', icon: HelpCircle },
    { tab: 'current-affairs', label: 'Current', icon: Newspaper },
    { tab: 'profile', label: 'Profile', icon: UserIcon }
  ];

  return (
    <div 
      id="mobile-bottom-navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 shadow-2xl safe-bottom transition-colors"
    >
      <nav className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab || (item.tab === 'learn' && (activeTab === 'courses' || activeTab === 'master-books'));

          return (
            <button
              key={item.tab}
              type="button"
              id={`bottom-nav-${item.tab}`}
              onClick={() => setActiveTab(item.tab)}
              className={`flex-1 min-h-[48px] flex flex-col items-center justify-center py-1 transition-all relative cursor-pointer active:scale-95 ${
                isActive 
                  ? 'text-sky-700 dark:text-sky-400 font-bold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                isActive 
                  ? 'bg-sky-50 dark:bg-sky-950/40' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}>
                {item.tab === 'profile' && user && !user.isGuest ? (
                  <div className="relative">
                    <img 
                      src={photoURL} 
                      alt={displayName} 
                      referrerPolicy="no-referrer"
                      className={`w-5 h-5 rounded-full object-cover transition-all ${
                        isActive 
                          ? 'ring-2 ring-sky-600 dark:ring-sky-500' 
                          : 'ring-1 ring-slate-300 dark:ring-slate-700'
                      }`}
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-1 ring-white dark:ring-slate-900" />
                  </div>
                ) : (
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-sky-700 dark:text-sky-400' : 'stroke-2'}`} />
                )}
              </div>

              <span className={`text-[10px] mt-0.5 tracking-tight ${
                isActive ? 'font-bold text-sky-700 dark:text-sky-400' : 'font-medium'
              }`}>
                {item.label}
              </span>

              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-sky-600 dark:bg-sky-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
