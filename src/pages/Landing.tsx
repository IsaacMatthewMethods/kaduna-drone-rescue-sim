
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const images = [
  {
    url: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=800&q=80",
    desc: "White DJI drone in mid air",
  },
  {
    url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=800&q=80",
    desc: "Bridge and waterfalls during daytime",
  },
  {
    url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80",
    desc: "River between mountains under white clouds",
  },
];

const Landing = () => {
  const navigate = useNavigate();
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
        {images.map((img, i) => (
          <div key={img.url} className="relative group rounded-xl overflow-hidden shadow-xl border border-muted bg-card hover-scale transition-all duration-500">
            <img src={img.url} alt={img.desc} className="w-72 h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
            <span className="absolute bottom-2 left-2 text-xs text-zinc-300 bg-black/40 px-2 py-1 rounded">{img.desc}</span>
          </div>
        ))}
      </div>
      <Button size="lg" className="text-lg px-8 py-5 hover:scale-105 shadow-2xl animate-fade-in" onClick={() => navigate("/dashboard")}>
        Enter Command Dashboard
      </Button>
      <footer className="mt-16 text-xs text-zinc-500 text-center space-y-1">
        <div>
          Stock images from Unsplash: {" "}
          <a href="https://unsplash.com/photos/1487887235947-a955ef187fcc" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">DJI drone</a>
          {", "}
          <a href="https://unsplash.com/photos/1433086966358-54859d0ed716" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">Bridge & waterfall</a>
          {", "}
          <a href="https://unsplash.com/photos/1482938289607-e9573fc25ebb" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">Mountains</a>
        </div>
        <div>
          © {new Date().getFullYear()} Fire-Response Drone Command Sim. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
