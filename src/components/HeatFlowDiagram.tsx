'use client';

import { motion } from 'framer-motion';

export default function HeatFlowDiagram({ machineOn, supplyTemp, returnTemp }: { machineOn: boolean, supplyTemp: number, returnTemp: number }) {
    const isHeating = machineOn;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="text-xs font-bold uppercase tracking-wider text-[#7A8299] absolute top-4 left-4">Heat Flow</div>

            <div className="flex items-center justify-between w-full max-w-[300px] mt-4 relative">
                {/* Return Air */}
                <div className="flex flex-col items-center gap-2 z-10 w-20">
                    <span className="text-[10px] font-bold text-[#3B82F6] uppercase tracking-wider">Return Air</span>
                    <span className="text-xl font-mono text-white">{returnTemp}°F</span>
                </div>

                {/* Exchanger Chamber */}
                <div className="flex-1 h-16 mx-4 relative rounded-xl border-2 border-[rgba(255,255,255,0.05)] bg-[#0A0F1A] flex items-center justify-center overflow-hidden">
                    {/* Heating Elements */}
                    <motion.div
                        className="absolute inset-0 opacity-0"
                        animate={{ opacity: isHeating ? [0.3, 0.6, 0.3] : 0 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.2), transparent)' }}
                    />
                    <div className="flex gap-2">
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={i}
                                className="w-1.5 h-10 rounded-full"
                                animate={{
                                    backgroundColor: isHeating ? '#FF6B35' : '#1A2235',
                                    boxShadow: isHeating ? '0 0 10px rgba(255,107,53,0.5)' : 'none'
                                }}
                                transition={{ duration: 0.5 }}
                            />
                        ))}
                    </div>

                    {/* Airflow Particles */}
                    {isHeating && (
                        <div className="absolute inset-0 pointer-events-none">
                            {[0, 1, 2, 3].map(i => (
                                <motion.div
                                    key={`p-${i}`}
                                    className="absolute top-1/2 w-2 h-0.5 rounded-full"
                                    style={{ background: 'linear-gradient(90deg, #3B82F6, #FF6B35)', y: '-50%' }}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 150, opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.4, ease: "linear" }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Supply Air */}
                <div className="flex flex-col items-center gap-2 z-10 w-20">
                    <span className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider">Supply Air</span>
                    <span className="text-xl font-mono text-white">{supplyTemp}°F</span>
                </div>
            </div>
        </div>
    );
}
