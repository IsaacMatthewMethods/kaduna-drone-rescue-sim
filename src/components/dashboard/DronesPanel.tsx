import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, Battery, CheckCircle, AlertTriangle } from 'lucide-react';
import { Drone } from '@/data/drones';

interface DronesPanelProps {
  drones: Drone[];
  onDispatchDrone: (drone: Drone) => void;
  selectedIncident: any;
  droneStage?: string | null;
  activeDrone?: Drone | null;
  droneStageImage?: string;
}

// CAST status to allow any string for UI display
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Available':
      return <CheckCircle className="text-green-500" size={16} />;
    case 'Charging':
      return <Battery className="text-yellow-500" size={16} />;
    case 'Active Firefighting':
      return <Rocket className="text-red-500 animate-pulse" size={16} />;
    case 'En Route':
      return <Rocket className="text-blue-400 animate-pulse" size={16} />;
    case 'On Site':
      return <CheckCircle className="text-orange-500" size={16} />;
    case 'Returning':
      return <Rocket className="text-pink-400 animate-pulse" size={16} />;
    case 'Preparing':
    case 'Taking Off':
      return <Rocket className="text-slate-400 animate-bounce" size={16} />;
    case 'Surveillance':
      return <CheckCircle className="text-cyan-400 animate-pulse" size={16} />;
    // Add further stages if needed
    default:
      return <AlertTriangle className="text-orange-500" size={16} />;
  }
};

const DronesPanel: React.FC<DronesPanelProps> = ({
  drones,
  onDispatchDrone,
  selectedIncident,
  droneStage,
  activeDrone,
  droneStageImage,
}) => {
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
          <div key={drone.id} className={`flex items-center gap-4 p-2 rounded-lg border border-border ${activeDrone && drone.id === activeDrone.id ? "bg-primary/10 animate-fade-in" : ""}`}>
            <img src={drone.imageUrl} alt={drone.name} className={`w-16 h-16 rounded-md object-cover ${activeDrone && drone.id === activeDrone.id ? "ring-4 ring-primary ring-offset-base-100" : ""}`} />
            <div className="flex-grow">
              <h4 className="font-semibold">{drone.name}</h4>
              <p className="text-xs text-muted-foreground">{drone.model}</p>
              <div className="text-sm flex items-center gap-2 mt-1">
                {getStatusIcon(drone.status)}
                <span>{drone.status}</span>
                {activeDrone && drone.id === activeDrone.id && droneStage &&
                  <span className="ml-2 text-accent-foreground font-medium animate-pulse">{droneStage}</span>
                }
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onDispatchDrone(drone)}
              disabled={drone.status !== 'Available' || !selectedIncident}
              className="hover-scale"
            >
              Dispatch
            </Button>
          </div>
        ))}
        {activeDrone && droneStageImage && (
          <div className="pt-4 text-center animate-fade-in">
            <img src={droneStageImage} alt={droneStage || "Drone Stage"} className="mx-auto rounded-xl w-24 h-24 object-cover mb-2 shadow-md" />
            <div className="text-primary text-sm font-semibold">{droneStage}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DronesPanel;
