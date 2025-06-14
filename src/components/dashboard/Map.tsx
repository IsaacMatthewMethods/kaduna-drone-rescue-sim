import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue with bundlers like Vite
// See: https://github.com/PaulLeCam/react-leaflet/issues/453
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
}

const Map: React.FC<MapProps> = ({ center, zoom, incidents, stations, dronePath }) => {
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
      {leafletDronePath && (
        <Polyline 
          pathOptions={{ color: '#87CEEB', dashArray: '5, 10' }} 
          positions={leafletDronePath} 
        />
      )}
    </MapContainer>
  );
};

export default Map;
