
import React from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Radio } from "lucide-react";

interface DroneProgressProps {
  stages: string[];
  currentStage: string | null;
  activeDrone?: { name: string };
}

const DroneProgress: React.FC<DroneProgressProps> = ({ stages, currentStage, activeDrone }) => {
  const currentIndex = currentStage ? stages.findIndex(s => s === currentStage) : -1;
  const percent = currentIndex >= 0 ? Math.floor(((currentIndex + 1) / stages.length) * 100) : 0;

  return (
    <div className="w-full max-w-xl mx-auto bg-card rounded-xl p-6 mt-6 shadow-lg flex flex-col gap-4 animate-fade-in border border-border">
      <h2 className="font-bold text-lg mb-2 text-primary flex gap-2 items-center">
        Drone Sequence Progress
        {activeDrone?.name && (
          <span className="font-normal text-muted-foreground text-sm ml-2">
            ({activeDrone.name})
          </span>
        )}
      </h2>
      <Progress value={percent} />
      <div className="flex flex-col gap-2 mt-2">
        {stages.map((stage, idx) => {
          const isActive = currentStage === stage;
          const isCompleted = idx < currentIndex;
          return (
            <div
              key={stage}
              className={`flex items-center gap-3 ml-2 text-base ${
                isActive
                  ? "font-bold text-primary"
                  : isCompleted
                  ? "text-green-600"
                  : "text-muted-foreground"
              }`}
            >
              {isCompleted && <CheckCircle size={16} className="text-green-500" />}
              {isActive && <Radio size={16} className="animate-pulse text-primary" />}
              {!isCompleted && !isActive && <span className="w-4" />}
              <span>{stage}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DroneProgress;
