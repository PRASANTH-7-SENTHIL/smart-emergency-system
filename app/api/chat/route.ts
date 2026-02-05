import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { prompt, language } = body;
        const langCode = language || 'en';

        // In a real implementation, you would call Google Gemini / OpenAI here
        // using process.env.AI_CHAT_API_KEY
        const apiKey = process.env.AI_CHAT_API_KEY;

        const prefixes: Record<string, string> = {
            en: "AI Safety Assistant",
            ta: "AI பாதுகாப்பு உதவியாளர்",
            hi: "AI सुरक्षा सहायक"
        };
        const prefix = prefixes[langCode] || prefixes['en'];

        if (!apiKey) {
            // Simulation mode
            return NextResponse.json({
                response: `(SIMULATED RESPONSE - ${langCode.toUpperCase()}) ${prefix}: I received your query "${prompt}". (Add AI_CHAT_API_KEY to .env.local)`
            });
        }

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const systemContext = `You are an intelligent AI Safety Assistant for an emergency response system.
            Context: functionality includes accident detection, driver monitoring, and emergency alerts.
            Your Goal: Provide helpful, accurate, and safety-focused responses.
            Language: Please respond in the language code '${langCode}'.
            Note: If the query is critical (medical/fire/police), advise calling emergency services immediately.`;

            const fullPrompt = `${systemContext}\n\nUser Query: ${prompt}`;

            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();

            return NextResponse.json({
                response: `${prefix}: ${text}`
            });
        } catch (apiError: any) {
            console.error("Gemini API Error:", apiError);
            return NextResponse.json({
                response: `${prefix}: I'm having trouble connecting to the AI service right now. Error details: ${apiError.message || apiError}`
            });
        }

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
