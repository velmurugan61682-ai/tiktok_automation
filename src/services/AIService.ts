import { GoogleGenAI } from "@google/genai";
import { AutomationRepository } from "../repository/AutomationRepository.js";
import { ProductRepository } from "../repository/ProductRepository.js";
import { ConversationRepository } from "../repository/ConversationRepository.js";

// Initialize the Gemini client on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy_key_for_compilation",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export class AIService {
  /**
   * AI FLOW:
   * Customer Message -> AI -> Knowledge Search -> Product Search -> Prompt Builder -> OpenAI/Gemini -> Validate -> Reply
   */
  static async generateReply(workspaceId: string, conversationId: string, customerMessage: string): Promise<string> {
    try {
      // 1. Knowledge Base Search
      const kbs = AutomationRepository.findKB(workspaceId);
      let relevantKbContext = "";
      for (const kb of kbs) {
        if (
          customerMessage.toLowerCase().includes(kb.question.toLowerCase()) ||
          kb.question.toLowerCase().split(" ").some(word => word.length > 4 && customerMessage.toLowerCase().includes(word))
        ) {
          relevantKbContext += `Q: ${kb.question}\nA: ${kb.answer}\n\n`;
        }
      }

      // 2. Product Search
      const products = ProductRepository.find(workspaceId);
      let relevantProductContext = "";
      for (const product of products) {
        if (
          customerMessage.toLowerCase().includes(product.name.toLowerCase()) ||
          customerMessage.toLowerCase().includes(product.sku.toLowerCase()) ||
          product.name.toLowerCase().split(" ").some(word => word.length > 4 && customerMessage.toLowerCase().includes(word))
        ) {
          relevantProductContext += `Product: ${product.name}\nSKU: ${product.sku}\nPrice: Rs. ${product.price}\nStock: ${product.stock}\nDescription: ${product.description}\n\n`;
        }
      }

      // If nothing matches, provide a few default products for context
      if (!relevantProductContext && products.length > 0) {
        relevantProductContext = "Available Products for reference:\n" + products.slice(0, 2).map(p => 
          `- ${p.name} (Price: Rs. ${p.price}, Stock: ${p.stock})`
        ).join("\n") + "\n\n";
      }

      // 3. Prompt Builder
      const systemInstruction = `You are an elite, helpful commercial AI Assistant for an online shop workspace (${workspaceId}).
Your job is to answer customer questions about products, shipping, and support based strictly on the context provided.
Always be polite, direct, and sales-focused. Never invent details about shipping rates or products.

Context from Knowledge Base:
${relevantKbContext || "No specific FAQ matches."}

Context from Product Catalog:
${relevantProductContext || "No specific product matches."}

Rules:
1. Always start your response with a welcoming greeting: "Welcome! What can I help you?" or similar welcoming phrase before addressing the customer's query.
2. If you can suggest a product, include its price and features.
3. Be friendly and keep responses concise (under 80 words) as it is a direct chat.
4. If you do not know the answer, say politely: "Let me check with a team member!" and prompt transfer to a human.`;

      // 4. Call Gemini 3.5 Flash
      // Note: If no API key is provided, we simulate a fast professional response to avoid crashes
      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not found in environment, simulating AI reply.");
        return this.simulateFallbackReply(customerMessage, relevantKbContext, relevantProductContext);
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: customerMessage,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || "";
      
      // 5. Validate & Save Response
      const validatedReply = text.trim() || "Welcome! What can I help you?";
      
      return validatedReply;

    } catch (error) {
      console.error("Gemini API Error in AIService:", error);
      return "Welcome! What can I help you?";
    }
  }

  private static simulateFallbackReply(message: string, kbContext: string, prodContext: string): string {
    const msgLower = message.toLowerCase();
    
    if (kbContext && kbContext.includes("shipping")) {
      return "Welcome! What can I help you? We offer FREE shipping all across India for orders above Rs. 499. For orders below Rs. 499, a flat shipping fee of Rs. 50 is charged. Can I help you with any other products?";
    }
    
    if (msgLower.includes("soap") || msgLower.includes("price") || msgLower.includes("cost")) {
      return "Welcome! What can I help you? Our Vaseegrah Nalangu Maavu Herbal Soap is priced at Rs. 180 (for 100g) and is in stock! It's made of 100% organic bath powder and pure coconut oil. Would you like me to share the order link?";
    }
    
    if (msgLower.includes("oil") || msgLower.includes("hair")) {
      return "Welcome! What can I help you? Our Vaseegrah Organic Hair Growth Oil is in stock for Rs. 320 (200ml bottle). It nourishes roots and reduces hairfall. Would you like me to add it to a cart for you?";
    }

    return "Welcome! What can I help you?";
  }

  static async generateLiveStreamPlan(
    workspaceId: string,
    topic: string,
    productName?: string
  ): Promise<{
    titles: string[];
    description: string;
    structure: Array<{ time: string; title: string; details: string }>;
    qnaPrompts: Array<{ question: string; answer: string }>;
  }> {
    const fallbackTitles = [
      `🔥 LIVE: ${topic} Masterclass & Live Q&A!`,
      `🚀 How to Master ${topic} (Step-by-Step Live Demo)`,
      `💥 Top Secrets of ${topic} Revealed Live!`,
      `🔴 LIVE Demo: ${topic} - Everything You Need to Know`,
      `⚡ ${topic} 30-Minute Live Guide & Special Q&A`
    ];

    const fallbackDescription = `🔥 Welcome to today's LIVE stream on "${topic}"! ${productName ? `Featuring: ${productName}.` : ''}

📌 TIMESTAMPS:
0:00 - Stream Start & Community Welcome
5:00 - Core Topic Presentation & Live Demo
15:00 - Viewer Q&A Session (Ask Your Questions Live!)
25:00 - Special Announcement & Wrap-Up

🔗 USEFUL LINKS & RESOURCES:
👉 Official Store: https://yourdomain.com
👉 Product Showcase: https://yourdomain.com/products

💡 KEYWORDS:
#LiveStream #${topic.replace(/\s+/g, '')} #LiveDemo #QnA #ECommerce

🔔 SUBSCRIBE & TURN ON NOTIFICATIONS!`;

    const fallbackStructure = [
      { time: "Minute 0-5", title: "Intro & Welcoming Viewers", details: "Check audio/video quality, welcome early joiners, introduce the topic." },
      { time: "Minute 5-15", title: "Core Topic Demo", details: `Live demonstration of ${topic}${productName ? ` highlighting ${productName}` : ''}.` },
      { time: "Minute 15-25", title: "Viewer Q&A Session", details: "Answer top audience questions, address doubts, provide live offer codes." },
      { time: "Minute 25-30", title: "Wrap Up & Subscribe CTA", details: "Summarize key points, announce next live, ask viewers to subscribe." }
    ];

    const fallbackQnA = [
      { question: "Is this suitable for beginners?", answer: "Yes! Step-by-step guidance is provided for all levels." },
      { question: "Where can I find the link to order?", answer: "Check the description link or pinned live chat message." },
      { question: "Will the recording be saved?", answer: "Yes, the full replay will be available right after the live stream ends." },
      { question: "What is the price or special discount today?", answer: "We have an exclusive live discount code pinned in the chat." },
      { question: "How long does shipping or access take?", answer: "Orders are processed within 24 hours with instant tracking." }
    ];

    try {
      if (!process.env.GEMINI_API_KEY) {
        return {
          titles: fallbackTitles,
          description: fallbackDescription,
          structure: fallbackStructure,
          qnaPrompts: fallbackQnA
        };
      }

      const prompt = `Act as an expert YouTube & TikTok Live Streaming Strategist.
Generate a complete, structured Live Stream Plan for the topic: "${topic}" ${productName ? `and product: "${productName}"` : ''}.

Return strictly JSON with no code blocks or markdown:
{
  "titles": ["5 high-CTR titles"],
  "description": "Engaging description with timestamps and CTAs",
  "structure": [
    { "time": "Minute 0-5", "title": "Intro", "details": "..." },
    { "time": "Minute 5-15", "title": "Demo", "details": "..." },
    { "time": "Minute 15-25", "title": "Q&A", "details": "..." },
    { "time": "Minute 25-30", "title": "Wrap Up", "details": "..." }
  ],
  "qnaPrompts": [
    { "question": "Question 1", "answer": "Answer 1" },
    { "question": "Question 2", "answer": "Answer 2" },
    { "question": "Question 3", "answer": "Answer 3" },
    { "question": "Question 4", "answer": "Answer 4" },
    { "question": "Question 5", "answer": "Answer 5" }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
        },
      });

      const text = (response.text || "").trim();
      const cleanedJson = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanedJson);

      return {
        titles: parsed.titles || fallbackTitles,
        description: parsed.description || fallbackDescription,
        structure: parsed.structure || fallbackStructure,
        qnaPrompts: parsed.qnaPrompts || fallbackQnA
      };
    } catch (e) {
      console.warn("AI generation failed or key missing, returning fallback plan", e);
      return {
        titles: fallbackTitles,
        description: fallbackDescription,
        structure: fallbackStructure,
        qnaPrompts: fallbackQnA
      };
    }
  }
}
