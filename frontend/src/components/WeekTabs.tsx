import React from 'react';
import { weeks } from '../lib/resourcesData';

interface WeekFilterProps {
  activeWeek: number;
  onWeekChange: (week: number) => void;
  isDark: boolean;
}

const WeekFilter: React.FC<WeekFilterProps> = ({ 
  activeWeek, 
  onWeekChange, 
  isDark 
}) => {
  const allWeeks = [0, ...weeks]; // 0 means all weeks

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {allWeeks.map((week) => (
        <button
          key={week}
          onClick={() => onWeekChange(week)}
          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeWeek === week
              ? 'bg-blue-600 text-white shadow-lg'
              : `${
                  isDark 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`
          }`}
        >
          {week === 0 ? 'All Weeks' : `Week ${week}`}
        </button>
      ))}
    </div>
  );
};

export default WeekFilter;
