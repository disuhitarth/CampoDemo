'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, AlertTriangle, Droplet, RefreshCw, X, ShieldAlert, Zap } from 'lucide-react';

export default function DemoToolbar() {
    const { selectedUnit, units, updateUnit, updateLiveData, addAlert, clearAlerts } = useApp();
    const [open, setOpen] = useState(false);
    const unit = units[selectedUnit];

    const triggerEStop = () => {
        updateUnit(selectedUnit, {
            status: 'offline',
            machineOn: false,
            estopCount: unit.estopCount + 1
        });
        addAlert({
            type: 'critical',
            title: 'E-Stop Triggered (Demo)',
            desc: `Physical E-Stop activated on ${unit.name}. Machine halted instantly.`,
            unit: unit.name,
            time: new Date()
        });
    };

    const triggerLowFuel = () => {
        updateUnit(selectedUnit, { status: 'warning' });
        updateLiveData(selectedUnit, { fuelPct: 4 });
        addAlert({
            type: 'warning',
            title: 'Critical Low Fuel (Demo)',
            desc: `${unit.name} fuel dropped to 4%. Immediate refill required.`,
            unit: unit.name,
            time: new Date()
        });
    };

    const triggerLockout = () => {
        const heaters = [...unit.heaters];
        if (heaters.length > 0) {
            heaters[0] = {
                ...heaters[0],
                status: 'lockout',
                faultCode: 'E-12 Ignition',
                leds: heaters[0].leds.map(led => {
                    if (led.label === 'LOCKOUT' || led.label === 'FAULT') return { ...led, active: true, color: 'red' };
                    if (led.label === 'FLAME') return { ...led, active: false };
                    return led;
                })
            };
        }
        updateUnit(selectedUnit, { status: 'offline', machineOn: false, heaters });
        addAlert({
            type: 'critical',
            title: 'Beckett Lockout (Demo)',
            desc: `Burner 1 on ${unit.name} failed ignition sequence. Manual reset needed.`,
            unit: unit.name,
            time: new Date()
        });
    };

    const resetUnit = () => {
        const heaters = [...unit.heaters];
        if (heaters.length > 0) {
            heaters[0] = {
                ...heaters[0],
                status: 'operational',
                faultCode: undefined,
                leds: heaters[0].leds.map(led => {
                    if (led.label === 'LOCKOUT' || led.label === 'FAULT') return { ...led, active: false };
                    if (led.label === 'FLAME') return { ...led, active: true, color: 'green' };
                    return led;
                })
            };
        }
        updateUnit(selectedUnit, { status: 'online', machineOn: true, heaters });
        updateLiveData(selectedUnit, { fuelPct: 85, voltage: 119.5, supplyTemp: 145 });
        clearAlerts();
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="p-4 rounded-2xl w-64 pointer-events-auto"
                        style={{ background: 'rgba(14,21,37,0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,107,53,0.3)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B35]">Presenter Demo Controls</span>
                            <button onClick={() => setOpen(false)} className="text-[#7A8299] hover:text-white"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="space-y-2">
                            <button onClick={triggerEStop} className="w-full flex items-center gap-3 p-2 rounded-lg text-sm text-white hover:bg-[#EF4444]/20 transition-colors border border-transparent hover:border-[#EF4444]/30 text-left">
                                <ShieldAlert className="w-4 h-4 text-[#EF4444]" /> Trigger E-Stop
                            </button>
                            <button onClick={triggerLowFuel} className="w-full flex items-center gap-3 p-2 rounded-lg text-sm text-white hover:bg-[#F59E0B]/20 transition-colors border border-transparent hover:border-[#F59E0B]/30 text-left">
                                <Droplet className="w-4 h-4 text-[#F59E0B]" /> Drop Fuel to 4%
                            </button>
                            <button onClick={triggerLockout} className="w-full flex items-center gap-3 p-2 rounded-lg text-sm text-white hover:bg-[#A78BFA]/20 transition-colors border border-transparent hover:border-[#A78BFA]/30 text-left">
                                <Zap className="w-4 h-4 text-[#A78BFA]" /> Trip Burner Lockout
                            </button>
                            <div className="h-px w-full my-2" style={{ background: 'rgba(255,255,255,0.1)' }} />
                            <button onClick={resetUnit} className="w-full flex items-center gap-3 p-2 rounded-lg text-sm text-white hover:bg-[#22C55E]/20 transition-colors border border-transparent hover:border-[#22C55E]/30 text-left">
                                <RefreshCw className="w-4 h-4 text-[#22C55E]" /> Restore Normal State
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setOpen(v => !v)}
                className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto hover:rotate-90 transition-transform duration-300"
                style={{ background: 'linear-gradient(135deg, #FF6B35, #e85a28)', boxShadow: '0 4px 14px rgba(255,107,53,0.4)', border: '2px solid rgba(255,255,255,0.1)' }}
            >
                <Settings2 className="w-6 h-6 text-white" />
            </button>
        </div>
    );
}
