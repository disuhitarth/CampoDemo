import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CampoHeat — DB 1200 HMI',
  description: 'Industrial Heater Remote Monitoring & Control System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#070B14] text-[#E8EAF0] antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
