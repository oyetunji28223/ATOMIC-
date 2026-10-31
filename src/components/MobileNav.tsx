import React from 'react';
import { Compass, Target, FileText, CheckSquare, FolderGit2, UserCheck } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingApprovalsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  pendingApprovalsCount,
}) => {
  const tabs = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'match', label: '100-Pt', icon: Target },
    { id: 'studio', label: 'CV Studio', icon: FileText },
    { id: 'applications', label: 'Tracker', icon: CheckSquare, badge: pendingApprovalsCount },
    { id: 'portfolio', label: 'Projects', icon: FolderGit2 },
    { id: 'profile', label: 'Profile', icon: UserCheck },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1 whitespace-nowrap truncate max-w-[56px]">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
