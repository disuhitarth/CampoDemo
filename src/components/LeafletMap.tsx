'use client';

import { useEffect, useRef } from 'react';
import { Unit } from '@/lib/data';
import 'leaflet/dist/leaflet.css';

interface Props {
    units: Unit[];
    onUnitSelect: (id: string) => void;
    dispatchedTrucks?: Record<string, boolean>;
}

const STATUS_COLORS = {
    online: '#22C55E',
    warning: '#F59E0B',
    offline: '#EF4444',
};

export default function LeafletMap({ units, onUnitSelect, dispatchedTrucks = {} }: Props) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<import('leaflet').Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const L = require('leaflet');

        // Fix default icon paths
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({ iconRetinaUrl: '', iconUrl: '', shadowUrl: '' });

        const map = L.map(mapRef.current, {
            center: [52.5, -113.8],
            zoom: 6,
            zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
            maxZoom: 18,
        }).addTo(map);

        units.forEach(unit => {
            const color = STATUS_COLORS[unit.status];

            const icon = L.divIcon({
                html: `<div class="relative w-5 h-5">
                    <div class="absolute inset-0 rounded-full border-[3px] border-white z-10" style="background:${color};box-shadow:0 0 10px ${color}88;"></div>
                    ${unit.status === 'online' ? `<div class="absolute inset-0 rounded-full animate-ping opacity-75" style="background:${color};"></div>` : ''}
                </div>`,
                className: '',
                iconSize: [20, 20],
                iconAnchor: [10, 10],
            });

            const marker = L.marker([unit.lat, unit.lng], { icon }).addTo(map);

            marker.bindPopup(`
        <div style="font-family:inherit;min-width:160px;">
          <div style="font-weight:700;font-size:14px;color:#E8EAF0;margin-bottom:4px;">${unit.name}</div>
          <div style="font-family:monospace;font-size:11px;color:#7A8299;margin-bottom:8px;">SN: ${unit.serial}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span style="width:8px;height:8px;border-radius:50%;background:${color};display:inline-block;box-shadow:0 0 5px ${color};"></span>
            <span style="font-size:11px;font-weight:700;color:${color};text-transform:uppercase;">${unit.status}</span>
          </div>
          <div style="font-size:11px;color:#7A8299;">📍 ${unit.site}</div>
          <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.1);display:grid;grid-template-columns:1fr 1fr;gap:4px;">
            <div><div style="font-size:9px;color:#4A5168;">SUPPLY</div><div style="font-size:13px;font-weight:700;font-family:monospace;color:#FF6B35;">${unit.supplyTemp}°F</div></div>
            <div><div style="font-size:9px;color:#4A5168;">FUEL</div><div style="font-size:13px;font-weight:700;font-family:monospace;color:${unit.fuelPct < 20 ? '#EF4444' : '#22C55E'};">${unit.fuelPct}%</div></div>
          </div>
        </div>
      `);

            marker.on('click', () => onUnitSelect(unit.id));

            if (dispatchedTrucks[unit.id]) {
                const depotLat = unit.lat - 0.8;
                const depotLng = unit.lng - 1.2;

                L.polyline([[depotLat, depotLng], [unit.lat, unit.lng]], {
                    color: '#3B82F6',
                    weight: 3,
                    dashArray: '8, 8',
                    opacity: 0.8,
                    lineCap: 'round'
                }).addTo(map);

                const truckIcon = L.divIcon({
                    html: `<div style="font-size:18px;">🚚</div>`,
                    className: '',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                });
                L.marker([depotLat + 0.3, depotLng + 0.45], { icon: truckIcon }).addTo(map);
            }
        });

        mapInstance.current = map;

        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, [units, dispatchedTrucks]); // Automatically re-draw when dependencies change

    return (
        <div className="rounded-2xl overflow-hidden relative" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            <div ref={mapRef} style={{ height: 420, width: '100%' }} />
            {/* Legend */}
            <div className="absolute bottom-3 right-3 z-[1000] rounded-xl p-3 space-y-2" style={{ background: 'rgba(14,21,37,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {[{ label: 'Online', color: '#22C55E' }, { label: 'Warning', color: '#F59E0B' }, { label: 'Offline', color: '#EF4444' }].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-2 text-[11px]" style={{ color: '#7A8299' }}>
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color, boxShadow: `0 0 5px ${color}` }} />
                        {label}
                    </div>
                ))}
            </div>
        </div>
    );
}
