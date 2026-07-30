import { useEffect, useRef, useState, type FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, LogOut, Menu, Moon, Sun, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/image.png';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const navItems = [
  { name: 'Events', href: '/events' },
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'Team', href: '/team' },
  { name: 'Domains', href: '/domains' },
  { name: 'Contact', href: '/contact' },
];

const Navbar: FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollContainer = document.getElementById('scroll-container');
    const scrollTarget: HTMLElement | Window = scrollContainer ?? window;
    const getScrollPosition = () => scrollContainer?.scrollTop ?? window.scrollY;

    const handleScroll = () => {
      const currentScrollY = getScrollPosition();
      setScrolled(currentScrollY > 12);

      if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY.current) {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    handleScroll();
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollTarget.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setHidden(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      ref={navRef}
      aria-label="Primary navigation"
      className={`fixed inset-x-0 top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-300 ${
        scrolled
          ? 'border-line bg-surface/95 shadow-soft'
          : 'border-line/60 bg-surface/75'
      }`}
      initial={false}
      animate={{ y: hidden ? -96 : 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="site-container-wide">
        <div className="flex h-[4.5rem] items-center justify-between gap-2 lg:gap-3">
          <Link
            to="/"
            className="group flex min-w-0 flex-1 items-center gap-2 rounded-control focus-visible:outline-offset-4 md:flex-initial"
            aria-label="HackerEarth Hub-NMAMIT home"
          >
            <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-control border border-line bg-white p-0.5 shadow-soft transition-transform duration-300 group-hover:-translate-y-0.5 sm:size-11">
              <img
                src={logo}
                alt="HackerEarth Logo"
                className="size-full object-cover"
              />
            </span>
            <span className="max-w-[8.75rem] font-display text-[0.68rem] font-semibold leading-tight tracking-[-0.02em] text-ink xs:max-w-none xs:text-sm md:max-w-36 md:text-xs xl:max-w-none xl:text-base">
              HackerEarth Hub-NMAMIT
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
            <div className="flex items-center gap-0.5 rounded-card border border-line/80 bg-surface-muted/75 p-1 lg:gap-1">
              <Link
                to="/"
                aria-label="Home"
                title="Home"
                aria-current={isActive('/') ? 'page' : undefined}
                className={`relative flex size-9 shrink-0 items-center justify-center rounded-control transition duration-200 ${
                  isActive('/')
                    ? 'bg-surface text-brand-700 shadow-soft dark:text-brand-300'
                    : 'text-ink-muted hover:bg-surface/80 hover:text-ink'
                }`}
              >
                <Home className="size-4" aria-hidden="true" />
                {isActive('/') && (
                  <motion.span
                    layoutId="desktop-nav-active"
                    className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    aria-hidden="true"
                  />
                )}
              </Link>

              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative rounded-control px-1.5 py-2 text-[0.7rem] font-semibold transition duration-200 lg:px-2 lg:text-xs xl:px-3 xl:text-sm ${
                      active
                        ? 'bg-surface text-brand-700 shadow-soft dark:text-brand-300'
                        : 'text-ink-muted hover:bg-surface/80 hover:text-ink'
                    }`}
                  >
                    {item.name}
                    {active && (
                      <motion.span
                        layoutId="desktop-nav-active"
                        className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 xl:inset-x-3"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-1 md:flex lg:gap-1.5">
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="btn btn-ghost btn-icon"
              type="button"
            >
              {isDark ? (
                <Sun className="size-5" aria-hidden="true" />
              ) : (
                <Moon className="size-5" aria-hidden="true" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                <div className="flex max-w-20 items-center gap-2 rounded-control border border-line bg-surface-muted px-2 py-2 text-ink lg:max-w-28 xl:ml-1 xl:max-w-44 xl:px-3">
                  <User className="size-4 shrink-0 text-brand-600 dark:text-brand-300" aria-hidden="true" />
                  <span className="truncate text-xs font-semibold xl:text-sm">
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-icon hover:text-red-600 dark:hover:text-red-400 xl:w-auto xl:px-3"
                  type="button"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  <span className="hidden xl:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary px-3 text-xs xl:ml-1 xl:text-sm">
                Login
              </Link>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="btn btn-ghost btn-icon"
              type="button"
            >
              {isDark ? (
                <Sun className="size-5" aria-hidden="true" />
              ) : (
                <Moon className="size-5" aria-hidden="true" />
              )}
            </button>

            <button
              onClick={onToggleSidebar}
              className="btn btn-ghost btn-icon"
              aria-label="Open navigation menu"
              aria-controls="sidebar-navigation"
              aria-haspopup="dialog"
              title="Menu"
              type="button"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
