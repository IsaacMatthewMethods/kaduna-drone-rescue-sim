
import React, { useState, useEffect, useCallback } from 'react';
import Map from '@/components/dashboard/Map';
import IncidentsPanel from '@/components/dashboard/IncidentsPanel';
import DronesPanel from '@/components/dashboard/DronesPanel';
import StatusLog from '@/components/dashboard/StatusLog';
import FireReportForm from '@/components/dashboard/FireReportForm';
import { Button } from '@/components/ui/button';
import { incidents as initialIncidents, Incident } from '@/data/incidents';
import { drones as initialDrones, Drone } from '@/data/drones';
import { droneStations, kadunaLocations } from '@/data/locations';
import { toast } from 'sonner';
import { AlertCircle, ShieldCheck } from 'lucide-react';

const Index = () => {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [drones, setDrones] = useState<Drone[]>(initialDrones);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);
  const [logs, setLogs] = useState<string[]>(['System Initialized. Ready for operations.']);
  const [isReportFormOpen, setReportFormOpen] = useState(false);
  const [dronePath, setDronePath] = useState<[number, number][] | undefined>();

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  const handleDispatchDrone = (drone: Drone) => {
    if (!selectedIncident) {
      toast.error('No incident selected to dispatch to.');
      return;
    }
    
    const droneStation = droneStations.find(s => s.name === drone.station);
    if (!droneStation) {
      toast.error('Could not find drone station.');
      return;
    }

    addLog(`Dispatching ${drone.name} to ${selectedIncident.location}.`);
    
    setDrones(d => d.map(dr => dr.id === drone.id ? { ...dr, status: 'En Route' } : dr));
    setIncidents(i => i.map(inc => inc.id === selectedIncident.id ? { ...inc, status: 'In Progress' } : inc));

    setDronePath([droneStation.coords, selectedIncident.coords as [number, number]]);
    
    // Simulate arrival
    setTimeout(() => {
      addLog(`${drone.name} has arrived at ${selectedIncident.location}.`);
      setDrones(d => d.map(dr => dr.id === drone.id ? { ...dr, status: 'On Site' } : dr));

      // Simulate resolving incident
      setTimeout(() => {
        addLog(`Fire at ${selectedIncident.location} has been extinguished by ${drone.name}.`);
        setIncidents(i => i.map(inc => inc.id === selectedIncident.id ? { ...inc, status: 'Resolved' } : inc));
        setDrones(d => d.map(dr => dr.id === drone.id ? { ...dr, status: 'Returning' } : dr));
        setSelectedIncident(null);
        setDronePath(undefined);
        
        // Simulate return and recharge
        setTimeout(() => {
            addLog(`${drone.name} has returned to base and is now charging.`);
            setDrones(d => d.map(dr => dr.id === drone.id ? { ...dr, status: 'Charging' } : dr));
            setTimeout(() => {
              addLog(`${drone.name} is charged and available.`);
              setDrones(d => d.map(dr => dr.id === drone.id ? { ...dr, status: 'Available' } : dr));
            }, 10000); // Recharge time
        }, 5000); // Return time

      }, 8000); // Firefighting time

    }, 5000); // Travel time
  };

  const handleReportSubmit = (newIncident: Incident) => {
    setIncidents(prev => [newIncident, ...prev]);
    addLog(`New incident reported at ${newIncident.location}.`);
  };

  return (
    <div className="h-screen w-screen bg-background text-foreground p-4 flex flex-col gap-4 overflow-hidden">
      <header className="flex justify-between items-center animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="text-primary"/>
          <span>Fire-Response Drone Command</span>
        </h1>
        <Button onClick={() => setReportFormOpen(true)}>
          <AlertCircle className="mr-2 h-4 w-4"/>
          Report Fire Incident
        </Button>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-grow h-full">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <IncidentsPanel 
            incidents={incidents.filter(i => i.status !== 'Resolved')}
            onSelectIncident={setSelectedIncident}
            selectedIncidentId={selectedIncident?.id}
          />
        </div>
        <div className="lg:col-span-2 h-[40vh] lg:h-auto">
          <Map 
            center={[7.44, 10.52]} 
            zoom={10} 
            incidents={incidents}
            stations={droneStations}
            dronePath={dronePath}
          />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-4">
          <DronesPanel 
            drones={drones} 
            onDispatchDrone={handleDispatchDrone}
            selectedIncident={selectedIncident}
          />
        </div>
        <div className="lg:col-span-4">
            <StatusLog logs={logs}/>
        </div>
      </main>

      <FireReportForm 
        isOpen={isReportFormOpen}
        onOpenChange={setReportFormOpen}
        onReportSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default Index;
