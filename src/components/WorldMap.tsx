import { useRef, useEffect } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type WorldMapProps = {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
};

export default function WorldMap({ mapContainerRef }: WorldMapProps) {
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 0],
      zoom: 1,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl());

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={mapContainerRef} className="w-full h-40" />;
}
