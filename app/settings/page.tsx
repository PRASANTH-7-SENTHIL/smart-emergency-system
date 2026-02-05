"use client";

import { Settings as SettingsIcon, Bell, Moon, Sun, Shield, Save, Globe } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const [notifications, setNotifications] = useState(true);
    const [gpsTracking, setGpsTracking] = useState(true);
    const [gmailStart, setGmailStart] = useState(false);
    const [gmailConnected, setGmailConnected] = useState(false);
    const [latestMail, setLatestMail] = useState<any>(null);

    useEffect(() => {
        if (!gmailStart) return;

        const checkGmail = async () => {
            try {
                const res = await fetch('/api/gmail/latest');
                const data = await res.json();

                if (data.connected) {
                    setGmailConnected(true);
                    if (data.hasNewMail) {
                        setLatestMail(data.mail);
                    }
                } else {
                    setGmailConnected(false);
                }
            } catch (err) {
                console.error("Error checking Gmail", err);
            }
        };

        checkGmail();
        const interval = setInterval(checkGmail, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [gmailStart]);

    const handleConnectGmail = async () => {
        const res = await fetch('/api/auth/google/url');
        const { url } = await res.json();
        window.location.href = url;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                    <SettingsIcon className="text-blue-500" /> {t('settings.title')}
                </h1>
                <p className="text-muted-foreground">{t('settings.description')}</p>
            </div>

            <div className="grid grid-cols-1 gap-6">

                {/* Appearance */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Moon size={20} /> {t('settings.appearance')}
                    </h2>

                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl mb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 mb-0">
                                {theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
                            </div>
                            <div>
                                <p className="font-medium">{t('settings.themeMode')}</p>
                                <p className="text-sm text-muted-foreground">{t('settings.themeDesc')}</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-transform active:scale-95"
                        >
                            {theme === 'light' ? t('settings.switchToDark') : t('settings.switchToLight')}
                        </button>
                    </div>

                    {/* Language Selector */}
                    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full text-purple-600 mb-0">
                                <Globe size={24} />
                            </div>
                            <div>
                                <p className="font-medium">{t('settings.language')}</p>
                                <p className="text-sm text-muted-foreground">{t('settings.languageDesc')}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {(['en', 'ta', 'hi'] as const).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${language === lang
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'bg-background hover:bg-muted text-foreground/80'
                                        }`}
                                >
                                    {lang === 'en' ? 'English' : lang === 'ta' ? 'தமிழ்' : 'हिंदी'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notifications & GPS */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Shield size={20} /> {t('settings.safetyExtensions')}
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full text-green-600">
                                    <Bell size={24} />
                                </div>
                                <div>
                                    <p className="font-medium">{t('settings.smsAlerts')}</p>
                                    <p className="text-sm text-muted-foreground">{t('settings.smsDesc')}</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* Gmail Notifications */}
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full text-red-600">
                                    <Bell size={24} />
                                </div>
                                <div>
                                    <p className="font-medium">{t('settings.gmailNotifications')}</p>
                                    <p className="text-sm text-muted-foreground">{t('settings.gmailDesc')}</p>
                                    {gmailStart && !gmailConnected && (
                                        <button
                                            onClick={handleConnectGmail}
                                            className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition"
                                        >
                                            {t('settings.connectGmail')}
                                        </button>
                                    )}
                                    {gmailStart && gmailConnected && (
                                        <span className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
                                            ✓ {t('settings.gmailConnected')}
                                        </span>
                                    )}
                                    {gmailStart && gmailConnected && (
                                        <p className="text-gmail text-muted-foreground font-mono text-xs mt-1 bg-muted p-1 rounded">
                                            {latestMail ? `📩 [${latestMail.from}] ${latestMail.subject}: ${latestMail.snippet.substring(0, 40)}...` : t('settings.noNewMail')}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={gmailStart} onChange={() => setGmailStart(!gmailStart)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between pb-2">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full text-orange-600">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="font-medium">{t('settings.gpsTracking')}</p>
                                    <p className="text-sm text-muted-foreground">{t('settings.gpsDesc')}</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={gpsTracking} onChange={() => setGpsTracking(!gpsTracking)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-all">
                        <Save size={20} /> {t('settings.saveChanges')}
                    </button>
                </div>
            </div>
        </div>
    );
}

function MapPin({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
    )
}
