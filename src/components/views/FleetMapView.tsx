'use client';

import dynamic from 'next/dynamic';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, AlertTriangle, Truck, Clock } from 'lucide-react';
import { useState } from 'react';

// Lazy-load the map to avoid SSR issues with Leaflet
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
    ssr: false, loading: () => (
        <div className="h-[420px] rounded-2xl flex items-center justify-center" style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-[#7A8299] text-sm">Loading map…</div>
        </div>
    )
});

const STATUS_ICONS = {
    online: { icon: Wifi, color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
    warning: { icon: AlertTriangle, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    offline: { icon: WifiOff, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

export default function FleetMapView() {
    const { setSelectedUnit, setView, units: contextUnits } = useApp();
    const units = Object.values(contextUnits);
    const [dispatchedTrucks, setDispatchedTrucks] = useState<Record<string, boolean>>({});

    const toggleDispatch = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDispatchedTrucks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCardClick = (unitId: string) => {
        setSelectedUnit(unitId);
        setView('dashboard');
    };

    return (
        <div className="space-y-5 max-w-[1400px]">
            <div>
                <h1 className="text-xl font-bold text-white">Fleet Map</h1>
                <p className="text-sm text-[#7A8299] mt-0.5">Last known GPS positions of your assigned units</p>
            </div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                <LeafletMap units={units} onUnitSelect={handleCardClick} dispatchedTrucks={dispatchedTrucks} />
            </motion.div>

            {/* Unit cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {units.map((unit, i) => {
                    const { icon: Icon, color, bg } = STATUS_ICONS[unit.status];
                    return (
                        <motion.button
                            key={unit.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.3 }}
                            onClick={() => handleCardClick(unit.id)}
                            className="text-left rounded-2xl p-5 transition-all group"
                            style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.07)' }}
                            whileHover={{ borderColor: color, scale: 1.01, boxShadow: `0 0 24px ${color}20` }}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="font-bold text-white">{unit.name}</div>
                                    <div className="text-xs font-mono text-[#7A8299]">SN: {unit.serial}</div>
                                </div>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                                    <Icon className="w-4 h-4" style={{ color }} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 5px ${color}` }} />
                                <span className="text-xs font-bold uppercase" style={{ color }}>{unit.status}</span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-mono mt-2">
                                <div className="text-[#7A8299] flex items-center gap-1"><Clock className="w-3 h-3" />
                                    {unit.fuelPct < 1 ? 'Empty' : `Est. Empty: ${Math.floor(unit.fuelPct * 1.2)}h`}
                                </div>
                                <button
                                    onClick={(e) => toggleDispatch(e, unit.id)}
                                    className="flex items-center gap-1.5 px-2 py-1 rounded transition-colors"
                                    style={dispatchedTrucks[unit.id]
                                        ? { background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }
                                        : { background: 'rgba(255,255,255,0.05)', color: '#4A5168' }
                                    }
                                >
                                    <Truck className="w-3 h-3" /> {dispatchedTrucks[unit.id] ? 'ETA: 45m' : 'Dispatch'}
                                </button>
                            </div>

                            <div className="text-[11px] text-[#7A8299] mt-3 pt-3 flex justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <span>📍 {unit.site}</span>
                                <span>{unit.lat.toFixed(4)}, {unit.lng.toFixed(4)}</span>
                            </div>

                            <div className="mt-3 pt-3 grid grid-cols-3 gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <div><div className="text-[10px] text-[#4A5168]">Supply</div><div className="text-sm font-bold font-mono text-white">{unit.supplyTemp}°F</div></div>
                                <div><div className="text-[10px] text-[#4A5168]">Fuel</div><div className="text-sm font-bold font-mono" style={{ color: unit.fuelPct < 20 ? '#EF4444' : '#22C55E' }}>{unit.fuelPct}%</div></div>
                                <div><div className="text-[10px] text-[#4A5168]">Voltage</div><div className="text-sm font-bold font-mono text-white">{unit.voltage}V</div></div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
