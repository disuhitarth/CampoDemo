'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
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
