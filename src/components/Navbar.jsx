import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  LayoutDashboard,
  Clock,
  Settings
} from 'lucide-react';
import LanguageSelector from './LanguageSelector.jsx';
import DataSourceBadge from './DataSourceBadge.jsx';
import { useFarm } from '../context/FarmContext.jsx';
import { useTranslation } from '../i18n/index.jsx';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser, dataSource } = useFarm();
  const { t } = useTranslation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: t('nav.home', 'Home'), path: '/' },
    { name: t('nav.recommendations', 'Recommendations'), path: '/recommendation' },
    { name: t('nav.results', 'Results'), path: '/results' },
    { name: t('nav.marketInsights', 'Market Insights'), path: '/market-insights' },
    { name: t('nav.about', 'About'), path: '/about' },
    { name: t('nav.feedback', 'Feedback'), path: '/feedback' },
    { name: t('nav.subscription', 'Subscription'), path: '/subscription' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-emerald-950 text-white shadow-md border-b border-emerald-900 font-sans" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
           <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <img
              src="\farmpro_icon2.png"
              alt="FarmPro"
              className="w-full h-full object-contain"
            />
          </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-heading">
                  {t('nav.brandName', 'FarmPro')}
                </span>
                {/* <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-800/80 text-emerald-200 border border-emerald-700/60 hidden sm:inline-block">
                  {t('nav.badgeMarketFirst', 'Market First')}
                </span> */}
              </div>
              <p className="text-[10px] text-emerald-300 font-medium -mt-0.5 hidden xs:block">
                {t('nav.tagline', 'Plant Smarter. Sell Better.')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isActive(link.path)
                    ? 'bg-emerald-900/90 text-amber-300 shadow-xs border border-emerald-700/50'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-900/40'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Section: Language + Auth Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Data Source Indicator */}
            <DataSourceBadge dataSource={dataSource} size="xs" />

            {/* Language Selector in Navbar */}
            <LanguageSelector />

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/60 text-xs font-medium text-white transition cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-emerald-950 font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-semibold max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-emerald-300" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.phone || user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {user.plan || 'Pro Kisan'}
                      </span>
                    </div>

                    <div className="py-1 text-xs">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t('nav.dashboard', 'Farmer Dashboard')}</span>
                      </Link>
                      <Link
                        to="/history"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                      >
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t('nav.history', 'Recommendation History')}</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                      >
                        <Settings className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t('nav.profile', 'Farm Profile')}</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          logoutUser();
                          setUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('nav.logout', 'Logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-100 hover:text-white hover:bg-emerald-900/60 transition"
                >
                  {t('nav.login', 'Login')}
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-emerald-950 shadow-xs transition"
                >
                  {t('nav.register', 'Register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Language + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSelector compact />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900/80 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950/98 border-t border-emerald-900 px-4 pt-3 pb-5 space-y-3 shadow-2xl animate-in fade-in-20">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
            <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">{t('nav.feedMode', 'Feed Mode')}</span>
            <DataSourceBadge dataSource={dataSource} size="xs" />
          </div>
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive(link.path)
                    ? 'bg-emerald-900 text-amber-300 font-bold border border-emerald-700/60'
                    : 'text-emerald-100 hover:bg-emerald-900/50 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user && (
              <>
                <div className="pt-2 border-t border-emerald-900/70 my-1"></div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-emerald-100 hover:bg-emerald-900/50"
                >
                  {t('nav.dashboard', 'Farmer Dashboard')}
                </Link>
                <Link
                  to="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-emerald-100 hover:bg-emerald-900/50"
                >
                  {t('nav.history', 'Recommendation History')}
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-emerald-100 hover:bg-emerald-900/50"
                >
                  {t('nav.profile', 'Farm Profile')}
                </Link>
              </>
            )}
          </nav>

          {/* Auth in Mobile Menu */}
          <div className="pt-3 border-t border-emerald-900/80">
            {user ? (
              <div className="flex items-center justify-between bg-emerald-900/60 p-2.5 rounded-lg border border-emerald-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-emerald-950 font-bold flex items-center justify-center text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <span className="text-[10px] text-amber-300">{user.plan}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="text-xs text-rose-300 hover:text-rose-200 px-2 py-1 cursor-pointer"
                >
                  {t('nav.logout', 'Logout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg text-xs font-semibold bg-emerald-900/80 text-white border border-emerald-700/60"
                >
                  {t('nav.login', 'Login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg text-xs font-bold bg-amber-400 text-emerald-950"
                >
                  {t('nav.register', 'Register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

