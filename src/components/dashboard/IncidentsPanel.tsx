
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FireExtinguisher, Clock } from 'lucide-react';
import { Incident } from '@/data/incidents';
import { formatDistanceToNow } from 'date-fns';

interface IncidentsPanelProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  selectedIncidentId?: number;
}

const IncidentsPanel: React.FC<IncidentsPanelProps> = ({ incidents, onSelectIncident, selectedIncidentId }) => {
  return (
    <Card className="glassmorphic h-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FireExtinguisher className="text-destructive" />
          Active Incidents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {incidents.map(incident => (
          <div
            key={incident.id}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedIncidentId === incident.id ? 'bg-secondary/50 border-primary' : 'border-border hover:border-accent'
            }`}
            onClick={() => onSelectIncident(incident)}
          >
            <h4 className="font-semibold">{incident.location}</h4>
            <p className="text-sm text-muted-foreground">{incident.report}</p>
            <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Clock size={12} />
              <span>{formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default IncidentsPanel;
