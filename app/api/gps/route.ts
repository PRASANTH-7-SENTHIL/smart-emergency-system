import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // In a real scenario, you'd save this to a database (Supabase/Firebase/Redis)
        // so the frontend can poll it or subscribe to it.

        console.log(`[API] Received GPS Data:`, body);

        // Echo back
        return NextResponse.json({ status: 'success', data: body });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid Data' }, { status: 400 });
    }
}
