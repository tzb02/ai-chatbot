import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { chat, message, type Chat, type DBMessage } from "./schema.simple";

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function saveChat({
  id,
  sessionId,
  title,
}: {
  id: string;
  sessionId: string;
  title: string;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      title,
      sessionId,
    });
  } catch (error) {
    console.error("Failed to save chat");
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id");
    throw error;
  }
}

export async function saveMessages({ messages }: { messages: Array<DBMessage> }) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    console.error("Failed to save messages");
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(desc(message.createdAt));
  } catch (error) {
    console.error("Failed to get messages by chat id");
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(message).where(eq(message.chatId, id));
    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id");
    throw error;
  }
}
