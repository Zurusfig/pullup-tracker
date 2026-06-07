import { Home, Dumbbell, History, BarChart3, User } from 'lucide-react';

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'workout', label: 'Train', icon: Dumbbell },
  { id: 'history', label: 'History', icon: History },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-card border-t border-gray-200 dark:border-gray-700 pb-safe z-40">
      <div className="flex justify-around max-w-lg mx-auto">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex flex-col items-center gap-1 py-2 px-3 min-w-[48px] min-h-[48px] flex-1"
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.8 : 2}
                className={isActive ? 'text-brand-green' : 'text-gray-400'}
              />
              <span
                className={`text-xs font-bold ${
                  isActive ? 'text-brand-green' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
