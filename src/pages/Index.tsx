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
import DroneProgress from '@/components/dashboard/DroneProgress';

const droneStages = [
  "Preparing for Takeoff",
  "Taking Off",
  "En Route",
  "Arrived On Site",
  "Surveillance",
  "Active Firefighting",
  "Fire Extinguished",
  "Returning to Base",
  "Arrived",
  "Charging",
  "Ready",
];

const droneStageImages: Record<string, string> = {
  "Preparing for Takeoff": "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=400&q=80",
  "Taking Off": "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=400&q=80",
  "En Route": "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=400&q=80",
  "Arrived On Site": "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=400&q=80",
  "Surveillance": "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=400&q=80",
  "Active Firefighting": "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=400&q=80",
  "Fire Extinguished": "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=400&q=80",
  "Returning to Base": "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=400&q=80",
  "Arrived": "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=400&q=80",
  "Charging": "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=400&q=80",
  "Ready": "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=400&q=80",
};

// Function to fetch fire reports from localStorage
function getLocalFireReports() {
  try {
    const fireReportKey = "fireReports";
    const reports: any[] = JSON.parse(localStorage.getItem(fireReportKey) || "[]");
    // Convert location/coords to correct types (safety)
    return Array.isArray(reports) ? reports : [];
  } catch {
    return [];
  }
}

const Index = () => {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [drones, setDrones] = useState<Drone[]>(initialDrones);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);
  const [logs, setLogs] = useState<string[]>(['System Initialized. Ready for operations.']);
  const [isReportFormOpen, setReportFormOpen] = useState(false);
  const [dronePath, setDronePath] = useState<[number, number][] | undefined>();
  const [droneStage, setDroneStage] = useState<string | null>(null);
  const [activeDrone, setActiveDrone] = useState<Drone | null>(null);

  // Add new incident from localStorage fire reports on page load
  useEffect(() => {
    const fireReports = getLocalFireReports();
    if (fireReports.length > 0) {
      const formatted = fireReports.map((r) => ({
        id: r.id,
        location: r.location,
        coords: r.coords,
        status: "Reported",
        report: r.description,
        timestamp: r.timestamp,
      }));
      setIncidents(prev => [...formatted, ...prev]);
      setTimeout(() => {
        localStorage.removeItem("fireReports"); // Clear after loading into dashboard
      }, 500);
    }
  }, []);

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

    setActiveDrone(drone);
    addLog(`Preparing ${drone.name} for takeoff to ${selectedIncident.location}.`);

    // The staged animation names
    setDroneStage("Preparing for Takeoff");
    // Only use allowed status values in drone object
    setDrones(d => d.map(dr => dr.id === drone.id ? { ...dr, status: 'Charging' } : dr));
    setIncidents(i => i.map(inc => inc.id === selectedIncident.id ? { ...inc, status: 'In Progress' } : inc));
    setDronePath([droneStation.coords, selectedIncident.coords as [number, number]]);

    // Simulate drone sequence using only Drone status values for .status
    setTimeout(() => {
      setDroneStage("Taking Off");
      addLog(`${drone.name} is taking off.`);
      setDrones(d => d.map(dr => dr.id === drone.id ? { ...dr, status: 'Charging' } : dr));
      setTimeout(() => {
        setDroneStage("En Route");
        addLog(`${drone.name} en route to ${selectedIncident.location}.`);
        setDrones(d => d.map(dr => dr.id === drone.id ? { ...dr, status: 'En Route' } : dr));
        setTimeout(() => {
          setDroneStage("Arrived On Site");
          addLog(`${drone.name} arrived at ${selectedIncident.location}.`);
          setDrones(d => d.map(dr => dr.id === drone.id ? { ...dr, status: 'On Site' } : dr));
          setTimeout(() => {
            setDroneStage("Surveillance");
            addLog(`${drone.name} started surveillance at ${selectedIncident.location}.`);
            setDrones(d => d.map(dr => dr.id === drone.id ? { ...dr, status: 'On Site' } : dr));
            setTimeout(() => {
              setDroneStage("Active Firefighting");
              addLog(`${drone.name} actively fighting fire at ${selectedIncident.location}.`);
              setDrones(d => d.map(dr => dr.id === drone.id ? { ...dr, status: 'On Site' } : dr));
              setTimeout(() => {
                setDroneStage("Fire Extinguished");
                addLog(`Fire at ${selectedIncident.location} extinguished by ${drone.name}.`);
                setIncidents(i => i.map(inc => inc.id === selectedIncident.id ? { ...inc, status: 'Resolved' } : inc));
                setDrones(d => d.map(dr => dr.id === drone.id ? { ...dr, status: 'Returning' } : dr));
                setDroneStage("Returning to Base");
                setSelectedIncident(null);
                setTimeout(() => {
                  setDroneStage("Arrived");
                  addLog(`${drone.name} returned to base.`);
                  setDrones(d => d.map(dr => dr.id === drone.id ? { ...dr, status: "Charging" } : dr));
                  setDroneStage("Charging");
                  setDronePath(undefined);
                  setTimeout(() => {
                    setDroneStage("Ready");
                    addLog(`${drone.name} fully charged and available.`);
                    setDrones(d => d.map(dr => dr.id === drone.id ? { ...dr, status: "Available" } : dr));
                    setActiveDrone(null);
                    setDroneStage(null);
                  }, 10000);
                }, 5000);
              }, 7000);
            }, 4000);
          }, 3000);
        }, 4000);
      }, 2000);
    }, 1200); // simulate "Preparing for Takeoff"
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
        <div className="lg:col-span-2 h-[40vh] lg:h-auto relative">
          <Map 
            center={[7.44, 10.52]} 
            zoom={10} 
            incidents={incidents}
            stations={droneStations}
            dronePath={dronePath}
            activeDrone={activeDrone}
            droneStage={droneStage}
            droneStageImage={droneStage ? droneStageImages[droneStage] : undefined}
          />
          {droneStage && (
            <div className="absolute top-4 right-4 z-[5000] bg-black/80 rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-fade-in">
              <img src={droneStageImages[droneStage]} alt={droneStage} className="w-20 h-20 object-cover rounded-lg border border-gray-700" />
              <div>
                <strong className="text-lg">{activeDrone?.name || "Drone"}:</strong>
                <div className="capitalize text-primary text-xl">{droneStage}</div>
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-1 flex flex-col gap-4">
          <DronesPanel 
            drones={drones} 
            onDispatchDrone={handleDispatchDrone}
            selectedIncident={selectedIncident}
            droneStage={droneStage}
            activeDrone={activeDrone}
            droneStageImage={droneStage ? droneStageImages[droneStage] : undefined}
          />
        </div>
        <div className="lg:col-span-4">
            <StatusLog logs={logs}/>
        </div>
      </main>

      {/* Drone Progress Section below the simulation/map */}
      {droneStage && (
        <DroneProgress
          stages={droneStages}
          currentStage={droneStage}
          activeDrone={activeDrone ? { name: activeDrone.name } : undefined}
        />
      )}

      <FireReportForm 
        isOpen={isReportFormOpen}
        onOpenChange={setReportFormOpen}
        onReportSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default Index;
