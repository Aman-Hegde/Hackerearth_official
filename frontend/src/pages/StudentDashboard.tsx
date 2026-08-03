import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Shapes,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { blogPosts } from "../lib/resourcesData";
import {
  getEnrolledResourceCategories,
  studentResourceSearch,
  studentResourceState,
} from "../lib/studentResources";

const StudentDashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const enrolledCategories = getEnrolledResourceCategories(user);
  const recommendedResources = blogPosts
    .filter((resource) => enrolledCategories.has(resource.category))
    .slice(0, 3);

  return (
    <div className="min-h-screen overflow-x-clip bg-canvas pb-16 pt-24 text-ink sm:pt-28 lg:pt-32">
      <div className="site-container-wide">
          <div className="min-w-0 space-y-8">
            <section
              id="student-dashboard-top"
              aria-labelledby="dashboard-heading"
              className="scroll-mt-28 overflow-hidden rounded-card border border-line bg-surface shadow-soft"
            >
              <div className="border-b border-line bg-gradient-to-r from-primary/10 via-technical/5 to-transparent p-5 sm:p-7">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-technical-text">
                  Welcome back,
                </p>
                <h1
                  id="dashboard-heading"
                  className="mt-2 break-words font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
                >
                  {user.name}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-line-strong bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink-muted">
                    {user.usn}
                  </span>
                  {user.enrolledDomains.map((domain) => (
                    <span
                      key={domain}
                      className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary-text"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4 text-sm text-ink-muted sm:px-7">
                <GraduationCap className="size-5 shrink-0 text-technical-text" aria-hidden="true" />
                <p>Your learning hub for club events, tasks, resources, and domains.</p>
              </div>
            </section>

            <section
              id="student-events-tasks"
              aria-labelledby="activities-heading"
              className="scroll-mt-28"
            >
              <div className="mb-4">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-technical-text">
                  Stay on track
                </p>
                <h2 id="activities-heading" className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
                  Events &amp; tasks
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <article className="ui-card flex min-h-64 flex-col p-5 sm:p-6">
                  <div className="flex size-11 items-center justify-center rounded-control border border-primary/20 bg-primary/10 text-primary-text">
                    <CalendarDays className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-ink">Upcoming events</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-ink-muted">
                    There are no upcoming events published right now. Visit the events page for club highlights and updates.
                  </p>
                  <Link to="/events" className="btn btn-secondary mt-5 w-full justify-center sm:w-fit">
                    Explore events
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </article>

                <article className="ui-card flex min-h-64 flex-col p-5 sm:p-6">
                  <div className="flex size-11 items-center justify-center rounded-control border border-technical/25 bg-technical/10 text-technical-text">
                    <CheckCircle2 className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-ink">My tasks</h3>
                  <p className="mt-2 text-sm font-semibold text-ink">No tasks assigned yet.</p>
                  <p className="mt-2 flex-1 text-sm leading-6 text-ink-muted">
                    Assigned club tasks will appear here when they become available.
                  </p>
                  <span className="mt-5 inline-flex min-h-11 w-fit items-center rounded-control border border-line bg-surface-muted px-4 text-sm font-medium text-ink-muted">
                    You&apos;re all caught up
                  </span>
                </article>
              </div>
            </section>

            <section
              id="student-resources"
              aria-labelledby="resources-heading"
              className="scroll-mt-28 rounded-card border border-line bg-surface-muted p-5 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-technical-text">
                    Continue learning
                  </p>
                  <h2 id="resources-heading" className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
                    Resources
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                    A selection from the learning library for your enrolled domains.
                  </p>
                </div>
                <Link
                  to={`/domains${studentResourceSearch}`}
                  state={studentResourceState}
                  className="btn btn-secondary shrink-0"
                >
                  Browse all resources
                  <ExternalLink className="size-4" aria-hidden="true" />
                </Link>
              </div>

              {recommendedResources.length > 0 ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {recommendedResources.map((resource) => (
                    <article key={resource.id} className="flex min-w-0 flex-col rounded-card border border-line bg-surface p-5 shadow-soft">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-technical/25 bg-technical/10 px-3 py-1 text-xs font-semibold capitalize text-technical-text">
                          {resource.category}
                        </span>
                        <span className="text-xs font-medium capitalize text-ink-muted">{resource.type}</span>
                      </div>
                      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-ink">{resource.title}</h3>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-ink-muted">{resource.description}</p>
                      <Link
                        to={`/domains/${resource.slug}${studentResourceSearch}`}
                        state={studentResourceState}
                        className="btn btn-ghost mt-4 w-full justify-between px-3"
                      >
                        Open resource
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-card border border-line bg-surface p-5 text-sm text-ink-muted">
                  Explore the learning library to find resources across club domains.
                </div>
              )}
            </section>

            <section id="student-domains" aria-labelledby="domains-heading" className="scroll-mt-28">
              <div className="mb-4">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-technical-text">
                  Your learning tracks
                </p>
                <h2 id="domains-heading" className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
                  My domains
                </h2>
              </div>

              {user.enrolledDomains.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {user.enrolledDomains.map((domain) => (
                    <Link
                      key={domain}
                      to={`/domains${studentResourceSearch}`}
                      state={studentResourceState}
                      className="group flex min-h-32 items-center gap-4 rounded-card border border-line bg-surface p-5 shadow-soft transition-colors duration-200 hover:border-primary/45 hover:bg-surface-muted"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-control border border-primary/25 bg-primary/10 text-primary-text">
                        <Shapes className="size-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-lg font-semibold text-ink">{domain}</span>
                        <span className="mt-1 block text-sm text-ink-muted">View learning resources</span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-technical-text" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="ui-card flex items-start gap-3 p-5 text-sm text-ink-muted">
                  <BookOpen className="mt-0.5 size-5 shrink-0 text-technical-text" aria-hidden="true" />
                  <p>No enrolled domains are available for this account.</p>
                </div>
              )}
            </section>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
