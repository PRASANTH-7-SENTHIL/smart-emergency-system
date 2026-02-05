"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    MapPin,
    Activity,
    MessageSquare,
    Newspaper,
    CloudRain,
    Gauge,
    Camera,
    Settings,
    Menu,
    X,
    Sun,
    Moon,
    LayoutDashboard
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

import { useLanguage } from '@/context/LanguageContext';

export default function AppSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { t } = useLanguage();

    const menuItems = [
        { name: t('sidebar.dashboard'), href: '/', icon: LayoutDashboard },
        { name: t('sidebar.accidentSpot'), href: '/accident-spot', icon: MapPin },
        { name: t('sidebar.driverMonitor'), href: '/driver-monitoring', icon: Activity },
        { name: t('sidebar.aiAssistant'), href: '/chat', icon: MessageSquare },
        { name: t('sidebar.dailyNews'), href: '/news', icon: Newspaper },
        { name: t('sidebar.weatherSensors'), href: '/weather', icon: CloudRain },
      
        { name: t('sidebar.accidentCapture'), href: '/accident-capture', icon: Camera },
        { name: t('sidebar.settings'), href: '/settings', icon: Settings },
        { name: t('sidebar.weatherStatus'), href: '/weather-status', icon: CloudRain },
    ];
    
    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-primary text-primary-foreground shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <aside
                className={`
          fixed top-0 left-0 z-40 h-full w-64 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          bg-card/80 backdrop-blur-md border-r border-border
          flex flex-col shadow-xl
        `}
            >
                <div className="p-6 border-b border-border flex items-center justify-center">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        SafeGuard Pro
                    </h1>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                                        ? 'bg-primary text-primary-foreground shadow-md translate-x-1'
                                        : 'text-foreground/70 hover:bg-secondary hover:text-secondary-foreground hover:translate-x-1'
                                    }
                `}
                                onClick={() => setIsOpen(false)} // Close on mobile click
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className={`
                            w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                            text-foreground/70 hover:bg-secondary hover:text-secondary-foreground hover:translate-x-1
                        `}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        <span className="font-medium">{t('sidebar.theme')}</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="bg-secondary/50 rounded-lg p-3 text-xs text-foreground/60 text-center">
                        {t('sidebar.systemStatus')} <span className="text-green-500 font-bold">{t('sidebar.online')}</span>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
