import React, { useEffect, useState } from "react";
import { Trophy, Crown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import * as XLSX from "xlsx";

const Leaderboard = () => {
  const { isDark } = useTheme();

  const [data, setData] = useState<{ Name: string; Score: number; Time: string }[]>([]);
  // File name here------------------------------------------------------------------------------------------------------
  const filename = "";

  function getTimeUntilNextSaturday() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7; // always at least 1 day
  const nextSaturday = new Date(now);
  nextSaturday.setDate(now.getDate() + daysUntilSaturday);
  nextSaturday.setHours(0, 0, 0, 0);
  const msLeft = nextSaturday.getTime() - now.getTime();
  const days    = Math.floor(msLeft / (1000*60*60*24));
  const hours   = Math.floor((msLeft / (1000*60*60)) % 24);
  const minutes = Math.floor((msLeft / (1000*60)) % 60);
  const seconds = Math.floor((msLeft / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const [countdown, setCountdown] = useState(getTimeUntilNextSaturday());

useEffect(() => {
  const interval = setInterval(() => {
    setCountdown(getTimeUntilNextSaturday());
  }, 1000);
  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const fetchExcel = async () => {
      try {
        const response = await fetch(`/${filename}`);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        const filtered = jsonData
          .map((row) => ({
            Name: row["Name"] || "",
            Score: Number(row["Total Score 500.0"]) || 0,
            Time: row["Time Taken"] || "",
          }))
          .sort((a, b) => b.Score - a.Score);
        setData(filtered);
      } catch (err) {
        console.error("Error loading Excel file:", err);
      }
    };
    fetchExcel();
  }, []);

  const crownColors = [
    "#FFD700", // gold
    "#C0C0C0", // silver
    "#CD7F32", // bronze
  ];

  return (
    <div
      className={`min-h-screen pt-7 pb-10 px-4 sm:px-8 lg:px-12 transition-colors duration-700 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-black to-gray-800"
          : "bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200"
      }`}
    >
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className={`${
            isDark
              ? "bg-gradient-to-tr from-indigo-800 via-purple-900 to-blue-900 opacity-60"
              : "bg-gradient-to-tr from-blue-400 via-indigo-500 to-purple-500 opacity-40"
          } absolute top-0 left-0 w-full h-full blur-3xl`}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 px-2 sm:px-6 md:px-12">
          <div
            className={`inline-flex items-center space-x-3 backdrop-blur-xl border border-transparent rounded-full px-6 py-4 mt-4 shadow-lg ${
              isDark ? "bg-indigo-900/60 text-indigo-300" : "bg-indigo-200/90 text-indigo-900"
            }`}
          >
            <Trophy className="w-7 h-7 text-yellow-400 drop-shadow-xl" />
            <span className="font-semibold text-xl tracking-wide select-none">
              DSA Weekly Contest Leaderboard - This Week
            </span>
          </div>
          <h1
            className={`mt-2 text-5xl sm:text-6xl font-extrabold leading-tight ${
              isDark ? "text-white" : "text-indigo-900"
            }`}
          >
            <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h1>
        </div>

        {/* Table Container */}
        <div
          className={`shadow-xl rounded-3xl bg-white dark:bg-gray-900 border ${
            isDark ? "border-gray-600" : "border-gray-300"
          } overflow-x-auto max-w-full`}
          role="region"
          aria-label="Weekly contest leaderboard"
        >
          <table className="min-w-full border-collapse border-spacing-0">
            <thead
              className={`${
                isDark ? "bg-indigo-900" : "bg-indigo-200"
              } z-10`}
            >
              <tr>
                {["Name", "Total Score", "Time Taken"].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className={`px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold text-sm sm:text-lg border-b ${
                      isDark ? "border-indigo-700 text-indigo-300" : "border-indigo-300 text-indigo-700"
                    } select-none`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
  colSpan={3}
  className="py-6 sm:py-12 text-center text-sm sm:text-xl text-indigo-600 dark:text-indigo-400 select-none"
>
  Weekly Contest yet to be conducted.
  <div className="mt-2 text-base text-indigo-400 dark:text-indigo-300 font-mono font-semibold">
    Next contest in{" "}
    <span className="font-bold">
      {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
    </span>
  </div>
</td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-transform transform hover:scale-[1.02] cursor-pointer rounded-lg shadow-sm select-none ${
                      isDark
                        ? idx % 2 === 0
                          ? "bg-indigo-900"
                          : "bg-indigo-800"
                        : idx % 2 === 0
                        ? "bg-indigo-50"
                        : "bg-indigo-100"
                    }`}
                  >
                    <td className="px-2 sm:px-6 py-2 sm:py-4 font-semibold text-sm sm:text-lg text-indigo-400 truncate max-w-xs flex items-center space-x-2 whitespace-nowrap">
                      <span
                        style={{
                          width: 20,
                          display: "inline-flex",
                          justifyContent: "center",
                          filter: "drop-shadow(0 0 4px rgba(255,255,255,0.7))",
                        }}
                      >
                        {idx < 3 && (
                          <Crown
                            size={18}
                            color={crownColors[idx]}
                            className="drop-shadow-lg"
                          />
                        )}
                      </span>
                      <span>{idx+1}. {row.Name}</span>
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 font-bold text-yellow-400 text-sm sm:text-lg whitespace-nowrap">
                      {row.Score}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 text-indigo-300 text-sm sm:text-lg whitespace-nowrap">
                      {row.Time}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
