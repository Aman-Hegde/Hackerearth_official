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
      className="w-full"
      data-color-scheme={isDark ? 'dark' : 'light'}
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter resources by week">
        {allWeeks.map((week) => {
          const isActive = activeWeek === week;
          return (
            <button
              key={week}
              type="button"
              onClick={() => onWeekChange(week)}
              aria-pressed={isActive}
              className={isActive
                ? 'btn min-h-11 rounded-full border border-primary/50 bg-primary/10 px-3 py-2 text-xs text-primary-text shadow-glow sm:px-4 sm:text-sm'
                : 'btn min-h-11 rounded-full border border-line/80 bg-glass/70 px-3 py-2 text-xs text-ink-muted shadow-soft backdrop-blur-md hover:border-line-strong hover:bg-surface sm:px-4 sm:text-sm'
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
