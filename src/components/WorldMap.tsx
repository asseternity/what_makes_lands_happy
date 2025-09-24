// WorldMap.tsx (fixed coloring & robust name mapping)

import { useRef, useEffect } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import country_aliases from './CountryAliases';

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function happinessToColor(h: number): string {
  if (h >= 7.5) return '#006400'; // dark green
  if (h >= 7.25) return '#0A8C0A';
  if (h >= 7.0) return '#228B22';
  if (h >= 6.75) return '#2E8B57';
  if (h >= 6.5) return '#32CD32';
  if (h >= 6.25) return '#7CFC00';
  if (h >= 6.0) return '#ADFF2F';
  if (h >= 5.75) return '#DFFF00';
  if (h >= 5.5) return '#FFFF00';
  if (h >= 5.25) return '#FFEF00';
  if (h >= 5.0) return '#FFD700';
  if (h >= 4.75) return '#FFA500';
  if (h >= 4.5) return '#FF8C00';
  if (h >= 4.25) return '#FF7F50';
  if (h >= 4.0) return '#FF6347';
  if (h >= 3.75) return '#FF4500';
  if (h >= 3.5) return '#FF0000';
  if (h >= 3.25) return '#DC143C';
  if (h >= 3.0) return '#B22222';
  if (h >= 2.75) return '#A52A2A';
  if (h >= 2.5) return '#8B0000';
  if (h >= 2.25) return '#800000';
  if (h >= 1.5) return '#4B0000'; // dark red
  return '#4B0000'; // covers 0–1.5
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
  countryStats?: Array<{
    Country: string;
    Country_clean: string;
    Happiness: number;
  }>;
};

function normalizeKey(s?: string) {
  if (!s) return '';
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function WorldMap({
  mapContainerRef,
  callback,
  countryStats = [],
}: WorldMapProps) {
  const mapRef = useRef<Map | null>(null);
  const paintedLayerIdRef = useRef<string | null>(null);

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

    // canonical -> happiness (use Country_clean as canonical key)
    const canonicalHappiness: Record<string, number> = {};
    // displayName -> canonical (many-to-one)
    const displayToCanonical: Record<string, string> = {};
    // normalized displayName -> canonical (for clicks)
    const normalizedToCanonical: Record<string, string> = {};

    for (const s of countryStats) {
      if (s?.Country_clean && typeof s.Happiness === 'number') {
        const canonical = s.Country_clean;
        canonicalHappiness[canonical] = s.Happiness;

        // prefer the provided display Country (exact) if available
        if (s.Country && typeof s.Country === 'string') {
          displayToCanonical[s.Country] = canonical;
          normalizedToCanonical[normalizeKey(s.Country)] = canonical;
        }

        // also add a titleCased variant of Country_clean as a display option
        const tc = titleCase(s.Country_clean);
        if (!displayToCanonical[tc]) {
          displayToCanonical[tc] = canonical;
          normalizedToCanonical[normalizeKey(tc)] = canonical;
        }
      }
    }

    // add aliases (alias -> canonical name)
    Object.entries(country_aliases).forEach(([alias, canon]) => {
      if (canonicalHappiness[canon] !== undefined) {
        const displayAliasTitle = titleCase(alias);
        // title-case and raw-lowercase variants
        displayToCanonical[displayAliasTitle] = canon;
        displayToCanonical[alias] = canon; // raw alias (lowercase)
        normalizedToCanonical[normalizeKey(displayAliasTitle)] = canon;
        normalizedToCanonical[normalizeKey(alias)] = canon;
      }
    });

    // on load: build and apply match expression only for display names that map to a known happiness
    mapRef.current!.on('load', () => {
      // use coalesce to pick the most likely name property, then downcase it
      const nameExpr: any[] = [
        'downcase',
        [
          'coalesce',
          ['get', 'NAME'],
          ['get', 'ADMIN'],
          ['get', 'NAME_EN'],
          ['get', 'BRK_NAME'],
        ],
      ];

      // build match expression against the downcased name
      const matchExpr: any[] = ['match', nameExpr];
      const defaultGrey = '#d9d9d9';

      // push each display name -> color, but use LOWERCASED display keys
      const seenKeys = new Set<string>();
      for (const [display, canon] of Object.entries(displayToCanonical)) {
        const h = canonicalHappiness[canon];
        if (typeof h === 'number' && !isNaN(h)) {
          const key = display.toLowerCase();
          if (!seenKeys.has(key)) {
            matchExpr.push(key, happinessToColor(h));
            seenKeys.add(key);
          }
        }
      }

      matchExpr.push(defaultGrey);

      // pick the layer we will paint (same logic as before)
      const preferredId = 'countries-fill';
      const layerExists = mapRef.current?.getLayer(preferredId);
      if (layerExists) {
        paintedLayerIdRef.current = preferredId;
        mapRef.current!.setPaintProperty(preferredId, 'fill-color', matchExpr);
        mapRef.current!.setPaintProperty(preferredId, 'fill-opacity', 1);
      } else {
        const layers = mapRef.current!.getStyle().layers || [];
        const candidate = layers.find((l: any) =>
          /country|countries|admin|ne_10m_admin_0_countries/i.test(l.id)
        );
        if (candidate) {
          paintedLayerIdRef.current = candidate.id;
          mapRef.current!.setPaintProperty(
            candidate.id,
            'fill-color',
            matchExpr
          );
          mapRef.current!.setPaintProperty(candidate.id, 'fill-opacity', 1);
        }
      }
    });

    // click: query the exact painted layer and return canonical if possible
    mapRef.current?.on('click', (e) => {
      const layerToQuery = paintedLayerIdRef.current ?? 'countries-fill';
      const features = mapRef.current?.queryRenderedFeatures(e.point, {
        layers: [layerToQuery],
      });

      if (features?.length) {
        const countryFeature = features[0];
        const rawName: string =
          countryFeature.properties?.NAME ||
          countryFeature.properties?.name ||
          '';
        const normalized = normalizeKey(rawName);

        const canonical =
          normalizedToCanonical[normalized] ??
          // try title-case variant fallbacks:
          normalizedToCanonical[normalizeKey(titleCase(rawName))];

        console.warn(`Raw name: "${rawName}" (normalized: "${normalized}")`);

        // If canonical found, send Country_clean; else send normalized raw name
        callback(canonical ?? normalized);
      }
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      paintedLayerIdRef.current = null;
    };
  }, [countryStats]);

  return <div ref={mapContainerRef} className="w-full h-40" />;
}
