import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { status, driver_name, message: customMessage } = body;

        console.log(`[API] Driver Status: ${status} for ${driver_name}`);

        if (status?.toLowerCase() === 'drowsy' || customMessage) {
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            const serviceSid = process.env.TWILIO_SERVICE_SID;
            const toNumber = process.env.ALERT_PHONE_NUMBER;

            if (accountSid && authToken && serviceSid && toNumber) {
                const client = twilio(accountSid, authToken);
                try {
                    const smsBody = customMessage || `⚠️ Alert: Driver ${driver_name} is feeling drowsy while driving.`;

                    const message = await client.messages.create({
                        messagingServiceSid: serviceSid,
                        body: smsBody,
                        to: toNumber,
                    });
                    console.log(`[API] SMS Sent: ${message.sid}`);
                    return NextResponse.json({ status: 'alert_sent', message: 'SMS sent successfully' });
                } catch (twilioError) {
                    console.error('[API] Twilio Error:', twilioError);
                    return NextResponse.json({ status: 'error', message: 'Twilio failed' }, { status: 500 });
                }
            } else {
                console.warn('[API] Twilio Credentials missing in .env.local');
                return NextResponse.json({ status: 'alert_simulated', message: 'Credentials missing, alert simulated in logs' });
            }
        }

        return NextResponse.json({ status: 'received' });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
    }
}
