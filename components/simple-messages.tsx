"use client";

import { useEffect, useRef } from "react";
import type { ChatRequestOptions } from "@ai-sdk/react";
import { Markdown } from "./markdown";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SimpleMessages({
  messages,
  status,
}: {
  messages: ChatMessage[];
  status: ChatRequestOptions["status"];
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground">
            Start a conversation by typing a message below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[80%] rounded-lg px-4 py-2",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            {message.parts.map((part, index) => {
              if (part.type === "text") {
                return (
                  <div key={index}>
                    {message.role === "user" ? (
                      <p className="whitespace-pre-wrap">{part.text}</p>
                    ) : (
                      <Markdown>{part.text}</Markdown>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      ))}
      
      {status === "in_progress" && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
            <div className="flex space-x-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/60" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/60 [animation-delay:0.2s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/60 [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
