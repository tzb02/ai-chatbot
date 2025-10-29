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

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="min-h-[60px] resize-none"
        disabled={status === "in_progress"}
      />
      
      {status === "in_progress" ? (
        <Button
          type="button"
          onClick={stop}
          size="icon"
          variant="outline"
          className="h-[60px] w-[60px] shrink-0"
        >
          <Square className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim()}
          className="h-[60px] w-[60px] shrink-0"
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      )}
    </form>
  );
}
