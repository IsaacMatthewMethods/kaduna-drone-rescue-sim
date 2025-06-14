
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, Battery, CheckCircle, AlertTriangle } from 'lucide-react';
import { Drone } from '@/data/drones';

interface DronesPanelProps {
  drones: Drone[];
  onDispatchDrone: (drone: Drone) => void;
  selectedIncident: any;
}

const getStatusIcon = (status: Drone['status']) => {
  switch (status) {
    case 'Available':
      return <CheckCircle className="text-green-500" size={16} />;
    case 'Charging':
      return <Battery className="text-yellow-500" size={16} />;
    default:
      return <AlertTriangle className="text-orange-500" size={16} />;
  }
};

const DronesPanel: React.FC<DronesPanelProps> = ({ drones, onDispatchDrone, selectedIncident }) => {
  return (
    <Card className="glassmorphic h-full animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="text-primary" />
          Drone Fleet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {drones.map(drone => (
          <div key={drone.id} className="flex items-center gap-4 p-2 rounded-lg border border-border">
            <img src={drone.imageUrl} alt={drone.name} className="w-16 h-16 rounded-md object-cover" />
            <div className="flex-grow">
              <h4 className="font-semibold">{drone.name}</h4>
              <p className="text-xs text-muted-foreground">{drone.model}</p>
              <div className="text-sm flex items-center gap-2 mt-1">
                {getStatusIcon(drone.status)}
                <span>{drone.status}</span>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onDispatchDrone(drone)}
              disabled={drone.status !== 'Available' || !selectedIncident}
            >
              Dispatch
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DronesPanel;
