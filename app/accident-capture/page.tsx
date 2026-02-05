"use client";

import { useState } from 'react';
import { Camera, MapPin, Calendar, CheckCircle } from 'lucide-react';
import Script from 'next/script';

export default function AccidentCapture() {
    // Placeholder data - in real app would fetch from API
    const [evidence, setEvidence] = useState([
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1599700403969-98e5a1ebf13f?q=80&w=600&auto=format&fit=crop", // Stock photo of car
            date: "2026-02-02 10:30 AM",
            location: "13.0827, 80.2707",
            status: "Verified"
        }
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                    <Camera className="text-blue-500" /> Accident Evidence Capture
                </h1>
                <p className="text-muted-foreground">Visual evidence captured by onboard ESP32-CAM.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {evidence.map((item) => (
                    <div key={item.id} className="group bg-card border border-border rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-xl">
                        <div className="relative aspect-video bg-gray-900">
                            <img src={item.image} alt="Accident Evidence" className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                CRITICAL
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">Evidence #{item.id}</h3>
                                <span className="flex items-center gap-1 text-green-500 text-sm font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                                    <CheckCircle size={14} /> {item.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar size={16} />
                                    {item.date}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin size={16} />
                                    {item.location}
                                </div>
                            </div>

                            <div className="mt-6">
                                <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                                    Download Report & Image
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
