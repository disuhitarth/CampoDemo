'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Unit, Alert, AlertType, ViewId, UNITS, SEED_ALERTS, User } from '@/lib/data';

interface AppState {
    user: User | null;
    selectedUnit: string;
    currentView: ViewId;
    alerts: Alert[];
    alertFilter: string;
    liveData: Record<string, { supplyTemp: number; returnTemp: number; voltage: number; fuelPct: number }>;
    units: Record<string, Unit>;
    mobileMenuOpen: boolean;
}

interface AppContextValue extends AppState {
    login: (user: User) => void;
    logout: () => void;
    setView: (view: ViewId) => void;
    setSelectedUnit: (id: string) => void;
    acknowledgeAlert: (id: number) => void;
    clearAlerts: () => void;
    addAlert: (alert: Omit<Alert, 'id'>) => void;
    setAlertFilter: (filter: string) => void;
    updateLiveData: (unitId: string, data: Partial<AppState['liveData'][string]>) => void;
    updateUnit: (unitId: string, data: Partial<Unit>) => void;
    setMobileMenuOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function initLiveData() {
    const d: AppState['liveData'] = {};
    Object.values(UNITS).forEach(u => {
        d[u.id] = { supplyTemp: u.supplyTemp, returnTemp: u.returnTemp, voltage: u.voltage, fuelPct: u.fuelPct };
    });
    return d;
}

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AppState>({
        user: null,
        selectedUnit: 'camo1',
        currentView: 'dashboard',
        alerts: SEED_ALERTS.map(a => ({ ...a, time: new Date(a.time) })),
        alertFilter: 'all',
        liveData: initLiveData(),
        units: UNITS,
        mobileMenuOpen: false,
    });

    // Subtly fluctuate temperature and voltage for online/running machines
    useEffect(() => {
        const timer = setInterval(() => {
            setState(s => {
                const newLiveData = { ...s.liveData };
                let changed = false;

                Object.keys(newLiveData).forEach(unitId => {
                    const unit = s.units[unitId];
                    if (unit.status === 'online' && unit.machineOn) {
                        changed = true;
                        const current = newLiveData[unitId];
                        
                        // Supply voltage noise +/- 0.15V
                        const vNoise = (Math.random() - 0.5) * 0.3;
                        const nextVoltage = Math.min(120.8, Math.max(116.5, current.voltage + vNoise));

                        // Supply & Return Temp noise +/- 0.25°F
                        const sNoise = (Math.random() - 0.5) * 0.5;
                        const rNoise = (Math.random() - 0.5) * 0.5;
                        const nextSupply = Math.min(155, Math.max(130, current.supplyTemp + sNoise));
                        const nextReturn = Math.min(nextSupply - 12, Math.max(105, current.returnTemp + rNoise));

                        newLiveData[unitId] = {
                            ...current,
                            voltage: +nextVoltage.toFixed(1),
                            supplyTemp: +nextSupply.toFixed(0),
                            returnTemp: +nextReturn.toFixed(0)
                        };
                    }
                });

                if (!changed) return s;
                return { ...s, liveData: newLiveData };
            });
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const login = useCallback((user: User) => setState(s => ({ ...s, user })), []);
    const logout = useCallback(() => setState(s => ({ ...s, user: null, currentView: 'dashboard' })), []);
    const setView = useCallback((view: ViewId) => setState(s => ({ ...s, currentView: view })), []);
    const setSelectedUnit = useCallback((id: string) => setState(s => ({ ...s, selectedUnit: id })), []);
    const setAlertFilter = useCallback((filter: string) => setState(s => ({ ...s, alertFilter: filter })), []);
    const clearAlerts = useCallback(() => setState(s => ({ ...s, alerts: [] })), []);
    const acknowledgeAlert = useCallback((id: number) =>
        setState(s => ({ ...s, alerts: s.alerts.map(a => a.id === id ? { ...a, type: 'resolved' as AlertType } : a) })), []);
    const addAlert = useCallback((alert: Omit<Alert, 'id'>) =>
        setState(s => ({ ...s, alerts: [{ ...alert, id: Date.now() }, ...s.alerts] })), []);
    const updateLiveData = useCallback((unitId: string, data: Partial<AppState['liveData'][string]>) =>
        setState(s => ({ ...s, liveData: { ...s.liveData, [unitId]: { ...s.liveData[unitId], ...data } } })), []);
    const updateUnit = useCallback((unitId: string, data: Partial<Unit>) =>
        setState(s => ({ ...s, units: { ...s.units, [unitId]: { ...s.units[unitId], ...data } } })), []);
    const setMobileMenuOpen = useCallback((open: boolean) => setState(s => ({ ...s, mobileMenuOpen: open })), []);

    return (
        <AppContext.Provider value={{ ...state, login, logout, setView, setSelectedUnit, acknowledgeAlert, clearAlerts, addAlert, setAlertFilter, updateLiveData, updateUnit, setMobileMenuOpen }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
