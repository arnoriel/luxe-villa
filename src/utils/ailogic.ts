// src/utils/ailogic.ts
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

// Fitur Hemat: Jawaban instan untuk sapaan umum tanpa panggil AI
const quickResponses: Record<string, string> = {
  "halo": "Halo! Selamat datang di LuxeEstate. Ada properti yang bisa saya bantu carikan?",
  "hi": "Hi! Ada yang bisa saya bantu hari ini?",
  "p": "Halo! Ada yang bisa saya bantu?",
  "terima kasih": "Sama-sama! Senang bisa membantu Anda.",
};

export async function getSmartResponse(prompt: string, history: ChatMessage[]) {
  // --- OPTIMASI 1: Client-side Filter (Hemat API) ---
  const lowPrompt = prompt.toLowerCase().trim();
  if (quickResponses[lowPrompt]) {
    return { text: quickResponses[lowPrompt], propertyIds: [] };
  }

  try {
    // --- OPTIMASI 2: Minimalisir Context (Hemat Token) ---
    // Hanya ambil data yang benar-benar penting untuk AI
    const propertyContext = properties.map((p) => ({
      id: p.id,
      t: p.title, // Singkatkan nama field
      p: p.price,
      l: p.location,
    }));

    const systemPrompt = `Role: LuxeEstate Assistant. 
    Format JSON: {"text": "msg", "ids": [number]}. 
    Data: ${JSON.stringify(propertyContext)}. 
    Aturan: Ramah, Bahasa Indonesia, berikan ID jika sebut properti.`;

    // --- OPTIMASI 3: Batasi History (Hemat Token & Kuota) ---
    // Cukup ambil 2 atau 3 chat terakhir agar payload tidak membengkak
    const minimalHistory = history.slice(-3).map((chat) => ({
      role: chat.role === "user" ? "user" : "assistant",
      content: chat.content,
    }));

    const messages = [
      { role: "system", content: systemPrompt },
      ...minimalHistory,
      { role: "user", content: prompt },
    ];

    // --- OPTIMASI 4: Parameter API yang Lebih Efisien ---
    const chatCompletion = await groq.chat.completions.create({
      messages: messages as any,
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      max_tokens: 500, // Batasi jawaban agar tidak terlalu panjang
      top_p: 1,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(responseContent);

    return {
      text: parsed.text || "Ada lagi yang bisa saya bantu?",
      propertyIds: parsed.ids || []
    };

  } catch (error: any) {
    console.error("Groq Error:", error);
    
    // Jika kena limit 429, berikan pesan yang lebih informatif
    if (error?.status === 429) {
      return { 
        text: "Maaf, server AI kami sedang sangat sibuk karena banyak permintaan. Mohon tunggu sebentar ya.", 
        propertyIds: [] 
      };
    }
    
    return { text: "Maaf, terjadi sedikit gangguan teknis.", propertyIds: [] };
  }
}