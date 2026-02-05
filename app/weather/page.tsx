"use client";

import { useEffect, useState } from 'react';
import { CloudRain, Wind, Droplets, Thermometer, Map as MapIcon, RefreshCw } from 'lucide-react';
import Script from 'next/script';
import { useLanguage } from '@/context/LanguageContext';


export default function WeatherSensors() {
    const { t } = useLanguage();
    const [sensors, setSensors] = useState({
        rain: 0,
        humidity: 65,
        airQuality: 42,
        temperature: 28
    });
    const [loading, setLoading] = useState(false);

    const [weatherData, setWeatherData] = useState<any>(null);

    // Simulated ThingSpeak Fetch
    const fetchSensorData = async () => {
        setLoading(true);
        // Simulate delay and random data change
        setTimeout(() => {
            setSensors(prev => ({
                rain: Math.random() > 0.8 ? Math.floor(Math.random() * 20) : 0, // Mostly 0 rain
                humidity: Math.floor(50 + Math.random() * 30),
                airQuality: Math.floor(30 + Math.random() * 50),
                temperature: Math.floor(25 + Math.random() * 10),
            }));
            setLoading(false);
        }, 1000);
    };

    const fetchRealWeather = async () => {
        try {
            const res = await fetch('/api/weather?city=Chennai'); // Defaulting to Chennai
            const data = await res.json();
            if (data.main) {
                setWeatherData(data);
            }
        } catch (error) {
            console.error("Failed to fetch weather", error);
        }
    };

    useEffect(() => {
        fetchSensorData();
        fetchRealWeather();
        const interval = setInterval(() => {
            fetchSensorData();
            fetchRealWeather();
        }, 10000); // Auto refresh every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2">
                        <CloudRain className="text-blue-500" /> {t('weather.title')}
                    </h1>
                    <p className="text-muted-foreground">{t('weather.desc')}</p>
                </div>
                <button
                    onClick={() => { fetchSensorData(); fetchRealWeather(); }}
                    disabled={loading}
                    className="p-2 bg-secondary rounded-full hover:bg-muted transition-all"
                >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Sensor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SensorCard
                    title={t('weather.rainLevel')}
                    value={`${sensors.rain}%`}
                    icon={CloudRain}
                    color="text-blue-500"
                    bg="bg-blue-50 dark:bg-blue-900/20"
                    desc={sensors.rain > 10 ? t('weather.heavyRain') : t('weather.noRain')}
                />
                <SensorCard
                    title={t('weather.humidity')}
                    value={`${sensors.humidity}%`}
                    icon={Droplets}
                    color="text-cyan-500"
                    bg="bg-cyan-50 dark:bg-cyan-900/20"
                    desc={t('weather.humidity')}
                />
                <SensorCard
                    title={t('weather.airQuality')}
                    value={`${sensors.airQuality} AQI`}
                    icon={Wind}
                    color="text-green-500"
                    bg="bg-green-50 dark:bg-green-900/20"
                    desc={sensors.airQuality < 50 ? t('weather.good') : t('weather.moderate')}
                />
                <SensorCard
                    title={t('weather.temperature')}
                    value={`${sensors.temperature}°C`}
                    icon={Thermometer}
                    color="text-orange-500"
                    bg="bg-orange-50 dark:bg-orange-900/20"
                    desc={t('weather.temperature')}
                />
            </div>

            {/* Charts Section (Placeholder) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6 rounded-2xl bg-card border border-border shadow-sm">
                    <h3 className="text-lg font-bold mb-4">{t('weather.lastReadings')}</h3>
                    <div className="h-64 flex items-end justify-between gap-2 px-2 pb-2 border-b border-l border-border">
                        {/* Simulated Chart Bars */}
                        {[40, 60, 45, 70, 55, 30, 80, 65, 50, 60].map((h, i) => (
                            <div key={i} className="w-full bg-blue-500/50 rounded-t-md hover:bg-blue-500 transition-colors" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                    <div className="text-center text-xs text-muted-foreground mt-2">{t('weather.lastReadings')}</div>
                </div>

                {/* Map Section for Environmental Monitoring */}
                <div className="card p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <MapIcon size={18} /> {t('weather.sensorLocation')}
                    </h3>
                    <div className="relative flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden min-h-[250px]">
                        <Script
                            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`}
                            strategy="lazyOnload"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            {t('weather.mapPreview')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Weather Status Section (Real-time API) */}
            {weatherData && (
                <div className="card bg-card border border-border rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <CloudRain className="text-blue-500" /> {t('weather.status.title')} <span className="text-sm font-normal text-muted-foreground">({weatherData.name})</span>
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-xl">
                            <span className="text-muted-foreground text-sm mb-1">{t('weather.status.condition')}</span>
                            <div className="flex items-center gap-2">
                                {weatherData.weather[0].icon && (
                                    <img
                                        src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                                        alt="Weather Icon"
                                        className="w-10 h-10"
                                    />
                                )}
                                <span className="font-bold text-lg capitalize">{weatherData.weather[0].description}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-xl">
                            <span className="text-muted-foreground text-sm mb-1">{t('weather.temperature')}</span>
                            <div className="flex items-center gap-2">
                                <Thermometer className="text-orange-500" size={24} />
                                <span className="font-bold text-lg">{Math.round(weatherData.main.temp)}°C</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{t('weather.status.feelsLike')} {Math.round(weatherData.main.feels_like)}°C</span>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-xl">
                            <span className="text-muted-foreground text-sm mb-1">{t('weather.humidity')}</span>
                            <div className="flex items-center gap-2">
                                <Droplets className="text-cyan-500" size={24} />
                                <span className="font-bold text-lg">{weatherData.main.humidity}%</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-xl">
                            <span className="text-muted-foreground text-sm mb-1">{t('weather.status.windSpeed')}</span>
                            <div className="flex items-center gap-2">
                                <Wind className="text-gray-500" size={24} />
                                <span className="font-bold text-lg">{weatherData.wind.speed} m/s</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SensorCard({ title, value, icon: Icon, color, bg, desc }: any) {
    const { t } = useLanguage();
    return (
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${bg} ${color}`}>
                    <Icon size={24} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${bg} ${color}`}>
                    {t('weather.live')}
                </span>
            </div>
            <div>
                <p className="text-sm text-muted-foreground mb-1">{title}</p>
                <h2 className="text-3xl font-bold">{value}</h2>
                <p className="text-xs text-muted-foreground mt-2">{desc}</p>
            </div>
        </div>
    );
}
