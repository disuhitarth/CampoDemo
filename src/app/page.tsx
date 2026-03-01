'use client';
import { useApp } from '@/context/AppContext';
import LoginScreen from '@/components/LoginScreen';
import AppShell from '@/components/AppShell';

export default function Home() {
  const { user } = useApp();
  return user ? <AppShell /> : <LoginScreen />;
}
