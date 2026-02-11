"use client";

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

import { useTheme } from "@/context/ThemeContext";
import { MouseSpotlight } from "@/components/MouseSpotlight";


// Declare globals for the external scripts
declare global {
    interface Window {
        tmPose: any;
        Chart: any;
        jspdf: any;
    }
}

export default function DriverMonitoring() {
    const router = useRouter();
    const { theme } = useTheme();

    // State
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [isTmLoaded, setIsTmLoaded] = useState(false);
    const [status, setStatus] = useState("Waiting for AI...");
    const [statusClass, setStatusClass] = useState("");
    const [counts, setCounts] = useState({ normal: 0, sleep: 0, left: 0, right: 0 });
    const [notificationMsg, setNotificationMsg] = useState("");
    const [notificationClass, setNotificationClass] = useState("");
    const [geminiReport, setGeminiReport] = useState("Analysis will appear here after clicking \"Generate Gemini Report\"");
    const [pdfReady, setPdfReady] = useState(false);

    // Refs for persistence across renders
    const modelRef = useRef<any>(null);
    const webcamRef = useRef<any>(null);
    const ctxRef = useRef<any>(null);
    const labelContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);
    const monitoringDataRef = useRef<any[]>([]);
    const allReadingsRef = useRef<any[]>([]);
    const actionCountsRef = useRef({ normal: 0, sleep: 0, left: 0, right: 0 }); // Mirror state for loop access
    const smsSentRef = useRef(false);
    const lastAlertTimeRef = useRef(0);
    const animFrameIdRef = useRef<number | null>(null);
    const isMonitoringRef = useRef(false);

    // Constants
    const URL = "https://teachablemachine.withgoogle.com/models/b5WQgHdeL/";
    const SLEEP_ALERT_THRESHOLD = 200;
    const ALERT_COOLDOWN = 5000;

    useEffect(() => {
        // Cleanup on unmount
        return () => stopMonitoring();
    }, []);

    const initChart = () => {
        const ctx = (document.getElementById('data-graph') as HTMLCanvasElement)?.getContext('2d');
        if (!ctx || !window.Chart) return;

        if (chartRef.current) chartRef.current.destroy();

        const textColor = theme === 'dark' ? '#e2e8f0' : '#334155';
        const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

        chartRef.current = new window.Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    { label: 'Normal', borderColor: 'lime', backgroundColor: 'rgba(0, 255, 0, 0.1)', data: [], fill: true, tension: 0.4, pointRadius: 0 },
                    { label: 'Sleeping', borderColor: 'red', backgroundColor: 'rgba(255, 0, 0, 0.1)', data: [], fill: true, tension: 0.4, pointRadius: 0 },
                    { label: 'Looking Left', borderColor: 'orange', backgroundColor: 'rgba(255, 165, 0, 0.1)', data: [], fill: true, tension: 0.4, pointRadius: 0 },
                    { label: 'Looking Right', borderColor: 'yellow', backgroundColor: 'rgba(255, 255, 0, 0.1)', data: [], fill: true, tension: 0.4, pointRadius: 0 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, max: 1, ticks: { color: textColor }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor, maxTicksLimit: 10 }, grid: { color: gridColor } }
                },
                plugins: { legend: { display: false } }
            }
        });
    };

    // Update chart when theme changes
    useEffect(() => {
        if (chartRef.current) {
            const textColor = theme === 'dark' ? '#e2e8f0' : '#334155';
            const gridColor = theme === 'dark' ? '#e2e8f0' : '#334155';

            chartRef.current.options.scales.y.ticks.color = textColor;
            chartRef.current.options.scales.x.ticks.color = textColor;
            chartRef.current.options.scales.y.grid.color = gridColor;
            chartRef.current.options.scales.x.grid.color = gridColor;
            chartRef.current.update();
        }
    }, [theme]);

    const startMonitoring = async () => {
        if (!window.tmPose) {
            alert("Teachable Machine library not loaded yet. Please wait a moment.");
            return;
        }

        initChart();
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        try {
            if (!modelRef.current) {
                modelRef.current = await window.tmPose.load(modelURL, metadataURL);
            }
        } catch (e) {
            alert("Error loading model: " + e);
            return;
        }

        const size = 300;

        try {
            if (!webcamRef.current) {
                const webcam = new window.tmPose.Webcam(size, size, true); // width, height, flip
                await webcam.setup();
                await webcam.play();
                webcamRef.current = webcam;
            } else {
                await webcamRef.current.play();
            }
        } catch (e) {
            console.error("Camera error:", e);
            // Try to recover by ignoring, or let user retry
        }

        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        if (canvas && ctxRef.current === null) {
            canvas.width = size; canvas.height = size;
            ctxRef.current = canvas.getContext("2d");
        }


        // Labels
        if (labelContainerRef.current) {
            labelContainerRef.current.innerHTML = "";
            const maxPredictions = modelRef.current.getTotalClasses();
            for (let i = 0; i < maxPredictions; i++) {
                const div = document.createElement("div");
                labelContainerRef.current.appendChild(div);
            }
        }

        setIsMonitoring(true);
        isMonitoringRef.current = true; // Sync ref
        setStatus("Monitoring Active");
        setStatusClass("");

        loop();
    };

    const loop = async () => {
        if (!webcamRef.current) return;
        webcamRef.current.update();
        try {
            await predict();
        } catch (e) {
            console.error(e)
        }

        if (isMonitoringRef.current) { // Check ref instead of state
            animFrameIdRef.current = window.requestAnimationFrame(loop);
        }
    };

    // Needed to stop loop correctly since closure captures state
    useEffect(() => {
        if (!isMonitoring && animFrameIdRef.current) {
            window.cancelAnimationFrame(animFrameIdRef.current);
            animFrameIdRef.current = null;
        }
    }, [isMonitoring]);

    const stopMonitoring = () => {
        setIsMonitoring(false); // Triggers useEffect to cancel frame
        isMonitoringRef.current = false;
        if (webcamRef.current) webcamRef.current.stop();
        setStatus("Monitoring Stopped");
        setStatusClass("");
    };

    const predict = async () => {
        if (!modelRef.current || !webcamRef.current) return;

        // Prediction
        const { pose, posenetOutput } = await modelRef.current.estimatePose(webcamRef.current.canvas);
        const prediction = await modelRef.current.predict(posenetOutput);

        const timestamp = new Date().toLocaleTimeString();
        const fullTimestamp = new Date().toISOString();
        const dataPoint: any = { time: timestamp, timestamp: fullTimestamp };

        let topClass = "";
        let topProb = 0;

        const maxPredictions = modelRef.current.getTotalClasses();
        for (let i = 0; i < maxPredictions; i++) {
            const prob = prediction[i].probability;
            // NORMALIZE CLASS NAME TO LOWERCASE to match state keys
            const rawClassName = prediction[i].className; // e.g. "Sleep" or "sleep"
            const className = rawClassName.toLowerCase(); // always "sleep"

            dataPoint[className] = prob;

            if (labelContainerRef.current && labelContainerRef.current.childNodes[i]) {
                labelContainerRef.current.childNodes[i].textContent = `${rawClassName}: ${(prob * 100).toFixed(1)}%`;
            }

            if (prob > topProb) {
                topProb = prob;
                topClass = className;
            }
        }

        // Counters
        if (topProb > 0.7) {
            // Check if key exists in counts, default to ignore if unknown class
            if (Object.keys(actionCountsRef.current).includes(topClass)) {
                actionCountsRef.current[topClass as keyof typeof counts]++;
                setCounts({ ...actionCountsRef.current }); // Update State
            }

            // SMS Alert
            if (topClass === 'sleep' && actionCountsRef.current.sleep >= SLEEP_ALERT_THRESHOLD && !smsSentRef.current) {
                sendSleepAlertSMS();
                smsSentRef.current = true;
            }
        }

        // Data buffers
        monitoringDataRef.current.push(dataPoint);
        if (monitoringDataRef.current.length > 50) monitoringDataRef.current.shift();
        allReadingsRef.current.push({ ...dataPoint, topClass, topProb });

        // Update Chart
        updateChart();

        // Status & Voice
        updateStatus(topClass, topProb);

        // Draw
        drawPose(pose);
    };

    const updateStatus = (topClass: string, topProb: number) => {
        const currentTime = Date.now();
        if (topClass === "normal" && topProb > 0.7) {
            setStatus("✅ Safe Driving");
            setStatusClass("safe");
        } else if ((topClass === "sleep" || topClass === "left" || topClass === "right") && topProb > 0.7) {
            setStatus("🚨 ALERT: " + topClass.toUpperCase());
            setStatusClass("alert");

            if (currentTime - lastAlertTimeRef.current > ALERT_COOLDOWN) {
                speakAlert(topClass);
                lastAlertTimeRef.current = currentTime;
            }
        } else {
            setStatus("Monitoring...");
            setStatusClass("");
        }
    };

    const getCurrentLocation = (): Promise<{ lat: number; lng: number } | null> => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                console.warn("Geolocation not supported");
                resolve(null);
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    resolve(null);
                }
            );
        });
    };

    const sendWebhookAlert = async (lat: number, lng: number) => {
        try {
            await fetch('https://sandhiyas.app.n8n.cloud/webhook-test/gps-alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alert_type: "DROWSINESS_DETECTED",
                    timestamp: new Date().toISOString(),
                    latitude: lat,
                    longitude: lng,
                    driver_status: "SLEEPING"
                })
            });
            console.log("Webhook alert sent with GPS:", { lat, lng });
        } catch (error) {
            console.error("Error sending webhook:", error);
        }
    };

    const sendSleepAlertSMS = async () => {
        setNotificationMsg("🚨 CRITICAL: Sleep alert! Sending SMS & GPS...");
        setNotificationClass("notification-status notification-sent");

        // Trigger GPS Webhook
        const location = await getCurrentLocation();
        if (location) {
            sendWebhookAlert(location.lat, location.lng);
        }

        try {
            const response = await fetch('/api/driver-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'Drowsy', // Trigger backend logic
                    driver_name: `Driver (Sleep Count: ${actionCountsRef.current.sleep})`
                })
            });

            if (response.ok) {
                setNotificationMsg("✅ SMS & GPS Alert sent successfully!");
            } else {
                setNotificationMsg("❌ Failed to send SMS alert.");
            }
        } catch (e) {
            console.error(e);
            setNotificationMsg("❌ Error sending SMS.");
        }
    };

    const updateChart = () => {
        if (!chartRef.current) return;
        const data = monitoringDataRef.current;

        chartRef.current.data.labels = data.map(d => d.time);
        ['normal', 'sleep', 'left', 'right'].forEach((cls, idx) => {
            chartRef.current.data.datasets[idx].data = data.map(d => d[cls] || 0);
        });
        chartRef.current.update('none'); // 'none' for performance
    };

    const speakAlert = (alertType: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const speech = new window.SpeechSynthesisUtterance();
            speech.text = alertType === 'sleep' ? "Alert! Wake up immediately!" : `Warning! You are looking ${alertType}.`;
            window.speechSynthesis.speak(speech);
        }
    };

    const drawPose = (pose: any) => {
        if (webcamRef.current?.canvas && ctxRef.current) {
            ctxRef.current.drawImage(webcamRef.current.canvas, 0, 0);
            if (pose && window.tmPose) {
                window.tmPose.drawKeypoints(pose.keypoints, 0.5, ctxRef.current);
                window.tmPose.drawSkeleton(pose.keypoints, 0.5, ctxRef.current);
            }
        }
    };

    const downloadData = () => {
        const dataStr = JSON.stringify(allReadingsRef.current, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', 'driver-data.json');
        linkElement.click();
    };

    const generateReport = async () => {
        if (allReadingsRef.current.length === 0) {
            alert("No data collected yet.");
            return;
        }

        const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!geminiKey) {
            alert("Gemini API Key missing in env.");
            return;
        }

        setGeminiReport("Generating report with AI...");

        try {
            const prompt = createPrompt();
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Gemini API Error Response:", data);
                throw new Error(data.error?.message || response.statusText);
            }

            console.log("Gemini Response Data:", data);

            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                setGeminiReport(text);
                setPdfReady(true);
            } else {
                // Handle cases like safety block or unexpected structure
                setGeminiReport("API returned valid response but no content. Raw: " + JSON.stringify(data, null, 2));
            }

        } catch (e: any) {
            console.error("Gemini API Exception:", e);
            setGeminiReport("Error calling Gemini API: " + (e.message || String(e)));
        }
    };

    const createPrompt = () => {
        // Simplified prompt construction for brevity
        return `Analyze this driver data:
    Total Readings: ${allReadingsRef.current.length}
    Sleep Count: ${actionCountsRef.current.sleep}
    Left Count: ${actionCountsRef.current.left}
    Right Count: ${actionCountsRef.current.right}
    Normal Count: ${actionCountsRef.current.normal}
    Provide a safety verification report.`;
    };

    const downloadPDF = () => {
        if (!window.jspdf) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("Driver Report", 10, 10);
        doc.text(geminiReport, 10, 20, { maxWidth: 180 });
        doc.save("report.pdf");
    };

    return (
        <MouseSpotlight>
            <div className="min-h-screen bg-transparent text-white p-4 md:p-8 font-sans transition-colors duration-300 relative z-10">
                <Script
                    src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js"
                    strategy="afterInteractive"
                />
                <Script
                    src="https://cdn.jsdelivr.net/npm/@teachablemachine/pose@0.8/dist/teachablemachine-pose.min.js"
                    strategy="afterInteractive"
                    onLoad={() => {
                        setIsTmLoaded(true);
                        setStatus("AI Ready - Click Start");
                    }}
                />
                <Script src="https://cdn.jsdelivr.net/npm/chart.js" />
                <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" />

                <div className="flex justify-between items-center mb-6">
                    <button
                        className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition shadow-sm font-medium flex items-center gap-2 border border-white/10"
                        onClick={() => router.push('/')}
                    >
                        ← Back to Dashboard
                    </button>
                    <div className="text-sm text-white/50 bg-white/5 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
                        AI-Powered Safety System
                    </div>
                </div>

                <h1 className="text-4xl font-extrabold text-[#ffb703] mb-8 text-center md:text-left drop-shadow-lg tracking-tight">
                    🚗 Driver Action Monitor
                </h1>

                <div className="flex flex-wrap gap-4 mb-8 justify-center md:justify-start">
                    <button
                        className={`px-8 py-4 rounded-full font-bold shadow-lg transition-all active:scale-95 text-[#0f1724] transform hover:-translate-y-1 ${!isTmLoaded ? 'bg-slate-500/50 cursor-not-allowed text-white backdrop-blur-sm' :
                            isMonitoring ? 'bg-green-500 text-white cursor-default shadow-green-500/50' : 'bg-[#ffb703] hover:bg-[#ffd166] shadow-yellow-500/50'
                            }`}
                        onClick={startMonitoring}
                        disabled={isMonitoring || !isTmLoaded}
                    >
                        {!isTmLoaded ? "Loading AI..." : isMonitoring ? "Monitoring Active" : "Start Monitoring"}
                    </button>
                    <button
                        className={`px-8 py-4 rounded-full font-bold text-white shadow-lg transition-all active:scale-95 bg-red-500/80 backdrop-blur-md hover:bg-red-600 border border-red-400/30 transform hover:-translate-y-1 ${!isMonitoring ? 'opacity-50 cursor-not-allowed' : 'shadow-red-500/50'}`}
                        onClick={stopMonitoring}
                        disabled={!isMonitoring}
                    >
                        Stop Monitoring
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Camera Section */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col items-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative w-full max-w-[400px] aspect-square bg-black/40 rounded-xl overflow-hidden mb-6 border-2 border-[#ffb703]/50 shadow-[0_0_20px_rgba(255,183,3,0.3)]">
                            <canvas id="canvas" className="w-full h-full object-cover"></canvas>
                            {!isMonitoring && (
                                <div className="absolute inset-0 flex items-center justify-center text-white/30 font-medium">
                                    Camera Offline
                                </div>
                            )}
                        </div>

                        <div id="label-container" ref={labelContainerRef} className="w-full flex flex-wrap justify-center gap-2 mb-4 text-sm font-medium text-white/80"></div>

                        <div className={`w-full py-4 px-6 rounded-xl text-center font-bold text-lg mb-4 transition-all duration-300 border ${statusClass === 'safe' ? 'bg-lime-900/30 text-lime-400 border-lime-500/30 shadow-[0_0_15px_rgba(132,204,22,0.2)]' :
                            statusClass === 'alert' ? 'bg-red-900/30 text-red-500 animate-pulse border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.4)]' :
                                'bg-slate-800/50 text-slate-300 border-slate-700/50'
                            }`}>
                            {status}
                        </div>

                        {notificationMsg && (
                            <div className={`w-full py-2 px-4 rounded-lg text-center text-sm font-medium backdrop-blur-md border ${notificationMsg.includes("Alert") ? 'bg-orange-900/40 text-orange-300 border-orange-500/30' : 'bg-blue-900/40 text-blue-300 border-blue-500/30'
                                }`}>
                                {notificationMsg}
                            </div>
                        )}
                    </div>

                    {/* Graph Section */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <h2 className="text-xl font-bold text-[#ffb703] mb-4 relative z-10 flex items-center gap-2">
                            <span className="w-2 h-8 bg-[#ffb703] rounded-full"></span>
                            Driver Behavior Over Time
                        </h2>
                        <div className="h-[350px] w-full bg-black/20 rounded-xl p-4 border border-white/5 relative z-10">
                            <canvas id="data-graph"></canvas>
                        </div>
                    </div>
                </div>

                {/* Counters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Normal Analysis', count: counts.normal, color: 'text-lime-400', border: 'border-lime-500/20', bg: 'bg-lime-500/5' },
                        { label: 'Sleep Alerts', count: counts.sleep, color: 'text-red-500', border: 'border-red-500/20', bg: 'bg-red-500/5' },
                        { label: 'Left Look', count: counts.left, color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/5' },
                        { label: 'Right Look', count: counts.right, color: 'text-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-500/5' },
                    ].map((item, idx) => (
                        <div key={idx} className={`backdrop-blur-lg border ${item.border} ${item.bg} p-6 rounded-2xl shadow-lg text-center transition hover:scale-105 duration-300`}>
                            <div className="text-slate-400 font-medium mb-2 text-sm uppercase tracking-wider">{item.label}</div>
                            <div className={`text-4xl font-black ${item.color} drop-shadow-sm`}>{item.count}</div>
                        </div>
                    ))}
                </div>

                {/* Reports Section */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="flex flex-wrap gap-4 mb-8 justify-center relative z-10">
                        <button className="px-6 py-3 bg-[#ffb703] text-[#0f1724] hover:bg-[#ffd166] rounded-full font-bold transition shadow-lg hover:shadow-yellow-500/20 active:scale-95 flex items-center gap-2" onClick={downloadData}>
                            <span>⬇</span> Download JSON
                        </button>
                        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 rounded-full font-bold transition shadow-lg hover:shadow-purple-500/30 active:scale-95 flex items-center gap-2" onClick={generateReport}>
                            <span>✨</span> Generate Gemini Report
                        </button>
                        <button className="px-6 py-3 bg-slate-700 text-white hover:bg-slate-600 rounded-full font-bold transition shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" onClick={downloadPDF} disabled={!pdfReady}>
                            <span>📄</span> Download PDF
                        </button>
                    </div>

                    <div className="bg-black/30 rounded-xl p-6 border border-white/10 backdrop-blur-sm relative z-10">
                        <h2 className="text-xl font-bold text-[#ffb703] mb-4 flex items-center gap-2">
                            <span>🤖</span> Gemini AI Analysis Report
                        </h2>
                        <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-mono text-sm max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-2">
                            {geminiReport}
                        </div>
                    </div>
                </div>
            </div>
        </MouseSpotlight>
    );
}
