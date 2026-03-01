'use client';

import { useApp } from '@/context/AppContext';
import { Alert } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, XCircle, Trash2 } from 'lucide-react';
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
                        return (
                            <motion.div key={alert.id}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: alert.type === 'resolved' ? 0.45 : 1, x: 0 }}
                                exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0 }}
                                transition={{ delay: i * 0.03, duration: 0.25 }}
                                className="rounded-2xl p-4 flex items-start gap-4"
                                style={{
                                    background: cfg.bg,
                                    border: `1px solid ${cfg.border}${cfg.borderOp}`,
                                    borderLeft: `3px solid ${cfg.color}`,
                                }}
                            >
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{ background: `${cfg.color}15` }}>
                                    <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-sm text-white">{alert.title}</div>
                                    <div className="text-xs text-[#7A8299] mt-0.5">{alert.desc}</div>
                                    <div className="flex items-center gap-3 mt-2 text-[10px] text-[#4A5168]">
                                        <span className="font-mono">{formatDistanceToNow(alert.time, { addSuffix: true })}</span>
                                        <span>·</span>
                                        <span className="font-semibold" style={{ color: '#7A8299' }}>{alert.unit}</span>
                                    </div>
                                </div>

                                {alert.type !== 'resolved' && (
                                    <button onClick={() => acknowledgeAlert(alert.id)}
                                        className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80"
                                        style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                                        ACK
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
