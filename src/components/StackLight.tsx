'use client';

import { Unit } from '@/lib/data';
import { motion } from 'framer-motion';

const LIGHTS = [
    { label: 'Red', color: '#EF4444', glow: 'rgba(239,68,68,0.5)', desc: 'Fault / E-Stop / <5% Fuel' },
    { label: 'Amber', color: '#F59E0B', glow: 'rgba(245,158,11,0.5)', desc: 'Warning / <20% Fuel' },
    { label: 'Green', color: '#22C55E', glow: 'rgba(34,197,94,0.5)', desc: 'Normal Operation' },
];

export default function StackLight({ unit, machineOn }: { unit: Unit; machineOn: boolean }) {
    const redOn = unit.status === 'offline' || unit.fuelPct < 5;
    const amberOn = unit.status === 'warning' || (unit.fuelPct >= 5 && unit.fuelPct < 20);
    const greenOn = machineOn && unit.status === 'online';
    const states = [redOn, amberOn, greenOn];

    return (
        <div className="rounded-2xl p-5 h-full" style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-xs font-bold uppercase tracking-wider text-[#7A8299] mb-4">Stack Light Status</div>

            <div className="flex items-center gap-8 justify-center">
                {/* Tower */}
                <div className="flex flex-col gap-3 items-center">
                    {LIGHTS.map(({ label, color, glow }, i) => {
                        const active = states[i];
                        const flash = (i === 0 && redOn) || (i === 1 && amberOn && !redOn);
                        return (
                            <div key={label} className="relative">
                                <motion.div
                                    className="w-14 h-14 rounded-full flex items-center justify-center"
                                    animate={flash && active ? { opacity: [1, 0.1, 1] } : {}}
                                    transition={{ repeat: Infinity, duration: i === 0 ? 0.6 : 1 }}
                                    style={{
                                        background: active ? `radial-gradient(circle at 35% 35%, ${color}ee, ${color}88)` : '#0A0F1A',
                                        border: `2px solid ${active ? color : 'rgba(255,255,255,0.08)'}`,
                                        boxShadow: active ? `0 0 20px ${glow}, inset 0 1px 2px rgba(255,255,255,0.15)` : 'none',
                                    }}
                                >
                                    <div className="w-6 h-6 rounded-full" style={{ background: active ? 'rgba(255,255,255,0.1)' : 'transparent' }} />
                                </motion.div>
                            </div>
                        );
                    })}
                    <div className="w-4 h-7 rounded-sm mt-1" style={{ background: '#141E33', border: '2px solid rgba(255,255,255,0.08)' }} />
                </div>

                {/* Legend */}
                <div className="space-y-4">
                    {LIGHTS.map(({ label, color, desc }, i) => (
                        <div key={label} className="flex items-start gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0" style={{ background: states[i] ? color : '#4A5168' }} />
                            <div>
                                <div className="text-sm font-bold" style={{ color: states[i] ? color : '#7A8299' }}>{label}</div>
                                <div className="text-[10px] text-[#4A5168]">{desc}</div>
                                <div className="text-[10px] font-bold mt-0.5" style={{ color: states[i] ? color : '#4A5168' }}>
                                    {states[i] ? 'ACTIVE' : 'OFF'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
