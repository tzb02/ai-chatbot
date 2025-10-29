import { cookies } from "next/headers";
import { SimpleChatWidget } from "@/components/simple-chat-widget";
import { generateUUID } from "@/lib/utils";

export default async function WidgetPage() {
  const id = generateUUID();
  
  // Get or create anonymous session ID
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("session-id")?.value;
  
  if (!sessionId) {
    sessionId = generateUUID();
  }

  return (
    <div className="h-screen w-full">
      <SimpleChatWidget
        id={id}
        sessionId={sessionId}
        initialMessages={[]}
      />
    </div>
  );
}
