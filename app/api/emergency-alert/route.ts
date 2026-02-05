import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST() {
    try {
        // 1. Fetch Sensor Data from ThingSpeak
        // Channel: 3250094, Read Key: R39FOL3LF3WJGMLS (or public)
        // We use the READ_KEY from env if available, or the one provided in prompt
        const THING_CHANNEL = process.env.NEXT_PUBLIC_THINGSPEAK_CHANNEL_ID || '3250094';
        const THING_KEY = process.env.NEXT_PUBLIC_THINGSPEAK_READ_KEY || 'R39FOL3LF3WJGMLS';

        const tsResponse = await fetch(
            `https://api.thingspeak.com/channels/${THING_CHANNEL}/feeds.json?api_key=${THING_KEY}&results=1`
        );

        if (!tsResponse.ok) {
            throw new Error(`ThingSpeak fetch failed: ${tsResponse.statusText}`);
        }

        const tsData = await tsResponse.json();

        if (!tsData.feeds || tsData.feeds.length === 0) {
            return NextResponse.json({ success: false, error: "No data available from sensors" }, { status: 404 });
        }

        const feed = tsData.feeds[0];

        // MAPPING (Required Order):
        // 1. Rain Level
        // 2. Temperature
        // 3. MQ135 (Air Quality)
        // 4. Humidity
        const rain = feed.field1 || 'N/A';
        const temp = feed.field2 || 'N/A';
        const aqi = feed.field3 || 'N/A';
        const humidity = feed.field4 || 'N/A';
        const timestamp = new Date().toLocaleString();

        const messageBody = `🚨 EMERGENCY ALERT 🚨\n\n` +
            `Timestamp: ${timestamp}\n\n` +
            `Sensors Status:\n` +
            `1. Rain Level: ${rain}\n` +
            `2. Temperature: ${temp}°C\n` +
            `3. Air Quality (MQ135): ${aqi}\n` +
            `4. Humidity: ${humidity}%\n\n` +
            `Please take immediate action.`;

        // 2. Send SMS via Twilio
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const toPhone = process.env.ALERT_PHONE_NUMBER;
        // Ideally fromPhone is needed, but if using Messaging Service, we use `messagingServiceSid`
        const serviceSid = process.env.TWILIO_SERVICE_SID;

        if (!accountSid || !authToken || !toPhone) {
            throw new Error("Missing Twilio credentials in environment variables");
        }

        // Sanitize Phone Number (Fix for potential trailing quotes in env)
        const cleanPhone = toPhone.replace(/['"\s]/g, '').trim();

        const client = twilio(accountSid, authToken);

        const msgOptions: any = {
            body: messageBody,
            to: cleanPhone,
        };

        if (serviceSid) {
            msgOptions.messagingServiceSid = serviceSid;
        } else {
            throw new Error("TWILIO_SERVICE_SID is missing.");
        }

        const result = await client.messages.create(msgOptions);

        return NextResponse.json({ success: true, sid: result.sid, status: result.status });

    } catch (error: any) {
        console.error("Emergency Alert Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
