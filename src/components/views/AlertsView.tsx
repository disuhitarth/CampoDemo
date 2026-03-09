'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Alert } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, XCircle, Trash2, ChevronDown, ChevronUp, Timer, Wrench } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const FILTERS = ['all', 'critical', 'warning', 'info'] as const;

const ALERT_CONFIG = {
    critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)', border: '#EF4444', borderOp: '40', icon: XCircle },
    warning: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: '#F59E0B', borderOp: '40', icon: AlertTriangle },
    info: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', border: '#3B82F6', borderOp: '40', icon: Info },
    resolved: { color: '#22C55E', bg: 'rgba(34,197,94,0.05)', border: '#22C55E', borderOp: '30', icon: CheckCircle },
};

export default function AlertsView() {
    const { alerts, alertFilter, setAlertFilter, acknowledgeAlert, clearAlerts } = useApp();
    const [expandedAlert, setExpandedAlert] = useState<number | null>(null);
    const [timerToggle, setTimerToggle] = useState(false);

    useEffect(() => {
        const t = setInterval(() => setTimerToggle(v => !v), 1000);
        return () => clearInterval(t);
    }, []);

    const filtered = alertFilter === 'all' ? alerts : alerts.filter(a => a.type === alertFilter);
    const counts = { all: alerts.length, critical: 0, warning: 0, info: 0 };
    alerts.forEach(a => { if (a.type !== 'resolved' && counts[a.type as keyof typeof counts] !== undefined) counts[a.type as keyof typeof counts]++; });

    return (
        <div className="space-y-5 max-w-[960px]">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-bold text-white">Alert Log</h1>
                    <p className="text-sm text-[#7A8299] mt-0.5">All system alerts for assigned units</p>
                </div>
                <button onClick={clearAlerts}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:text-red-400"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#7A8299' }}>
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1.5 flex-wrap">
                {FILTERS.map(f => {
                    const count = counts[f as keyof typeof counts];
                    const active = alertFilter === f;
                    const filterColor = f === 'critical' ? '#EF4444' : f === 'warning' ? '#F59E0B' : f === 'info' ? '#3B82F6' : '#FF6B35';
                    return (
                        <button key={f} onClick={() => setAlertFilter(f)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all"
                            style={active
                                ? { background: `${filterColor}15`, color: filterColor, border: `1px solid ${filterColor}40` }
                                : { background: '#0E1525', color: '#7A8299', border: '1px solid rgba(255,255,255,0.07)' }
                            }>
                            {f}
                            <span className="px-1.5 py-0.5 rounded-full text-[10px]"
                                style={{ background: active ? `${filterColor}20` : 'rgba(255,255,255,0.06)', color: active ? filterColor : '#4A5168' }}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Alert list */}
            <div className="space-y-2">
                <AnimatePresence>
                    {filtered.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-center py-16 text-[#4A5168]">
                            <CheckCircle className="w-10 h-10 mx-auto mb-3 text-[#22C55E] opacity-40" />
                            <div className="text-sm">No {alertFilter === 'all' ? '' : alertFilter + ' '}alerts recorded.</div>
                        </motion.div>
                    )}

                    {filtered.map((alert, i) => {
                        const cfg = ALERT_CONFIG[alert.type];
                        const Icon = cfg.icon;
                        const isExpanded = expandedAlert === alert.id;
                        const hasPlaybook = alert.type === 'critical' || alert.type === 'warning';
                        const playbookSteps = alert.title.includes('Lockout') ? [
                            'Check CAD Cell resistance on dashboard.',
                            'If CAD > 1500Ω, dispatch tech to clean cell.',
                            'Inspect fuel nozzle for clogs.',
                            'Reset lockout ONLY after visual check.'
                        ] : alert.title.includes('E-Stop') ? [
                            'Inspect area for immediate hazards.',
                            'Communicate with site manager.',
                            'Physically pull out E-Stop button.',
                            'Reset unit power cycle.'
                        ] : alert.title.includes('Fuel') ? [
                            'Verify ETA of fuel truck.',
                            'Monitor supply temperature drop.'
                        ] : [];

                        return (
                            <motion.div key={alert.id} layout
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: alert.type === 'resolved' ? 0.45 : 1, x: 0 }}
                                exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0 }}
                                transition={{ delay: i * 0.03, duration: 0.25 }}
                                className="rounded-2xl flex flex-col overflow-hidden"
                                style={{
                                    background: cfg.bg,
                                    border: `1px solid ${cfg.border}${cfg.borderOp}`,
                                    borderLeft: `3px solid ${cfg.color}`,
                                }}
                            >
                                <div className="p-4 flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                                        style={{ background: `${cfg.color}15` }}>
                                        <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <div className="font-bold text-sm text-white">{alert.title}</div>
                                            {alert.type === 'critical' && (
                                                <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                                                    style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                                                    <Timer className="w-2.5 h-2.5" /> Escalate in 14:{timerToggle ? '22' : '21'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-[#7A8299] mt-0.5">{alert.desc}</div>
                                        <div className="flex items-center gap-3 mt-2 text-[10px] text-[#4A5168]">
                                            <span className="font-mono">{formatDistanceToNow(alert.time, { addSuffix: true })}</span>
                                            <span>·</span>
                                            <span className="font-semibold" style={{ color: '#7A8299' }}>{alert.unit}</span>
                                            {hasPlaybook && alert.type !== 'resolved' && (
                                                <>
                                                    <span>·</span>
                                                    <button onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                                                        className="font-bold flex items-center gap-1 hover:text-white transition-colors"
                                                        style={{ color: cfg.color }}>
                                                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                        {isExpanded ? 'Hide Playbook' : 'AI Playbook'}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {alert.type !== 'resolved' && (
                                        <div className="flex flex-col gap-2 flex-shrink-0">
                                            {alert.type === 'critical' && (
                                                <button onClick={() => acknowledgeAlert(alert.id)}
                                                    className="flex items-center justify-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80 shadow-lg"
                                                    style={{ background: '#3B82F6', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                    <Wrench className="w-3 h-3" /> Dispatch Tech
                                                </button>
                                            )}
                                            <button onClick={() => acknowledgeAlert(alert.id)}
                                                className="flex flex-center justify-center gap-1 flex-shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80"
                                                style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                                                ACKNOWLEDGE
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Expanded Area */}
                                <AnimatePresence>
                                    {isExpanded && alert.type !== 'resolved' && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                            className="px-4 pb-4 overflow-hidden border-t" style={{ borderColor: `rgba(255,255,255,0.05)` }}>
                                            <div className="mt-3 p-4 rounded-xl relative overflow-hidden" style={{ background: '#0E1525', border: '1px solid rgba(167,139,250,0.3)' }}>
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#A78BFA] opacity-5 blur-3xl rounded-full" />
                                                <div className="text-[10px] uppercase font-bold text-[#A78BFA] mb-3 tracking-wider flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-pulse" />
                                                    AI Diagnostic & Resolution Playbook
                                                </div>
                                                <div className="space-y-2">
                                                    {playbookSteps.map((step, idx) => (
                                                        <div key={idx} className="flex items-start gap-2.5 text-xs text-[#E8EAF0]">
                                                            <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 text-[9px] font-bold border"
                                                                style={{ background: 'rgba(167,139,250,0.1)', color: '#A78BFA', borderColor: 'rgba(167,139,250,0.2)' }}>
                                                                {idx + 1}
                                                            </div>
                                                            <div className="mt-0.5 leading-relaxed">{step}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
