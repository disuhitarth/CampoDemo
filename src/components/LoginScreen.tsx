'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { USERS } from '@/lib/data';
import { useApp } from '@/context/AppContext';
import { Flame, Shield, Eye, EyeOff } from 'lucide-react';

export default function LoginScreen() {
    const { login } = useApp();
    const [email, setEmail] = useState('operator@campo.io');
    const [password, setPassword] = useState('demo1234');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const user = USERS[email.toLowerCase()];
        if (!user || user.password !== password) {
            setError('Invalid email or password.');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: _pw, ...safeUser } = user;
            login(safeUser);
        }, 900);
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 110%, rgba(255,107,53,0.06) 0%, #070B14 60%)' }}>
            {/* Subtle grid bg */}
            <div className="fixed inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }} />

            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[420px] mx-4"
            >
                {/* Logo */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                        style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(255,107,53,0.05))', border: '1px solid rgba(255,107,53,0.2)' }}
                    >
                        <Flame className="w-8 h-8 text-[#FF6B35]" />
                    </motion.div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">CampoHeat</h1>
                    <p className="text-sm text-[#7A8299] mt-1">DB 1200 Industrial HMI</p>
                </div>

                {/* Card */}
                <div className="rounded-2xl p-8" style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
                    <div className="flex items-center gap-2 mb-6">
                        <Shield className="w-4 h-4 text-[#FF6B35]" />
                        <span className="text-xs font-bold tracking-widest text-[#7A8299] uppercase">Secure Login</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#7A8299] uppercase tracking-wider mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-[#4A5168] outline-none transition-all"
                                style={{ background: '#141E33', border: '1px solid rgba(255,255,255,0.08)' }}
                                placeholder="operator@campo.io"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#7A8299] uppercase tracking-wider mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-white placeholder-[#4A5168] outline-none transition-all"
                                    style={{ background: '#141E33', border: '1px solid rgba(255,255,255,0.08)' }}
                                    placeholder="••••••••"
                                    required
                                />
                                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A5168] hover:text-[#7A8299]">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400 text-center py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)' }}>
                                {error}
                            </motion.p>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-bold text-sm text-white mt-2 relative overflow-hidden disabled:opacity-70"
                            style={{ background: 'linear-gradient(135deg, #FF6B35, #e85a28)', boxShadow: '0 4px 20px rgba(255,107,53,0.3)' }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Authenticating…
                                </span>
                            ) : 'Sign In Securely'}
                        </motion.button>
                    </form>

                    <p className="text-center text-xs text-[#4A5168] mt-6">
                        Demo: <span className="text-[#7A8299]">operator@campo.io</span> / <span className="text-[#7A8299]">demo1234</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
