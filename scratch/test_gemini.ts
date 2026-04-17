require('dotenv').config();
import { GoogleGenAI } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({ apiKey: "AIzaSyBQFpSVF640-UKxatAtZRVvcKRBLuDWTPU" });
  try {
    console.log('Testing gemini-1.5-pro...');
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: "Hello, world!"
    });
    console.log("Success:", response.text);
  } catch (e) {
    console.error("Error for gemini-1.5-pro:", e);
  }
}

test();
