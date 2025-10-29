"use client";

import type { ChatRequestOptions } from "@ai-sdk/react";
import { SendHorizontal, Square } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export function SimpleInput({
  input,
  setInput,
  handleSubmit,
  status,
  stop,
}: {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  status: ChatRequestOptions["status"];
  stop: () => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isLoading = status === "awaiting_message";
  
  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <Textarea
        className="min-h-[60px] resize-none"
        disabled={isLoading}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        value={input}
      />

      {isLoading ? (
        <Button
          className="h-[60px] w-[60px] shrink-0"
          onClick={stop}
          size="icon"
          type="button"
          variant="outline"
        >
          <Square className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          className="h-[60px] w-[60px] shrink-0"
          disabled={!input.trim()}
          size="icon"
          type="submit"
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      )}
    </form>
  );
}
