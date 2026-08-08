import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Shapes,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/ui/PageTransition";
import SectionReveal from "../components/ui/SectionReveal";
import ResourceCard from "../components/ResourceCard";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { apiRequest } from "../lib/api";
import { blogPosts } from "../lib/resourcesData";
import {
  getEnrolledResourceCategories,
  studentResourceSearch,
  studentResourceState,
} from "../lib/studentResources";

const domainCardStyles = [
  {
    card: "border-technical/25 hover:border-technical/50",
    icon: "border-technical/25 bg-technical/10 text-technical-text",
    glow: "bg-technical/20",
  },
  {
    card: "border-creative/25 hover:border-creative/50",
    icon: "border-creative/25 bg-creative/10 text-creative-text",
    glow: "bg-creative/20",
  },
  {
    card: "border-dream/25 hover:border-dream/50",
    icon: "border-dream/25 bg-dream/10 text-dream-text",
    glow: "bg-dream/20",
  },
] as const;

type DomainCommunity = {
  domain: "Web Development" | "DSA" | "Aptitude";
  joinUrl: string;
};

type DomainGroupsResponse = {
  success: boolean;
  groups: DomainCommunity[];
};

const domainCommunityDescriptions: Record<DomainCommunity["domain"], string> = {
  "Web Development":
    "Connect with the Web Development community for updates, discussions and learning resources.",
  DSA: "Connect with the DSA community for updates, discussions and learning resources.",
  Aptitude:
    "Connect with the Aptitude community for updates, discussions and learning resources.",
};

const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 32 32"
    role="img"
    aria-label="WhatsApp"
    fill="none"
  >
    <path
      fill="currentColor"
      d="M16.04 4C9.41 4 4.02 9.35 4.02 15.93c0 2.1.56 4.16 1.61 5.96L4 28l6.31-1.61A12.1 12.1 0 0 0 16.04 28C22.67 28 28 22.65 28 16.07 28 9.49 22.67 4 16.04 4Zm0 21.88c-1.84 0-3.64-.49-5.21-1.42l-.37-.22-3.74.95.99-3.62-.24-.38a9.72 9.72 0 0 1-1.49-5.26c0-5.4 4.51-9.79 10.06-9.79 5.53 0 10.01 4.45 10.01 9.93 0 5.41-4.49 9.81-10.01 9.81Zm5.51-7.35c-.3-.15-1.79-.87-2.07-.97-.28-.1-.48-.15-.68.15-.2.29-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.46-2.42-1.47-.89-.79-1.5-1.77-1.67-2.07-.17-.29-.02-.45.13-.6.13-.13.3-.35.45-.52.15-.17.2-.29.3-.49.1-.2.05-.37-.03-.52-.08-.15-.68-1.62-.93-2.22-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.07-.8.37-.28.29-1.05 1.02-1.05 2.48 0 1.47 1.08 2.88 1.23 3.08.15.2 2.12 3.2 5.14 4.49.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.79-.72 2.04-1.42.25-.69.25-1.29.18-1.42-.08-.12-.28-.2-.58-.34Z"
    />
  </svg>
);

const StudentDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [domainGroups, setDomainGroups] = useState<DomainCommunity[]>([]);
  const [isLoadingDomainGroups, setIsLoadingDomainGroups] = useState(true);
  const [domainGroupsError, setDomainGroupsError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDomainGroups = async () => {
      try {
        setIsLoadingDomainGroups(true);
        setDomainGroupsError("");
        const data = await apiRequest<DomainGroupsResponse>(
          "/api/student/domain-groups"
        );

        if (isMounted) {
          setDomainGroups(data.groups);
        }
      } catch {
        if (isMounted) {
          setDomainGroups([]);
          setDomainGroupsError(
            "Domain communities could not be loaded right now."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingDomainGroups(false);
        }
      }
    };

    void loadDomainGroups();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!user) return null;

  const enrolledCategories = getEnrolledResourceCategories(user);
  const recommendedResources = blogPosts
    .filter((resource) => enrolledCategories.has(resource.category))
    .slice(0, 3);

  return (
    <PageTransition>
      <main
        className="relative isolate min-h-screen overflow-x-hidden bg-transparent text-ink"
        data-color-scheme={isDark ? "dark" : "light"}
      >
        <div className="site-container-wide pb-section pt-24 sm:pt-28 lg:pt-32">
          <div className="min-w-0 space-y-10 lg:space-y-12">
            <SectionReveal variant="fade">
              <header
                id="student-dashboard-top"
                className="ui-panel-glass scroll-mt-28 overflow-hidden"
                aria-labelledby="dashboard-heading"
              >
                <div className="relative overflow-hidden p-5 sm:p-7 lg:p-8">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-dream/10"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-24 left-10 size-52 rounded-full bg-technical/5"
                  />

                  <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.72fr)] lg:items-center">
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-2 rounded-full border border-dream/30 bg-dream/10 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-dream-text">
                        <GraduationCap className="size-4" aria-hidden="true" />
                        Student dashboard
                      </span>
                      <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-rose-text">
                        Welcome back,
                      </p>
                      <h1
                        id="dashboard-heading"
                        className="mt-2 break-words font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl"
                      >
                        {user.name}
                      </h1>
                      <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">
                        Your learning hub for club events, tasks, resources, and domains.
                      </p>
                    </div>

                    <aside
                      className="rounded-card border border-line/80 bg-surface/90 p-5 shadow-soft sm:p-6"
                      aria-label="Student profile summary"
                    >
                      <div className="flex items-center gap-3 border-b border-line/80 pb-4">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-control border border-primary/25 bg-primary/10 text-primary-text">
                          <UserRound className="size-5" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="font-display text-lg font-semibold text-ink">Profile summary</p>
                          <p className="text-xs text-ink-subtle">Student details</p>
                        </div>
                      </div>

                      <dl className="mt-4 space-y-4">
                        <div>
                          <dt className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                            Name
                          </dt>
                          <dd className="mt-1 break-words text-sm font-semibold text-ink">{user.name}</dd>
                        </div>
                        <div>
                          <dt className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                            USN
                          </dt>
                          <dd className="mt-1 break-words text-sm font-semibold text-ink">{user.usn}</dd>
                        </div>
                        <div>
                          <dt className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                            Enrolled domains
                          </dt>
                          <dd className="mt-2 flex flex-wrap gap-2">
                            {user.enrolledDomains.map((domain) => (
                              <span
                                key={domain}
                                className="rounded-full border border-dream/30 bg-dream/10 px-3 py-1.5 text-xs font-semibold text-dream-text"
                              >
                                {domain}
                              </span>
                            ))}
                          </dd>
                        </div>
                      </dl>
                    </aside>
                  </div>
                </div>
              </header>
            </SectionReveal>

            <SectionReveal delay={0.05}>
              <section
                id="student-domain-communities"
                aria-labelledby="domain-communities-heading"
                className="ui-panel-glass scroll-mt-28 p-5 sm:p-6 lg:p-8"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-technical-text">
                      Stay connected
                    </p>
                    <h2
                      id="domain-communities-heading"
                      className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl"
                    >
                      Your Domain Communities
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                      Join the official discussion spaces for the domains linked to your account.
                    </p>
                  </div>
                </div>

                {isLoadingDomainGroups ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[0, 1, 2].map((item) => (
                      <div
                        key={item}
                        className="ui-card-glass min-h-48 animate-pulse border-technical/15 p-5 motion-reduce:animate-none"
                        aria-hidden="true"
                      >
                        <div className="size-11 rounded-control bg-surface-muted" />
                        <div className="mt-5 h-5 w-2/3 rounded-full bg-surface-muted" />
                        <div className="mt-4 space-y-2">
                          <div className="h-3 rounded-full bg-surface-muted" />
                          <div className="h-3 w-5/6 rounded-full bg-surface-muted" />
                        </div>
                        <div className="mt-5 h-11 w-32 rounded-full bg-surface-muted" />
                      </div>
                    ))}
                  </div>
                ) : domainGroupsError ? (
                  <div className="mt-6 flex items-start gap-3 rounded-card border border-rose/25 bg-rose/10 p-5 text-sm text-ink-muted">
                    <ExternalLink
                      className="mt-0.5 size-5 shrink-0 text-rose-text"
                      aria-hidden="true"
                    />
                    <p>{domainGroupsError}</p>
                  </div>
                ) : domainGroups.length > 0 ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {domainGroups.map((group, index) => {
                      const accent = domainCardStyles[index % domainCardStyles.length];

                      return (
                        <article
                          key={group.domain}
                          className={`ui-card-glass group relative flex min-h-56 flex-col overflow-hidden p-5 transition duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-glow motion-reduce:transform-none motion-reduce:transition-none ${accent.card}`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none absolute -right-10 -top-12 size-28 rounded-full opacity-30 ${accent.glow}`}
                          />
                          <div className="relative flex items-start gap-4">
                            <span
                              className={`flex size-11 shrink-0 items-center justify-center rounded-control border ${accent.icon}`}
                            >
                              <WhatsAppIcon className="size-5" />
                            </span>
                            <div className="min-w-0">
                              <p className="font-display text-lg font-semibold text-ink">
                                {group.domain} Community
                              </p>
                              <p className="mt-2 text-sm leading-6 text-ink-muted">
                                {domainCommunityDescriptions[group.domain]}
                              </p>
                            </div>
                          </div>
                          <a
                            href={group.joinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary relative mt-5 w-full justify-center sm:w-fit"
                          >
                            Join Now
                            <ExternalLink className="size-4" aria-hidden="true" />
                          </a>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-6 flex items-start gap-3 rounded-card border border-line/80 bg-surface/75 p-5 text-sm text-ink-muted">
                    <WhatsAppIcon className="mt-0.5 size-5 shrink-0 text-technical-text" />
                    <p>No domain communities are available for your account yet.</p>
                  </div>
                )}
              </section>
            </SectionReveal>

            <SectionReveal delay={0.04}>
              <section
                id="student-events-tasks"
                aria-labelledby="activities-heading"
                className="scroll-mt-28"
              >
                <div className="mb-5">
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-rose-text">
                    Stay on track
                  </p>
                  <h2 id="activities-heading" className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
                    Events &amp; tasks
                  </h2>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <article className="ui-card-glass flex min-h-64 flex-col border-primary/25 p-5 sm:p-6">
                    <div className="flex size-11 items-center justify-center rounded-control border border-primary/25 bg-primary/10 text-primary-text">
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

                  <article className="ui-card-glass flex min-h-64 flex-col border-technical/25 p-5 sm:p-6">
                    <div className="flex size-11 items-center justify-center rounded-control border border-technical/25 bg-technical/10 text-technical-text">
                      <CheckCircle2 className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold text-ink">My tasks</h3>
                    <p className="mt-2 text-sm font-semibold text-ink">No tasks assigned yet.</p>
                    <p className="mt-2 flex-1 text-sm leading-6 text-ink-muted">
                      Assigned club tasks will appear here when they become available.
                    </p>
                    <span className="mt-5 inline-flex min-h-11 w-fit items-center rounded-full border border-line bg-surface-muted/80 px-4 text-sm font-medium text-ink-muted">
                      You&apos;re all caught up
                    </span>
                  </article>
                </div>
              </section>
            </SectionReveal>

            <SectionReveal delay={0.06}>
              <section
                id="student-resources"
                aria-labelledby="resources-heading"
                className="ui-panel-glass scroll-mt-28 p-5 sm:p-6 lg:p-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-creative-text">
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
                    className="btn btn-secondary w-full shrink-0 sm:w-fit"
                  >
                    Browse all resources
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </Link>
                </div>

                {recommendedResources.length > 0 ? (
                  <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {recommendedResources.map((resource, index) => (
                      <ResourceCard
                        key={resource.id}
                        post={resource}
                        isDark={isDark}
                        index={index}
                        headingLevel="h3"
                        detailSearch={studentResourceSearch}
                        detailState={studentResourceState}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 flex items-start gap-3 rounded-card border border-line/80 bg-surface/75 p-5 text-sm text-ink-muted">
                    <BookOpen className="mt-0.5 size-5 shrink-0 text-creative-text" aria-hidden="true" />
                    <p>Explore the learning library to find resources across club domains.</p>
                  </div>
                )}
              </section>
            </SectionReveal>

            <SectionReveal delay={0.08}>
              <section id="student-domains" aria-labelledby="domains-heading" className="scroll-mt-28">
                <div className="mb-5">
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-dream-text">
                    Your learning tracks
                  </p>
                  <h2 id="domains-heading" className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
                    My domains
                  </h2>
                </div>

                {user.enrolledDomains.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {user.enrolledDomains.map((domain, index) => {
                      const accent = domainCardStyles[index % domainCardStyles.length];

                      return (
                        <Link
                          key={domain}
                          to={`/domains${studentResourceSearch}`}
                          state={studentResourceState}
                          className={`ui-card-glass group relative flex min-h-32 items-center gap-4 overflow-hidden p-5 transition duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-glow motion-reduce:transform-none motion-reduce:transition-none ${accent.card}`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none absolute -right-10 -top-12 size-28 rounded-full opacity-30 ${accent.glow}`}
                          />
                          <span className={`relative flex size-11 shrink-0 items-center justify-center rounded-control border ${accent.icon}`}>
                            <Shapes className="size-5" aria-hidden="true" />
                          </span>
                          <span className="relative min-w-0 flex-1">
                            <span className="block break-words font-display text-lg font-semibold text-ink">{domain}</span>
                            <span className="mt-1 block text-sm text-ink-muted">View learning resources</span>
                          </span>
                          <ArrowRight className="relative size-4 shrink-0 text-primary-text transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" />
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="ui-card-glass flex items-start gap-3 p-5 text-sm text-ink-muted">
                    <BookOpen className="mt-0.5 size-5 shrink-0 text-technical-text" aria-hidden="true" />
                    <p>No enrolled domains are available for this account.</p>
                  </div>
                )}
              </section>
            </SectionReveal>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default StudentDashboard;
