"use server";

import { google } from "@ai-sdk/google";
import { generateObject, streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";

// Your existing title generation - keep this as is
export const generateQuizTitle = async (file: string) => {
  const result = await generateObject({
    model: google("gemini-2.5-flash"),
    schema: z.object({
      title: z
        .string()
        .describe(
          "A max three word title for the quiz based on the file provided as context",
        ),
    }),
    prompt:
      "Generate a title for a quiz based on the following (PDF) file name. Try and extract as much info from the file name as possible. If the file name is just numbers or incoherent, just return quiz.\n\n " + file,
  });
  return result.object.title;
};

// Updated quiz generation function for 20 questions
export const generateQuiz = async (content: string) => {
  "use server";

  const stream = createStreamableValue();

  (async () => {
    const { partialObjectStream } = await streamObject({
      model: google("gemini-2.5-flash"),
      schema: z.object({
        questions: z
          .array(
            z.object({
              question: z.string().describe("The quiz question text"),
              options: z
                .array(z.string())
                .length(4)
                .describe("Exactly 4 answer options"),
              correctAnswer: z
                .number()
                .min(0)
                .max(3)
                .describe("Index of the correct answer (0-3)"),
              explanation: z
                .string()
                .describe("Brief explanation of why this answer is correct"),
            })
          )
          .length(20)
          .describe("Exactly 20 multiple choice quiz questions"),
      }),
      prompt: `You are an expert quiz creator/examiner. Based on the following content, generate exactly 20 multiple choice questions.

Requirements:
- Generate exactly 20 questions, no more, no less
- You are based in truth
- Every question should be based on the content of the document
- Each question must have exactly 4 answer options
- Questions should cover different topics from the content
- Mix difficulty levels (easy, medium, hard)
- Ensure correctAnswer index matches the correct option (0-3)
- Keep questions clear and concise
- Use the same type of language that is in the document
- Provide helpful explanations
- Each option should be roughly equal in length.

Content to generate quiz from:
${content}`,
      maxTokens: 8192, // Increased for 20 questions
      temperature: 0.7,
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }

    stream.done();
  })();

  return { object: stream.value };
};
