
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { kadunaLocations } from '@/data/locations';
import { toast } from 'sonner';
import { MapPin } from 'lucide-react';

interface FireReportFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onReportSubmit: (report: any) => void;
}

const FireReportForm: React.FC<FireReportFormProps> = ({ isOpen, onOpenChange, onReportSubmit }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  
  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    toast.info("Attempting to get your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // In a real app, you'd reverse-geocode this. For now, we'll just use coords.
        const locationName = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        setLocation(locationName);
        toast.success("Location found!");
      },
      () => {
        toast.error("Unable to retrieve your location.");
      }
    );
  };
  
  const handleSubmit = () => {
     if (!description || !location) {
        toast.error("Please fill in all fields.");
        return;
     }
     const selectedLocation = kadunaLocations.find(l => l.name === location);
     const newIncident = {
         id: Date.now(),
         location: location,
         coords: selectedLocation ? selectedLocation.coords : [0,0], // Fallback
         status: 'Reported',
         report: description,
         timestamp: new Date().toISOString()
     }
     onReportSubmit(newIncident);
     toast.success("Fire incident reported successfully!");
     onOpenChange(false);
     setDescription('');
     setLocation('');
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glassmorphic">
        <DialogHeader>
          <DialogTitle>Report a Fire Incident</DialogTitle>
          <DialogDescription>
            Provide details about the fire. Your quick report can save lives.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Describe the incident (e.g., 'Thick smoke from rooftop...')"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-2">
            <Select onValueChange={setLocation} value={location}>
              <SelectTrigger>
                <SelectValue placeholder="Select incident location" />
              </SelectTrigger>
              <SelectContent>
                {kadunaLocations.map(loc => (
                  <SelectItem key={loc.name} value={loc.name}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleGeoLocation}>
                <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Submit Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FireReportForm;
