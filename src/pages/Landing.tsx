
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { kadunaLocations } from "@/data/locations";
import { toast } from "sonner"; // Not used but could be shown as inline feedback

const droneImages = [
  {
    url: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=800&q=80",
    desc: "DJI drone in mid air",
  },
  {
    url: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    desc: "Flying drone at sunset",
  },
  {
    url: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
    desc: "Drone hovering over the city",
  },
];

const fireReportKey = "fireReports";

type FireReport = {
  id: number;
  description: string;
  location: string;
  coords: [number, number];
  timestamp: string;
  status: "Reported";
};

// Landing fire report modal
const FireReportModal = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = () => {
    if (!location || !description) {
      alert("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    const locObj = kadunaLocations.find(l => l.name === location);
    const report: FireReport = {
      id: Date.now(),
      location,
      description,
      coords: locObj?.coords ?? [0, 0],
      status: "Reported",
      timestamp: new Date().toISOString(),
    };
    // Store in localStorage
    const prev = JSON.parse(localStorage.getItem(fireReportKey) || "[]");
    localStorage.setItem(fireReportKey, JSON.stringify([report, ...prev]));
    setTimeout(() => {
      setSubmitting(false);
      onOpenChange(false);
      setLocation("");
      setDescription("");
      alert("Fire report submitted! It will appear in the admin dashboard.");
    }, 500);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-background rounded-xl max-w-md w-full p-6 shadow-2xl relative">
        <button className="absolute top-3 right-3 p-2 rounded hover:bg-muted text-2xl" onClick={() => onOpenChange(false)}>&times;</button>
        <h2 className="text-xl font-bold mb-1 text-primary">Report a Fire Incident</h2>
        <p className="mb-3 text-muted-foreground text-sm">Help us respond fast by reporting a fire you see.</p>
        <div className="space-y-3">
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the incident (e.g., thick smoke, visible flames...)"
            disabled={submitting}
          />
          <Select onValueChange={setLocation} value={location}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {kadunaLocations.map(loc => (
                <SelectItem key={loc.name} value={loc.name}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="mt-4 w-full" onClick={onSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Fire Report"}
        </Button>
      </div>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-zinc-900 flex flex-col items-center justify-center">
      <header className="mb-10 pt-8 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary text-center drop-shadow-lg mb-4">
          Kaduna Drone Fire Rescue
        </h1>
        <p className="text-lg max-w-xl mx-auto text-slate-300 text-center animate-fade-in">
          Reimagining emergency response with drone technology <br />
          Real-time wildfire monitoring and intervention powered by AI.
        </p>
      </header>
      <div className="flex flex-col md:flex-row gap-8 w-full md:w-[900px] justify-center mb-10 items-center animate-fade-in">
        {droneImages.map((img, i) => (
          <div key={img.url} className="relative group rounded-xl overflow-hidden shadow-xl border border-muted bg-card hover-scale transition-all duration-500">
            <img src={img.url} alt={img.desc} className="w-72 h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
            <span className="absolute bottom-2 left-2 text-xs text-zinc-300 bg-black/40 px-2 py-1 rounded">{img.desc}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mb-8 animate-fade-in">
        <Button size="lg" className="text-lg px-8 py-5 hover:scale-105 shadow-2xl" onClick={() => navigate("/dashboard")}>
          Enter Command Dashboard
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="text-lg px-8 py-5 hover:scale-105 shadow-2xl"
          onClick={() => setModalOpen(true)}
        >
          Report Fire Incident
        </Button>
      </div>
      <footer className="mt-16 text-xs text-zinc-500 text-center space-y-1">
        <div>
          Images from Unsplash:
          {" "}
          <a href="https://unsplash.com/photos/1487887235947-a955ef187fcc" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">DJI drone</a>
          ,&nbsp;
          <a href="https://unsplash.com/photos/1464983953574-0892a716854b" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">Sunset drone</a>
          ,&nbsp;
          <a href="https://unsplash.com/photos/1472396961693-142e6e269027" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">City drone</a>
        </div>
        <div>
          © {new Date().getFullYear()} Fire-Response Drone Command Sim. All rights reserved.
        </div>
      </footer>
      <FireReportModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default Landing;

