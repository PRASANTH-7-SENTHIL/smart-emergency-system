import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city') || 'Chennai';
        // Default to Chennai, India if no city specified

        const apiKey = process.env.WEATHER_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.message || 'Failed to fetch weather data' }, { status: response.status });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error("Weather API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
