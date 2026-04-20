import React from 'react';
import { WorkspaceSwitcher } from '../WorkspaceSwitcher';
import { DateTimeManager } from '../DateTimeManager';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-2 z-[100] pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto">
        <WorkspaceSwitcher />
      </div>

      <div className="flex items-center gap-4 pointer-events-auto">
        <DateTimeManager />
      </div>
    </header>
  );
};
