import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    console.error("GEMINI_API_KEY not found in .env");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        const response: any = await ai.models.list();
        console.log("Response keys:", Object.keys(response));
        if (response.models) {
             console.log("Models found in .models");
        } else if (response.data) {
             console.log("Models found in .data");
        } else {
             console.log("Raw response:", response);
        }
    } catch (error: any) {
        console.error("Error listing models:", error.message);
        if (error.response) {
            console.error("Response data:", JSON.stringify(error.response.data, null, 2));
        }
    }
}

listModels();
