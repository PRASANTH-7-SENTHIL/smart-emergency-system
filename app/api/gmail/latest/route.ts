import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const tokensCookie = request.cookies.get('gmail_tokens');

    if (!tokensCookie) {
        return NextResponse.json({ connected: false });
    }

    let tokens;
    try {
        tokens = JSON.parse(tokensCookie.value);
    } catch (e) {
        return NextResponse.json({ connected: false, error: 'Invalid token format' });
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials(tokens);

    try {
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        // List messages to get the latest one
        const listResponse = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 1,
            labelIds: ['INBOX'], // Only check inbox
        });

        const messages = listResponse.data.messages;

        if (!messages || messages.length === 0) {
            return NextResponse.json({ connected: true, hasNewMail: false });
        }

        const latestMessageId = messages[0].id;

        // Get details of the latest message
        const messageResponse = await gmail.users.messages.get({
            userId: 'me',
            id: latestMessageId!,
            format: 'full',
        });

        const headers = messageResponse.data.payload?.headers;
        const subject = headers?.find(h => h.name === 'Subject')?.value || 'No Subject';
        const from = headers?.find(h => h.name === 'From')?.value || 'Unknown Sender';
        const snippet = messageResponse.data.snippet;

        return NextResponse.json({
            connected: true,
            hasNewMail: true,
            mail: {
                id: latestMessageId,
                subject,
                from,
                snippet
            }
        });

    } catch (error) {
        console.error('Error fetching Gmail:', error);
        return NextResponse.json({ connected: true, error: 'Failed to fetch email' }, { status: 500 });
    }
}
