import type { FC } from 'react';
import { weeks } from '../lib/resourcesData';

interface WeekFilterProps {
  activeWeek: number;
  onWeekChange: (week: number) => void;
  isDark: boolean;
}

const WeekFilter: FC<WeekFilterProps> = ({
  activeWeek,
  onWeekChange,
  isDark
}) => {
  const allWeeks = [0, ...weeks]; // 0 means all weeks

  return (
    <div
      className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
      data-color-scheme={isDark ? 'dark' : 'light'}
    >
      <div className="flex min-w-max gap-2" role="group" aria-label="Filter resources by week">
        {allWeeks.map((week) => {
          const isActive = activeWeek === week;
          return (
            <button
              key={week}
              type="button"
              onClick={() => onWeekChange(week)}
              aria-pressed={isActive}
              className={isActive
                ? 'btn btn-primary min-h-11 shrink-0 border-2 px-3 py-2 text-xs shadow-soft sm:px-4 sm:text-sm'
                : 'btn btn-secondary min-h-11 shrink-0 px-3 py-2 text-xs sm:px-4 sm:text-sm'
              }
            >
              {week === 0 ? 'All Weeks' : `Week ${week}`}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WeekFilter;
