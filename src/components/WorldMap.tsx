import { useState, useRef, useEffect } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

class SimpleZoomControl implements maplibregl.IControl {
  private container: HTMLElement | null = null;
  onAdd(mapInstance: Map) {
    const c = document.createElement('div');
    c.className = 'maplibregl-ctrl maplibregl-ctrl-group simple-zoom-ctrl';
    c.style.position = 'absolute';
    c.style.right = '0px';
    c.style.transform = 'translateY(100%)';
    c.style.display = 'flex';
    c.style.flexDirection = 'column';
    c.style.gap = '6px';
    c.style.background = 'rgba(255,255,255,0.9)';
    c.style.borderRadius = '6px';
    c.style.padding = '6px';
    c.style.boxShadow = '0 1px 6px rgba(0,0,0,0.15)';
    c.style.userSelect = 'none';

    const btn = (text: string, onClick: () => void) => {
      const b = document.createElement('button');
      b.innerText = text;
      b.title = text;
      b.style.width = '24px';
      b.style.height = '24px';
      b.style.display = 'flex';
      b.style.alignItems = 'center';
      b.style.justifyContent = 'center';
      b.style.border = 'none';
      b.style.background = 'transparent';
      b.style.cursor = 'pointer';
      b.style.fontSize = '22px';
      b.onpointerdown = (ev) => ev.stopPropagation();
      b.onclick = onClick;
      return b;
    };

    const zoomIn = btn('+', () =>
      mapInstance.easeTo({ zoom: mapInstance.getZoom() + 1 })
    );
    const zoomOut = btn('−', () =>
      mapInstance.easeTo({ zoom: mapInstance.getZoom() - 1 })
    );

    c.appendChild(zoomIn);
    c.appendChild(zoomOut);

    this.container = c;
    // Return element to MapLibre for insertion
    return c;
  }
  onRemove() {
    this.container?.parentNode?.removeChild(this.container);
    this.container = null;
  }
}

type WorldMapProps = {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  callback: Function;
};

export default function WorldMap({ mapContainerRef, callback }: WorldMapProps) {
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [43, 43],
      zoom: 3,
      attributionControl: false,
    });

    mapRef.current.addControl(new SimpleZoomControl());

    mapRef.current?.on('click', (e) => {
      const features = mapRef.current?.queryRenderedFeatures(e.point, {
        layers: ['countries-fill'],
      });

      if (features?.length) {
        const country = features[0];
        const cleanCountryName: string = country.properties?.NAME.toLowerCase();
        callback(cleanCountryName);
      }
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={mapContainerRef} className="w-full h-40" />;
}
