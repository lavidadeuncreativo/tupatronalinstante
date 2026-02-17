import { CrochetPattern } from "./schema";

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

export function validatePatternLogic(pattern: CrochetPattern): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check consistent structure
    if (!pattern.parts || pattern.parts.length === 0) {
        errors.push("Pattern has no parts.");
        return { valid: false, errors, warnings };
    }

    for (const part of pattern.parts) {
        let lastStitchCount = 0;

        // Attempt to track stitch count logic (very basic check)
        part.instructions.forEach((inst, index) => {
            if (index === 0 && inst.stitch_count === null) {
                warnings.push(`${part.name} - Step ${inst.step}: First row/round usually needs a stitch count.`);
            }

            // Check if stitch count jumps drastically without explanation
            if (inst.stitch_count !== null && lastStitchCount > 0) {
                const diff = inst.stitch_count - lastStitchCount;
                if (Math.abs(diff) > lastStitchCount * 2) {
                    warnings.push(`${part.name} - Step ${inst.step}: Stitch count changed drastically from ${lastStitchCount} to ${inst.stitch_count}. Correct?`);
                }
            }

            if (inst.stitch_count !== null) {
                lastStitchCount = inst.stitch_count;
            }

            // Basic text smell test
            const text = inst.text.toLowerCase();
            if (text.includes("inc") && !text.includes("dec") && inst.stitch_count !== null && index > 0) {
                // Expect count to go up
                const prev = part.instructions[index - 1].stitch_count;
                if (prev !== null && inst.stitch_count <= prev) {
                    warnings.push(`${part.name} - Step ${inst.step}: Instructions mention 'inc' but stitch count did not increase (prev: ${prev}, curr: ${inst.stitch_count}).`);
                }
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}
