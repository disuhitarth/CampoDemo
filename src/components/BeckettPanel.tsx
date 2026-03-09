'use client';

import { Unit } from '@/lib/data';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';

const LED_COLORS: Record<string, { off: string; on: string; glow: string }> = {
    green: { off: '#1a2a1a', on: '#00ff44', glow: 'rgba(0,255,68,0.6)' },
    amber: { off: '#2a1f0a', on: '#ffbb00', glow: 'rgba(255,187,0,0.6)' },
    red: { off: '#2a0a0a', on: '#ff2211', glow: 'rgba(255,34,17,0.7)' },
};

export default function BeckettPanel({ unit }: { unit: Unit }) {
    const { updateUnit, updateLiveData, clearAlerts } = useApp();

    const resetLockout = (heaterId: number) => {
        const heaters = [...unit.heaters];
        const hIdx = heaters.findIndex(h => h.id === heaterId);
        if (hIdx > -1) {
            heaters[hIdx] = {
                ...heaters[hIdx],
                status: 'operational',
                faultCode: undefined,
                leds: heaters[hIdx].leds.map(led => {
                    if (led.label === 'LOCKOUT' || led.label === 'FAULT') return { ...led, active: false };
                    if (led.label === 'FLAME') return { ...led, active: true, color: 'green' };
                    return led;
                })
            };
        }

        const hasLockout = heaters.some(h => h.status === 'lockout');
        const hasWarning = heaters.some(h => h.status === 'warning');
        const unitStatus = hasLockout ? 'offline' : hasWarning ? 'warning' : 'online';

        updateUnit(unit.id, { status: unitStatus, machineOn: unitStatus !== 'offline', heaters });

        if (unitStatus === 'online') {
            updateLiveData(unit.id, { fuelPct: 85, voltage: 119.5, supplyTemp: 145 });
            clearAlerts();
        }
    };

    return (
        <div className="rounded-2xl p-5 h-full" style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#7A8299]">Beckett 7565 Controller</div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: '#4A5168' }}>Burner Diagnostics</span>
            </div>

            <div className="space-y-4">
                {unit.heaters.map(heater => {
                    const statusColor = heater.status === 'operational' ? '#22C55E' : heater.status === 'lockout' ? '#EF4444' : '#F59E0B';
                    const statusBg = heater.status === 'operational' ? 'rgba(34,197,94,0.1)' : heater.status === 'lockout' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)';
                    return (
                        <div key={heater.id}>
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                <span className="text-xs font-bold tracking-widest text-[#7A8299]">{heater.label}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase" style={{ background: statusBg, color: statusColor }}>{heater.status}</span>
                                <span className="text-[10px] text-[#4A5168] ml-auto">Beckett 7565</span>
                            </div>

                            {/* LEDs */}
                            <div className="rounded-xl p-3 mb-3" style={{ background: '#050911', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div className="flex gap-4 flex-wrap">
                                    {heater.leds.map(led => {
                                        const c = LED_COLORS[led.color];
                                        return (
                                            <div key={led.label} className="flex flex-col items-center gap-1.5">
                                                <motion.div
                                                    className="w-4 h-4 rounded-full"
                                                    animate={led.active && led.flashing ? { opacity: [1, 0.15, 1] } : {}}
                                                    transition={{ repeat: Infinity, duration: 0.7 }}
                                                    style={{
                                                        background: led.active ? c.on : c.off,
                                                        border: '1.5px solid rgba(255,255,255,0.1)',
                                                        boxShadow: led.active ? `0 0 8px ${c.glow}` : 'none',
                                                    }}
                                                />
                                                <span className="text-[8px] font-bold text-[#4A5168] whitespace-nowrap">{led.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Diagnostics */}
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { label: 'Current', value: `${heater.current.toFixed(1)} A`, fault: heater.current === 0 && heater.status === 'lockout' },
                                    { label: 'Voltage', value: `${heater.voltage} V` },
                                    { label: 'CAD Cell', value: heater.cadCell >= 10000 ? `${Math.round(heater.cadCell / 1000)}k+ Ω` : `${heater.cadCell.toLocaleString()} Ω`, fault: heater.cadCell > 50000 },
                                    { label: heater.faultCode ? 'Fault Code' : 'Cycles', value: heater.faultCode ?? heater.cycles.toLocaleString(), fault: !!heater.faultCode },
                                ].map(({ label, value, fault }) => (
                                    <div key={label} className="rounded-lg p-2.5" style={{ background: '#141E33' }}>
                                        <div className="text-[10px] text-[#4A5168] uppercase tracking-wider">{label}</div>
                                        <div className="text-sm font-bold font-mono mt-0.5" style={{ color: fault ? '#EF4444' : '#E8EAF0' }}>{value}</div>
                                    </div>
                                ))}
                            </div>

                            {heater.status === 'lockout' && (
                                <button
                                    onClick={() => resetLockout(heater.id)}
                                    className="w-full mt-3 py-2 rounded-xl text-xs font-bold transition-all hover:bg-opacity-80"
                                    style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}
                                >
                                    Reset Lockout
                                </button>
                            )}
                        </div>
                    );
                })}

                {unit.heaters.length === 0 && (
                    <div className="text-center py-8 text-[#4A5168] text-sm">Unit offline — no heater data available</div>
                )}
            </div>
        </div>
    );
}
