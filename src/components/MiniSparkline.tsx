'use client';

import { useMemo } from 'react';
import { genHistoryData } from '@/lib/data';
import { Unit } from '@/lib/data';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function MiniSparkline({ unit }: { unit: Unit }) {
    const data = useMemo(() => {
        const d = genHistoryData(unit, '24h');
        return d.labels.map((label, i) => ({ label, supply: d.supplyData[i], returnT: d.returnData[i] }));
    }, [unit.id]); // eslint-disable-line

    return (
        <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="returnGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="label" tick={{ fill: '#4A5168', fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: '#4A5168', fontSize: 9 }} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#E8EAF0', fontSize: 12 }}
                        labelStyle={{ color: '#7A8299' }}
                    />
                    <Area type="monotone" dataKey="supply" name="Supply °F" stroke="#FF6B35" strokeWidth={2} fill="url(#supplyGrad)" dot={false} />
                    <Area type="monotone" dataKey="returnT" name="Return °F" stroke="#3B82F6" strokeWidth={2} fill="url(#returnGrad)" dot={false} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
