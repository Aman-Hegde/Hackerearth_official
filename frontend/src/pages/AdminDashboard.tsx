import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  DoorOpen,
  FileSpreadsheet,
  GitBranch,
  History,
  Image,
  Loader2,
  Pencil,
  PlusCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Trophy,
  UserCheck,
  Users,
  UserX,
  X,
} from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import SectionReveal from '../components/ui/SectionReveal';
import { ApiError } from '../lib/api';
import {
  createAdminEvent,
  downloadAdminEventRegistrations,
  getAdminEventRegistrations,
  getAdminEvents,
  updateAdminEvent,
  type AdminEventRegistrationStudent,
  type AdminEventRegistrationSummary,
  type EventInput,
  type EventSummary,
} from '../lib/eventApi';
import { registrationBranchOptions } from '../lib/registrationBranches';
import {
  awardStudentPoints,
  getAdminOverview,
  getAdminRegistrationSettings,
  getAdminStudentPointHistory,
  getAdminStudents,
  downloadAdminStudentsExcel,
  type AdminPointStudent,
  type AdminPointTransaction,
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
const emptyEventForm = {
  title: '',
  posterUrl: '',
  description: '',
  venue: '',
  eventDate: '',
  eventTime: '',
  deadlineDate: '',
  deadlineTime: '',
  maxRegistrations: '',
  active: true,
};

type StatusFilter = '' | 'active' | 'inactive';
type DomainFilter = '' | 'Web Development' | 'DSA' | 'Aptitude';
type AdminErrorKind = 'unauthorized' | 'forbidden' | 'network' | 'server' | 'api';
type EventFormState = typeof emptyEventForm;

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

const domainFilterOptions: Array<{ value: DomainFilter; label: string }> = [
  { value: '', label: 'All Domains' },
  { value: 'Web Development', label: 'Web Development' },
  { value: 'DSA', label: 'DSA' },
  { value: 'Aptitude', label: 'Aptitude' },
];

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

const toDateInputValue = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const toTimeInputValue = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toTimeString().slice(0, 5);
};

const getEventStatusLabel = (event: EventSummary) => {
  if (event.status === 'open') return 'OPEN';
  if (event.status === 'full') return 'FULL';
  if (event.status === 'past') return 'PAST';
  return 'CLOSED';
};

const getEventStatusClasses = (event: EventSummary) => {
  if (event.status === 'open') return 'border-dream/35 bg-dream/10 text-dream-text';
  if (event.status === 'full') return 'border-technical/35 bg-technical/10 text-technical-text';
  if (event.status === 'past') return 'border-line bg-surface-muted text-ink-muted';
  return 'border-rose/35 bg-rose/10 text-rose-text';
};

const buildEventPayload = (form: EventFormState): EventInput | null => {
  const eventDateTime = new Date(`${form.eventDate}T${form.eventTime}`);
  const registrationDeadline = new Date(`${form.deadlineDate}T${form.deadlineTime}`);
  const maxRegistrations = Number(form.maxRegistrations);

  if (
    !form.title.trim() ||
    !form.posterUrl.trim() ||
    !form.description.trim() ||
    !form.venue.trim() ||
    !form.eventDate ||
    !form.eventTime ||
    !form.deadlineDate ||
    !form.deadlineTime ||
    Number.isNaN(eventDateTime.getTime()) ||
    Number.isNaN(registrationDeadline.getTime()) ||
    !Number.isInteger(maxRegistrations) ||
    maxRegistrations < 1
  ) {
    return null;
  }

  return {
    title: form.title.trim(),
    posterUrl: form.posterUrl.trim(),
    description: form.description.trim(),
    venue: form.venue.trim(),
    eventDateTime: eventDateTime.toISOString(),
    registrationDeadline: registrationDeadline.toISOString(),
    maxRegistrations,
    active: form.active,
  };
};

const formatShortDate = (value?: string | null) => {
  if (!value) return 'Recently';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';

  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
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

  const [awardSearchEmail, setAwardSearchEmail] = useState('');
  const [awardSearchResults, setAwardSearchResults] = useState<AdminStudent[]>([]);
  const [awardSearchLoading, setAwardSearchLoading] = useState(false);
  const [awardSearchError, setAwardSearchError] = useState<AdminRequestError | null>(null);
  const [selectedAwardStudent, setSelectedAwardStudent] = useState<AdminPointStudent | null>(null);
  const [pointHistory, setPointHistory] = useState<AdminPointTransaction[]>([]);
  const [pointHistoryLoading, setPointHistoryLoading] = useState(false);
  const [awardPoints, setAwardPoints] = useState('');
  const [awardDescription, setAwardDescription] = useState('');
  const [awardError, setAwardError] = useState<AdminRequestError | null>(null);
  const [awardNotice, setAwardNotice] = useState<string | null>(null);
  const [awardSubmitting, setAwardSubmitting] = useState(false);
  const [isAwardConfirmOpen, setIsAwardConfirmOpen] = useState(false);

  const [events, setEvents] = useState<EventSummary[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<AdminRequestError | null>(null);
  const [eventsNotice, setEventsNotice] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<EventFormState>(emptyEventForm);
  const [eventFormError, setEventFormError] = useState<AdminRequestError | null>(null);
  const [eventSubmitting, setEventSubmitting] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventSummary | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [registrationsEvent, setRegistrationsEvent] = useState<AdminEventRegistrationSummary | null>(null);
  const [eventRegistrations, setEventRegistrations] = useState<AdminEventRegistrationStudent[]>([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [registrationsError, setRegistrationsError] = useState<AdminRequestError | null>(null);
  const [registrationsDownloading, setRegistrationsDownloading] = useState(false);

  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState<StatusFilter>('');
  const [domain, setDomain] = useState<DomainFilter>('');
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

  const loadEvents = useCallback(async (signal?: AbortSignal) => {
    setEventsLoading(true);
    setEventsError(null);

    try {
      const response = await getAdminEvents(signal);
      setEvents(response.events);
    } catch (error) {
      if (!isAbortError(error)) {
        const requestError = classifyAdminError(error, 'Unable to load events.');
        if (isGlobalAuthorizationError(requestError)) {
          setGlobalAuthError((current) => current ?? requestError);
        } else {
          setEventsError(requestError);
        }
      }
    } finally {
      if (!signal?.aborted) setEventsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadOverview(controller.signal);
    void loadRegistration(controller.signal);
    void loadEvents(controller.signal);
    return () => controller.abort();
  }, [loadEvents, loadOverview, loadRegistration]);

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
        domain: domain || undefined,
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
  }, [debouncedBranch, debouncedSearch, domain, page, status, studentRefreshToken, year]);

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

  const handleDomainChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDomain(event.target.value as DomainFilter);
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
        domain: domain || undefined,
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

  const loadAwardStudentHistory = useCallback(async (studentId: string) => {
    setPointHistoryLoading(true);
    setAwardError(null);

    try {
      const response = await getAdminStudentPointHistory(studentId, 10);
      setSelectedAwardStudent(response.student);
      setPointHistory(response.transactions);
    } catch (error) {
      const requestError = classifyAdminError(error, 'Unable to load point activity.');
      if (isGlobalAuthorizationError(requestError)) {
        setGlobalAuthError(requestError);
      } else {
        setAwardError(requestError);
      }
    } finally {
      setPointHistoryLoading(false);
    }
  }, []);

  const handleAwardSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = awardSearchEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      setAwardSearchError({ kind: 'api', message: 'Enter a college email to search.' });
      return;
    }

    setAwardSearchLoading(true);
    setAwardSearchError(null);
    setAwardNotice(null);
    setAwardSearchResults([]);
    setSelectedAwardStudent(null);
    setPointHistory([]);

    try {
      const response = await getAdminStudents({
        page: 1,
        limit: 5,
        search: normalizedEmail,
        status: 'active',
        sortBy: 'name',
        sortOrder: 'asc',
      });
      setAwardSearchResults(response.students);
      if (response.students.length === 0) {
        setAwardSearchError({ kind: 'api', message: 'No active student matched that email.' });
      }
    } catch (error) {
      const requestError = classifyAdminError(error, 'Unable to search students.');
      if (isGlobalAuthorizationError(requestError)) {
        setGlobalAuthError(requestError);
      } else {
        setAwardSearchError(requestError);
      }
    } finally {
      setAwardSearchLoading(false);
    }
  };

  const handleSelectAwardStudent = async (student: AdminStudent) => {
    setAwardSearchResults([]);
    setAwardError(null);
    setAwardNotice(null);
    await loadAwardStudentHistory(student.id);
  };

  const getAwardValidationMessage = () => {
    const points = Number(awardPoints);
    const description = awardDescription.trim();

    if (!selectedAwardStudent) return 'Select an active student first.';
    if (!awardPoints.trim() || !Number.isInteger(points) || points < 1 || points > 100000) {
      return 'Points must be a whole number from 1 to 100000.';
    }
    if (!description) return 'A reason or activity description is required.';
    if (description.length > 240) return 'Description cannot exceed 240 characters.';
    return null;
  };

  const handleOpenAwardConfirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationMessage = getAwardValidationMessage();

    if (validationMessage) {
      setAwardError({ kind: 'api', message: validationMessage });
      return;
    }

    setAwardError(null);
    setIsAwardConfirmOpen(true);
  };

  const handleConfirmAward = async () => {
    if (!selectedAwardStudent || awardSubmitting) return;

    const validationMessage = getAwardValidationMessage();
    if (validationMessage) {
      setAwardError({ kind: 'api', message: validationMessage });
      setIsAwardConfirmOpen(false);
      return;
    }

    setAwardSubmitting(true);
    setAwardError(null);
    setAwardNotice(null);

    try {
      const response = await awardStudentPoints({
        studentId: selectedAwardStudent.id,
        points: Number(awardPoints),
        description: awardDescription.trim(),
      });
      setSelectedAwardStudent(response.student);
      setPointHistory((current) => [response.transaction, ...current].slice(0, 10));
      setAwardNotice(`${response.transaction.points} points awarded to ${response.student.name}.`);
      setAwardPoints('');
      setAwardDescription('');
      setIsAwardConfirmOpen(false);
    } catch (error) {
      const requestError = classifyAdminError(error, 'Unable to award points.');
      if (isGlobalAuthorizationError(requestError)) {
        setGlobalAuthError(requestError);
      } else {
        setAwardError(requestError);
      }
    } finally {
      setAwardSubmitting(false);
    }
  };

  const openCreateEventModal = () => {
    setEditingEvent(null);
    setEventForm(emptyEventForm);
    setEventFormError(null);
    setIsEventModalOpen(true);
  };

  const openEditEventModal = (event: EventSummary) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      posterUrl: event.posterUrl,
      description: event.description,
      venue: event.venue,
      eventDate: toDateInputValue(event.eventDateTime),
      eventTime: toTimeInputValue(event.eventDateTime),
      deadlineDate: toDateInputValue(event.registrationDeadline),
      deadlineTime: toTimeInputValue(event.registrationDeadline),
      maxRegistrations: String(event.maxRegistrations),
      active: event.active,
    });
    setEventFormError(null);
    setIsEventModalOpen(true);
  };

  const closeEventModal = () => {
    if (eventSubmitting) return;
    setIsEventModalOpen(false);
    setEditingEvent(null);
    setEventForm(emptyEventForm);
    setEventFormError(null);
  };

  const handleEventFormChange = (
    field: keyof EventFormState,
    value: string | boolean
  ) => {
    setEventForm((current) => ({ ...current, [field]: value }));
    setEventFormError(null);
  };

  const handleEventSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = buildEventPayload(eventForm);

    if (!payload) {
      setEventFormError({
        kind: 'api',
        message: 'Fill all event fields with valid values.',
      });
      return;
    }

    if (new Date(payload.registrationDeadline) >= new Date(payload.eventDateTime)) {
      setEventFormError({
        kind: 'api',
        message: 'Registration deadline must be before the event date and time.',
      });
      return;
    }

    setEventSubmitting(true);
    setEventFormError(null);
    setEventsNotice(null);
    setEventsError(null);

    try {
      const response = editingEvent
        ? await updateAdminEvent(editingEvent.id, payload)
        : await createAdminEvent(payload);

      setEvents((current) => {
        if (editingEvent) {
          return current.map((item) => item.id === response.event.id ? response.event : item);
        }

        return [response.event, ...current];
      });
      setEventsNotice(response.message ?? (editingEvent ? 'Event updated successfully.' : 'Event created successfully.'));
      setIsEventModalOpen(false);
      setEditingEvent(null);
      setEventForm(emptyEventForm);
    } catch (error) {
      const requestError = classifyAdminError(error, editingEvent ? 'Unable to update event.' : 'Unable to create event.');
      if (isGlobalAuthorizationError(requestError)) {
        setGlobalAuthError(requestError);
      } else {
        setEventFormError(requestError);
      }
    } finally {
      setEventSubmitting(false);
    }
  };

  const openRegistrationsModal = async (event: EventSummary) => {
    setRegistrationsEvent({
      id: event.id,
      title: event.title,
      registrationCount: event.registrationCount,
      maxRegistrations: event.maxRegistrations,
    });
    setEventRegistrations([]);
    setRegistrationsError(null);
    setRegistrationsLoading(true);

    try {
      const response = await getAdminEventRegistrations(event.id);
      setRegistrationsEvent(response.event);
      setEventRegistrations(response.registrations);
      setEvents((current) =>
        current.map((item) =>
          item.id === response.event.id
            ? {
                ...item,
                registrationCount: response.event.registrationCount,
                maxRegistrations: response.event.maxRegistrations,
              }
            : item
        )
      );
    } catch (error) {
      const requestError = classifyAdminError(error, 'Unable to load event registrations.');
      if (isGlobalAuthorizationError(requestError)) {
        setGlobalAuthError(requestError);
        setRegistrationsEvent(null);
      } else {
        setRegistrationsError(requestError);
      }
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const closeRegistrationsModal = () => {
    if (registrationsDownloading) return;
    setRegistrationsEvent(null);
    setEventRegistrations([]);
    setRegistrationsError(null);
  };

  const handleDownloadEventRegistrations = async () => {
    if (!registrationsEvent || registrationsDownloading) return;

    setRegistrationsDownloading(true);
    setRegistrationsError(null);

    try {
      const { blob, filename } = await downloadAdminEventRegistrations(registrationsEvent.id);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      const requestError = classifyAdminError(error, 'Unable to download registrations.');
      if (isGlobalAuthorizationError(requestError)) {
        setGlobalAuthError(requestError);
        setRegistrationsEvent(null);
      } else {
        setRegistrationsError(requestError);
      }
    } finally {
      setRegistrationsDownloading(false);
    }
  };

  const handleGlobalRetry = () => {
    setGlobalAuthError(null);
    setOverviewError(null);
    setRegistrationError(null);
    setStudentsError(null);
    setEventsError(null);
    void loadOverview();
    void loadRegistration();
    void loadEvents();
    setStudentRefreshToken((current) => current + 1);
  };

  const registrationOpensAt = formatDateTime(registration?.registrationOpensAt);
  const registrationClosesAt = formatDateTime(registration?.registrationClosesAt);
  const filtersActive = Boolean(search.trim() || branch.trim() || year || status || domain);

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
            <>
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

              <div className="mt-6 border-t border-line/80 pt-6">
                <h3 className="font-display text-xl font-semibold text-ink">
                  Domain Registrations
                </h3>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <SectionReveal delay={0.14} duration={0.38} className="h-full">
                    <StatCard label="Web Development" value={overview.domainCounts.webDevelopment} icon={<Code2 className="size-5" aria-hidden="true" />} detail="Registered students" accent={statAccents.technical} />
                  </SectionReveal>
                  <SectionReveal delay={0.17} duration={0.38} className="h-full">
                    <StatCard label="DSA" value={overview.domainCounts.dsa} icon={<GitBranch className="size-5" aria-hidden="true" />} detail="Registered students" accent={statAccents.dream} />
                  </SectionReveal>
                  <SectionReveal delay={0.2} duration={0.38} className="h-full">
                    <StatCard label="Aptitude" value={overview.domainCounts.aptitude} icon={<Brain className="size-5" aria-hidden="true" />} detail="Registered students" accent={statAccents.primary} />
                  </SectionReveal>
                </div>
              </div>
            </>
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

        <SectionReveal delay={0.06} duration={0.42}>
        <section aria-labelledby="events-management-heading" className="overflow-hidden rounded-card border border-line/80 bg-surface/90 shadow-soft">
          <div className="border-b border-line/80 bg-dream-soft/30 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary-text">
                  Events &amp; Tracks
                </p>
                <h2 id="events-management-heading" className="mt-1 font-display text-2xl font-semibold text-ink">
                  Manage Events
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">
                  Create workshops, manage event registration windows, and monitor live capacity.
                </p>
              </div>
              <button type="button" onClick={openCreateEventModal} className="btn btn-primary w-full justify-center sm:w-fit">
                <PlusCircle className="size-4" aria-hidden="true" />
                Add Event
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {(eventsError || eventsNotice) && (
              <div className="mb-5">
                {eventsError ? (
                  <InlineFeedback kind="error">{eventsError.message}</InlineFeedback>
                ) : eventsNotice ? (
                  <InlineFeedback kind="success">{eventsNotice}</InlineFeedback>
                ) : null}
              </div>
            )}

            {eventsLoading && events.length === 0 ? (
              <LoadingState label="Loading events..." />
            ) : eventsError && events.length === 0 ? (
              <button type="button" onClick={() => void loadEvents()} className="btn btn-secondary">
                <RefreshCw className="size-4" aria-hidden="true" />
                Retry events
              </button>
            ) : events.length === 0 ? (
              <div className="rounded-card border border-line/80 bg-surface/80 p-8 text-center text-sm text-ink-muted">
                No events have been created yet.
              </div>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {events.map((event) => (
                  <article key={event.id} className="rounded-card border border-line/80 bg-glass/60 p-4 shadow-soft">
                    <div className="grid gap-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
                      <div className="aspect-[16/10] overflow-hidden rounded-control border border-line bg-surface-muted">
                        <img
                          src={event.posterUrl}
                          alt={`${event.title} poster`}
                          className="size-full object-cover"
                          loading="lazy"
                          onError={(imageEvent) => {
                            imageEvent.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="break-words font-display text-lg font-semibold text-ink">
                              {event.title}
                            </h3>
                            <p className="mt-1 text-sm text-ink-muted">{formatDateTime(event.eventDateTime)}</p>
                          </div>
                          <span className={`inline-flex min-h-8 items-center rounded-full border px-3 font-mono text-xs font-bold ${getEventStatusClasses(event)}`}>
                            {getEventStatusLabel(event)}
                          </span>
                        </div>

                        <dl className="mt-4 grid gap-3 text-sm text-ink-muted sm:grid-cols-2">
                          <div>
                            <dt className="font-semibold text-ink">Venue</dt>
                            <dd>{event.venue}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-ink">Registrations</dt>
                            <dd>{event.registrationCount} / {event.maxRegistrations}</dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="font-semibold text-ink">Deadline</dt>
                            <dd>{formatDateTime(event.registrationDeadline)}</dd>
                          </div>
                        </dl>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button type="button" onClick={() => void openRegistrationsModal(event)} className="btn btn-secondary rounded-full">
                            <Users className="size-4" aria-hidden="true" />
                            View Registrations
                          </button>
                          <button type="button" onClick={() => openEditEventModal(event)} className="btn btn-secondary rounded-full">
                            <Pencil className="size-4" aria-hidden="true" />
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
        </SectionReveal>

        <SectionReveal delay={0.07} duration={0.42}>
        <section aria-labelledby="award-points-heading" className="overflow-hidden rounded-card border border-line/80 bg-surface/90 shadow-soft">
          <div className="border-b border-line/80 bg-dream-soft/30 p-5 sm:p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-technical-text">
              Leaderboard Points
            </p>
            <h2 id="award-points-heading" className="mt-1 font-display text-2xl font-semibold text-ink">
              Award Student Points
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">
              Search by registered college email, verify the student, then record a new point transaction.
            </p>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="space-y-4">
              <form onSubmit={handleAwardSearch} className="rounded-card border border-line/80 bg-glass/60 p-4 shadow-soft">
                <label htmlFor="award-student-email" className="block text-sm font-semibold text-ink">
                  Search Student
                </label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <span className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" aria-hidden="true" />
                    <input
                      id="award-student-email"
                      type="email"
                      value={awardSearchEmail}
                      onChange={(event) => {
                        setAwardSearchEmail(event.target.value);
                        setAwardSearchError(null);
                      }}
                      placeholder="Search by college email"
                      className="min-h-11 w-full rounded-control border border-line-strong bg-surface/95 py-2 pl-10 pr-3 text-sm text-ink shadow-soft placeholder:text-ink-subtle focus:border-technical/60 focus:ring-2 focus:ring-technical/20"
                    />
                  </span>
                  <button type="submit" className="btn btn-primary shrink-0" disabled={awardSearchLoading}>
                    {awardSearchLoading ? (
                      <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    ) : (
                      <Search className="size-4" aria-hidden="true" />
                    )}
                    {awardSearchLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </form>

              {awardSearchError && <InlineFeedback kind="error">{awardSearchError.message}</InlineFeedback>}

              {awardSearchResults.length > 0 && (
                <div className="rounded-card border border-line/80 bg-surface/80 p-3 shadow-soft">
                  <p className="px-1 pb-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                    Search Results
                  </p>
                  <div className="grid gap-2">
                    {awardSearchResults.map((student) => (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => void handleSelectAwardStudent(student)}
                        className="rounded-control border border-line/80 bg-glass/60 p-3 text-left transition hover:border-technical/45 hover:bg-technical/10 focus-visible:outline-offset-2"
                      >
                        <span className="block font-semibold text-ink">{student.name}</span>
                        <span className="mt-1 block break-words text-sm text-ink-muted">{student.email}</span>
                        <span className="mt-2 block font-mono text-xs font-semibold text-ink-subtle">
                          {student.usn} • {student.branch} • Year {student.year}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedAwardStudent && (
                <div className="rounded-card border border-technical/25 bg-technical/10 p-4 shadow-soft">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-control border border-technical/25 bg-technical/10 text-technical-text">
                      <Trophy className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-semibold text-ink">
                        {selectedAwardStudent.name}
                      </h3>
                      <p className="mt-1 break-words text-sm text-ink-muted">
                        {selectedAwardStudent.email}
                      </p>
                      <p className="mt-2 font-mono text-xs font-semibold text-ink-subtle">
                        {selectedAwardStudent.usn} • {selectedAwardStudent.branch} • Year {selectedAwardStudent.year}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-card border border-line/80 bg-surface/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                        Current Points
                      </p>
                      <p className="mt-1 text-3xl font-semibold tabular-nums text-primary-text">
                        {selectedAwardStudent.totalPoints}
                      </p>
                    </div>
                    <div className="rounded-card border border-line/80 bg-surface/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                        Overall Rank
                      </p>
                      <p className="mt-1 text-3xl font-semibold tabular-nums text-primary-text">
                        {selectedAwardStudent.overallRank ? `#${selectedAwardStudent.overallRank}` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <form onSubmit={handleOpenAwardConfirm} className="rounded-card border border-line/80 bg-glass/60 p-4 shadow-soft">
                <div className="grid gap-4 sm:grid-cols-[minmax(0,0.45fr)_minmax(0,1fr)]">
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-ink">Points to Award</span>
                    <input
                      type="number"
                      min={1}
                      max={100000}
                      step={1}
                      value={awardPoints}
                      onChange={(event) => {
                        setAwardPoints(event.target.value);
                        setAwardError(null);
                      }}
                      placeholder="20"
                      className="min-h-11 w-full rounded-control border border-line-strong bg-surface/95 px-3 py-2 text-sm text-ink shadow-soft placeholder:text-ink-subtle focus:border-technical/60 focus:ring-2 focus:ring-technical/20"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold text-ink">Reason / Activity</span>
                    <input
                      type="text"
                      value={awardDescription}
                      onChange={(event) => {
                        setAwardDescription(event.target.value);
                        setAwardError(null);
                      }}
                      maxLength={240}
                      placeholder="Participated in HackerEarth workshop"
                      className="min-h-11 w-full rounded-control border border-line-strong bg-surface/95 px-3 py-2 text-sm text-ink shadow-soft placeholder:text-ink-subtle focus:border-technical/60 focus:ring-2 focus:ring-technical/20"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary mt-4 w-full justify-center sm:w-fit"
                  disabled={!selectedAwardStudent || awardSubmitting}
                >
                  <PlusCircle className="size-4" aria-hidden="true" />
                  Award Points
                </button>
              </form>

              {(awardError || awardNotice) && (
                awardError ? (
                  <InlineFeedback kind="error">{awardError.message}</InlineFeedback>
                ) : awardNotice ? (
                  <InlineFeedback kind="success">{awardNotice}</InlineFeedback>
                ) : null
              )}

              <div className="rounded-card border border-line/80 bg-surface/80 p-4 shadow-soft">
                <div className="flex items-center gap-2">
                  <History className="size-4 text-dream-text" aria-hidden="true" />
                  <h3 className="font-display text-lg font-semibold text-ink">
                    Recent Point Activity
                  </h3>
                </div>

                {pointHistoryLoading ? (
                  <div className="mt-4">
                    <LoadingState label="Loading point activity..." />
                  </div>
                ) : selectedAwardStudent ? (
                  pointHistory.length > 0 ? (
                    <ul className="mt-4 divide-y divide-line/70">
                      {pointHistory.map((transaction) => (
                        <li key={transaction.id} className="flex gap-3 py-3">
                          <span className="font-mono text-sm font-bold text-success-text">
                            +{transaction.points}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-ink">
                              {transaction.description || 'Point award'}
                            </span>
                            <span className="mt-1 block text-xs text-ink-subtle">
                              {formatShortDate(transaction.createdAt)}
                              {transaction.awardedBy?.name ? ` • by ${transaction.awardedBy.name}` : ''}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm leading-6 text-ink-muted">
                      No point activity yet.
                    </p>
                  )
                ) : (
                  <p className="mt-4 text-sm leading-6 text-ink-muted">
                    Select a student to view recent manual point awards.
                  </p>
                )}
              </div>
            </div>
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
            <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-[minmax(15rem,1fr)_minmax(10rem,0.5fr)_9rem_10rem_minmax(12rem,0.6fr)]">
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
                  {[1, 2, 3, 4].map((value) => <option key={value} value={value}>{value}</option>)}
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

              <label>
                <span className="mb-2 block text-sm font-semibold text-ink">Domain</span>
                <select
                  value={domain}
                  onChange={handleDomainChange}
                  className="min-h-11 w-full rounded-control border border-line-strong bg-glass/70 px-3 py-2 text-sm text-ink shadow-soft focus:border-rose/60 focus:ring-2 focus:ring-rose/20"
                >
                  {domainFilterOptions.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
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

        {registrationsEvent && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-canvas/70 p-4 backdrop-blur-md">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="event-registrations-heading"
              className="ui-panel-glass my-8 w-full max-w-5xl border-dream/30 p-5 shadow-glass sm:p-6"
            >
              <div className="flex flex-col gap-4 border-b border-line/80 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-dream-text">
                    Registered Students
                  </p>
                  <h2 id="event-registrations-heading" className="mt-1 break-words font-display text-2xl font-semibold text-ink">
                    {registrationsEvent.title}
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-ink-muted">
                    {registrationsEvent.registrationCount} / {registrationsEvent.maxRegistrations} Registered
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => void handleDownloadEventRegistrations()}
                    className="btn min-h-11 rounded-full border border-creative/30 bg-creative/10 px-4 text-creative-text hover:bg-creative/20"
                    disabled={registrationsDownloading}
                  >
                    {registrationsDownloading ? (
                      <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    ) : (
                      <FileSpreadsheet className="size-4" aria-hidden="true" />
                    )}
                    {registrationsDownloading ? 'Downloading...' : 'Download Excel'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon self-end sm:self-auto"
                    onClick={closeRegistrationsModal}
                    disabled={registrationsDownloading}
                    aria-label="Close event registrations"
                  >
                    <X className="size-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-5">
                {registrationsError && (
                  <div className="mb-4">
                    <InlineFeedback kind="error">{registrationsError.message}</InlineFeedback>
                  </div>
                )}

                {registrationsLoading ? (
                  <LoadingState label="Loading event registrations..." />
                ) : eventRegistrations.length === 0 ? (
                  <div className="rounded-card border border-line/80 bg-surface/80 p-8 text-center text-sm text-ink-muted">
                    No students have registered for this event yet.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-card border border-line/80 bg-surface/90 shadow-soft">
                    <p className="border-b border-line/80 bg-surface-muted/50 px-4 py-3 text-xs font-medium text-ink-subtle md:hidden">
                      Scroll horizontally to view every registration field.
                    </p>
                    <div className="max-w-full overflow-x-auto overscroll-x-contain">
                      <table className="min-w-[46rem] w-full border-collapse text-left text-sm">
                        <caption className="sr-only">Event registrations</caption>
                        <thead className="border-b border-line-strong bg-dream-soft/50 text-xs uppercase tracking-[0.08em] text-ink-muted">
                          <tr>
                            {['Name', 'USN', 'Email', 'Phone Number', 'Year'].map((heading) => (
                              <th key={heading} scope="col" className="px-4 py-4 font-semibold">{heading}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line/80">
                          {eventRegistrations.map((registration) => (
                            <tr key={registration.id} className="bg-surface/80 transition-colors hover:bg-dream-soft/30 motion-reduce:transition-none">
                              <th scope="row" className="px-4 py-4 font-semibold text-ink">{registration.name}</th>
                              <td className="px-4 py-4 font-mono text-xs font-semibold text-ink-muted">{registration.usn}</td>
                              <td className="px-4 py-4 text-ink-muted">
                                <a href={`mailto:${registration.email}`} className="underline decoration-line underline-offset-4 hover:text-technical-text">
                                  {registration.email}
                                </a>
                              </td>
                              <td className="px-4 py-4 text-ink-muted">{registration.contactNumber}</td>
                              <td className="px-4 py-4 text-ink-muted">{registration.year ?? '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {isEventModalOpen && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-canvas/70 p-4 backdrop-blur-md">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="event-modal-heading"
              className="ui-panel-glass my-8 w-full max-w-3xl border-primary/30 p-5 shadow-glass sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary-text">
                    {editingEvent ? 'Edit Event' : 'Add Event'}
                  </p>
                  <h2 id="event-modal-heading" className="mt-1 font-display text-2xl font-semibold text-ink">
                    {editingEvent ? 'Update event details' : 'Create a new event'}
                  </h2>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon shrink-0"
                  onClick={closeEventModal}
                  disabled={eventSubmitting}
                  aria-label="Close event form"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              <form onSubmit={handleEventSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-ink">Event Title</span>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(event) => handleEventFormChange('title', event.target.value)}
                      maxLength={120}
                      className="min-h-11 w-full rounded-control border border-line-strong bg-surface/95 px-3 py-2 text-sm text-ink shadow-soft placeholder:text-ink-subtle focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </label>

                  <label className="sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-ink">Poster Image URL</span>
                    <span className="relative block">
                      <Image className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" aria-hidden="true" />
                      <input
                        type="url"
                        value={eventForm.posterUrl}
                        onChange={(event) => handleEventFormChange('posterUrl', event.target.value)}
                        placeholder="https://..."
                        maxLength={1000}
                        className="min-h-11 w-full rounded-control border border-line-strong bg-surface/95 py-2 pl-10 pr-3 text-sm text-ink shadow-soft placeholder:text-ink-subtle focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </span>
                  </label>

                  <label className="sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-ink">Description</span>
                    <textarea
                      value={eventForm.description}
                      onChange={(event) => handleEventFormChange('description', event.target.value)}
                      rows={4}
                      maxLength={2000}
                      className="w-full rounded-control border border-line-strong bg-surface/95 px-3 py-2 text-sm text-ink shadow-soft placeholder:text-ink-subtle focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold text-ink">Venue</span>
                    <input
                      type="text"
                      value={eventForm.venue}
                      onChange={(event) => handleEventFormChange('venue', event.target.value)}
                      maxLength={160}
                      className="min-h-11 w-full rounded-control border border-line-strong bg-surface/95 px-3 py-2 text-sm text-ink shadow-soft placeholder:text-ink-subtle focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold text-ink">Maximum Registrations</span>
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      step={1}
                      value={eventForm.maxRegistrations}
                      onChange={(event) => handleEventFormChange('maxRegistrations', event.target.value)}
                      className="min-h-11 w-full rounded-control border border-line-strong bg-surface/95 px-3 py-2 text-sm text-ink shadow-soft placeholder:text-ink-subtle focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold text-ink">Event Date</span>
                    <input
                      type="date"
                      value={eventForm.eventDate}
                      onChange={(event) => handleEventFormChange('eventDate', event.target.value)}
                      className="min-h-11 w-full rounded-control border border-line-strong bg-surface/95 px-3 py-2 text-sm text-ink shadow-soft focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold text-ink">Event Time</span>
                    <input
                      type="time"
                      value={eventForm.eventTime}
                      onChange={(event) => handleEventFormChange('eventTime', event.target.value)}
                      className="min-h-11 w-full rounded-control border border-line-strong bg-surface/95 px-3 py-2 text-sm text-ink shadow-soft focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold text-ink">Registration Deadline Date</span>
                    <input
                      type="date"
                      value={eventForm.deadlineDate}
                      onChange={(event) => handleEventFormChange('deadlineDate', event.target.value)}
                      className="min-h-11 w-full rounded-control border border-line-strong bg-surface/95 px-3 py-2 text-sm text-ink shadow-soft focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold text-ink">Registration Deadline Time</span>
                    <input
                      type="time"
                      value={eventForm.deadlineTime}
                      onChange={(event) => handleEventFormChange('deadlineTime', event.target.value)}
                      className="min-h-11 w-full rounded-control border border-line-strong bg-surface/95 px-3 py-2 text-sm text-ink shadow-soft focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </label>
                </div>

                <label className="flex items-center gap-3 rounded-card border border-line/80 bg-surface/75 p-3 text-sm font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={eventForm.active}
                    onChange={(event) => handleEventFormChange('active', event.target.checked)}
                    className="size-4 rounded border-line text-primary focus:ring-primary/30"
                  />
                  Registration active
                </label>

                {eventFormError && <InlineFeedback kind="error">{eventFormError.message}</InlineFeedback>}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button type="button" onClick={closeEventModal} className="btn btn-secondary" disabled={eventSubmitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={eventSubmitting}>
                    {eventSubmitting && (
                      <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    )}
                    {eventSubmitting
                      ? editingEvent ? 'Updating...' : 'Creating...'
                      : editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        {isAwardConfirmOpen && selectedAwardStudent && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-canvas/70 p-4 backdrop-blur-md">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="award-confirm-heading"
              className="ui-panel-glass w-full max-w-lg border-dream/30 p-5 shadow-glass sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-dream-text">
                    Confirm Award
                  </p>
                  <h2 id="award-confirm-heading" className="mt-1 font-display text-2xl font-semibold text-ink">
                    Award {Number(awardPoints)} points to {selectedAwardStudent.name}?
                  </h2>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon shrink-0"
                  onClick={() => setIsAwardConfirmOpen(false)}
                  disabled={awardSubmitting}
                  aria-label="Close award confirmation"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-5 rounded-card border border-line/80 bg-surface/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                  Reason
                </p>
                <p className="mt-2 text-sm leading-6 text-ink">
                  {awardDescription.trim()}
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAwardConfirmOpen(false)}
                  disabled={awardSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => void handleConfirmAward()}
                  disabled={awardSubmitting}
                >
                  {awardSubmitting && (
                    <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  )}
                  {awardSubmitting ? 'Awarding...' : 'Confirm Award'}
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </PageTransition>
  );
};

export default AdminDashboard;
