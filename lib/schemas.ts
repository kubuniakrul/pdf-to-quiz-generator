import { z } from "zod";

// Schema for a single question
export const questionSchema = z.object({
  question: z.string().describe("The multiple choice question text"),
  options: z
    .array(z.string())
    .length(4)
    .describe("Exactly 4 answer options of roughly equal length"),
  correctAnswer: z
    .number()
    .min(0)
    .max(3)
    .describe("Index of the correct answer (0-3)"),
  explanation: z
    .string()
    .optional()
    .describe("Optional explanation of why this answer is correct"),
});

// Schema for the array of questions - updated to expect 20
export const questionsSchema = z
  .array(questionSchema)
  .length(20)
  .describe("Array of exactly 20 quiz questions");

// Type exports for TypeScript
export type Question = z.infer<typeof questionSchema>;
export type Questions = z.infer<typeof questionsSchema>;
