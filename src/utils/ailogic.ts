import Groq from "groq-sdk";
import { properties } from "../data";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  propertyIds?: number[];
}

const quickResponses: Record<string, string> = {
  "halo": "Halo! Selamat datang di LuxeEstate. Ada properti yang bisa saya bantu carikan?",
  "hi": "Hi! Ada yang bisa saya bantu hari ini?",
  "p": "Halo! Ada yang bisa saya bantu?",
  "terima kasih": "Sama-sama! Senang bisa membantu Anda.",
};

export async function getSmartResponse(prompt: string, history: ChatMessage[]) {
  const lowPrompt = prompt.toLowerCase().trim();
  if (quickResponses[lowPrompt]) {
    return { text: quickResponses[lowPrompt], propertyIds: [], intent: "chat" };
  }

  try {
    const propertyContext = properties.map((p) => ({
      id: p.id,
      t: p.title,
      p: p.price,
      l: p.location,
    }));

    const systemPrompt = `Role: LuxeEstate Assistant. 
    Format JSON: {"text": "msg", "ids": [number], "intent": "buy" | "chat"}. 
    Data: ${JSON.stringify(propertyContext)}. 
    Aturan: 
    1. Jika user ingin membeli/menyewa/tertarik pada properti tertentu, set "intent": "buy" dan berikan ID properti tersebut di "ids".
    2. Selain itu gunakan "intent": "chat".
    3. Ramah, Bahasa Indonesia.`;

    const minimalHistory = history.slice(-3).map((chat) => ({
      role: chat.role === "user" ? "user" : "assistant",
      content: chat.content,
    }));

    const messages = [
      { role: "system", content: systemPrompt },
      ...minimalHistory,
      { role: "user", content: prompt },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages as any,
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      max_tokens: 500,
      top_p: 1,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(responseContent);

    return {
      text: parsed.text || "Ada lagi yang bisa saya bantu?",
      propertyIds: parsed.ids || [],
      intent: parsed.intent || "chat"
    };

  } catch (error: any) {
    console.error("Groq Error:", error);
    if (error?.status === 429) {
      return { text: "Maaf, server kami sedang sibuk.", propertyIds: [], intent: "chat" };
    }
    return { text: "Maaf, terjadi gangguan teknis.", propertyIds: [], intent: "chat" };
  }
}