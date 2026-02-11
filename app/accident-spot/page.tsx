"use client";

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import { AlertCircle, Navigation, Clock, Satellite } from 'lucide-react';

declare global {
    interface Window {
        google: any;
    }
}

export default function AccidentSpot() {
    const [isTracking, setIsTracking] = useState(false);
    const [coords, setCoords] = useState({ lat: 13.0827, lng: 80.2707 }); // Default: Chennai/India
    const [map, setMap] = useState<any>(null);
    const [marker, setMarker] = useState<any>(null);
    // Refs for persistence across renders
    const mapRef = useRef<HTMLDivElement>(null);
    const coordsRef = useRef(coords); // Keep track of latest coords without re-triggering effect

    // Sync coordsRef
    useEffect(() => {
        coordsRef.current = coords;
    }, [coords]);

    // Load Map
    const initMap = () => {
        if (!mapRef.current || !window.google?.maps) return;

        const newMap = new window.google.maps.Map(mapRef.current, {
            center: coords,
            zoom: 15,
            disableDefaultUI: false,
        });

        const newMarker = new window.google.maps.Marker({
            position: coords,
            map: newMap,
            title: "Accident Spot",
            animation: window.google.maps.Animation.DROP,
        });

        setMap(newMap);
        setMarker(newMarker);
    };

    // Attach initMap to window and check for existing script
    useEffect(() => {
        (window as any).initMap = initMap;

        // If generic script is already loaded, init manually
        if (window.google && window.google.maps) {
            initMap();
        }
    }, []);

    // ThingSpeak Config
    const CHANNEL_ID = process.env.NEXT_PUBLIC_THINGSPEAK_CHANNEL_ID || '3250094';
    const READ_KEY = process.env.NEXT_PUBLIC_THINGSPEAK_READ_KEY || 'R39FOL3LF3WJGMLS';

    // Fetch ThingSpeak Data
    const fetchThingSpeakData = async () => {
        try {
            const response = await fetch(
                `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_KEY}&results=1`
            );
            const data = await response.json();

            if (data.feeds && data.feeds.length > 0) {
                const latestFeed = data.feeds[0];
                const lat = parseFloat(latestFeed.field5); // Field 5: Latitude
                const lng = parseFloat(latestFeed.field6); // Field 6: Longitude

                // Start or Stop tracking based on data validity or specific logic?
                // Request says: "If valid coordinates are received ... Display exact location"
                // It doesn't say to stop tracking, but implies updating position.
                // We'll update if valid.
                if (!isNaN(lat) && !isNaN(lng)) {
                    const newCoords = { lat, lng };

                    // Only update if changed (basic check)
                    if (newCoords.lat !== coordsRef.current.lat || newCoords.lng !== coordsRef.current.lng) {
                        setCoords(newCoords);
                        if (map && marker) {
                            map.panTo(newCoords);
                            marker.setPosition(newCoords);
                        }
                    }
                    setIsTracking(true); // Assuming receiving data means active
                }
            }
        } catch (error) {
            console.error("Error fetching ThingSpeak data:", error);
        }
    };

    // Live Tracking Interval
    useEffect(() => {
        let interval: NodeJS.Timeout;

        // "Fetch ThingSpeak channel data every 5 seconds"
        // The user requirement says "Fetch ... every 5 seconds".
        // It doesn't explicitly say "only when Start button is clicked", but usually 'isTracking' controls this.
        // However, "If no data is available: Show Waiting...".
        // Let's assume we fetch when 'isTracking' is true, OR maybe always?
        // "When a physical trigger button is pressed... data is sent".
        // "Fetch ... every 5 seconds".
        // Use the button to "START GPS TRACKING" which effectively starts the polling.

        if (isTracking) {
            // Initial fetch
            fetchThingSpeakData();

            interval = setInterval(() => {
                fetchThingSpeakData();
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [isTracking, map, marker]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Live Accident Tracking
                    </h1>
                    <p className="text-muted-foreground">Real-time monitoring of vehicle location via ThingSpeak.</p>
                </div>

                <button
                    onClick={() => {
                        const newTrackingState = !isTracking;
                        setIsTracking(newTrackingState);

                        if (newTrackingState) {
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(
                                    (position) => {
                                        const { latitude, longitude } = position.coords;
                                        // Update local state
                                        setCoords({ lat: latitude, lng: longitude });

                                        // Send to Webhook
                                        fetch('https://sandhiyas.app.n8n.cloud/webhook-test/gps-alert', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                alert_type: "ACCIDENT_TRACKING_STARTED",
                                                timestamp: new Date().toISOString(),
                                                latitude,
                                                longitude
                                            })
                                        }).then(() => console.log("Tracking started webhook sent"))
                                            .catch(err => console.error("Webhook error", err));
                                    },
                                    (error) => console.error("Error getting location", error)
                                );
                            } else {
                                alert("Geolocation is not supported by this browser.");
                            }
                        }
                    }}
                    className={`
            px-6 py-3 rounded-full font-bold shadow-lg transition-all transform hover:scale-105
            ${isTracking
                            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }
          `}
                >
                    {isTracking ? 'STOP TRACKING' : 'START MONITORING'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="card p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300">
                        <Navigation size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Latitude</p>
                        <p className="text-xl font-mono font-semibold">{coords.lat.toFixed(6)}</p>
                    </div>
                </div>

                <div className="card p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300">
                        <Navigation size={24} className="transform rotate-90" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Longitude</p>
                        <p className="text-xl font-mono font-semibold">{coords.lng.toFixed(6)}</p>
                    </div>
                </div>

                <div className="card p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-4">
                    <div className={`p-3 rounded-full ${isTracking ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Satellite size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="text-xl font-semibold">{isTracking ? 'Monitoring...' : 'Waiting for trigger'}</p>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-border shadow-lg">
                <Script
                    id="google-maps"
                    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAhzQSErBDuzk4d4M0H50iMgU3XYYVU6aM&callback=initMap"
                    strategy="afterInteractive"
                />
                <div ref={mapRef} className="w-full h-full bg-gray-200 dark:bg-gray-800" />

                {/* Loading Overlay */}
                {!map && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 z-10">
                        <p className="text-gray-500">Loading Map...</p>
                    </div>
                )}

                {/* Overlay Status */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur p-4 rounded-xl shadow-lg border border-border max-w-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock size={16} className="text-blue-500" />
                        <span className="text-xs font-mono text-muted-foreground">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <AlertCircle size={20} className={isTracking ? "text-green-500" : "text-yellow-500"} />
                        <span className="font-medium text-sm">
                            {isTracking ? "Live Feed Active" : "Waiting for Signal"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
