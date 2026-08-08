import { useEffect, useRef, useState, type FC, type FocusEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, ChevronUp, Home, LogOut, Menu, Moon, Settings, Sun, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/image.png';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const navItems = [
  { name: 'Events', href: '/events' },
  { name: 'Leaderboard', disabled: true },
  { name: 'Team', href: '/team' },
  { name: 'Domains', href: '/domains' },
  { name: 'Contact', href: '/contact' },
] as const;

const adminNavItems = [
  { name: 'Events', href: '/events' },
  { name: 'Leaderboard', disabled: true },
  { name: 'Team', href: '/team' },
  { name: 'Admin', href: '/admin/dashboard' },
  { name: 'Contact', href: '/contact' },
] as const;

const studentDashboardNavItems = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', target: 'student-dashboard-top' },
  { name: 'Events & Tasks', target: 'student-events-tasks' },
  { name: 'Resources', target: 'student-resources' },
  { name: 'My Domains', target: 'student-domains' },
  { name: 'Leaderboard', disabled: true },
  { name: 'Contact', href: '/contact' },
] as const;

const Navbar: FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [containsFocus, setContainsFocus] = useState(false);
  const [activeDashboardSection, setActiveDashboardSection] = useState('student-dashboard-top');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const displayedUsername = user?.name || user?.email?.split('@')[0];
  const isStudentDashboard = pathname === '/student/dashboard';
  const mainNavItems = user?.role === 'admin' ? adminNavItems : navItems;

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
    setIsUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        userMenuRef.current &&
        event.target instanceof Node &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUserMenuOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    setIsUserMenuOpen(false);
    navigate(user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
  };

  const handleSettingsClick = () => {
    setIsUserMenuOpen(false);
    navigate('/settings');
  };

  const scrollToDashboardSection = (target: string) => {
    setActiveDashboardSection(target);
    document.getElementById(target)?.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const handleBlurCapture = (event: FocusEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget;
    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      setContainsFocus(false);
    }
  };

  const effectivelyHidden = hidden && !containsFocus;
  const hoverLiftClass = shouldReduceMotion ? '' : 'hover:-translate-y-0.5';

  const controlSurfaceClass = scrolled
    ? 'border-line-strong/80 bg-surface/95 shadow-soft backdrop-blur-md'
    : 'border-line/80 bg-surface/90 shadow-soft backdrop-blur-md';

  const inactivePillClass = `border-transparent bg-transparent text-ink-muted ${hoverLiftClass} hover:border-line hover:bg-surface hover:text-ink`;
  const activePillClass =
    'border-primary/60 bg-primary/10 text-primary-text shadow-soft';

  return (
    <motion.nav
      ref={navRef}
      aria-label="Primary navigation"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 w-full"
      initial={false}
      animate={{ y: effectivelyHidden ? -96 : 0 }}
      transition={{
        duration: shouldReduceMotion || containsFocus ? 0 : 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
      onFocusCapture={() => setContainsFocus(true)}
      onBlurCapture={handleBlurCapture}
    >
      <div className="site-container-wide py-2 lg:py-3">
        <div className="flex min-w-0 items-center justify-between gap-2 sm:gap-3 lg:rounded-3xl lg:border lg:border-line-strong/80 lg:bg-surface/95 lg:px-3 lg:py-2.5 lg:shadow-surface lg:backdrop-blur-xl xl:px-4">
          <Link
            to="/"
            className="group pointer-events-auto flex min-w-0 flex-1 items-center gap-2 rounded-full focus-visible:outline-offset-4 sm:gap-3 lg:flex-none"
            aria-label="HackerEarth Hub-NMAMIT home"
          >
            <span
              className={`flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-white p-0.5 shadow-soft transition duration-300 group-hover:border-technical/50 sm:size-12 lg:size-12 lg:bg-surface ${
                shouldReduceMotion ? '' : 'group-hover:-translate-y-0.5'
              }`}
            >
              <img
                src={logo}
                alt="HackerEarth Logo"
                className="size-full rounded-full object-cover"
              />
            </span>
            <span className="min-w-0 max-w-full font-display text-[0.68rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ink sm:text-sm lg:max-w-36 lg:truncate lg:whitespace-nowrap xl:max-w-none xl:text-base">
              HackerEarth Hub-NMAMIT
            </span>
          </Link>

          <div
            className={`pointer-events-auto ml-auto min-w-0 items-center gap-2 xl:gap-3 ${
              isStudentDashboard ? 'hidden xl:flex' : 'hidden lg:flex'
            }`}
          >
            {isStudentDashboard ? (
              <div className="flex min-w-0 shrink items-center gap-0.5 rounded-2xl border border-line bg-surface-muted/80 p-1 shadow-soft">
                {studentDashboardNavItems.map((item) => {
                  const isDisabled = 'disabled' in item && item.disabled;
                  const isSectionItem = 'target' in item;
                  const active = !isDisabled && isSectionItem && activeDashboardSection === item.target;
                  const className = `relative flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-xl border px-2 py-2 text-[0.625rem] font-semibold transition duration-200 focus-visible:outline-offset-2 xl:px-3 xl:text-xs ${
                    isDisabled
                      ? 'cursor-not-allowed select-none border-transparent text-ink-subtle opacity-60'
                      : active
                        ? activePillClass
                        : inactivePillClass
                  }`;

                  return isDisabled ? (
                    <span
                      key={item.name}
                      aria-disabled="true"
                      title="Temporarily unavailable"
                      className={className}
                    >
                      {item.name}
                    </span>
                  ) : isSectionItem ? (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => scrollToDashboardSection(item.target)}
                      aria-current={active ? 'location' : undefined}
                      className={className}
                    >
                      {item.name}
                      {active && (
                        <span
                          className="absolute -bottom-0.5 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-technical shadow-soft"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  ) : (
                    <Link key={item.name} to={item.href} className={className}>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-w-0 shrink items-center gap-0.5 rounded-2xl border border-line bg-surface-muted/80 p-1 shadow-soft xl:gap-1">
                <Link
                  to="/"
                  aria-label="Home"
                  title="Home"
                  aria-current={isActive('/') ? 'page' : undefined}
                  className={`relative flex size-11 shrink-0 items-center justify-center rounded-xl border transition duration-200 focus-visible:outline-offset-2 ${
                    isActive('/') ? activePillClass : inactivePillClass
                  }`}
                >
                  <Home className="size-4" aria-hidden="true" />
                  {isActive('/') && (
                    <span
                      className="absolute -bottom-0.5 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-technical shadow-soft"
                      aria-hidden="true"
                    />
                  )}
                </Link>

                {mainNavItems.map((item) => {
                  const isDisabled = 'disabled' in item && item.disabled;
                  if (isDisabled) {
                    return (
                      <span
                        key={item.name}
                        aria-disabled="true"
                        title="Temporarily unavailable"
                        className="relative flex min-h-11 shrink-0 cursor-not-allowed select-none items-center whitespace-nowrap rounded-xl border border-transparent px-2.5 py-2 text-[0.6875rem] font-semibold text-ink-subtle opacity-60 xl:px-4 xl:text-sm"
                      >
                        {item.name}
                      </span>
                    );
                  }

                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-xl border px-2.5 py-2 text-[0.6875rem] font-semibold transition duration-200 focus-visible:outline-offset-2 xl:px-4 xl:text-sm ${
                        active ? activePillClass : inactivePillClass
                      }`}
                    >
                      {item.name}
                      {active && (
                        <span
                          className="absolute -bottom-0.5 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-technical shadow-soft"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="flex min-w-0 shrink-0 items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`flex size-11 shrink-0 items-center justify-center rounded-full border text-ink-muted transition duration-200 ${hoverLiftClass} hover:border-technical/40 hover:bg-surface-muted hover:text-ink focus-visible:outline-offset-2 ${controlSurfaceClass}`}
                type="button"
              >
                {isDark ? (
                  <Sun className="size-5" aria-hidden="true" />
                ) : (
                  <Moon className="size-5" aria-hidden="true" />
                )}
              </button>

              {isAuthenticated ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((current) => !current)}
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="menu"
                    className={`flex h-11 min-w-0 max-w-40 items-center gap-1.5 rounded-full border px-3 text-ink transition duration-200 ${hoverLiftClass} hover:border-technical/40 hover:bg-surface-muted hover:text-technical-text focus-visible:outline-offset-2 xl:max-w-56 ${controlSurfaceClass}`}
                  >
                    <User className="size-4 shrink-0 text-primary-text" aria-hidden="true" />
                    <span className="truncate text-xs font-semibold xl:text-sm" title={displayedUsername}>
                      {displayedUsername}
                    </span>
                    {isUserMenuOpen ? (
                      <ChevronUp className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
                    )}
                  </button>

                  {isUserMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-card border border-line-strong bg-surface/95 p-1.5 text-ink shadow-surface backdrop-blur-xl"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleProfileClick}
                        className="flex min-h-11 w-full items-center gap-2 rounded-control px-3 text-left text-sm font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-technical-text focus-visible:outline-offset-2"
                      >
                        <User className="size-4" aria-hidden="true" />
                        Profile
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleSettingsClick}
                        className="flex min-h-11 w-full items-center gap-2 rounded-control px-3 text-left text-sm font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-technical-text focus-visible:outline-offset-2"
                      >
                        <Settings className="size-4" aria-hidden="true" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex min-h-11 w-full items-center gap-2 rounded-control px-3 text-left text-sm font-semibold text-ink-muted transition hover:bg-rose/10 hover:text-rose-text focus-visible:outline-offset-2"
                        type="button"
                        role="menuitem"
                      >
                        <LogOut className="size-4" aria-hidden="true" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-primary/60 bg-gradient-to-r from-primary to-technical px-4 text-xs font-semibold text-ink-inverse shadow-soft transition duration-200 ${hoverLiftClass} hover:brightness-105 focus-visible:outline-offset-2 xl:px-5 xl:text-sm`}
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          <div
            className={`pointer-events-auto shrink-0 items-center gap-2 ${
              isStudentDashboard ? 'flex xl:hidden' : 'flex lg:hidden'
            }`}
          >
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`flex size-11 shrink-0 items-center justify-center rounded-full border text-ink-muted transition duration-200 hover:border-technical/40 hover:bg-surface-muted hover:text-ink focus-visible:outline-offset-2 ${controlSurfaceClass}`}
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
              className={`flex size-11 shrink-0 items-center justify-center rounded-full border text-ink-muted transition duration-200 hover:border-technical/40 hover:bg-surface-muted hover:text-ink focus-visible:outline-offset-2 ${controlSurfaceClass}`}
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
