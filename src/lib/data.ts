// ── TYPES ─────────────────────────────────────────────────
export type UnitStatus = 'online' | 'warning' | 'offline';
export type AlertType = 'critical' | 'warning' | 'info' | 'resolved';
export type ViewId = 'dashboard' | 'map' | 'history' | 'alerts';

export interface Unit {
    id: string;
    name: string;
    serial: string;
    status: UnitStatus;
    machineOn: boolean;
    site: string;
    uptime: string;
    supplyTemp: number;
    returnTemp: number;
    voltage: number;
    fuelPct: number;
    estopCount: number;
    lat: number;
    lng: number;
    heaters: Heater[];
}

export interface Heater {
    id: number;
    label: string;
    status: 'operational' | 'lockout' | 'warning';
    current: number;
    voltage: number;
    cadCell: number;
    cycles: number;
    faultCode?: string;
    leds: { label: string; color: string; active: boolean; flashing?: boolean }[];
}

export interface Alert {
    id: number;
    type: AlertType;
    title: string;
    desc: string;
    unit: string;
    time: Date;
}

export interface User {
    name: string;
    initials: string;
    role: string;
    email: string;
    units: string[];
}

// ── USERS ─────────────────────────────────────────────────
export const USERS: Record<string, User & { password: string }> = {
    'operator@campo.io': {
        email: 'operator@campo.io',
        password: 'demo1234',
        name: 'Jordan Torres',
        initials: 'JT',
        role: 'Field Operator',
        units: ['camo1', 'camo2', 'camo3'],
    },
    'admin@campo.io': {
        email: 'admin@campo.io',
        password: 'admin1234',
        name: 'Admin User',
        initials: 'AU',
        role: 'Administrator',
        units: ['camo1', 'camo2', 'camo3'],
    },
};

// ── UNITS ─────────────────────────────────────────────────
export const UNITS: Record<string, Unit> = {
    camo1: {
        id: 'camo1',
        name: 'Camo 1',
        serial: 'DB1200-0041',
        status: 'online',
        machineOn: true,
        site: 'Site A — Calgary, AB',
        uptime: '14d 6h 22m',
        supplyTemp: 142,
        returnTemp: 118,
        voltage: 118.2,
        fuelPct: 67,
        estopCount: 3,
        lat: 51.0447,
        lng: -114.0719,
        heaters: [
            {
                id: 1,
                label: 'HEATER 1',
                status: 'operational',
                current: 2.4,
                voltage: 118.2,
                cadCell: 1240,
                cycles: 3847,
                leds: [
                    { label: 'POWER', color: 'green', active: true },
                    { label: 'FLAME', color: 'green', active: true },
                    { label: 'LOCKOUT', color: 'red', active: false },
                    { label: 'FAULT', color: 'red', active: false },
                    { label: 'CALL FOR HEAT', color: 'green', active: true },
                ],
            },
            {
                id: 2,
                label: 'HEATER 2',
                status: 'lockout',
                current: 0.0,
                voltage: 117.8,
                cadCell: 85000,
                cycles: 12400,
                faultCode: 'E-12 Ignition',
                leds: [
                    { label: 'POWER', color: 'green', active: true },
                    { label: 'FLAME', color: 'amber', active: false },
                    { label: 'LOCKOUT', color: 'red', active: true },
                    { label: 'FAULT', color: 'red', active: true },
                    { label: 'CALL FOR HEAT', color: 'green', active: false },
                ],
            },
        ],
    },
    camo2: {
        id: 'camo2',
        name: 'Camo 2',
        serial: 'DB1200-0042',
        status: 'warning',
        machineOn: true,
        site: 'Site B — Edmonton, AB',
        uptime: '3d 14h 5m',
        supplyTemp: 138,
        returnTemp: 114,
        voltage: 117.4,
        fuelPct: 18,
        estopCount: 0,
        lat: 53.5461,
        lng: -113.4938,
        heaters: [
            {
                id: 1,
                label: 'HEATER 1',
                status: 'warning',
                current: 2.1,
                voltage: 117.4,
                cadCell: 950,
                cycles: 1200,
                leds: [
                    { label: 'POWER', color: 'green', active: true },
                    { label: 'FLAME', color: 'green', active: true },
                    { label: 'LOCKOUT', color: 'red', active: false },
                    { label: 'FAULT', color: 'amber', active: true, flashing: true },
                    { label: 'CALL FOR HEAT', color: 'green', active: true },
                ],
            },
        ],
    },
    camo3: {
        id: 'camo3',
        name: 'Camo 3',
        serial: 'DB1200-0089',
        status: 'offline',
        machineOn: false,
        site: 'Site C — Red Deer, AB',
        uptime: '0d 0h 0m',
        supplyTemp: 0,
        returnTemp: 0,
        voltage: 0,
        fuelPct: 44,
        estopCount: 1,
        lat: 52.2681,
        lng: -113.8112,
        heaters: [],
    },
};

// ── SEED ALERTS ─────────────────────────────────────────
export const SEED_ALERTS: Alert[] = [
    { id: 1, type: 'critical', title: 'E-Stop Triggered', desc: 'Physical E-Stop pressed on Camo 3. Unit halted.', unit: 'Camo 3', time: new Date(Date.now() - 3600000) },
    { id: 2, type: 'warning', title: 'Low Fuel Warning', desc: 'Camo 2 fuel level at 18% — below 20% threshold.', unit: 'Camo 2', time: new Date(Date.now() - 7200000) },
    { id: 3, type: 'critical', title: 'Beckett Lockout', desc: 'Heater 2 on Camo 1 entered lockout state. Error E-12 (Ignition Failure).', unit: 'Camo 1', time: new Date(Date.now() - 10800000) },
    { id: 4, type: 'info', title: 'Unit Started', desc: 'Camo 1 successfully started. All systems verified.', unit: 'Camo 1', time: new Date(Date.now() - 86400000) },
];

// ── HISTORY DATA GEN ──────────────────────────────────────
export type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';
const RANGE_POINTS: Record<TimeRange, number> = { '1h': 12, '6h': 24, '24h': 48, '7d': 84, '30d': 120 };
const RANGE_INTERVAL_MIN: Record<TimeRange, number> = { '1h': 5, '6h': 15, '24h': 30, '7d': 120, '30d': 360 };

export function genHistoryData(unit: Unit, range: TimeRange) {
    const n = RANGE_POINTS[range];
    const intervalMin = RANGE_INTERVAL_MIN[range];
    const labels = Array.from({ length: n }, (_, i) => {
        const t = new Date(Date.now() - (n - 1 - i) * intervalMin * 60000);
        if (range === '30d' || range === '7d') return `${t.getMonth() + 1}/${t.getDate()} ${String(t.getHours()).padStart(2, '0')}h`;
        return `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
    });

    const supplyData = Array.from({ length: n }, (_, i) => {
        const base = unit.supplyTemp + Math.sin(i / (n / 6)) * 8;
        return +(base + (Math.random() - 0.5) * 4).toFixed(1);
    });
    const returnData = supplyData.map(v => +(v - 22 + (Math.random() - 0.5) * 3).toFixed(1));
    const voltageData = Array.from({ length: n }, () => {
        const spike = Math.random() > 0.9 ? (Math.random() - 0.5) * 10 : 0;
        return +(118 + (Math.random() - 0.5) * 2 + spike).toFixed(1);
    });
    const fuelData = Array.from({ length: n }, (_, i) => {
        const drift = unit.fuelPct - i * (unit.fuelPct * 0.003);
        return +Math.max(0, drift + (Math.random() - 0.5) * 0.6).toFixed(1);
    });

    return { labels, supplyData, returnData, voltageData, fuelData };
}
