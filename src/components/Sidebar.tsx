'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, Map, LineChart, Bell, LogOut, Zap } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ViewId } from '@/lib/data';

const NAV_ITEMS: { view: ViewId; label: string; icon: React.ElementType }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'map', label: 'Fleet Map', icon: Map },
    { view: 'history', label: 'Historical Data', icon: LineChart },
    { view: 'alerts', label: 'Alerts', icon: Bell },
];

export default function Sidebar() {
    const { currentView, setView, alerts, logout, user, selectedUnit } = useApp();
    const unreadAlerts = alerts.filter(a => a.type !== 'resolved').length;

    return (
        <aside className="hidden md:flex w-[220px] flex-col flex-shrink-0 h-screen sticky top-0"
            style={{ background: '#0E1525', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
            {/* Brand */}
            <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,rgba(255,107,53,0.25),rgba(255,107,53,0.05))', border: '1px solid rgba(255,107,53,0.3)' }}>
                    <Zap className="w-4 h-4 text-[#FF6B35]" />
                </div>
                <div>
                    <div className="text-sm font-bold text-white tracking-tight">CampoHeat</div>
                    <div className="text-[10px] text-[#7A8299] font-mono">DB 1200 HMI</div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {NAV_ITEMS.map(({ view, label, icon: Icon }) => {
                    const active = currentView === view;
                    return (
                        <button
                            key={view}
                            onClick={() => setView(view)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold relative transition-colors"
                            style={{ color: active ? '#FF6B35' : '#7A8299' }}
                        >
                            {active && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 rounded-xl"
                                    style={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.15)' }}
                                    transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                                />
                            )}
                            <Icon className="w-[18px] h-[18px] relative z-10 flex-shrink-0" />
                            <span className="relative z-10">{label}</span>
                            {view === 'alerts' && unreadAlerts > 0 && (
                                <span className="ml-auto relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                    style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                                    {unreadAlerts}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="px-3 py-1">
                    <div className="text-[10px] text-[#4A5168]">v2.4.1</div>
                    <div className="text-[10px] font-mono text-[#7A8299]">SN: {selectedUnit === 'camo1' ? 'DB1200-0041' : selectedUnit === 'camo2' ? 'DB1200-0042' : 'DB1200-0089'}</div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#4A5168] hover:text-[#EF4444] transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
