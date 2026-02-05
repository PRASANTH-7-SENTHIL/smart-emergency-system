import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
    );

    const scopes = [
        'https://www.googleapis.com/auth/gmail.readonly'
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent' // Force refresh token generation
    });

    return NextResponse.json({ url });
}
