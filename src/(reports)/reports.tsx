import React, { useState } from 'react';

interface ReportScreenProps {
  onNavigateTab?: (tab: 'overview' | 'employees' | 'reports') => void;
  onSelectParticipant?: (id: string) => void;
  adminName?: string;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  onNavigateTab,
  onSelectParticipant,
  adminName = 'Mandlakazi',
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState('Challenge A');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Built-in Mock Data matching the design screenshots
  const participants = [
    { rank: 1, id: 'p1', name: 'Jack Sparrow', points: '34,500 pts', team: 'Caribbean' },
    { rank: 2, id: 'p2', name: 'Will Turner', points: '31,000 pts', team: 'Flying Dutchman' },
    { rank: 3, id: 'p3', name: 'Elizabeth Swann', points: '29,200 pts', team: 'Royal Navy' },
  ];

  return (
    <div className="min-h-screen w-full bg-white font-mono p-4 sm:p-6 md:p-8 flex flex-col gap-8 antialiased select-none text-black">
      {/* 1. Global Header Navigation Pill Bar */}
      <header className="w-full bg-[#D9D9D9] rounded-full p-2.5 sm:p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center border border-black shadow-sm">
            <svg className="w-6 h-6 text-black" viewBox="0 0 100 100" fill="currentColor">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C56.63 85 62.84 83.16 68.12 79.98L58.5 65.5C55.93 67.09 52.93 68 50 68C40.06 68 32 59.94 32 50C32 40.06 40.06 32 50 32C59.94 32 68 40.06 68 50H85C85 30.67 69.33 15 50 15Z"
              />
            </svg>
          </div>

          <nav className="inline-flex items-center rounded-full border border-black bg-[#D9D9D9] p-1">
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('overview')}
              className="rounded-full px-4 sm:px-6 py-1.5 text-xs sm:text-sm font-medium text-black hover:opacity-75 transition-opacity"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('employees')}
              className="rounded-full px-4 sm:px-6 py-1.5 text-xs sm:text-sm font-medium text-black hover:opacity-75 transition-opacity"
            >
              Employees
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('reports')}
              className="rounded-full bg-white border border-black px-4 sm:px-6 py-1.5 text-xs sm:text-sm font-bold text-black shadow-sm"
            >
              Reports
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3 bg-white border border-black rounded-full px-4 py-1.5 shadow-sm">
          <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">
            {adminName.charAt(0)}
          </div>
          <span className="text-xs sm:text-sm font-bold text-black hidden sm:inline">
            {adminName}
          </span>
        </div>
      </header>

      {/* 2. Challenge Selector Dropdown */}
      <div className="flex items-center justify-between w-full">
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between gap-4 bg-[#D9D9D9] hover:bg-neutral-300 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold text-black border border-transparent hover:border-black transition-all cursor-pointer"
          >
            <span>{selectedChallenge}</span>
            <span className="text-xs">▾</span>
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-52 bg-white border border-black shadow-[4px_4px_0px_0px_#000000] z-20 py-1">
              {['Challenge A', 'Spring Into Motion', '10K Habit Quest'].map((chal) => (
                <button
                  key={chal}
                  type="button"
                  onClick={() => {
                    setSelectedChallenge(chal);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs font-mono transition-colors ${
                    selectedChallenge === chal ? 'font-bold bg-[#D9D9D9]' : 'hover:bg-neutral-100'
                  }`}
                >
                  {chal}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => alert(`Exported report for ${selectedChallenge}`)}
          className="bg-[#D9D9D9] hover:bg-neutral-300 px-4 py-2 text-xs font-bold text-black rounded-sm border border-transparent hover:border-black transition-all cursor-pointer"
        >
          Export CSV
        </button>
      </div>

      {/* Main Content */}
      <main className="flex flex-col gap-8">
        {/* 3. Top Line Chart Card (Pure SVG Recreation) */}
        <div className="w-full bg-[#D9D9D9] p-4 sm:p-6 rounded-none">
          <div className="w-full border border-dashed border-black p-4 sm:p-6 bg-[#D9D9D9]">
            <div className="h-64 sm:h-80 w-full flex items-center justify-center">
              <svg
                className="w-full h-full"
                viewBox="0 0 800 300"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Responsive White Polyline matching Report Page.png vertices */}
                <polyline
                  points="20,280 120,220 220,250 300,180 350,200 450,120 570,240 710,90"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 4. Bottom Participants Section */}
        <section className="w-full bg-[#D9D9D9] rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
          <div className="text-sm font-bold text-black uppercase tracking-wider">
            Participants
          </div>

          <div className="flex flex-col gap-3">
            {participants.map((participant, index) => (
              <div
                key={participant.id}
                onClick={() => onSelectParticipant && onSelectParticipant(participant.id)}
                className="w-full h-14 border border-dashed border-black flex items-center justify-between px-4 sm:px-6 text-xs sm:text-sm bg-[#D9D9D9] hover:bg-neutral-300 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-bold text-black">#{index + 1}</span>
                  <span className="font-bold text-black">{participant.name}</span>
                  <span className="text-neutral-600 hidden sm:inline">[{participant.team}]</span>
                </div>
                <div className="flex items-center gap-4 font-mono">
                  <span className="font-bold text-black">
                    {participant.points}
                  </span>
                  <span className="text-black font-bold text-sm">→</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReportScreen;