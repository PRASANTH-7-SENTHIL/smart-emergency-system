"use client";

import { useState, useEffect } from 'react';
import {
    CloudRain,
    Wind,
    Droplets,
    Thermometer,
    MapPin,
    Search,
    Loader2,
    Sun,
    Cloud,
    CloudLightning,
    CloudSnow
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface WeatherData {
    name: string;
    main: {
        temp: number;
        humidity: number;
        pressure: number;
        feels_like: number;
    };
    weather: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    wind: {
        speed: number;
    };
    cod: number;
}

export default function WeatherStatusPage() {
    const { t } = useLanguage();
    const [city, setCity] = useState('Chennai');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || '330bdbbfdc0cdfd71cdfb8e46d005835';

    const fetchWeather = async (searchCity: string) => {
        if (!searchCity.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
            );

            const data = await response.json();

            if (data.cod !== 200) {
                setError(data.message || t('weather.status.fetchError'));
                setWeather(null);
            } else {
                setWeather(data);
            }
        } catch (err) {
            setError(t('weather.status.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather('Chennai');
    }, []);

    const getWeatherIcon = (main: string) => {
        switch (main.toLowerCase()) {
            case 'clear': return <Sun className="w-16 h-16 text-yellow-400" />;
            case 'rain': return <CloudRain className="w-16 h-16 text-blue-400" />;
            case 'clouds': return <Cloud className="w-16 h-16 text-gray-400" />;
            case 'thunderstorm': return <CloudLightning className="w-16 h-16 text-yellow-600" />;
            case 'snow': return <CloudSnow className="w-16 h-16 text-blue-200" />;
            default: return <Sun className="w-16 h-16 text-yellow-400" />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2">
                        <CloudRain className="text-blue-500" />
                        {t('weather.status.title')}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Real-time weather updates and environmental status
                    </p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchWeather(city)}
                            placeholder="Enter city name..."
                            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <MapPin className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                    </div>
                    <button
                        onClick={() => fetchWeather(city)}
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-xl transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20">
                    {error}
                </div>
            )}

            {weather && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Main Weather Card */}
                    <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>

                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-semibold opacity-90">{weather.name}</h2>
                                    <p className="text-blue-100 capitalize">{weather.weather[0].description}</p>
                                </div>
                                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                    {getWeatherIcon(weather.weather[0].main)}
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="text-7xl font-bold tracking-tighter">
                                    {Math.round(weather.main.temp)}°
                                </div>
                                <div className="flex gap-4 mt-4 text-sm font-medium opacity-80">
                                    <span>H: {Math.round(weather.main.temp + 2)}°</span>
                                    <span>L: {Math.round(weather.main.temp - 2)}°</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-center items-center gap-2 hover:border-primary/50 transition-colors">
                            <Wind className="w-8 h-8 text-blue-500" />
                            <span className="text-muted-foreground text-sm">{t('weather.status.windSpeed')}</span>
                            <span className="text-xl font-bold">{weather.wind.speed} m/s</span>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-center items-center gap-2 hover:border-primary/50 transition-colors">
                            <Droplets className="w-8 h-8 text-blue-500" />
                            <span className="text-muted-foreground text-sm">{t('weather.humidity')}</span>
                            <span className="text-xl font-bold">{weather.main.humidity}%</span>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-center items-center gap-2 hover:border-primary/50 transition-colors">
                            <Thermometer className="w-8 h-8 text-orange-500" />
                            <span className="text-muted-foreground text-sm">{t('weather.status.feelsLike')}</span>
                            <span className="text-xl font-bold">{Math.round(weather.main.feels_like)}°</span>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-center items-center gap-2 hover:border-primary/50 transition-colors">
                            <Activity className="w-8 h-8 text-green-500" />
                            <span className="text-muted-foreground text-sm">{t('weather.status.pressure')}</span>
                            <span className="text-xl font-bold">{weather.main.pressure} hPa</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Activity(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
