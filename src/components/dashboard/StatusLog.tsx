
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ListChecks } from 'lucide-react';

interface StatusLogProps {
  logs: string[];
}

/**
 * Vertical progress/timeline log interface.
 * - Progress bar tracks step through logs.
 * - Each log is a vertical step.
 * - Current/most recent log is highlighted with color/gradient.
 * - Professional look using shadcn/ui and Tailwind.
 */
const StatusLog: React.FC<StatusLogProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to the latest step when new logs are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // For progress bar calculation (from 0 to 100)
  const progressValue = logs.length > 1
    ? Math.min(100, ((logs.length - 1) / (logs.length > 4 ? logs.length - 1 : 4)) * 100)
    : 10;

  return (
    <Card className="glassmorphic animate-fade-in shadow-xl" style={{ animationDelay: '0.2s' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-orange-400 animate-gradient-x font-extrabold text-2xl drop-shadow">
          <ListChecks className="text-white drop-shadow" />
          Command Center Progress
        </CardTitle>
        <Progress value={progressValue} className="h-3 mt-4 bg-gradient-to-r from-gray-800 via-zinc-700 to-indigo-900 border border-gray-700" />
      </CardHeader>
      <CardContent>
        <div
          ref={scrollRef}
          className="h-40 md:h-44 overflow-y-auto px-1 py-2 space-y-0.5"
        >
          <ol className="relative border-l-2 border-gradient-to-b from-blue-500 via-pink-500 to-orange-400 ml-2 pl-4">
            {logs.map((log, idx) => {
              const isActive = idx === logs.length - 1;
              return (
                <li key={idx} className="mb-6 last:mb-0 relative">
                  <span
                    className={
                      `absolute -left-5 top-0 w-3 h-3 rounded-full border-2 
                       ${isActive
                        ? "bg-gradient-to-br from-pink-500 via-blue-400 to-orange-400 border-indigo-300 shadow-lg animate-pulse"
                        : "bg-gray-500 border-gray-300"}`
                    }
                  />
                  <span
                    className={
                      `block whitespace-pre-wrap text-sm md:text-base transition-all
                       ${isActive
                        ? "font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-blue-400 to-orange-300"
                        : "text-gray-300"}`
                    }
                  >
                    {log}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusLog;

