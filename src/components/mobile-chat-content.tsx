"use client";

import { useEffect, useMemo, useRef } from "react";
import { MicIcon, SendHorizontalIcon } from "lucide-react";

import { useMobileFixedFooter } from "@/components/mobile-app-layout";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import type { ChatMessage } from "@/lib/mobile-chat-mock-data";

type MobileChatContentProps = {
  threadId: string;
  messages: ChatMessage[];
  draftPrompt: string;
  onDraftPromptChange: (value: string) => void;
  onSend: () => void;
  onVoiceInput: () => void;
};

export function MobileChatContent({
  threadId,
  messages,
  draftPrompt,
  onDraftPromptChange,
  onSend,
  onVoiceInput,
}: MobileChatContentProps) {
  const { setFixedFooter } = useMobileFixedFooter();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ block: "end" });
  }, [threadId, messages.length]);

  const fixedFooter = useMemo(
    () => (
      <InputGroup className="pointer-events-auto h-auto border-border bg-background">
        <InputGroupTextarea
          value={draftPrompt}
          onChange={(event) => onDraftPromptChange(event.target.value)}
          className="min-h-20 placeholder:text-foreground/45"
          placeholder="Ask about recipes, training, team guidance..."
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault();
              onSend();
            }
          }}
        />
        <InputGroupAddon
          align="block-end"
          className="border-t border-border pt-2"
        >
          <div className="ml-auto flex items-center gap-2">
            <InputGroupButton
              variant="ghost"
              size="icon-sm"
              aria-label="Voice input"
              title="Voice input"
              onClick={onVoiceInput}
            >
              <MicIcon />
            </InputGroupButton>
            <InputGroupButton
              variant="default"
              size="icon-sm"
              aria-label="Send message"
              title="Send"
              onClick={onSend}
            >
              <SendHorizontalIcon />
            </InputGroupButton>
          </div>
        </InputGroupAddon>
      </InputGroup>
    ),
    [draftPrompt, onDraftPromptChange, onSend, onVoiceInput],
  );

  useEffect(() => {
    setFixedFooter(fixedFooter);

    return () => {
      setFixedFooter(null);
    };
  }, [fixedFooter, setFixedFooter]);

  return (
    <div className="space-y-4 pb-6">
      {messages.map((message) =>
        message.role === "assistant" ? (
          <p
            key={message.id}
            className="max-w-[88%] whitespace-pre-line text-xs leading-relaxed text-foreground/90"
          >
            {message.content}
          </p>
        ) : (
          <div
            key={message.id}
            className="ml-auto w-fit max-w-[88%] border border-primary/35 bg-primary/12 p-2 text-xs leading-relaxed"
          >
            {message.content}
          </div>
        ),
      )}
      <div ref={chatEndRef} />
    </div>
  );
}
