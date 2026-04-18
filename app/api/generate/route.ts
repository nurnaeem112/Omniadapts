import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    return Response.json({
        debug: "API WORKING NEW VERSION"
    });
}