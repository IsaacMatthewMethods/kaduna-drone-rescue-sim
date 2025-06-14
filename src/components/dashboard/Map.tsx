import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { LngLatLike, Marker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MapProps {
  center: LngLatLike;
  zoom: number;
  incidents: { coords: [number, number] }[];
  stations: { name: string, coords: [number, number] }[];
  dronePath?: [number, number][];
}

const Map: React.FC<MapProps> = ({ center, zoom, incidents, stations, dronePath }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);

  const initMap = () => {
    if (map.current || !mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: center,
      zoom: zoom,
      pitch: 45,
    });

    map.current.on('load', () => {
      // Add incidents as markers
      incidents.forEach(incident => {
        new Marker({ color: '#f44336' })
          .setLngLat(incident.coords)
          .addTo(map.current!);
      });

      // Add stations as markers
      stations.forEach(station => {
        new Marker({ color: '#2196f3' })
            .setLngLat(station.coords)
            .setPopup(new mapboxgl.Popup().setText(station.name))
            .addTo(map.current!);
      });
      setIsTokenSet(true);
      toast.success("Map initialized successfully!");
    });
  };

  useEffect(() => {
    if (isTokenSet && map.current && dronePath) {
      const sourceId = 'drone-path';
      const layerId = 'drone-path-layer';

      if (map.current.getSource(sourceId)) {
        (map.current.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: dronePath,
          },
        });
      } else {
        map.current.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: dronePath,
            },
          },
        });

        map.current.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#87CEEB',
            'line-width': 4,
            'line-dasharray': [0, 2],
          },
        });
        
        const pathAnimation = () => {
           // Your animation logic here...
        };
        pathAnimation();
      }
    }
  }, [dronePath, isTokenSet]);

  if (!isTokenSet) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900/50 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-4 text-white">Mapbox Access Token Required</h3>
        <p className="text-sm text-gray-400 mb-4 max-w-md text-center">
          To display the interactive map, please provide your Mapbox public access token. You can get one for free from{' '}
          <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            mapbox.com
          </a>.
        </p>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="pk.ey..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="text-white"
          />
          <Button type="submit" onClick={initMap}>Set Token</Button>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className="w-full h-full rounded-lg shadow-2xl" />;
};

export default Map;
