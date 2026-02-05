"use client";

import { useEffect, useState } from 'react';
import { Newspaper, Calendar, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Article {
    title: string;
    description: string;
    url: string;
    image: string;
    publishedAt: string;
    source: {
        name: string;
    };
}

export default function DailyNews() {
    const [news, setNews] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const { t, language } = useLanguage();

    useEffect(() => {
        fetchNews();
    }, [language]);

    const fetchNews = async () => {
        setLoading(true);
        try {
            // Fetch news based on current language and search query
            const response = await fetch(`/api/news?place=${t('news.searchQuery')}&lang=${language}`);
            const data = await response.json();
            // Filter for valid articles
            const articles = data.articles?.filter((a: any) => a.title && a.url) || [];
            setNews(articles);
        } catch (error) {
            console.error("Failed to fetch news", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                        <Newspaper className="text-blue-500" /> {t('news.title')}
                    </h1>
                    <p className="text-muted-foreground">{t('news.subtitle')}</p>
                </div>
                <button
                    onClick={fetchNews}
                    className="px-4 py-2 bg-secondary hover:bg-muted rounded-xl transition-colors text-sm font-medium"
                >
                    {t('news.refresh')}
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-card animate-pulse rounded-2xl border border-border"></div>
                    ))}
                </div>
            ) : news.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-border">
                    <p className="text-muted-foreground">{t('news.noNews')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((article, idx) => (
                        <div key={idx} className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                                {article.image ? (
                                    <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <Newspaper size={40} />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded-md">
                                    {article.source.name}
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                    <Calendar size={14} />
                                    {new Date(article.publishedAt).toLocaleDateString()}
                                </div>
                                <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                                    {article.description}
                                </p>
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mt-auto"
                                >
                                    {t('news.readFull')} <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
