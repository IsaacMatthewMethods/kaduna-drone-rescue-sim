
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal } from 'lucide-react';

interface StatusLogProps {
  logs: string[];
}

const StatusLog: React.FC<StatusLogProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card className="glassmorphic animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal />
          System Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={scrollRef} className="h-32 bg-black/50 rounded-md p-2 font-mono text-sm overflow-y-auto">
          {logs.map((log, index) => (
            <p key={index} className="whitespace-pre-wrap">{log}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusLog;
