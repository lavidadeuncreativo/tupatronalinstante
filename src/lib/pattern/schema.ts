import { z } from "zod";

export const MaterialsSchema = z.object({
  yarn: z.array(
    z.object({
      fiber: z.enum(["cotton", "acrylic", "wool", "blend", "other"]).or(z.string()),
      weight: z.enum(["lace", "fingering", "sport", "DK", "worsted", "bulky", "super_bulky"]).or(z.string()),
      meters_est: z.number().optional(),
      colors: z.array(z.string()),
    })
  ),
  hook_mm_range: z.tuple([z.number(), z.number()]),
  hook_mm_recommended: z.number(),
  tools: z.array(z.string()),
});

export const GaugeSchema = z.object({
  target: z.string(), // "X stitches x Y rows = 10 cm"
  stitches_per_10cm: z.number().optional(),
  rows_per_10cm: z.number().optional(),
  how_to_measure: z.string(),
  adjustment_rules: z.array(z.string()),
});

export const AbbreviationSchema = z.object({
  abbr: z.string(),
  meaning: z.string(),
});

export const InstructionStepSchema = z.object({
  step: z.number(),
  label: z.string(), // "Row 1" or "Round 1"
  text: z.string(),
  stitch_count: z.number().nullable(),
});

export const PatternPartSchema = z.object({
  name: z.string(),
  worked: z.enum(["in_rounds", "rows", "motifs"]),
  instructions: z.array(InstructionStepSchema),
  notes: z.array(z.string()).optional(),
});

export const CalibrationSchema = z.object({
  required_for_exact: z.boolean(),
  inputs: z.array(z.string()), // "height_cm", "width_cm", "scale_photo"
  used_values: z.record(z.string(), z.any()).optional(),
});

export const CrochetPatternSchema = z.object({
  brand: z.literal("Patrón al instante").default("Patrón al instante"),
  title: z.string(),
  category: z.enum(["amigurumi", "bag", "motif", "blanket", "garment_simple", "other"]),
  mode: z.enum(["instant", "exact"]),
  confidence: z.number().min(0).max(100),
  assumptions: z.array(z.string()),
  materials: MaterialsSchema,
  gauge: GaugeSchema,
  abbreviations: z.array(AbbreviationSchema),
  parts: z.array(PatternPartSchema),
  assembly: z.array(z.string()),
  finishing: z.array(z.string()),
  calibration: CalibrationSchema,
});

export type CrochetPattern = z.infer<typeof CrochetPatternSchema>;
