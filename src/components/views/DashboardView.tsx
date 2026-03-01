'use client';

import { useApp } from '@/context/AppContext';
import { UNITS } from '@/lib/data';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Thermometer, Zap, Droplets, AlertTriangle, Power, Clock, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MiniSparkline from '@/components/MiniSparkline';
import BeckettPanel from '@/components/BeckettPanel';
import StackLight from '@/components/StackLight';

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] } }),
};

export default function DashboardView() {
    const { selectedUnit, liveData, addAlert, setView } = useApp();
    const unit = UNITS[selectedUnit];
    const live = liveData[selectedUnit];
    const [holding, setHolding] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);
    const [machineOn, setMachineOn] = useState(unit.machineOn);
    const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => { setMachineOn(unit.machineOn); }, [unit]);

    const startHold = () => {
        setHolding(true);
        let progress = 0;
        holdTimer.current = setInterval(() => {
            progress += 3.5;
            setHoldProgress(progress);
            if (progress >= 100) {
                clearInterval(holdTimer.current!);
                setMachineOn(v => !v);
                setHolding(false);
                setHoldProgress(0);
            }
        }, 100);
    };
    const endHold = () => {
        if (holdTimer.current) clearInterval(holdTimer.current);
        setHolding(false);
        setHoldProgress(0);
    };

    const statusColor = unit.status === 'online' ? '#22C55E' : unit.status === 'warning' ? '#F59E0B' : '#EF4444';
    const statusLabel = unit.status === 'online' ? 'ONLINE' : unit.status === 'warning' ? 'WARNING' : 'OFFLINE';

    return (
        <div className="space-y-5 max-w-[1400px]">
            {/* Unit header */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
                className="rounded-2xl p-5 flex items-center gap-5 flex-wrap"
                style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)' }}>
                    <Zap className="w-6 h-6 text-[#FF6B35]" />
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-bold text-white">DB 1200 Industrial Heater</h1>
                    <p className="text-sm font-mono text-[#7A8299]">SN: {unit.serial}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}40` }}>
                            ● {statusLabel}
                        </span>
                        <span className="text-xs text-[#7A8299]">📍 {unit.site}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#7A8299]">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono">{unit.uptime}</span>
                </div>
            </motion.div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Supply Temp', value: `${live.supplyTemp}°F`, icon: Thermometer, color: '#FF6B35', sub: `ΔT: ${(live.supplyTemp - live.returnTemp).toFixed(0)}°F` },
                    { label: 'Return Temp', value: `${live.returnTemp}°F`, icon: Thermometer, color: '#3B82F6', sub: 'Sensor: Type J TC' },
                    { label: 'Supply Voltage', value: `${live.voltage}V`, icon: Zap, color: '#A78BFA', sub: 'Nominal 120VAC' },
                    { label: 'Fuel Level', value: `${live.fuelPct}%`, icon: Droplets, color: live.fuelPct < 20 ? '#EF4444' : live.fuelPct < 40 ? '#F59E0B' : '#22C55E', sub: live.fuelPct < 20 ? '⚠ Low — refill soon' : 'Rochester 0–10V' },
                ].map(({ label, value, icon: Icon, color, sub }, i) => (
                    <motion.div key={label} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible"
                        className="rounded-2xl p-5"
                        style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#7A8299]">{label}</span>
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                                <Icon className="w-4 h-4" style={{ color }} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold font-mono" style={{ color }}>{value}</div>
                        <div className="text-xs text-[#4A5168] mt-1">{sub}</div>
                    </motion.div>
                ))}
            </div>

            {/* Main panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Power control */}
                <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible"
                    className="rounded-2xl p-6 flex flex-col items-center justify-center gap-4 lg:col-span-1"
                    style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#7A8299] self-start">Power Control</div>
                    <div className="flex items-center gap-3 self-start">
                        <motion.span animate={{ opacity: machineOn ? [1, 0.4, 1] : 1 }} transition={{ repeat: Infinity, duration: 1.8 }}
                            className="w-2.5 h-2.5 rounded-full" style={{ background: machineOn ? '#22C55E' : '#4A5168' }} />
                        <span className="text-sm font-bold" style={{ color: machineOn ? '#22C55E' : '#7A8299' }}>{machineOn ? 'RUNNING' : 'STOPPED'}</span>
                    </div>

                    {/* Hold button */}
                    <div className="relative">
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 140 140">
                            <circle cx="70" cy="70" r="62" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                            <motion.circle
                                cx="70" cy="70" r="62" fill="none"
                                stroke={machineOn ? '#EF4444' : '#FF6B35'}
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 62}`}
                                strokeDashoffset={`${2 * Math.PI * 62 * (1 - holdProgress / 100)}`}
                                transition={{ ease: 'linear' }}
                            />
                        </svg>
                        <button
                            onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold}
                            onTouchStart={startHold} onTouchEnd={endHold}
                            className="w-36 h-36 rounded-full flex flex-col items-center justify-center gap-1 select-none cursor-pointer transition-all"
                            style={{ background: machineOn ? 'linear-gradient(135deg, #1a0a0a, #2c1010)' : 'linear-gradient(135deg, #0E1525, #141E33)', border: `2px solid ${machineOn ? 'rgba(239,68,68,0.3)' : 'rgba(255,107,53,0.3)'}` }}
                        >
                            <Power className="w-8 h-8" style={{ color: machineOn ? '#EF4444' : '#FF6B35' }} />
                            <span className="text-[10px] font-bold text-center leading-tight" style={{ color: machineOn ? '#EF4444' : '#FF6B35' }}>
                                HOLD TO<br />{machineOn ? 'TURN OFF' : 'TURN ON'}
                            </span>
                        </button>
                    </div>
                    <p className="text-xs text-[#4A5168]">Hold for 3 seconds</p>
                </motion.div>

                {/* Temp chart */}
                <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible"
                    className="rounded-2xl p-5 lg:col-span-2"
                    style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-[#7A8299]">Historical Data</div>
                            <div className="text-sm text-[#4A5168] mt-0.5">Last 24 hours</div>
                        </div>
                        <button onClick={() => setView('history')}
                            className="text-xs font-bold text-[#FF6B35] hover:underline flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> View Full History →
                        </button>
                    </div>
                    <MiniSparkline unit={unit} />
                </motion.div>
            </div>

            {/* Beckett + Stack Light */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2">
                    <BeckettPanel unit={unit} />
                </motion.div>
                <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
                    <StackLight unit={unit} machineOn={machineOn} />
                </motion.div>
            </div>

            {/* E-Stop */}
            <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible"
                className="rounded-2xl p-5 flex items-center justify-between gap-4"
                style={{ background: 'linear-gradient(135deg, #1a0a0a, #1e0e0e)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div className="flex items-center gap-4">
                    <AlertTriangle className="w-7 h-7 text-[#EF4444] flex-shrink-0" />
                    <div>
                        <div className="text-sm font-bold text-[#EF4444] uppercase tracking-wider">E-Stop Activations</div>
                        <div className="text-xs text-[#7A8299] mt-0.5">Physical emergency stop press count</div>
                    </div>
                </div>
                <span className="text-5xl font-bold font-mono text-[#EF4444]">{unit.estopCount}</span>
            </motion.div>
        </div>
    );
}
