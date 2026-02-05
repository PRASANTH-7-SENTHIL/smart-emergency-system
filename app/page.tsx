"use client";

import Link from "next/link";
import {
  Car,
  Activity,
  MessageSquare,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  AlertTriangle
} from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useLanguage } from '@/context/LanguageContext';

export default function Dashboard() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in duration-500 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      {/* Header / Top Bar Area */}
      <div className="flex justify-between items-center mb-6">
        <div>
          {/* Placeholder if sidebar title isn't enough context */}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 text-center transition-colors duration-300">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">
            {t('dashboard.title')}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto transition-colors duration-300">
            {t('dashboard.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={async () => {
                const btn = document.activeElement as HTMLButtonElement;
                if (btn) btn.disabled = true;
                const originalText = btn ? btn.innerText : '';
                if (btn) btn.innerText = "Sending Alert...";

                try {
                  const res = await fetch('/api/emergency-alert', { method: 'POST' });
                  const data = await res.json();
                  if (data.success) {
                    alert("✅ Emergency Alert Sent Successfully!");
                  } else {
                    alert("❌ Failed to send alert: " + data.error);
                  }
                } catch (e) {
                  alert("❌ Error sending alert.");
                } finally {
                  if (btn) {
                    btn.disabled = false;
                    // Restore original text logic is tricky with icons, 
                    // so simpler to just reload or let user see done.
                    // Actually, let's just use the router refresh or simple text reset if possible, 
                    // but since there's an Icon, replacing innerText wipes it.
                    // Better approach: Don't mess with DOM directly like this in React ideally, 
                    // but for minimal changes asked:
                    window.location.reload();
                  }
                }
              }}
              className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95">
              <PhoneCall size={20} />
              {t('dashboard emergency')}
            </button>
            <button className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-full font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              {t('dashboard.learnMore')}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Accident Spot */}
        <div className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform">
              <Car size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{t('dashboard.cards.accidentSpot.title')}</h3>
            <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">
              {t('dashboard.cards.accidentSpot.desc')}
            </p>
            <Link
              href="/accident-spot" // Sidebar says '/' but practically we link here
              className="mt-4 flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-colors"
            >
              {t('dashboard.cards.accidentSpot.action')} <AlertTriangle size={16} />
            </Link>
          </div>
        </div>

        {/* Card 2: Driver Monitoring */}
        <div className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{t('dashboard.cards.driverMonitoring.title')}</h3>
            <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">
              {t('dashboard.cards.driverMonitoring.desc')}
            </p>
            <Link
              href="/driver-monitoring"
              className="mt-4 flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-colors"
            >
              {t('dashboard.cards.driverMonitoring.action')} <Activity size={16} />
            </Link>
          </div>
        </div>

        {/* Card 3: Chat with Us */}
        <div className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-full text-green-500 dark:text-green-400 group-hover:scale-110 transition-transform">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{t('dashboard.cards.chat.title')}</h3>
            <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">
              {t('dashboard.cards.chat.desc')}
            </p>
            <Link
              href="/chat"
              className="mt-4 flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-colors"
            >
              {t('dashboard.cards.chat.action')} <MessageSquare size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
