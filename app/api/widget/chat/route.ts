import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  streamText,
} from "ai";
import { z } from "zod";
import { myProvider } from "@/lib/ai/providers";
import {
  getChatById,
  getMessagesByChatId,
  saveChat,
  saveMessages,
} from "@/lib/db/queries.simple";
import type { ChatMessage } from "@/lib/types";
import { convertToUIMessages, generateUUID } from "@/lib/utils";

export const maxDuration = 60;

const requestSchema = z.object({
  id: z.string(),
  message: z.object({
    id: z.string(),
    role: z.literal("user"),
    parts: z.array(
      z.object({
        type: z.string(),
        text: z.string().optional(),
      })
    ),
  }),
  sessionId: z.string(),
});

// Simple system prompt for survey chatbot
const SURVEY_SYSTEM_PROMPT = `You are a friendly survey assistant. Your role is to:
- Ask survey questions in a conversational way
- Listen carefully to user responses
- Provide helpful clarifications when needed
- Keep the conversation natural and engaging
- Be concise and clear in your responses

Keep your responses brief and to the point.`;

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { id, message, sessionId } = requestSchema.parse(json);

    // Check if chat exists
    const chat = await getChatById({ id });

    if (!chat) {
      // Create new chat with a default title
      await saveChat({
        id,
        sessionId,
        title: "Survey Chat",
      });
    }

    // Get existing messages
    const messagesFromDb = await getMessagesByChatId({ id });
    const uiMessages = [
      ...convertToUIMessages(messagesFromDb as any),
      message,
    ] as ChatMessage[];

    // Save user message
    await saveMessages({
      messages: [
        {
          id: message.id,
          chatId: id,
          role: "user",
          parts: message.parts,
          createdAt: new Date(),
        },
      ],
    });

    // Create AI response stream
    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        const result = streamText({
          model: myProvider.languageModel("gpt-4o-mini"),
          system: SURVEY_SYSTEM_PROMPT,
          messages: convertToModelMessages(uiMessages),
          experimental_transform: smoothStream({ chunking: "word" }),
        });

        result.consumeStream();
        dataStream.merge(result.toUIMessageStream());
      },
      generateId: generateUUID,
      onFinish: async ({ messages }) => {
        // Save assistant messages
        await saveMessages({
          messages: messages.map((currentMessage) => ({
            id: currentMessage.id,
            chatId: id,
            role: currentMessage.role,
            parts: currentMessage.parts,
            createdAt: new Date(),
          })),
        });
      },
      onError: () => {
        return "Sorry, an error occurred. Please try again.";
      },
    });

    return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
  } catch (error) {
    console.error("Widget chat error:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
