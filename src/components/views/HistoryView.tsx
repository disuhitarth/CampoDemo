'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { genHistoryData, TimeRange } from '@/lib/data';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const RANGES: TimeRange[] = ['1h', '6h', '24h', '7d', '30d'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl p-3 text-xs" style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
            <div className="text-[#7A8299] mb-2">{label}</div>
            {payload.map((p: any) => (
                <div key={p.name} className="flex items-center gap-2 py-0.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-[#7A8299]">{p.name}:</span>
                    <span className="font-bold font-mono text-white">{p.value}</span>
                </div>
            ))}
        </div>
    );
};

export default function HistoryView() {
    const { selectedUnit, units } = useApp();
    const unit = units[selectedUnit];
    const [range, setRange] = useState<TimeRange>('24h');
    const [showSupply, setShowSupply] = useState(true);
    const [showReturn, setShowReturn] = useState(true);

    const data = useMemo(() => {
        const d = genHistoryData(unit, range);
        return d.labels.map((label, i) => ({
            label, supply: d.supplyData[i], returnT: d.returnData[i], voltage: d.voltageData[i], fuel: d.fuelData[i],
        }));
    }, [unit, range]); // Removed disable-line to trigger correctly when unit data changes.

    return (
        <div className="space-y-5 max-w-[1400px]">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-bold text-white">Historical Data</h1>
                    <p className="text-sm text-[#7A8299] mt-0.5">Parameter trends for {unit.name} — SN: {unit.serial}</p>
                </div>

                {/* Range tabs */}
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {RANGES.map(r => (
                        <button key={r}
                            onClick={() => setRange(r)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                            style={range === r
                                ? { background: 'rgba(255,107,53,0.15)', color: '#FF6B35', border: '1px solid rgba(255,107,53,0.25)' }
                                : { color: '#7A8299', border: '1px solid transparent' }
                            }
                        >
                            {r.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Param toggles */}
            <div className="flex gap-4 flex-wrap">
                {[
                    { label: 'Supply Temp', key: 'supply', color: '#FF6B35', value: showSupply, set: setShowSupply },
                    { label: 'Return Temp', key: 'return', color: '#3B82F6', value: showReturn, set: setShowReturn },
                ].map(({ label, color, value, set }) => (
                    <button key={label} onClick={() => set(v => !v)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{ background: value ? `${color}15` : 'rgba(255,255,255,0.04)', border: `1px solid ${value ? color + '40' : 'rgba(255,255,255,0.08)'}`, color: value ? color : '#7A8299' }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: value ? color : '#4A5168' }} />
                        {label}
                    </button>
                ))}
            </div>

            {/* Temperature chart */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className="rounded-2xl p-5" style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-xs font-bold uppercase tracking-wider text-[#7A8299] mb-4">Supply & Return Temperature Trend</div>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF6B35" stopOpacity={0.2} /><stop offset="95%" stopColor="#FF6B35" stopOpacity={0} /></linearGradient>
                                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} /><stop offset="95%" stopColor="#3B82F6" stopOpacity={0} /></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="label" tick={{ fill: '#4A5168', fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                            <YAxis tick={{ fill: '#4A5168', fontSize: 9 }} tickLine={false} axisLine={false} unit="°F" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11, color: '#7A8299', paddingTop: 8 }} />
                            {showSupply && <Area type="monotone" dataKey="supply" name="Supply °F" stroke="#FF6B35" strokeWidth={2} fill="url(#sg)" dot={false} />}
                            {showReturn && <Area type="monotone" dataKey="returnT" name="Return °F" stroke="#3B82F6" strokeWidth={2} fill="url(#rg)" dot={false} />}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Voltage + Fuel side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}
                    className="rounded-2xl p-5" style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#7A8299] mb-4">Power Supply Voltage Fluctuations</div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="label" tick={{ fill: '#4A5168', fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                                <YAxis tick={{ fill: '#4A5168', fontSize: 9 }} tickLine={false} axisLine={false} unit="V" domain={['auto', 'auto']} />
                                <Tooltip content={<CustomTooltip />} />
                                <ReferenceLine y={120} stroke="rgba(34,197,94,0.4)" strokeDasharray="4 4" label={{ value: '120V Nominal', fill: '#4A5168', fontSize: 9 }} />
                                <Line type="monotone" dataKey="voltage" name="Voltage VAC" stroke="#A78BFA" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.3 }}
                    className="rounded-2xl p-5" style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#7A8299] mb-4">Fuel Level Over Time</div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} /><stop offset="95%" stopColor="#22C55E" stopOpacity={0} /></linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="label" tick={{ fill: '#4A5168', fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                                <YAxis tick={{ fill: '#4A5168', fontSize: 9 }} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
                                <Tooltip content={<CustomTooltip />} />
                                <ReferenceLine y={20} stroke="rgba(245,158,11,0.5)" strokeDasharray="4 4" label={{ value: '20% Warning', fill: '#F59E0B', fontSize: 9 }} />
                                <ReferenceLine y={5} stroke="rgba(239,68,68,0.5)" strokeDasharray="3 3" label={{ value: '5% Critical', fill: '#EF4444', fontSize: 9 }} />
                                <Area type="monotone" dataKey="fuel" name="Fuel %" stroke="#22C55E" strokeWidth={2} fill="url(#fg)" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
