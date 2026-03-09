'use client';

import { useApp } from '@/context/AppContext';
import { Bell, ChevronDown, Radio, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
    const { user, selectedUnit, setSelectedUnit, alerts, setView, units, setMobileMenuOpen } = useApp();
    const unit = units[selectedUnit];
    const unread = alerts.filter(a => a.type !== 'resolved').length;

    return (
        <header className="h-14 flex items-center gap-2 sm:gap-4 px-3 sm:px-5 flex-shrink-0 z-40 sticky top-0"
            style={{ background: 'rgba(7,11,20,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-1.5 text-[#7A8299] hover:text-white transition-colors"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Unit selector */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0E1525] focus-within:border-[#FF6B35] transition-colors relative">
                <Radio className="w-3.5 h-3.5 text-[#FF6B35] flex-shrink-0" />
                <select
                    value={selectedUnit}
                    onChange={e => setSelectedUnit(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-white outline-none cursor-pointer appearance-none pr-4 min-w-[130px]"
                    style={{ color: '#E8EAF0' }}
                >
                    {Object.values(units).map(u => (
                        <option key={u.id} value={u.id} style={{ background: '#0E1525' }}>
                            {u.name} — SN: {u.serial}
                        </option>
                    ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#7A8299] absolute right-3 pointer-events-none" />
            </div>

            {/* Live badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E' }}>
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                LIVE
            </div>

            <div className="ml-auto flex items-center gap-2">
                {/* Alerts bell */}
                <button onClick={() => setView('alerts')} className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors">
                    <Bell className="w-[18px] h-[18px] text-[#7A8299]" />
                    {unread > 0 && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                            style={{ background: '#EF4444', color: '#fff' }}>
                            {unread}
                        </motion.span>
                    )}
                </button>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #FF6B35, #e85a28)' }}>
                    {user?.initials ?? 'JT'}
                </div>
            </div>
        </header>
    );
}
