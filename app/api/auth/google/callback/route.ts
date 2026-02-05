import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
    );

    try {
        const { tokens } = await oauth2Client.getToken(code);

        // Store tokens in a secure HTTP-only cookie
        const cookieValue = JSON.stringify(tokens);
        const cookie = serialize('gmail_tokens', cookieValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        const response = NextResponse.redirect(new URL('/settings', request.url));
        response.headers.append('Set-Cookie', cookie);

        return response;
    } catch (error) {
        console.error('Error retrieving access token', error);
        return NextResponse.json({ error: 'Failed to retrieve access token' }, { status: 500 });
    }
}
