'use client';

import { Activity, Wrench, User, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_LOGS = [
    { id: 1, user: 'Jordan Torres', action: 'Replaced secondary fuel filter.', time: '2 hours ago', type: 'maintenance' },
    { id: 2, user: 'Admin User', action: 'Increased alert threshold for fuel to 25%.', time: '1 day ago', type: 'settings' },
    { id: 3, user: 'Jordan Torres', action: 'Cleared Ignition E-12 fault code manually.', time: '3 days ago', type: 'operation' },
];

export default function ServiceLogWidget() {
    return (
        <div className="rounded-2xl p-5 h-full" style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.1)' }}>
                        <MessageSquare className="w-4 h-4 text-[#A78BFA]" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white uppercase tracking-wider">Operator Log</div>
                        <div className="text-xs text-[#7A8299]">Recent notes & actions</div>
                    </div>
                </div>
                <button className="text-xs font-bold text-[#A78BFA] hover:underline">Add Note</button>
            </div>

            <div className="space-y-3 mt-4">
                {MOCK_LOGS.map((log, i) => (
                    <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: log.type === 'maintenance' ? 'rgba(59,130,246,0.15)' : log.type === 'settings' ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)' }}>
                            {log.type === 'maintenance' ? <Wrench className="w-3.5 h-3.5 text-[#3B82F6]" /> : log.type === 'settings' ? <Activity className="w-3.5 h-3.5 text-[#F59E0B]" /> : <User className="w-3.5 h-3.5 text-[#22C55E]" />}
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-white">{log.user}</div>
                            <div className="text-[11px] text-[#A0ABC0] mt-0.5 leading-snug">{log.action}</div>
                            <div className="text-[9px] text-[#7A8299] font-mono mt-1">{log.time}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
