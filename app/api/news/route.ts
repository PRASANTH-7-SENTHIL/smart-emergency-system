import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const place = searchParams.get('place') || 'India';
        const lang = searchParams.get('lang') || 'en';
        const apiKey = process.env.GNEWS_API_KEY;

        if (!apiKey) {
            // Return mock data
            return NextResponse.json({
                articles: [
                    {
                        title: `Mock News (${lang.toUpperCase()}): Government Announces New Road Safety Initiatives`,
                        source: { name: "Safety Daily" },
                        url: "#",
                        publishedAt: new Date().toISOString(),
                        description: "New AI cameras to be installed on highways."
                    },
                    {
                        title: `Traffic Alert (${lang.toUpperCase()}): Heavy Rains Expected`,
                        source: { name: "Weather Channel" },
                        url: "#",
                        publishedAt: new Date().toISOString(),
                        description: "Drive carefully."
                    }
                ]
            });
        }

        const res = await fetch(`https://gnews.io/api/v4/search?q=${place}&lang=${lang}&token=${apiKey}`);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Daily News API Error:", error);
        return NextResponse.json({ articles: [] }); // Safe fallback
    }
}
