"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
import { SimpleMessages } from "./simple-messages";
import { SimpleInput } from "./simple-input";
import { toast } from "./toast";

export function SimpleChatWidget({
  id,
  sessionId,
  initialMessages,
}: {
  id: string;
  sessionId: string;
  initialMessages: ChatMessage[];
}) {
  const [input, setInput] = useState<string>("");

  const {
    messages,
    sendMessage,
    status,
    stop,
  } = useChat<ChatMessage>({
    id,
    messages: initialMessages,
    experimental_throttle: 100,
    generateId: generateUUID,
    transport: new DefaultChatTransport({
      api: "/api/widget/chat",
      fetch: fetchWithErrorHandlers,
      prepareSendMessagesRequest(request) {
        return {
          body: {
            id: request.id,
            message: request.messages.at(-1),
            sessionId,
            ...request.body,
          },
        };
      },
    }),
    onError: (error) => {
      toast({
        type: "error",
        description: error.message || "An error occurred",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || status === "in_progress") {
      return;
    }

    sendMessage({
      role: "user" as const,
      parts: [{ type: "text", text: input }],
    });

    setInput("");
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Survey Assistant</h2>
        <p className="text-sm text-muted-foreground">
          How can I help you today?
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <SimpleMessages messages={messages} status={status} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <SimpleInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          status={status}
          stop={stop}
        />
      </div>
    </div>
  );
}
