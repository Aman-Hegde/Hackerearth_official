import { useEffect, useRef, type FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Award, Calendar, Code, Home, LogOut, Mail, User, Users, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Events', path: '/events', icon: Calendar },
  { name: 'Team', path: '/team', icon: Users },
  { name: 'Domains', path: '/domains', icon: Code },
  { name: 'Leaderboard', path: '/leaderboard', icon: Award },
  { name: 'Contact', path: '/contact', icon: Mail },
];

const restoreSidebarToggleFocus = () => {
  window.requestAnimationFrame(() => {
    const toggles = Array.from(
      document.querySelectorAll<HTMLButtonElement>(
        'button[aria-controls="sidebar-navigation"]',
      ),
    );
    toggles.find((toggle) => toggle.offsetParent !== null)?.focus();
  });
};

const Sidebar: FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const sidebarRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`);

  const closeSidebar = (restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) restoreSidebarToggleFocus();
  };

  useEffect(() => {
    const desktopViewport = window.matchMedia('(min-width: 1024px)');
    const closeOutsideMobile = () => {
      if (desktopViewport.matches) setIsOpen(false);
    };

    closeOutsideMobile();
    desktopViewport.addEventListener('change', closeOutsideMobile);
    return () => desktopViewport.removeEventListener('change', closeOutsideMobile);
  }, [setIsOpen]);

  useEffect(() => {
    if (!isOpen || window.matchMedia('(min-width: 1024px)').matches) return;

    const scrollTarget = document.getElementById('scroll-container') ?? document.body;
    const previousOverflow = scrollTarget.style.overflow;
    scrollTarget.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        restoreSidebarToggleFocus();
        return;
      }

      if (event.key !== 'Tab' || !sidebarRef.current) return;

      const focusableElements = Array.from(
        sidebarRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        sidebarRef.current.focus();
        return;
      }

      if (!sidebarRef.current.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      scrollTarget.style.overflow = previousOverflow;
    };
  }, [isOpen, setIsOpen]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-[55] bg-canvas/70 backdrop-blur-sm lg:hidden"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            onClick={() => closeSidebar(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.aside
            ref={sidebarRef}
            id="sidebar-navigation"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sidebar-heading"
            tabIndex={-1}
            className="fixed inset-y-0 left-0 z-[60] flex w-[min(19rem,88vw)] flex-col overflow-hidden rounded-r-card border-r border-line bg-surface/95 text-ink shadow-surface backdrop-blur-xl lg:hidden"
            initial={shouldReduceMotion ? { x: 0 } : { x: '-100%' }}
            animate={{ x: 0 }}
            exit={shouldReduceMotion ? { x: 0 } : { x: '-100%' }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div
              className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-technical/80 to-transparent"
              aria-hidden="true"
            />

            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line/80 px-3">
              <motion.div
                className="min-w-0"
                initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : 0.08,
                  duration: shouldReduceMotion ? 0 : 0.18,
                }}
              >
                <p
                  id="sidebar-heading"
                  className="truncate font-display text-sm font-semibold text-ink"
                >
                  Explore
                </p>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-subtle">
                  Quick navigation
                </p>
              </motion.div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => closeSidebar(true)}
                className="btn btn-ghost btn-icon"
                aria-label="Close navigation menu"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <nav className="px-2 py-3" aria-label="Mobile navigation">
                <ul className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <motion.li
                        key={item.name}
                        whileHover={shouldReduceMotion ? undefined : { x: 2 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => closeSidebar()}
                          aria-label={item.name}
                          aria-current={active ? 'page' : undefined}
                          className={`group relative flex min-h-12 items-center overflow-hidden rounded-control border px-3 transition duration-200 ${
                            active
                              ? 'border-primary bg-primary/10 text-primary-text'
                              : 'border-transparent text-ink-muted hover:border-line hover:bg-surface-muted hover:text-ink'
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="sidebar-active"
                              className="absolute bottom-2 left-0 top-2 w-0.5 rounded-r-full bg-gradient-to-b from-primary to-technical"
                              transition={
                                shouldReduceMotion
                                  ? { duration: 0 }
                                  : { type: 'spring', stiffness: 380, damping: 32 }
                              }
                              aria-hidden="true"
                            />
                          )}

                          <span
                            className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-lg transition ${
                              active
                                ? 'bg-primary/10 text-primary-text'
                                : 'text-ink-subtle group-hover:text-ink'
                            }`}
                          >
                            <Icon className="size-5" aria-hidden="true" />
                          </span>

                          <span className="relative z-10 ml-2.5 whitespace-nowrap text-sm font-semibold">
                            {item.name}
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mx-2 mb-4 border-t border-line pt-4">
                {isAuthenticated ? (
                  <div className="grid gap-3">
                    <div className="ui-card-muted flex items-center gap-3 rounded-control p-3 shadow-none">
                      <span className="flex size-9 items-center justify-center rounded-control bg-primary/10 text-primary-text">
                        <User className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 truncate text-sm font-semibold">
                        {user?.name || user?.email?.split('@')[0]}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="btn btn-secondary w-full hover:border-red-400 hover:text-red-600 dark:hover:text-red-400"
                      type="button"
                    >
                      <LogOut className="size-4" aria-hidden="true" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => closeSidebar()}
                    className="btn btn-primary w-full"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
