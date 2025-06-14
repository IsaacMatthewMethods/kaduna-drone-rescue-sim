
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix for default icon issue with bundlers like Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icons to differentiate markers
const incidentIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const stationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapProps {
  center: [number, number];
  zoom: number;
  incidents: { coords: [number, number] }[];
  stations: { name: string, coords: [number, number] }[];
  dronePath?: [number, number][];
  activeDrone?: any;
  droneStage?: string | null;
  droneStageImage?: string;
}

const Map: React.FC<MapProps> = ({ center, zoom, incidents, stations, dronePath, activeDrone, droneStage, droneStageImage }) => {
  // Leaflet expects [lat, lon], while our data is [lon, lat]. We swap them here.
  const leafletCenter: [number, number] = [center[1], center[0]];
  const leafletIncidents = incidents.map(incident => ({
    ...incident,
    coords: [incident.coords[1], incident.coords[0]] as [number, number]
  }));
  const leafletStations = stations.map(station => ({
    ...station,
    coords: [station.coords[1], station.coords[0]] as [number, number]
  }));
  const leafletDronePath = dronePath?.map(coord => [coord[1], coord[0]] as [number, number]);

  // Pick drone marker image if drone is active
  const droneIcon = activeDrone
    ? new L.Icon({
        iconUrl: droneStageImage || activeDrone.imageUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        shadowSize: [41, 41],
      })
    : undefined;

  return (
    <MapContainer center={leafletCenter} zoom={zoom} scrollWheelZoom={true} className="w-full h-full rounded-lg shadow-2xl">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {leafletIncidents.map((incident, idx) => (
        <Marker key={`incident-${idx}`} position={incident.coords} icon={incidentIcon}>
          <Popup>An incident is reported here.</Popup>
        </Marker>
      ))}
      {leafletStations.map((station) => (
        <Marker key={station.name} position={station.coords} icon={stationIcon}>
          <Popup>{station.name}</Popup>
        </Marker>
      ))}
      {leafletDronePath && activeDrone && (
        <>
          {/* Drone path as a blue animated polyline */}
          <Polyline 
            pathOptions={{ color: '#87CEEB', dashArray: '7,12', weight: 5, opacity: 0.7 }} 
            positions={leafletDronePath} 
          />
          {/* Simulated drone position as animated marker */}
          <Marker
            position={
              droneStage === "En Route"
                ? leafletDronePath[1]
                : droneStage === "Returning to Base"
                ? leafletDronePath[0]
                : (
                    droneStage === "Arrived On Site" || droneStage === "Surveillance" || droneStage === "Active Firefighting" || droneStage === "Fire Extinguished"
                  )
                ? leafletDronePath[1]
                : leafletDronePath[0]
            }
            icon={droneIcon}
          >
            <Popup>
              <div className="text-center">
                <img src={droneStageImage || activeDrone.imageUrl} alt={activeDrone?.name} className="w-16 h-16 mx-auto object-cover rounded mb-2" />
                <div className="font-medium">{activeDrone?.name || "Drone"}</div>
                <div className="text-xs text-muted-foreground">{droneStage}</div>
              </div>
            </Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  );
};

export default Map;
