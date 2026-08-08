import {
  type ChangeEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import SectionReveal from '../components/ui/SectionReveal';
import { ApiError } from '../lib/api';
import { registrationBranchOptions } from '../lib/registrationBranches';
import {
  getAdminOverview,
  getAdminRegistrationSettings,
  getAdminStudents,
  downloadAdminStudentsExcel,
  type AdminOverview,
  type AdminStudent,
  type RegistrationSettings,
  type StudentPagination,
  updateAdminRegistrationSettings,
  updateAdminStudentStatus,
} from '../lib/adminApi';

const PAGE_LIMIT = 25;
const OPEN_REGISTRATION_MESSAGE = 'Student registration is currently open.';
const CLOSED_REGISTRATION_MESSAGE = 'Student registration is currently closed.';

type StatusFilter = '' | 'active' | 'inactive';
type AdminErrorKind = 'unauthorized' | 'forbidden' | 'network' | 'server' | 'api';

interface AdminRequestError {
  kind: AdminErrorKind;
  message: string;
}

const emptyPagination: StudentPagination = {
  page: 1,
  limit: PAGE_LIMIT,
  total: 0,
  totalPages: 0,
};

const statAccents = {
  primary: {
    border: 'border-primary/25',
    icon: 'border-primary/25 bg-primary/10 text-primary-text',
    glow: 'bg-primary/20',
  },
  dream: {
    border: 'border-dream/25',
    icon: 'border-dream/25 bg-dream/10 text-dream-text',
    glow: 'bg-dream/20',
  },
  rose: {
    border: 'border-rose/25',
    icon: 'border-rose/25 bg-rose/10 text-rose-text',
    glow: 'bg-rose/20',
  },
  technical: {
    border: 'border-technical/25',
    icon: 'border-technical/25 bg-technical/10 text-technical-text',
    glow: 'bg-technical/20',
  },
} as const;

const useDebouncedValue = <T,>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [delay, value]);

  return debouncedValue;
};

const classifyAdminError = (error: unknown, fallback: string): AdminRequestError => {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return {
        kind: 'unauthorized',
        message: 'Your admin session has expired. Please sign in again.',
      };
    }

    if (error.status === 403) {
      return {
        kind: 'forbidden',
        message: 'Your account does not have permission to access the Admin Dashboard.',
      };
    }

    if (error.status >= 500) {
      return {
        kind: 'server',
        message: 'Something went wrong while loading the Admin Dashboard.',
      };
    }

    return { kind: 'api', message: error.message || fallback };
  }

  if (error instanceof TypeError) {
    return {
      kind: 'network',
      message: 'Unable to connect to the server. Please try again.',
    };
  }

  return { kind: 'api', message: fallback };
};

const isGlobalAuthorizationError = (error: AdminRequestError) =>
  error.kind === 'unauthorized' || error.kind === 'forbidden';

const isAbortError = (error: unknown) =>
  error instanceof DOMException && error.name === 'AbortError';

const formatDateTime = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const StatCard = ({
  label,
  value,
  icon,
  detail,
  accent,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  detail?: string;
  accent: {
    border: string;
    icon: string;
    glow: string;
  };
}) => (
  <article className={`relative flex min-h-40 h-full flex-col justify-between overflow-hidden rounded-card border bg-surface/90 p-5 shadow-soft sm:p-6 ${accent.border}`}>
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute -right-12 -top-12 size-28 rounded-full opacity-25 ${accent.glow}`}
    />
    <div className="flex items-start justify-between gap-4">
      <p className="relative font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">
        {label}
      </p>
      <span className={`relative flex size-10 shrink-0 items-center justify-center rounded-control border ${accent.icon}`}>
        {icon}
      </span>
    </div>
    <div className="relative mt-5">
      <p className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {value}
      </p>
      {detail && <p className="mt-2 text-sm leading-6 text-ink-muted">{detail}</p>}
    </div>
  </article>
);

const InlineFeedback = ({
  kind,
  children,
}: {
  kind: 'error' | 'success';
  children: ReactNode;
}) => (
  <div
    className={`flex items-start gap-2 rounded-control border p-3 text-sm leading-6 ${
      kind === 'error'
        ? 'border-rose/40 bg-rose/10 text-ink'
        : 'border-dream/40 bg-dream/10 text-ink'
    }`}
    role={kind === 'error' ? 'alert' : 'status'}
  >
    {kind === 'error' ? (
      <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-text" aria-hidden="true" />
    ) : (
      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-dream-text" aria-hidden="true" />
    )}
    <span>{children}</span>
  </div>
);

const LoadingState = ({ label }: { label: string }) => (
  <div className="flex min-h-32 items-center justify-center gap-3 rounded-card border border-line/80 bg-surface/90 p-6 text-sm font-medium text-ink-muted shadow-soft" role="status">
    <Loader2 className="size-5 animate-spin text-dream-text motion-reduce:animate-none" aria-hidden="true" />
    {label}
  </div>
);

const AdminDashboard = () => {
  const [globalAuthError, setGlobalAuthError] = useState<AdminRequestError | null>(null);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<AdminRequestError | null>(null);

  const [registration, setRegistration] = useState<RegistrationSettings | null>(null);
  const [registrationLoading, setRegistrationLoading] = useState(true);
  const [registrationPending, setRegistrationPending] = useState(false);
  const [registrationError, setRegistrationError] = useState<AdminRequestError | null>(null);
  const [registrationNotice, setRegistrationNotice] = useState<string | null>(null);

  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [pagination, setPagination] = useState<StudentPagination>(emptyPagination);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState<AdminRequestError | null>(null);
  const [studentsNotice, setStudentsNotice] = useState<string | null>(null);
  const [pendingStudentId, setPendingStudentId] = useState<string | null>(null);
  const [studentRefreshToken, setStudentRefreshToken] = useState(0);
  const [studentsExporting, setStudentsExporting] = useState(false);

  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState<StatusFilter>('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 300);
  const debouncedBranch = useDebouncedValue(branch, 300);

  const loadOverview = useCallback(async (signal?: AbortSignal) => {
    setOverviewLoading(true);
    setOverviewError(null);

    try {
      const response = await getAdminOverview(signal);
      setOverview(response.overview);
    } catch (error) {
      if (!isAbortError(error)) {
        const requestError = classifyAdminError(error, 'Unable to load dashboard statistics.');
        if (isGlobalAuthorizationError(requestError)) {
          setGlobalAuthError((current) => current ?? requestError);
        } else {
          setOverviewError(requestError);
        }
      }
    } finally {
      if (!signal?.aborted) setOverviewLoading(false);
    }
  }, []);

  const loadRegistration = useCallback(async (signal?: AbortSignal) => {
    setRegistrationLoading(true);
    setRegistrationError(null);

    try {
      const response = await getAdminRegistrationSettings(signal);
      setRegistration(response.settings);
    } catch (error) {
      if (!isAbortError(error)) {
        const requestError = classifyAdminError(error, 'Unable to load registration settings.');
        if (isGlobalAuthorizationError(requestError)) {
          setGlobalAuthError((current) => current ?? requestError);
        } else {
          setRegistrationError(requestError);
        }
      }
    } finally {
      if (!signal?.aborted) setRegistrationLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadOverview(controller.signal);
    void loadRegistration(controller.signal);
    return () => controller.abort();
  }, [loadOverview, loadRegistration]);

  useEffect(() => {
    const controller = new AbortController();
    setStudentsLoading(true);
    setStudentsError(null);

    void getAdminStudents(
      {
        page,
        limit: PAGE_LIMIT,
        search: debouncedSearch,
        branch: debouncedBranch,
        year: year ? Number(year) : undefined,
        status: status || undefined,
      },
      controller.signal,
    )
      .then((response) => {
        setStudents(response.students);
        setPagination(response.pagination);
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) {
          const requestError = classifyAdminError(error, 'Unable to load registered students.');
          if (isGlobalAuthorizationError(requestError)) {
            setGlobalAuthError((current) => current ?? requestError);
          } else {
            setStudentsError(requestError);
          }
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setStudentsLoading(false);
      });

    return () => controller.abort();
  }, [debouncedBranch, debouncedSearch, page, status, studentRefreshToken, year]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
    setStudentsNotice(null);
  };

  const handleBranchChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setBranch(event.target.value);
    setPage(1);
    setStudentsNotice(null);
  };

  const handleRegistrationToggle = async () => {
    if (!registration || registrationPending) return;

    const nextOpen = !registration.studentRegistrationOpen;
    const normalizedMessage = registration.registrationMessage.trim();
    const nextMessage = nextOpen
      ? normalizedMessage === CLOSED_REGISTRATION_MESSAGE
        ? OPEN_REGISTRATION_MESSAGE
        : normalizedMessage
      : normalizedMessage === OPEN_REGISTRATION_MESSAGE
        ? CLOSED_REGISTRATION_MESSAGE
        : normalizedMessage;

    setRegistrationPending(true);
    setRegistrationError(null);
    setRegistrationNotice(null);

    try {
      const response = await updateAdminRegistrationSettings(nextOpen, nextMessage);
      setRegistration(response.settings);
      setRegistrationNotice(response.message);
      await loadOverview();
    } catch (error) {
      const requestError = classifyAdminError(error, 'Unable to update registration settings.');
      if (isGlobalAuthorizationError(requestError)) {
        setGlobalAuthError(requestError);
      } else {
        setRegistrationError(requestError);
      }
    } finally {
      setRegistrationPending(false);
    }
  };

  const handleStudentStatusChange = async (student: AdminStudent) => {
    const nextActive = !student.isActive;
    if (
      !nextActive &&
      !window.confirm(`Disable ${student.name}'s student account?`)
    ) {
      return;
    }

    setPendingStudentId(student.id);
    setStudentsError(null);
    setStudentsNotice(null);

    try {
      const response = await updateAdminStudentStatus(student.id, nextActive);
      setStudentsNotice(response.message);
      setStudentRefreshToken((current) => current + 1);
      await loadOverview();
    } catch (error) {
      const requestError = classifyAdminError(error, 'Unable to update the student status.');
      if (isGlobalAuthorizationError(requestError)) {
        setGlobalAuthError(requestError);
      } else {
        setStudentsError(requestError);
      }
    } finally {
      setPendingStudentId(null);
    }
  };

  const handleDownloadExcel = async () => {
    if (studentsExporting || pagination.total === 0) return;

    setStudentsExporting(true);
    setStudentsError(null);
    setStudentsNotice(null);

    try {
      const { blob, filename } = await downloadAdminStudentsExcel({
        search: debouncedSearch,
        branch: debouncedBranch,
        year: year ? Number(year) : undefined,
        status: status || undefined,
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      setStudentsNotice('Excel export downloaded successfully.');
    } catch (error) {
      const requestError = classifyAdminError(error, 'Unable to export students.');
      if (isGlobalAuthorizationError(requestError)) {
        setGlobalAuthError(requestError);
      } else {
        setStudentsError(requestError);
      }
    } finally {
      setStudentsExporting(false);
    }
  };

  const handleGlobalRetry = () => {
    setGlobalAuthError(null);
    setOverviewError(null);
    setRegistrationError(null);
    setStudentsError(null);
    void loadOverview();
    void loadRegistration();
    setStudentRefreshToken((current) => current + 1);
  };

  const registrationOpensAt = formatDateTime(registration?.registrationOpensAt);
  const registrationClosesAt = formatDateTime(registration?.registrationClosesAt);
  const filtersActive = Boolean(search.trim() || branch.trim() || year || status);

  return (
    <PageTransition>
      <main className="relative isolate min-h-screen overflow-x-hidden bg-transparent text-ink">
        <div className="site-container-wide min-w-0 space-y-10 pb-section pt-24 sm:pt-28 lg:pt-32">
          <SectionReveal variant="fade" duration={0.42}>
            <header className="ui-panel-glass relative overflow-hidden px-5 py-6 sm:px-7 sm:py-7 lg:px-8">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-dream/10"
              />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-rose-text">
                    Administration
                  </p>
                  <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                    Admin Dashboard
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-muted sm:text-base">
                    Monitor registrations and manage registered student access.
                  </p>
                </div>
                {overview && (
                  <div className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-dream/30 bg-dream/10 px-4 text-sm font-semibold text-dream-text">
                    <ShieldCheck className="size-4" aria-hidden="true" />
                    {overview.totalAdmins} {overview.totalAdmins === 1 ? 'administrator' : 'administrators'}
                  </div>
                )}
              </div>
            </header>
          </SectionReveal>

        {globalAuthError && (
          <section className="ui-panel-glass border-rose/30 p-5 sm:p-6" aria-labelledby="admin-access-error">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 id="admin-access-error" className="font-display text-xl font-semibold text-ink">
                  Admin access unavailable
                </h2>
                <div className="mt-3">
                  <InlineFeedback kind="error">{globalAuthError.message}</InlineFeedback>
                </div>
              </div>
              <button type="button" onClick={handleGlobalRetry} className="btn btn-secondary shrink-0">
                <RefreshCw className="size-4" aria-hidden="true" />
                Retry dashboard
              </button>
            </div>
          </section>
        )}

        {!globalAuthError && (
          <>
        <SectionReveal delay={0.03} duration={0.42}>
        <section aria-labelledby="overview-heading">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 id="overview-heading" className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              Overview
            </h2>
            {overviewError && (
              <button type="button" onClick={() => void loadOverview()} className="btn btn-secondary">
                <RefreshCw className="size-4" aria-hidden="true" />
                Retry
              </button>
            )}
          </div>

          {overviewLoading && !overview ? (
            <LoadingState label="Loading dashboard statistics..." />
          ) : overviewError && !overview ? (
            <InlineFeedback kind="error">{overviewError.message}</InlineFeedback>
          ) : overview ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SectionReveal delay={0.02} duration={0.38} className="h-full">
                <StatCard label="Total Students" value={overview.totalStudents} icon={<Users className="size-5" aria-hidden="true" />} detail={`${overview.verifiedStudents} email verified`} accent={statAccents.primary} />
              </SectionReveal>
              <SectionReveal delay={0.05} duration={0.38} className="h-full">
                <StatCard label="Active Students" value={overview.activeStudents} icon={<UserCheck className="size-5" aria-hidden="true" />} accent={statAccents.dream} />
              </SectionReveal>
              <SectionReveal delay={0.08} duration={0.38} className="h-full">
                <StatCard label="Inactive Students" value={overview.inactiveStudents} icon={<UserX className="size-5" aria-hidden="true" />} accent={statAccents.rose} />
              </SectionReveal>
              <SectionReveal delay={0.11} duration={0.38} className="h-full">
                <StatCard label="Registration Status" value={overview.registrationOpen ? 'OPEN' : 'CLOSED'} icon={<DoorOpen className="size-5" aria-hidden="true" />} detail="Live registration availability" accent={statAccents.technical} />
              </SectionReveal>
            </div>
          ) : null}
        </section>
        </SectionReveal>

        <SectionReveal delay={0.05} duration={0.42}>
        <section aria-labelledby="registration-heading" className="overflow-hidden rounded-card border border-line/80 bg-surface/90 shadow-soft">
          <div className="border-b border-line/80 bg-dream-soft/30 p-5 sm:p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-dream-text">
              Registration Control
            </p>
            <h2 id="registration-heading" className="mt-1 font-display text-2xl font-semibold text-ink">
              Student Registration
            </h2>
          </div>

          <div className="p-5 sm:p-6">
            {registrationLoading && !registration ? (
              <LoadingState label="Loading registration settings..." />
            ) : registrationError && !registration ? (
              <div className="space-y-4">
                <InlineFeedback kind="error">{registrationError.message}</InlineFeedback>
                <button type="button" onClick={() => void loadRegistration()} className="btn btn-secondary">
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Retry settings
                </button>
              </div>
            ) : registration ? (
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex min-h-9 items-center rounded-full border px-3 font-mono text-xs font-bold tracking-[0.12em] ${
                      registration.registrationOpen
                        ? 'border-dream/40 bg-dream/10 text-dream-text'
                        : 'border-rose/40 bg-rose/10 text-rose-text'
                    }`}>
                      {registration.registrationOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                    <span className="text-xs text-ink-subtle">
                      Updated {formatDateTime(registration.updatedAt) ?? 'recently'}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-ink-muted">
                    {registration.registrationMessage}
                  </p>
                  {(registrationOpensAt || registrationClosesAt) && (
                    <dl className="mt-4 grid gap-2 text-sm text-ink-muted sm:grid-cols-2">
                      {registrationOpensAt && <div><dt className="font-semibold text-ink">Opens</dt><dd>{registrationOpensAt}</dd></div>}
                      {registrationClosesAt && <div><dt className="font-semibold text-ink">Closes</dt><dd>{registrationClosesAt}</dd></div>}
                    </dl>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => void handleRegistrationToggle()}
                  disabled={registrationPending}
                  className="btn btn-primary w-full shrink-0 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
                >
                  {registrationPending ? (
                    <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  ) : registration.studentRegistrationOpen ? (
                    <UserX className="size-4" aria-hidden="true" />
                  ) : (
                    <UserCheck className="size-4" aria-hidden="true" />
                  )}
                  {registrationPending
                    ? 'Updating...'
                    : registration.studentRegistrationOpen
                      ? 'Close Registration'
                      : 'Open Registration'}
                </button>
              </div>
            ) : null}

            {(registrationError || registrationNotice) && registration && (
              <div className="mt-5">
                {registrationError ? (
                  <InlineFeedback kind="error">{registrationError.message}</InlineFeedback>
                ) : registrationNotice ? (
                  <InlineFeedback kind="success">{registrationNotice}</InlineFeedback>
                ) : null}
              </div>
            )}
          </div>
        </section>
        </SectionReveal>

        <SectionReveal delay={0.07} duration={0.42}>
        <section aria-labelledby="students-heading" className="min-w-0">
          <div className="mb-5">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-rose-text">
              Registered Students
            </p>
            <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="students-heading" className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                  Student Directory
                </h2>
                <p className="mt-2 text-sm text-ink-muted" aria-live="polite">
                  {pagination.total} {pagination.total === 1 ? 'student' : 'students'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handleDownloadExcel()}
                  className="btn min-h-11 rounded-full border border-creative/30 bg-creative/10 px-4 text-creative-text hover:bg-creative/20"
                  disabled={studentsLoading || studentsExporting || pagination.total === 0}
                >
                  {studentsExporting ? (
                    <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  ) : (
                    <FileSpreadsheet className="size-4" aria-hidden="true" />
                  )}
                  {studentsExporting ? 'Preparing Excel...' : 'Download Excel'}
                </button>
                <button
                  type="button"
                  onClick={() => setStudentRefreshToken((current) => current + 1)}
                  className="btn btn-secondary rounded-full"
                  disabled={studentsLoading}
                >
                  <RefreshCw className={`size-4 ${studentsLoading ? 'animate-spin motion-reduce:animate-none' : ''}`} aria-hidden="true" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          <div className="min-w-0 rounded-card border border-line/80 bg-surface/90 p-4 shadow-soft sm:p-5">
            <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-[minmax(15rem,1fr)_minmax(10rem,0.45fr)_9rem_10rem]">
              <label className="min-w-0 md:col-span-2 lg:col-span-1">
                <span className="mb-2 block text-sm font-semibold text-ink">Search students</span>
                <span className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" aria-hidden="true" />
                  <input
                    type="search"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search students..."
                    className="min-h-11 w-full rounded-control border border-line-strong bg-glass/70 py-2 pl-10 pr-3 text-sm text-ink shadow-soft placeholder:text-ink-subtle focus:border-rose/60 focus:ring-2 focus:ring-rose/20"
                  />
                </span>
              </label>

              <label className="min-w-0">
                <span className="mb-2 block text-sm font-semibold text-ink">Branch</span>
                <select
                  value={branch}
                  onChange={handleBranchChange}
                  className="min-h-11 w-full rounded-control border border-line-strong bg-surface/95 px-3 py-2 text-sm text-ink shadow-soft focus:border-rose/60 focus:ring-2 focus:ring-rose/20 [&>option]:bg-surface [&>option]:text-ink"
                >
                  <option value="">All branches</option>
                  {registrationBranchOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-ink">Year</span>
                <select
                  value={year}
                  onChange={(event) => { setYear(event.target.value); setPage(1); setStudentsNotice(null); }}
                  className="min-h-11 w-full rounded-control border border-line-strong bg-glass/70 px-3 py-2 text-sm text-ink shadow-soft focus:border-rose/60 focus:ring-2 focus:ring-rose/20"
                >
                  <option value="">All years</option>
                  {[1, 2, 3, 4].map((value) => <option key={value} value={value}>Year {value}</option>)}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-ink">Status</span>
                <select
                  value={status}
                  onChange={(event) => { setStatus(event.target.value as StatusFilter); setPage(1); setStudentsNotice(null); }}
                  className="min-h-11 w-full rounded-control border border-line-strong bg-glass/70 px-3 py-2 text-sm text-ink shadow-soft focus:border-rose/60 focus:ring-2 focus:ring-rose/20"
                >
                  <option value="">All statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>
          </div>

          {(studentsError || studentsNotice) && (
            <div className="mt-4">
              {studentsError ? (
                <InlineFeedback kind="error">{studentsError.message}</InlineFeedback>
              ) : studentsNotice ? (
                <InlineFeedback kind="success">{studentsNotice}</InlineFeedback>
              ) : null}
            </div>
          )}

          <div className="mt-5 min-w-0 overflow-hidden rounded-card border border-line/80 bg-surface/90 shadow-soft">
            {studentsLoading && students.length === 0 ? (
              <LoadingState label="Loading registered students..." />
            ) : studentsError && students.length === 0 ? (
              <div className="p-5 sm:p-6">
                <button type="button" onClick={() => setStudentRefreshToken((current) => current + 1)} className="btn btn-secondary">
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Retry students
                </button>
              </div>
            ) : students.length === 0 ? (
              <div className="p-8 text-center sm:p-12">
                <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-dream/25 bg-dream/10 text-dream-text">
                  <Users className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                  {filtersActive ? 'No matching students' : 'No students registered'}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  {filtersActive
                    ? 'Try adjusting the search or filters.'
                    : 'Registered student accounts will appear here.'}
                </p>
              </div>
            ) : (
              <div>
                <p className="border-b border-line/80 bg-surface-muted/50 px-4 py-3 text-xs font-medium text-ink-subtle lg:hidden">
                  Scroll horizontally to view every student field and action.
                </p>
              <div className="max-w-full overflow-x-auto overscroll-x-contain">
                <table className="min-w-[72rem] w-full border-collapse text-left text-sm">
                  <caption className="sr-only">Registered student directory</caption>
                  <thead className="border-b border-line-strong bg-dream-soft/50 text-xs uppercase tracking-[0.08em] text-ink-muted">
                    <tr>
                      {['Name', 'USN', 'Email', 'Phone Number', 'Branch', 'Year', 'Status', 'Action'].map((heading) => (
                        <th key={heading} scope="col" className="px-4 py-4 font-semibold">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/80">
                    {students.map((student) => (
                      <tr key={student.id} className="bg-surface/80 transition-colors hover:bg-dream-soft/30 motion-reduce:transition-none">
                        <th scope="row" className="px-4 py-4 font-semibold text-ink">{student.name}</th>
                        <td className="px-4 py-4 font-mono text-xs font-semibold text-ink-muted">{student.usn}</td>
                        <td className="px-4 py-4 text-ink-muted"><a href={`mailto:${student.email}`} className="underline decoration-line underline-offset-4 hover:text-technical-text">{student.email}</a></td>
                        <td className="px-4 py-4 text-ink-muted">{student.contactNumber}</td>
                        <td className="px-4 py-4 text-ink-muted">{student.branch}</td>
                        <td className="px-4 py-4 text-ink-muted">Year {student.year}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold ${student.isActive ? 'border-dream/30 bg-dream/10 text-dream-text' : 'border-rose/30 bg-rose/10 text-rose-text'}`}>
                            {student.isActive ? <CheckCircle2 className="size-3.5" aria-hidden="true" /> : <UserX className="size-3.5" aria-hidden="true" />}
                            {student.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => void handleStudentStatusChange(student)}
                            disabled={pendingStudentId === student.id}
                            className={`btn min-w-24 rounded-full border disabled:cursor-not-allowed disabled:opacity-60 ${student.isActive ? 'border-rose/30 bg-rose/10 text-rose-text hover:bg-rose/20' : 'border-dream/30 bg-dream/10 text-dream-text hover:bg-dream/20'}`}
                          >
                            {pendingStudentId === student.id && <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
                            {pendingStudentId === student.id ? 'Updating...' : student.isActive ? 'Disable' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
            )}

            <div className="flex flex-col gap-4 border-t border-line/80 bg-dream-soft/25 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-muted" aria-live="polite">
                Page {pagination.totalPages === 0 ? 0 : pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={studentsLoading || pagination.page <= 1}
                  className="btn btn-secondary flex-1 rounded-full disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((current) => current + 1)}
                  disabled={studentsLoading || pagination.totalPages === 0 || pagination.page >= pagination.totalPages}
                  className="btn btn-secondary flex-1 rounded-full disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                >
                  Next
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>
        </SectionReveal>
          </>
        )}
        </div>
      </main>
    </PageTransition>
  );
};

export default AdminDashboard;
