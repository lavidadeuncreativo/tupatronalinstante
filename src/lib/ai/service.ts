import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateObject } from "ai";
import { z } from "zod";
import { CrochetPatternSchema, CrochetPattern } from "./../pattern/schema";

const FAKE_PATTERN: CrochetPattern = {
    brand: "Patrón al instante",
    title: "Patrón de Muestra (Demo)",
    category: "amigurumi",
    mode: "instant",
    confidence: 100,
    assumptions: ["Este es un patrón simulado porque no hay API Key configurada.", "Configura GOOGLE_GENERATIVE_AI_API_KEY para resultados reales."],
    materials: {
        yarn: [
            { fiber: "cotton", weight: "DK", meters_est: 50, colors: ["Variado"] }
        ],
        hook_mm_range: [2.5, 3.5],
        hook_mm_recommended: 3.0,
        tools: ["marcador", "aguja lanera", "relleno"]
    },
    gauge: {
        target: "20 pb x 24 hileras = 10 cm",
        how_to_measure: "Muestra estándar en punto bajo",
        adjustment_rules: ["Ajustar gancho según tensión"]
    },
    abbreviations: [
        { abbr: "pb", meaning: "punto bajo" },
        { abbr: "aum", meaning: "aumento (2 pb en mismo pto)" },
        { abbr: "dism", meaning: "disminución (2 pb juntos)" }
    ],
    parts: [
        {
            name: "Cuerpo Principal (Ejemplo)",
            worked: "in_rounds",
            instructions: [
                { step: 1, label: "Vta 1", text: "Anillo mágico de 6 pb (6)", stitch_count: 6 },
                { step: 2, label: "Vta 2", text: "Aum en cada pto (12)", stitch_count: 12 },
                { step: 3, label: "Vta 3", text: "*1 pb, 1 aum* rep 6 veces (18)", stitch_count: 18 },
                { step: 4, label: "Vta 4", text: "*2 pb, 1 aum* rep 6 veces (24)", stitch_count: 24 },
                { step: 5, label: "Vta 5-8", text: "1 pb en cada pto (24)", stitch_count: 24 },
                { step: 6, label: "Vta 9", text: "*2 pb, 1 dism* rep 6 veces (18)", stitch_count: 18 },
                { step: 7, label: "Vta 10", text: "Rellenar y cerrar con aguja lanera", stitch_count: 0 }
            ],
            notes: ["Este patrón es solo un ejemplo para validar el flujo."]
        }
    ],
    assembly: ["Cerrar y esconder hebras"],
    finishing: ["Disfruta tu creación de prueba"],
    calibration: {
        required_for_exact: false,
        inputs: [],
        used_values: {}
    }
};

export interface AIService {
    generatePattern(imageBase64: string, mode: "instant" | "exact"): Promise<CrochetPattern>;
}

export class GeminiService implements AIService {
    private genAI: GoogleGenerativeAI;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async generatePattern(imageBase64: string, mode: "instant" | "exact"): Promise<CrochetPattern> {
        const model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
      You are an expert crochet designer. Analyze this image and generate a COMPLETE, VALID crochet pattern JSON.
      
      STRICT RULES:
      1. If the image is a screenshot of text/chart/pattern instructions, RETURN ERROR or Refuse. We only generate from finished objects.
      2. If not crochet, refuse.
      3. Mode: ${mode}.
         - If 'exact', be extremely precise with stitch counts assuming standard gauge.
         - If 'instant', make educated guesses.
      4. Output must match the CrochetPatternSchema exactly.
      
      Analyze the structure, stitch type, and likely construction method.
    `;

        // Note: In a real implementation using Vercel AI SDK 'generateObject' is cleaner, 
        // but for direct control over multimodal inputs with specific schema via raw Gemini SDK:

        try {
            const result = await model.generateContent([
                prompt,
                { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
            ]);

            const text = result.response.text();
            // Clean up markdown code blocks if present
            const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();

            const parsed = CrochetPatternSchema.parse(JSON.parse(jsonStr));
            return parsed;

        } catch (e) {
            console.error("Gemini Generation Error:", e);
            throw new Error("Failed to generate pattern. Ensure image is clear crochet work.");
        }
    }
}

export class FakeProvider implements AIService {
    async generatePattern(imageBase64: string, mode: "instant" | "exact"): Promise<CrochetPattern> {
        console.log("FakeProvider: Generating pattern for mode", mode);
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        return FAKE_PATTERN;
    }
}

export function getAIService(): AIService {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (apiKey && apiKey.length > 5) {
        return new GeminiService(apiKey);
    }
    console.warn("Using FakeProvider (No API Key found)");
    return new FakeProvider();
}
