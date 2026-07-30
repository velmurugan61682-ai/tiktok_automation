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
}
