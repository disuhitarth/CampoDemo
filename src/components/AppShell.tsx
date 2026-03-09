'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardView from './views/DashboardView';
import FleetMapView from './views/FleetMapView';
import HistoryView from './views/HistoryView';
import AlertsView from './views/AlertsView';
import DemoToolbar from './DemoToolbar';

const views = {
    dashboard: DashboardView,
    map: FleetMapView,
    history: HistoryView,
    alerts: AlertsView,
};

export default function AppShell() {
    const { currentView } = useApp();
    const ViewComponent = views[currentView];

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 overflow-y-auto p-5 md:p-6" style={{ background: '#070B14' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentView}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="h-full"
                        >
                            <ViewComponent />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
            <DemoToolbar />
        </div>
    );
}
