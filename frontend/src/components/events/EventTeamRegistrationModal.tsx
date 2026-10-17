import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Loader2, LogIn, UserPlus, Users, X } from "lucide-react";
import type { User } from "../../context/AuthContext";
import { ApiError } from "../../lib/api";
import {
  createEventTeam,
  joinEventTeam,
  previewEventTeamInvitation,
  type EventSummary,
  type EventTeamRegistrationResult,
  type TeamInvitationPreview,
} from "../../lib/eventApi";

type TeamMode = "create" | "join";

interface Props {
  event: EventSummary;
  mode: TeamMode;
  user: User | null;
  initialInvitationCode?: string;
  onClose: () => void;
  onComplete: (result: EventTeamRegistrationResult, message: string) => void;
}

const inputClass =
  "min-h-11 w-full rounded-control border border-line-strong bg-surface/95 px-3 py-2 text-sm text-ink shadow-soft placeholder:text-ink-subtle focus:border-primary/60 focus:ring-2 focus:ring-primary/20";

const normalizeIndianMobile = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (/^[6-9]\d{9}$/.test(digits)) return digits;
  if (/^91[6-9]\d{9}$/.test(digits)) return digits.slice(2);
  return null;
};

const extractInvitationCode = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed, window.location.origin);
    return parsed.searchParams.get("invite")?.trim() ?? "";
  } catch {
    return trimmed;
  }
};

const EventTeamRegistrationModal = ({
  event,
  mode,
  user,
  initialInvitationCode = "",
  onClose,
  onComplete,
}: Props) => {
  const [teamName, setTeamName] = useState("");
  const [invitationInput, setInvitationInput] = useState(initialInvitationCode);
  const [invitationCode, setInvitationCode] = useState(initialInvitationCode);
  const [preview, setPreview] = useState<TeamInvitationPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState(user?.contactNumber ?? "");
  const [branch, setBranch] = useState(user?.branch ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const membersOnlyBlocked = event.eligibility === "members_only" && !user;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape" && !submitting) onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, submitting]);

  useEffect(() => {
    if (mode !== "join" || !initialInvitationCode) return;
    const controller = new AbortController();
    setPreviewLoading(true);
    setError("");
    void previewEventTeamInvitation(event.id, initialInvitationCode, controller.signal)
      .then((response) => setPreview(response.invitation))
      .catch((requestError) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(requestError instanceof ApiError ? requestError.message : "Unable to load this invitation.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setPreviewLoading(false);
      });
    return () => controller.abort();
  }, [event.id, initialInvitationCode, mode]);

  const loadInvitation = async () => {
    const code = extractInvitationCode(invitationInput);
    if (!code) {
      setError("Enter a valid invitation link or code.");
      return;
    }
    setPreviewLoading(true);
    setError("");
    setPreview(null);
    try {
      const response = await previewEventTeamInvitation(event.id, code);
      setInvitationCode(code);
      setPreview(response.invitation);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Unable to load this invitation.");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleContactChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    setContactNumber(
      digits.length === 12 && digits.startsWith("91")
        ? digits.slice(2)
        : digits.slice(0, 10)
    );
  };

  const handleSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    if (submitting || membersOnlyBlocked) return;
    const normalizedContact = normalizeIndianMobile(contactNumber);
    if (!normalizedContact) {
      setError("Enter a valid Indian mobile number.");
      return;
    }
    if (mode === "create" && (teamName.trim().length < 2 || teamName.trim().length > 80)) {
      setError("Team name must contain 2 to 80 characters.");
      return;
    }
    if (mode === "join" && (!invitationCode || !preview)) {
      setError("Load a valid invitation before joining.");
      return;
    }
    if (branch.trim().length < 2 || branch.trim().length > 160) {
      setError("Enter a valid branch name.");
      return;
    }
    if (!user && (!name.trim() || !email.trim())) {
      setError("Enter your full name, email address, contact number, and branch name.");
      return;
    }

    setSubmitting(true);
    setError("");
    const participant = user
      ? { contactNumber: normalizedContact, branch: branch.trim() }
      : {
          name: name.trim(),
          email: email.trim(),
          contactNumber: normalizedContact,
          branch: branch.trim(),
        };
    try {
      const response = mode === "create"
        ? await createEventTeam(event.id, { ...participant, teamName: teamName.trim() })
        : await joinEventTeam(event.id, { ...participant, invitationCode });
      onComplete(response.team, response.message);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Unable to complete team registration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-canvas/75 p-4 pt-24 backdrop-blur-md sm:p-6 sm:pt-28">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-registration-heading"
        className="ui-panel-glass mx-auto flex w-full max-w-2xl flex-col overflow-hidden border-dream/30 shadow-glass"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line/70 bg-surface/80 p-5 sm:p-6">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-dream-text">
              {mode === "create" ? "Create Team" : "Join Existing Team"}
            </p>
            <h2 id="team-registration-heading" className="mt-1 font-display text-2xl font-semibold text-ink">
              {mode === "join" && preview ? preview.team.name : event.title}
            </h2>
          </div>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} disabled={submitting} aria-label="Close team registration">
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          {membersOnlyBlocked ? (
            <div className="rounded-card border border-primary/25 bg-primary/10 p-5 text-sm text-ink-muted">
              <p className="font-semibold text-ink">Club member sign-in required</p>
              <p className="mt-2">This event is available only to active HackerEarth Hub members.</p>
              <Link to="/login" className="btn btn-primary mt-4 w-fit">
                <LogIn className="size-4" aria-hidden="true" /> Sign In
              </Link>
            </div>
          ) : (
            <>
              {mode === "create" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-ink">Team Name</span>
                  <input className={inputClass} value={teamName} onChange={(e) => setTeamName(e.target.value)} maxLength={80} required />
                </label>
              ) : !preview ? (
                <div>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink">Invitation Link or Code</span>
                    <input className={inputClass} value={invitationInput} onChange={(e) => setInvitationInput(e.target.value)} autoComplete="off" required />
                  </label>
                  <button type="button" className="btn btn-secondary mt-3" onClick={() => void loadInvitation()} disabled={previewLoading}>
                    {previewLoading ? <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Users className="size-4" aria-hidden="true" />}
                    {previewLoading ? "Checking..." : "Load Invitation"}
                  </button>
                </div>
              ) : (
                <div className="rounded-card border border-dream/25 bg-dream/10 p-4">
                  <p className="font-semibold text-ink">{preview.event.name}</p>
                  <p className="mt-1 text-sm text-ink-muted">{preview.team.name} · {preview.team.availableSlots} slot{preview.team.availableSlots === 1 ? "" : "s"} available</p>
                  {!preview.registrationOpen && <p className="mt-2 text-sm font-semibold text-rose-text">Registration is no longer available.</p>}
                </div>
              )}

              {!user && (mode === "create" || preview) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-ink">Full Name</span>
                    <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-ink">Email Address</span>
                    <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} required />
                  </label>
                </div>
              )}

              {(mode === "create" || preview) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink">Branch Name</span>
                    <input className={inputClass} value={branch} onChange={(e) => setBranch(e.target.value)} maxLength={160} placeholder="Enter branch name" required />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink">Contact Number</span>
                    <span className="flex min-h-11 overflow-hidden rounded-control border border-line-strong bg-surface/95 shadow-soft focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
                      <span className="flex items-center border-r border-line px-3 text-sm font-semibold text-ink-muted">+91</span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-subtle"
                        value={contactNumber}
                        onChange={(e) => handleContactChange(e.target.value)}
                        placeholder="Enter mobile number"
                        required
                      />
                    </span>
                  </label>
                </div>
              )}

              {error && <p role="alert" className="rounded-control border border-rose/30 bg-rose/10 px-4 py-3 text-sm font-semibold text-rose-text">{error}</p>}

              {(mode === "create" || preview) && (
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting || (mode === "join" && preview?.registrationOpen === false)}>
                    {submitting ? <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <UserPlus className="size-4" aria-hidden="true" />}
                    {submitting ? "Submitting..." : mode === "create" ? "Create Team" : "Join Team"}
                  </button>
                </div>
              )}
            </>
          )}
        </form>
      </section>
    </div>
  );
};

export default EventTeamRegistrationModal;
