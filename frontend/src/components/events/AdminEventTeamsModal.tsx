import { useEffect, useState } from "react";
import { FileSpreadsheet, Loader2, ShieldCheck, X } from "lucide-react";
import { ApiError } from "../../lib/api";
import {
  downloadAdminEventTeams,
  getAdminEventTeams,
  type AdminEventTeam,
  type AdminEventTeamsSummary,
  type EventSummary,
} from "../../lib/eventApi";

interface Props {
  event: EventSummary;
  onClose: () => void;
}

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

const AdminEventTeamsModal = ({ event, onClose }: Props) => {
  const [summary, setSummary] = useState<AdminEventTeamsSummary>({
    id: event.id,
    title: event.title,
    registrationCount: event.registrationCount,
    maxRegistrations: event.maxRegistrations,
  });
  const [teams, setTeams] = useState<AdminEventTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape" && !downloading) onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [downloading, onClose]);

  useEffect(() => {
    const controller = new AbortController();
    void getAdminEventTeams(event.id, controller.signal)
      .then((response) => {
        setSummary(response.event);
        setTeams(response.teams);
      })
      .catch((requestError) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(requestError instanceof ApiError ? requestError.message : "Unable to load registered teams.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [event.id]);

  const downloadTeams = async () => {
    setDownloading(true);
    setError("");
    try {
      const { blob, filename } = await downloadAdminEventTeams(event.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Unable to download team registrations.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-canvas/75 p-4 pt-24 backdrop-blur-md sm:p-6 sm:pt-28">
      <section role="dialog" aria-modal="true" aria-labelledby="admin-event-teams-heading" className="ui-panel-glass mx-auto w-full max-w-6xl overflow-hidden border-dream/30 shadow-glass">
        <header className="flex flex-col gap-4 border-b border-line/70 bg-surface/80 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-dream-text">Registered Teams</p>
            <h2 id="admin-event-teams-heading" className="mt-1 font-display text-2xl font-semibold text-ink">{summary.title}</h2>
            <p className="mt-2 text-sm font-semibold text-ink-muted">{summary.registrationCount} / {summary.maxRegistrations} teams registered</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => void downloadTeams()} disabled={downloading}>
              {downloading ? <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <FileSpreadsheet className="size-4" aria-hidden="true" />}
              {downloading ? "Downloading..." : "Export Teams"}
            </button>
            <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} disabled={downloading} aria-label="Close registered teams">
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="max-h-[calc(100vh-13rem)] overflow-y-auto p-5 sm:p-6">
          {error && <p role="alert" className="mb-4 rounded-control border border-rose/30 bg-rose/10 px-4 py-3 text-sm font-semibold text-rose-text">{error}</p>}
          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-2 text-sm font-semibold text-ink-muted" role="status">
              <Loader2 className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" /> Loading teams...
            </div>
          ) : teams.length === 0 ? (
            <div className="rounded-card border border-line/80 bg-surface/80 p-8 text-center text-sm text-ink-muted">No teams have registered for this event yet.</div>
          ) : (
            <div className="space-y-4">
              {teams.map((team) => (
                <article key={team.id} className="overflow-hidden rounded-card border border-line/80 bg-surface/80 shadow-soft">
                  <div className="flex flex-col gap-3 border-b border-line/70 bg-dream-soft/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-ink">{team.name}</h3>
                      <p className="mt-1 text-xs text-ink-muted">Created {formatDateTime(team.createdAt)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink-muted">{team.currentMemberCount}/{team.maxTeamSize} members</span>
                      <span className="rounded-full border border-dream/30 bg-dream/10 px-3 py-1 text-xs font-bold uppercase text-dream-text">{team.status}</span>
                    </div>
                  </div>
                  <div className="max-w-full overflow-x-auto overscroll-x-contain">
                    <table className="min-w-[60rem] w-full border-collapse text-left text-sm">
                      <thead className="border-b border-line bg-surface-muted/50 text-xs uppercase text-ink-muted">
                        <tr>{["Participant", "Role", "USN", "Email", "Phone", "Branch", "Year", "Joined"].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-line/70">
                        {team.members.map((member) => (
                          <tr key={member.id}>
                            <th className="px-4 py-3 font-semibold text-ink">{member.name}</th>
                            <td className="px-4 py-3 text-ink-muted">{member.isLeader ? <span className="inline-flex items-center gap-1"><ShieldCheck className="size-3.5 text-primary-text" aria-hidden="true" /> Leader</span> : "Teammate"}</td>
                            <td className="px-4 py-3 font-mono text-xs text-ink-muted">{member.usn || "-"}</td>
                            <td className="px-4 py-3 text-ink-muted">{member.email || "-"}</td>
                            <td className="px-4 py-3 text-ink-muted">{member.contactNumber || "-"}</td>
                            <td className="px-4 py-3 text-ink-muted">{member.branch || "-"}</td>
                            <td className="px-4 py-3 text-ink-muted">{member.year ?? "-"}</td>
                            <td className="px-4 py-3 text-ink-muted">{formatDateTime(member.joinedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminEventTeamsModal;
