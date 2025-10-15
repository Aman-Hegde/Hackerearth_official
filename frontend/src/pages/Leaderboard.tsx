//cumulative leaderboard

const getUniqueKey = (email: string | undefined, name: string): string => {
    //name as the unique key
    const normalizedName = String(name || "N/A").toLowerCase().trim();

    if (normalizedName && normalizedName !== 'n/a') {
        return `N_${normalizedName}`; 
    }
    // Fallback
    return `UNKNOWN_${Math.random()}`; 
};

"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Crown, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from "lucide-react";
import * as XLSX from "xlsx";
import { useTheme } from "../context/ThemeContext"; 
import Loader from "../components/Loader";

interface LeaderboardEntry {
  Name: string;
  Score: number; 
  TimeDisplay: string; 
  Email: string; 
  UniqueKey: string;
}

// Map to store all parsed data
interface ContestDataMap {
    [key: string]: LeaderboardEntry[]; 
}

// list of weekly contest files (in public folder)
const CONTEST_FILES: { viewKey: string; filename: string }[] = [
  { viewKey: "Week 1", filename: "weekly_contest_1_leaderboard.xlsx" },
  { viewKey: "Week 2", filename: "weekly_contest_2_leaderboard.xlsx" },
  { viewKey: "Week 3", filename: "weekly_contest_3_leaderboard.xlsx" },
];

const VIEW_OPTIONS = ["Cumulative", ...CONTEST_FILES.map(f => f.viewKey)];
const DEFAULT_VIEW = "Cumulative";


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

  const getUniqueKey = (email: string | undefined, name: string): string => {
    const normalizedName = String(name || "N/A").toLowerCase().trim();

    if (normalizedName && normalizedName !== 'n/a') {
        return `N_${normalizedName}`; 
    }
    return `UNKNOWN_${Math.random()}`; 
  };
  
  const formatTimeForDisplay = (timeValue: any): string => {
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


  const processAllData = useCallback(async () => {
    const contestMap: ContestDataMap = {};
    const masterCumulativeData: { [key: string]: LeaderboardEntry } = {};
    
    for (const contest of CONTEST_FILES) {
        const { viewKey, filename } = contest;
        
        try {
            const response = await fetch(`/${filename}`);
            if (!response.ok) {
                contestMap[viewKey] = [];
                continue;
            }

            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

            const individualWeekData: LeaderboardEntry[] = [];

            jsonData.forEach((row) => {
                const email = String(row["Email"] || "").trim();
                const name = String(row["Name"] || "N/A").trim();
                const score = Number(row["Total Score 500.0"]) || 0;
                const timeDisplay = formatTimeForDisplay(row["Time Taken"]);
                
                const uniqueKey = getUniqueKey(email, name);

                if (uniqueKey.startsWith('UNKNOWN')) return;

                const entry: LeaderboardEntry = {
                    Name: name,
                    Email: email,
                    Score: score, 
                    TimeDisplay: timeDisplay,
                    UniqueKey: uniqueKey,
                };
                individualWeekData.push(entry);
                
                if (!masterCumulativeData[uniqueKey]) {
                    masterCumulativeData[uniqueKey] = {
                        Name: name,
                        Email: email,
                        Score: score, 
                        TimeDisplay: "", 
                        UniqueKey: uniqueKey,
                    };
                } else {
                    masterCumulativeData[uniqueKey].Score += score;
                    
                    if (name && masterCumulativeData[uniqueKey].Name === 'N/A') {
                        masterCumulativeData[uniqueKey].Name = name;
                    }
                    if (email && !masterCumulativeData[uniqueKey].Email) {
                        masterCumulativeData[uniqueKey].Email = email;
                    }
                }
            });

            contestMap[viewKey] = individualWeekData;

        } catch (error) {
            console.error(`Error processing file ${filename}:`, error);
        }
    }
    
    // Store the final cumulative results
    contestMap[DEFAULT_VIEW] = Object.values(masterCumulativeData);

    return contestMap;
  }, []); 

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
            let finalComparison = sortConfig.direction === 'asc' ? comparison : -comparison;

            if (sortConfig.key === 'Score' && finalComparison === 0) {
                return a.Name.localeCompare(b.Name);
            }
            
            return finalComparison;
        });
    }

    return dataView;
  }, [currentData, searchQuery, sortConfig]);

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

  const crownColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
  
  const baseColumns: { key: keyof LeaderboardEntry; label: string; }[] = [
    { key: "Name", label: "Name" },
    { key: "Score", label: currentView === 'Cumulative' ? "Total Score" : "Score" }, 
  ];

  const columns = currentView !== 'Cumulative' 
    ? [...baseColumns, { key: "TimeDisplay" as keyof LeaderboardEntry, label: "Time Taken" }] 
    : baseColumns;

  if (loading) {
    return (
      <div className={`flex flex-col justify-center items-center min-h-screen ${isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900"}`}>
        <Loader size={80} />
        <p className="mt-4 text-lg font-medium">Loading Leaderboard Data from all contests...</p>
        </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-10 px-4 sm:px-8 transition-colors duration-500 ${isDark ? "bg-black text-gray-200" : "bg-gray-50 text-gray-800"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className={`text-4xl font-semibold tracking-tighter md:text-[54px] md:leading-[60px] pb-2 ${isDark ? "bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent" : "text-gray-900"}`}>{currentView} Leaderboard</h1>
        </div>

        <div className={`rounded-xl border p-4 sm:p-6 shadow-lg ${isDark ? "bg-black border-gray-700" : "bg-white border-gray-200"}`}>
          {fileMissing ? (
            <div className="text-center py-12 text-red-500">Could not load any leaderboard data. Please ensure files are correctly named and present in the /public folder.</div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">View:</label>
                    <select
                        value={currentView}
                        onChange={handleViewChange}
                        className={`p-2 border rounded-md font-semibold transition ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`}
                    >
                        {VIEW_OPTIONS.map(view => (
                            <option key={view} value={view}>{view}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {searchQuery && (
                        <div className="flex items-center gap-2 text-sm mr-auto">
                            <span className="text-gray-400">Searching:</span>
                            <span className="font-semibold px-2 py-1 rounded-md bg-blue-500/10 text-blue-400">{searchQuery}</span>
                            <button onClick={clearSearch} className="p-1 rounded-full hover:bg-red-500/10 text-red-400"><X size={16}/></button>
                        </div>
                    )}
                    <button
                      onClick={() => setIsSearchModalOpen(true)}
                      className={`flex items-center justify-center px-4 py-2 border rounded-md font-semibold transition ${isDark ? "bg-gray-800 border-gray-600 hover:bg-gray-700" : "bg-white border-gray-300 hover:bg-gray-100"}`}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      <span>Search</span>
                    </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className={`${isDark ? "border-b border-gray-700" : "border-b border-gray-200"}`}>
                      <th className="p-4 font-semibold">Rank</th>
                      {columns.map((col) => (
                        <th 
                          key={col.key} 
                          className="p-4 font-semibold cursor-pointer select-none" 
                          onClick={() => handleSort(col.key)}
                        >
                          <div className="flex items-center gap-2">
                            {col.label}
                            {sortConfig?.key === col.key && (sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, index) => {
                        const rank = (currentPage - 1) * pageSize + index + 1;
                        return (
                        <tr key={row.UniqueKey + row.Score} className={`transition ${isDark ? "hover:bg-gray-900" : "hover:bg-gray-100"}`}>
                          <td className="p-4">
                            <div className="flex items-center gap-3 font-medium">
                              <span className="w-6 text-center text-gray-500">{rank}</span>
                              {rank <= 3 && <Crown size={18} color={crownColors[rank - 1]} />}
                            </div>
                          </td>
                          <td className="p-4">{row.Name}</td>
                          <td className="p-4 font-semibold text-yellow-500">{Math.round(row.Score)}</td>
                          {currentView !== 'Cumulative' && (
                            <td className="p-4 text-gray-400">{row.TimeDisplay}</td>
                          )}
                        </tr>
                    )})}
                    {paginatedData.length === 0 && (
                         <tr className={`${isDark ? "text-gray-500" : "text-gray-400"}`}>
                            <td colSpan={columns.length + 1} className="p-8 text-center">
                                No results found for "{searchQuery}" in {currentView}.
                            </td>
                         </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="flex items-center justify-between pt-4 flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span>Rows per page:</span>
                  <select
                    value={pageSize}
                    onChange={e => setPageSize(Number(e.target.value))}
                    className={`p-1 border rounded-md ${isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}`}
                  >
                    {[10, 20, 50].map(size => <option key={size} value={size}>{size}</option>)}
                  </select>
                </div>
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-2 border rounded-md disabled:opacity-50"><ChevronsLeft className="h-4 w-4" /></button>
                  <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="p-2 border rounded-md disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
                  <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="p-2 border rounded-md disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
                  <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-2 border rounded-md disabled:opacity-50"><ChevronsRight className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-xl w-full max-w-sm ${isDark ? "bg-gray-900 border border-gray-700" : "bg-white"}`}>
            <div>
                <button onClick={() => setIsSearchModalOpen(false)} className="p-1 mb-4 rounded-full hover:bg-gray-500/10 float-right"><X/></button>
                <h3 className="text-xl font-semibold mb-4">Search Leaderboard</h3>
            </div>
            <div className="space-y-4">
                <input
                    type="text"
                    value={modalSearchValue}
                    onChange={(e) => setModalSearchValue(e.target.value)}
                    placeholder="Enter Name to search..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                    }}
                    className={`p-3 w-full border rounded-md transition focus:ring-blue-500 focus:border-blue-500 ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
                />
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={clearSearch} className="px-4 py-2 rounded-md font-semibold hover:bg-gray-500/10">Clear Search</button>
              <button onClick={handleSearch} className="px-4 py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700">Search</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;