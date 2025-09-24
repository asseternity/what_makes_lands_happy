import { useRef, useEffect } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function happinessToColor(h: number): string {
  if (h >= 7.5) return '#006400'; // dark green
  if (h >= 7.0) return '#228B22';
  if (h >= 6.5) return '#32CD32';
  if (h >= 6.0) return '#7CFC00';
  if (h >= 5.5) return '#ADFF2F';
  if (h >= 5.0) return '#FFFF00';
  if (h >= 4.5) return '#FFD700';
  if (h >= 4.0) return '#FFA500';
  if (h >= 3.5) return '#FF8C00';
  if (h >= 3.0) return '#FF4500';
  if (h >= 2.5) return '#FF0000';
  if (h >= 2.0) return '#B22222';
  if (h >= 1.5) return '#8B0000';
  return '#4B0000'; // worst 0–1.5
}

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
  // Provide your dataset here or import it above.
  // Expected shape: [{ Country: "India", Country_clean: "india", Happiness: 4.05 }, ...]
  countryStats?: Array<{ Country: string; Happiness: number }>;
};

function hslToHex(h: number, s: number, l: number) {
  // h in [0,360], s/l in [0,100]
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(
      (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))) * 255
    )
      .toString(16)
      .padStart(2, '0');
  return `#${f(0)}${f(8)}${f(4)}`;
}

export default function WorldMap({
  mapContainerRef,
  callback,
  countryStats = [],
}: WorldMapProps) {
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

    // Build quick lookup from provided stats
    const statsByName: Record<string, number> = {};
    let minH = Infinity;
    let maxH = -Infinity;
    for (const s of countryStats) {
      if (s?.Country && typeof s.Happiness === 'number') {
        statsByName[s.Country] = s.Happiness;
        if (s.Happiness < minH) minH = s.Happiness;
        if (s.Happiness > maxH) maxH = s.Happiness;
      }
    }
    if (!isFinite(minH)) {
      // safe defaults if no data provided
      minH = 0;
      maxH = 10;
    }

    // on map load set up paint expression for countries-fill
    mapRef.current.on('load', () => {
      // Build match expression: ['match', ['get','NAME'], 'India', '#hex', 'Egypt', '#hex', ..., defaultColor]
      const matchExpr: any[] = ['match', ['get', 'NAME']];

      // For each known country compute green shade. Brighter green = higher Happiness.
      // We'll use HSL hue 120 (green). Map happiness to lightness 70 -> 30 (higher happiness -> darker, richer green).
      // Adjust as needed.
      const defaultGrey = '#d9d9d9';
      for (const countryName of Object.keys(statsByName)) {
        const hval = statsByName[countryName];
        const hex = happinessToColor(hval); // use your new function
        matchExpr.push(countryName, hex);
      }

      matchExpr.push(defaultGrey);

      // Ensure the layer id exists. The example style likely has 'countries-fill'.
      const layerId = 'countries-fill';
      const layerExists = mapRef.current?.getLayer(layerId);

      if (layerExists) {
        mapRef.current?.setPaintProperty(layerId, 'fill-color', matchExpr);
        // Optional: set fill-opacity or outline
        mapRef.current?.setPaintProperty(layerId, 'fill-opacity', 1);
      } else {
        // If layer id differs you can iterate style layers and pick the first polygon layer that contains 'country' in the id/name.
        const layers = mapRef.current!.getStyle().layers || [];
        const candidate = layers.find((l: any) =>
          /country|countries|admin/.test(l.id)
        );
        if (candidate) {
          mapRef.current!.setPaintProperty(
            candidate.id,
            'fill-color',
            matchExpr
          );
          mapRef.current!.setPaintProperty(candidate.id, 'fill-opacity', 1);
        }
      }
    });

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
  }, [countryStats]);

  return <div ref={mapContainerRef} className="w-full h-40" />;
}
