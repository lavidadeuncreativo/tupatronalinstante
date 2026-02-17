import { NextRequest, NextResponse } from "next/server";
import { getAIService } from "@/lib/ai/service";
import { validatePatternLogic } from "@/lib/pattern/validator";
import { z } from "zod";

// const prisma = new PrismaClient({ ... }); // Removed for demo stability

const RequestSchema = z.object({
    image: z.string().optional(), // base64
    imageUrl: z.string().optional(), // URL
    mode: z.enum(["instant", "exact"]).default("instant"),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { image, imageUrl, mode } = RequestSchema.parse(body);

        let base64Data = "";

        if (image) {
            // Optimization: Remove data:image/...;base64, prefix if present
            base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        } else if (imageUrl) {
            console.log("Fetching image from URL:", imageUrl);
            const res = await fetch(imageUrl);
            if (!res.ok) throw new Error("Failed to fetch image from URL");
            const arrayBuffer = await res.arrayBuffer();
            base64Data = Buffer.from(arrayBuffer).toString("base64");
        } else {
            throw new Error("No image provided");
        }

        // 2. Call AI Service
        const aiService = getAIService();
        const pattern = await aiService.generatePattern(base64Data, mode);

        // 3. Validation
        const validation = validatePatternLogic(pattern);

        // 4. Save to DB if needed (e.g. temporary ID)
        /*
        const savedPattern = await prisma.pattern.create({
            data: {
                title: pattern.title,
                category: pattern.category,
                mode: pattern.mode,
                content: JSON.stringify(pattern),
                // For simpler demo, we skip uploading image to object storage and just store null or assume client has it
                // In real app -> upload to R2/S3 here.
            }
        });
        */
        const savedPattern = { id: "demo-id-" + Date.now() };

        return NextResponse.json({
            jobId: savedPattern.id,
            pattern,
            validation
        });

    } catch (error) {
        console.error("Job Error:", error);
        return NextResponse.json(
            { error: "Failed to process pattern generation request." },
            { status: 500 }
        );
    }
}
