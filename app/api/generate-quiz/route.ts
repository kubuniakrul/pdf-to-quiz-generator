import { questionSchema, questionsSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 120;

export async function POST(req: Request) {
  const { files } = await req.json();
  const firstFile = files[0].data;
  const fileType = files[0].type;

  const result = streamObject({
    model: google("gemini-2.5-flash"),
    messages: [
      {
        role: "system",
        content:
          "You are an expert teacher and test creator. Your job is to take a document and create a comprehensive multiple choice test with exactly 20 questions based on the content of the document. Each question must have exactly 4 options that are roughly equal in length. Ensure questions cover different topics from the document and vary in difficulty from easy to hard.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create a multiple choice test with exactly 20 questions based on this document. Make sure to cover all major topics.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: fileType,
          },
        ],
      },
    ],
    schema: questionSchema,
    output: "array",
    maxTokens: 8192,
    temperature: 0.7,
    onFinish: ({ object }) => {
      const res = questionsSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
      if (Array.isArray(object) && object.length !== 20) {
        throw new Error(`Expected exactly 20 questions, but got ${object.length}`);
      }
    },
  });

  return result.toTextStreamResponse();
}
