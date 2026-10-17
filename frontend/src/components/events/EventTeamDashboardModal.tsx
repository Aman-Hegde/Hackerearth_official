import { useEffect, useState } from "react";
import { Check, Copy, Loader2, ShieldCheck, UserRound, X } from "lucide-react";
import { ApiError } from "../../lib/api";
import {
  getEventTeamAccessToken,
  getMyEventTeam,
  type EventSummary,
  type EventTeamDetails,
} from "../../lib/eventApi";

interface Props {
  event: EventSummary;
  onClose: () => void;
}

const EventTeamDashboardModal = ({ event, onClose }: Props) => {
  const [team, setTeam] = useState<EventTeamDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    void getMyEventTeam(
      event.id,
      getEventTeamAccessToken(event.id) ?? undefined,
      controller.signal
    )
      .then((response) => setTeam(response.team))
      .catch((requestError) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(requestError instanceof ApiError ? requestError.message : "Unable to load your team.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [event.id]);

  const copyInvitation = async () => {
    if (!team?.invitationPath) return;
    try {
      await navigator.clipboard.writeText(new URL(team.invitationPath, window.location.origin).toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Unable to copy the invitation link. Please copy it from the address shown.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-canvas/75 p-4 pt-24 backdrop-blur-md sm:p-6 sm:pt-28">
      <section role="dialog" aria-modal="true" aria-labelledby="team-dashboard-heading" className="ui-panel-glass mx-auto w-full max-w-3xl overflow-hidden border-dream/30 shadow-glass">
        <header className="flex items-start justify-between gap-4 border-b border-line/70 bg-surface/80 p-5 sm:p-6">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-dream-text">Your Team</p>
            <h2 id="team-dashboard-heading" className="mt-1 font-display text-2xl font-semibold text-ink">{team?.name ?? event.title}</h2>
          </div>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close team details">
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div className="p-5 sm:p-6">
          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-2 text-sm font-semibold text-ink-muted" role="status">
              <Loader2 className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" /> Loading your team...
            </div>
          ) : error ? (
            <p role="alert" className="rounded-control border border-rose/30 bg-rose/10 px-4 py-3 text-sm font-semibold text-rose-text">{error}</p>
          ) : team ? (
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-card border border-line/80 bg-surface/80 p-4">
                  <p className="text-xs font-semibold uppercase text-ink-subtle">Members</p>
                  <p className="mt-1 text-2xl font-bold text-ink">{team.currentMemberCount}/{team.maxTeamSize}</p>
                </div>
                <div className="rounded-card border border-line/80 bg-surface/80 p-4">
                  <p className="text-xs font-semibold uppercase text-ink-subtle">Minimum Size</p>
                  <p className="mt-1 text-2xl font-bold text-ink">{team.minTeamSize}</p>
                </div>
                <div className="rounded-card border border-line/80 bg-surface/80 p-4">
                  <p className="text-xs font-semibold uppercase text-ink-subtle">Status</p>
                  <p className="mt-1 text-lg font-bold capitalize text-dream-text">{team.status}</p>
                </div>
              </div>

              {team.role === "leader" && team.invitationPath && (
                <div className="rounded-card border border-primary/25 bg-primary/10 p-4">
                  <p className="flex items-center gap-2 font-semibold text-ink"><ShieldCheck className="size-4 text-primary-text" aria-hidden="true" /> Team invitation</p>
                  <p className="mt-2 break-all font-mono text-xs text-ink-muted">{new URL(team.invitationPath, window.location.origin).toString()}</p>
                  <button type="button" className="btn btn-primary mt-3" onClick={() => void copyInvitation()}>
                    {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                    {copied ? "Copied" : "Copy Invite Link"}
                  </button>
                </div>
              )}

              <div>
                <h3 className="font-display text-lg font-semibold text-ink">Team roster</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {team.members.map((member, index) => (
                    <div key={`${member.role}-${member.name}-${index}`} className="flex items-center gap-3 rounded-card border border-line/80 bg-surface/80 p-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-dream/25 bg-dream/10 text-dream-text">
                        <UserRound className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{member.name}</p>
                        <p className="text-xs font-medium text-ink-muted">{member.role === "leader" ? "Team Leader" : "Team Member"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default EventTeamDashboardModal;
