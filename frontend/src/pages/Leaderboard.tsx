//cumulative leaderboard
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Crown, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from "lucide-react";
import * as XLSX from "xlsx";
import { useTheme } from "../context/ThemeContext";
import Loader from "../components/Loader";

// --- Type Definitions ---
interface LeaderboardEntry {
  Name: string;
  Score: number;
  TimeDisplay: string;
  Email: string;
  UniqueKey: string;
}

interface ContestDataMap {
  [key: string]: LeaderboardEntry[];
}

// --- Configuration ---
const CONTEST_FILES: { viewKey: string; filename: string }[] = [
  { viewKey: "Week 1", filename: "weekly_contest_1_leaderboard.xlsx" },
  { viewKey: "Week 2", filename: "weekly_contest_2_leaderboard_v2.xlsx" },
  { viewKey: "Week 3", filename: "weekly_contest_3_leaderboard.xlsx" },
  { viewKey: "Week 4", filename: "weekly_contest_4_leaderboard.xlsx" },
  { viewKey: "Week 5", filename: "weekly_contest_5_leaderboard.xlsx" },
  { viewKey: "Week 6", filename: "weekly_contest_6_leaderboard.xlsx" },
  { viewKey: "Week 7", filename: "weekly_contest_7_leaderboard.xlsx" },
  { viewKey: "Week 8", filename: "weekly_contest_8_leaderboard.xlsx" },
  { viewKey: "Week 9", filename: "weekly_contest_9_leaderboard.xlsx" },
  { viewKey: "Week 10", filename: "weekly_contest_10_leaderboard.xlsx" },
  { viewKey: "Week 11", filename: "weekly_contest_11_leaderboard_v2.xlsx" },
  { viewKey: "Week 12", filename: "weekly_contest_12_leaderboard.xlsx" },
];

const VIEW_OPTIONS = ["Cumulative", ...CONTEST_FILES.map(f => f.viewKey)];
const DEFAULT_VIEW = "Cumulative";
const NAME_HEADER_KEY = "Name";
const SCORE_HEADER_KEY = "Total Score 500.0";

// --- Helper Functions ---
const getUniqueKey = (email: string | undefined, name: string): string => {
  const normalizedEmail = String(email || "").toLowerCase().trim();

  if (normalizedEmail) {
    return `E_${normalizedEmail}`;
  }

  // fallback ONLY if email is missing
  const normalizedName = String(name || "N/A").toLowerCase().trim();
  return `N_${normalizedName}`;
};

const formatTimeForDisplay = (timeValue: unknown): string => {
  if (typeof timeValue === "number") {
    const totalSeconds = Math.round(timeValue * 24 * 3600);
    const absSeconds = Math.max(0, totalSeconds);
    const hh = String(Math.floor(absSeconds / 3600)).padStart(2, "0");
    const mm = String(Math.floor((absSeconds % 3600) / 60)).padStart(2, "0");
    const ss = String(absSeconds % 60).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }
  return typeof timeValue === 'string' && timeValue.includes(':') ? timeValue : "00:00:00";
};


const Leaderboard = () => {
  const { isDark } = useTheme();

  const [allContestData, setAllContestData] = useState<ContestDataMap>({});
  const [fileMissing, setFileMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState(DEFAULT_VIEW);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof LeaderboardEntry; direction: "asc" | "desc" } | null>({ key: "Score", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [modalSearchValue, setModalSearchValue] = useState("");

  const processAllData = useCallback(async () => {
    const contestMap: ContestDataMap = {};
    const masterCumulativeData: { [key: string]: LeaderboardEntry } = {};

    for (const contest of CONTEST_FILES) {
      const { viewKey, filename } = contest;
      try {
        const response = await fetch(`/${filename}`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          contestMap[viewKey] = [];
          continue;
        }
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: "" });

        const individualWeekData: LeaderboardEntry[] = [];

        jsonData.forEach((row) => {
          const rawName = row[NAME_HEADER_KEY];
          const name = String(rawName || "").trim();

          const email = String(row["Email"] || "").trim();
          const score = Number(row[SCORE_HEADER_KEY]) || 0;
          const timeDisplay = formatTimeForDisplay(row["Time Taken"]);

          const uniqueKey = getUniqueKey(email,name);

          if (uniqueKey.startsWith('UNKNOWN')) return;

          const entry: LeaderboardEntry = {
            Name: name,
            Email: email,
            Score: score,
            TimeDisplay: timeDisplay,
            UniqueKey: uniqueKey,
          };
          individualWeekData.push(entry);

          // Cumulative Logic
          if (!masterCumulativeData[uniqueKey]) {
            masterCumulativeData[uniqueKey] = {
              Name: name,
              Email: email,
              Score: score,
              TimeDisplay: "",
              UniqueKey: uniqueKey,
            };
          } else {
            // accumulate score
            masterCumulativeData[uniqueKey].Score += score;

            // choose the best name
            const existingName = masterCumulativeData[uniqueKey].Name.trim();
            const newName = name.trim();

            if (newName && (newName.length > existingName.length)) {
              masterCumulativeData[uniqueKey].Name = newName;
            }
          }

        });

        contestMap[viewKey] = individualWeekData;

      } catch (error) {
        console.error(`Error processing file ${filename}:`, error);
      }
    }

    contestMap[DEFAULT_VIEW] = Object.values(masterCumulativeData);

    return contestMap;
  }, []);

  // --- Effects and Memoization ---

  useEffect(() => {
    setLoading(true);
    processAllData().then((contestMap) => {
      setAllContestData(contestMap);
      const hasData = (contestMap[DEFAULT_VIEW]?.length || 0) > 0;
      setFileMissing(!hasData);
      setLoading(false);
    });
  }, [processAllData]);

  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery("");
    setModalSearchValue("");
  }, [currentView]);


  const currentData = useMemo(() => {
    return allContestData[currentView] || [];
  }, [allContestData, currentView]);


  const processedData = useMemo(() => {
    let dataView = [...currentData];

    // Search Filter
    if (searchQuery) {
      dataView = dataView.filter(row =>
        String(row.Name).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    if (sortConfig) {
      dataView.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        let comparison = 0;

        if (sortConfig.key === 'Score') {
          comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else if (sortConfig.key === 'Name') {
          comparison = String(aValue).localeCompare(String(bValue));
        } else if (sortConfig.key === 'TimeDisplay') {
          comparison = String(aValue).localeCompare(String(bValue));
        }

        const finalComparison = sortConfig.direction === 'asc' ? comparison : -comparison;

        // Tie-breakers
        if (sortConfig.key === 'Score' && finalComparison === 0) {
          // For weekly contests, use TimeDisplay as tie-breaker
          if (currentView !== 'Cumulative') {
            const timeA = a.TimeDisplay.split(':').reduce((acc, v) => acc * 60 + Number(v), 0);
            const timeB = b.TimeDisplay.split(':').reduce((acc, v) => acc * 60 + Number(v), 0);
            if (timeA !== timeB) {
              return timeA - timeB; // Lower time = better rank
            }
          }
          // Final fallback: Name alphabetical order
          return a.Name.localeCompare(b.Name);
        }

        return finalComparison;
      });
    }


    return dataView;
  }, [currentData, currentView, searchQuery, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  // --- Event Handlers ---
  const handleSort = (key: keyof LeaderboardEntry) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (key === 'Score') {
      direction = 'desc';
    }

    if (sortConfig?.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    setSortConfig({ key, direction });
  };

  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newView = event.target.value;
    setCurrentView(newView);
    setSortConfig({ key: "Score", direction: "desc" });
  };

  const handleSearch = () => {
    setSearchQuery(modalSearchValue);
    setIsSearchModalOpen(false);
  };

  const clearSearch = () => {
    setModalSearchValue("");
    setSearchQuery("");
    setIsSearchModalOpen(false);
  };

  // --- Render Configuration ---
  const crownColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

  const baseColumns: { key: keyof LeaderboardEntry; label: string; }[] = [
    { key: "Name", label: "Name" },
    { key: "Score", label: currentView === 'Cumulative' ? "Total Score" : "Score" },
  ];

  const columns = currentView !== 'Cumulative'
    ? [...baseColumns, { key: "TimeDisplay" as keyof LeaderboardEntry, label: "Time Taken" }]
    : baseColumns;

  // --- Render ---
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center text-ink transition-colors duration-500">
        <Loader size={80} />
        <p className="mt-4 text-lg font-medium">Loading Leaderboard Data from all contests...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-canvas text-ink transition-colors duration-500">
      <div className="site-container-wide section-space">
        <header className="mx-auto mb-10 max-w-4xl text-center sm:mb-12">
          <h1 className="section-heading">{currentView} Leaderboard</h1>
        </header>

        <section className="ui-card overflow-hidden" aria-label="Leaderboard controls and results">
          {fileMissing ? (
            <div className="m-4 rounded-control border border-red-500/20 bg-red-500/5 px-5 py-12 text-center text-red-600 dark:text-red-300 sm:m-6">
              Could not load any leaderboard data. Please ensure files are correctly named and present in the /public folder.
            </div>
          ) : (
            <div>
              <div className="grid gap-4 border-b border-line p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div className="min-w-0">
                  <label htmlFor="leaderboard-view" className="block text-sm font-semibold text-ink-muted">
                    View:
                  </label>
                  <select
                    id="leaderboard-view"
                    value={currentView}
                    onChange={handleViewChange}
                    className="mt-2 min-h-11 w-full rounded-control border border-line-strong bg-surface px-3 py-2 font-semibold text-ink transition-colors sm:max-w-xs"
                  >
                    {VIEW_OPTIONS.map(view => (
                      <option key={view} value={view}>{view}</option>
                    ))}
                  </select>
                </div>

                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
                  {searchQuery && (
                    <div className="flex min-w-0 items-center gap-2 rounded-control border border-line bg-surface-muted px-3 py-2 text-sm">
                      <span className="shrink-0 text-ink-subtle">Searching:</span>
                      <span className="min-w-0 break-all font-semibold text-brand-700 dark:text-brand-300">
                        {searchQuery}
                      </span>
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="btn btn-ghost btn-icon ml-auto size-8 shrink-0 text-ink-muted hover:text-red-600 focus-visible:outline-offset-2 dark:hover:text-red-300"
                        aria-label="Clear leaderboard search"
                        title="Clear search"
                      >
                        <X className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setModalSearchValue(searchQuery);
                      setIsSearchModalOpen(true);
                    }}
                    className="btn btn-secondary w-full shrink-0 sm:w-auto"
                  >
                    <Search className="size-4" aria-hidden="true" />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              <div
                className="max-h-[70vh] overflow-auto border-b border-line bg-surface"
                role="region"
                aria-label={currentView + " leaderboard table"}
                tabIndex={0}
              >
                <table
                  className={currentView !== 'Cumulative'
                    ? "w-full min-w-[44rem] border-separate border-spacing-0 text-left text-sm"
                    : "w-full min-w-[36rem] border-separate border-spacing-0 text-left text-sm"
                  }
                >
                  <caption className="sr-only">{currentView} Leaderboard</caption>
                  <thead>
                    <tr>
                      <th className="sticky left-0 top-0 z-30 w-20 min-w-20 border-b border-line bg-surface px-3 py-3 font-semibold text-ink">
                        Rank
                      </th>
                      {columns.map((col) => {
                        const isNameColumn = col.key === "Name";
                        return (
                          <th
                            key={col.key}
                            aria-sort={sortConfig?.key === col.key
                              ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending')
                              : 'none'
                            }
                            className={isNameColumn
                              ? "sticky left-20 top-0 z-30 min-w-48 border-b border-line bg-surface p-0 font-semibold text-ink"
                              : "sticky top-0 z-20 min-w-32 border-b border-line bg-surface p-0 font-semibold text-ink"
                            }
                          >
                            <button
                              type="button"
                              onClick={() => handleSort(col.key)}
                              className="flex min-h-11 w-full select-none items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-surface-muted focus-visible:outline-offset-[-3px]"
                              aria-label={"Sort by " + col.label}
                            >
                              <span>{col.label}</span>
                              {sortConfig?.key === col.key && (
                                sortConfig.direction === 'asc'
                                  ? <ChevronUp className="size-4" aria-hidden="true" />
                                  : <ChevronDown className="size-4" aria-hidden="true" />
                              )}
                            </button>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, index) => {
                      const rank = (currentPage - 1) * pageSize + index + 1;
                      return (
                        <tr key={row.UniqueKey + row.Score} className="group transition-colors hover:bg-surface-muted">
                          <td className="sticky left-0 z-10 w-20 min-w-20 border-b border-line bg-surface px-3 py-4 transition-colors group-hover:bg-surface-muted">
                            <div className="flex items-center gap-2 font-medium">
                              <span className="w-6 text-center tabular-nums text-ink-subtle">{rank}</span>
                              {rank <= 3 && (
                                <Crown size={18} color={crownColors[rank - 1]} aria-hidden="true" />
                              )}
                            </div>
                          </td>
                          <td className="sticky left-20 z-10 min-w-48 border-b border-line bg-surface px-4 py-4 font-medium text-ink transition-colors group-hover:bg-surface-muted">
                            {row.Name}
                          </td>
                          <td className="min-w-32 border-b border-line px-4 py-4 font-mono font-semibold tabular-nums text-signal-700 dark:text-signal-300">
                            {Math.round(row.Score)}
                          </td>
                          {currentView !== 'Cumulative' && (
                            <td className="min-w-36 border-b border-line px-4 py-4 font-mono tabular-nums text-ink-muted">
                              {row.TimeDisplay}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    {paginatedData.length === 0 && (
                      <tr className="text-ink-subtle">
                        <td colSpan={columns.length + 1} className="p-8 text-center">
                          No results found for "{searchQuery}" in {currentView}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid items-center gap-4 p-4 sm:p-6 md:grid-cols-[1fr_auto_1fr]">
                <div className="flex items-center gap-2 text-sm text-ink-muted">
                  <label htmlFor="leaderboard-page-size">Rows per page:</label>
                  <select
                    id="leaderboard-page-size"
                    value={pageSize}
                    onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                    className="min-h-10 rounded-control border border-line-strong bg-surface px-2 py-1 font-semibold text-ink"
                  >
                    {[10, 20, 50].map(size => <option key={size} value={size}>{size}</option>)}
                  </select>
                </div>

                <div className="text-sm font-medium tabular-nums text-ink-muted md:text-center">
                  Page {currentPage} of {totalPages}
                </div>

                <div className="flex items-center gap-2 md:justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="btn btn-secondary btn-icon size-10"
                    aria-label="First page"
                    title="First page"
                  >
                    <ChevronsLeft className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => p - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-secondary btn-icon size-10"
                    aria-label="Previous page"
                    title="Previous page"
                  >
                    <ChevronLeft className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-secondary btn-icon size-10"
                    aria-label="Next page"
                    title="Next page"
                  >
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="btn btn-secondary btn-icon size-10"
                    aria-label="Last page"
                    title="Last page"
                  >
                    <ChevronsRight className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {isSearchModalOpen && (
        <div
          className={isDark
            ? "fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4"
            : "fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          }
        >
          <div
            className="ui-card max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto p-5 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="leaderboard-search-title"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 id="leaderboard-search-title" className="font-display text-xl font-semibold text-ink">
                Search Leaderboard
              </h3>
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(false)}
                className="btn btn-ghost btn-icon size-9 shrink-0 text-ink-muted"
                aria-label="Close search dialog"
                title="Close"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6">
              <label htmlFor="leaderboard-search-input" className="sr-only">
                Enter Name to search...
              </label>
              <input
                id="leaderboard-search-input"
                type="text"
                value={modalSearchValue}
                onChange={(e) => setModalSearchValue(e.target.value)}
                placeholder="Enter Name to search..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                className="min-h-11 w-full rounded-control border border-line-strong bg-surface px-3 py-2 text-ink transition-colors placeholder:text-ink-subtle"
              />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 xs:flex-row xs:justify-end">
              <button type="button" onClick={clearSearch} className="btn btn-secondary w-full xs:w-auto">
                Clear Search
              </button>
              <button type="button" onClick={handleSearch} className="btn btn-primary w-full xs:w-auto">
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );

};

export default Leaderboard;