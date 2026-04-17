import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt, systemInstruction } = await req.json();

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY!
        });

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash-latest",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7
            }
        });

        return NextResponse.json({
            text: response.text
        });

    } catch (error: any) {
        console.error("GEN ERROR:", error);

        return NextResponse.json(
            { error: error.message || "Server error" },
            { status: 500 }
        );
    }
}