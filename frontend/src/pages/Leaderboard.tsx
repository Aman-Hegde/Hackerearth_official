"use client";

import { useEffect, useState, useMemo } from "react";
import { Trophy, Crown, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from "lucide-react";
import * as XLSX from "xlsx";
import { useTheme } from "../context/ThemeContext"; // Assuming you have this context for dark mode

// --- Type Definitions ---
interface LeaderboardEntry {
  id: number;
  Name: string;
  Score: number;
  Time: string;
  Email: string;
}

// --- The Leaderboard Component ---
const Leaderboard = () => {
  const { isDark } = useTheme();

  // --- State Management ---
  const [initialData, setInitialData] = useState<LeaderboardEntry[]>([]);
  const [fileMissing, setFileMissing] = useState(false);
  const [loading, setLoading] = useState(true);

  // State for Table Features
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof LeaderboardEntry; direction: "asc" | "desc" } | null>({ key: "Score", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // State for the Search Modal
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [modalSearchValue, setModalSearchValue] = useState("");

  const filename = "weekly_contest_1_leaderboard.xlsx"; // Ensure this file is in your /public folder

  // --- Data Fetching and Formatting ---
  useEffect(() => {
    const fetchExcelData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/${filename}`);
        if (!response.ok) {
          setFileMissing(true);
          throw new Error("Leaderboard file not found.");
        }
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const formattedData = jsonData.map((row, index) => ({
          id: index,
          Name: row["Name"] || "N/A",
          Email: row["Email"] || "",
          Score: Number(row["Total Score 500.0"]) || 0,
          Time: formatExcelTime(row["Time Taken"]),
        }));

        setInitialData(formattedData);
        setFileMissing(false);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        setInitialData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExcelData();
  }, [filename]);

  const formatExcelTime = (timeValue: any): string => {
    if (typeof timeValue === "number") {
      const totalSeconds = Math.round(timeValue * 24 * 3600);
      const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      const ss = String(totalSeconds % 60).padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    }
    return typeof timeValue === 'string' && timeValue.includes(':') ? timeValue : "00:00:00";
  };

  // --- Core Table Logic (Filtering, Sorting, Pagination) ---
  const processedData = useMemo(() => {
    let dataView = [...initialData];

    // 1. Search Filter
    if (searchQuery) {
      dataView = dataView.filter(row =>
        String(row.Name).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Sorting
    if (sortConfig) {
      dataView.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return dataView;
  }, [initialData, searchQuery, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  // --- Event Handlers ---
  const handleSort = (key: keyof LeaderboardEntry) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
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

  // --- Render ---
  const crownColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
  const columns: { key: keyof LeaderboardEntry; label: string; sortable: boolean }[] = [
    { key: "Name", label: "Name", sortable: true },
    { key: "Score", label: "Score", sortable: true },
    { key: "Time", label: "Time Taken", sortable: true },
  ];

  if (loading) {
    return <div className={`flex justify-center items-center min-h-screen ${isDark ? "bg-gray-900 text-white" : ""}`}>Loading Leaderboard...</div>;
  }

  return (
    <div className={`min-h-screen pt-24 pb-10 px-4 sm:px-8 transition-colors duration-500 ${isDark ? "bg-black text-gray-200" : "bg-gray-50 text-gray-800"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-black via-gray-500 to-brown-700 bg-clip-text text-transparent">
            Weekly Leaderboard
          </h1>
        </div>

        {/* Table Container */}
        <div className={`rounded-xl border p-4 sm:p-6 shadow-lg ${isDark ? "bg-black border-gray-700" : "bg-white border-gray-200"}`}>
          {fileMissing ? (
            <div className="text-center py-12 text-red-500">Could not find leaderboard data file.</div>
          ) : (
            <div className="space-y-4">
              {/* Search Control Area */}
              <div className="flex justify-end items-center">
                 {searchQuery && (
                  <div className="flex items-center gap-2 text-sm mr-auto">
                    <span className="text-gray-400">Searching for:</span>
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

              {/* The Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className={`${isDark ? "border-b border-gray-700" : "border-b border-gray-200"}`}>
                      {columns.map((col) => (
                        <th key={col.key} className="p-4 font-semibold cursor-pointer select-none" onClick={() => handleSort(col.key)}>
                          <div className="flex items-center gap-2">
                            {col.label}
                            {sortConfig?.key === col.key && (sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, index) => (
                      <tr key={row.id} className={`transition ${isDark ? "hover:bg-gray-900" : "hover:bg-gray-100"}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3 font-medium">
                            <span className="w-6 text-center text-gray-500">{(currentPage - 1) * pageSize + index + 1}</span>
                            {((currentPage - 1) * pageSize + index) < 3 && <Crown size={18} color={crownColors[(currentPage - 1) * pageSize + index]} />}
                            <span>{row.Name}</span>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-yellow-500">{row.Score}</td>
                        <td className="p-4 text-gray-400">{row.Time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
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
      
      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-xl w-full max-w-sm ${isDark ? "bg-gray-900 border border-gray-700" : "bg-white"}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Search by Name</h2>
              <button onClick={() => setIsSearchModalOpen(false)}><X/></button>
            </div>
            
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Enter a name..."
                    value={modalSearchValue}
                    onChange={(e) => setModalSearchValue(e.target.value)}
                    className={`p-2 w-full border rounded-md transition ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
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