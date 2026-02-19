"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeftIcon, ListIcon, PencilIcon } from "lucide-react";

import { MobileAppLayout } from "@/components/mobile-app-layout";
import { MobileChatContent } from "@/components/mobile-chat-content";
import { mobilePrimaryNav } from "@/components/mobile-primary-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  buildMobileChatAssistantReply,
  mobileChatThreadsSeed,
  mobileChatVoiceAcknowledgement,
  toMobileChatThreadTitle,
  type ChatHistoryBucket,
  type ChatMessage,
  type ChatThread,
} from "@/lib/mobile-chat-mock-data";
import { cn } from "@/lib/utils";

const historyBucketOrder: readonly ChatHistoryBucket[] = [
  "today",
  "yesterday",
  "last-week",
];

const historyBucketLabel: Record<ChatHistoryBucket, string> = {
  today: "Today",
  yesterday: "Yesterday",
  "last-week": "Last week",
};

function toThreadPreview(thread: ChatThread) {
  const latestMessage = thread.messages[thread.messages.length - 1]?.content ?? "";
  const normalized = latestMessage.replace(/\s+/g, " ").trim();

  if (normalized.length <= 72) {
    return normalized;
  }

  return `${normalized.slice(0, 69).trimEnd()}...`;
}

function moveThreadToTop(threads: ChatThread[], activeThreadId: string) {
  const activeThreadIndex = threads.findIndex((thread) => thread.id === activeThreadId);
  if (activeThreadIndex <= 0) {
    return threads;
  }

  const activeThread = threads[activeThreadIndex];
  if (!activeThread) {
    return threads;
  }
  return [activeThread, ...threads.slice(0, activeThreadIndex), ...threads.slice(activeThreadIndex + 1)];
}

export function MobileChatPage() {
  const historyCloseMs = 220;
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistoryMounted, setIsHistoryMounted] = useState(false);
  const [isHistoryAnimatedIn, setIsHistoryAnimatedIn] = useState(false);
  const [threads, setThreads] = useState<ChatThread[]>(mobileChatThreadsSeed);
  const [activeThreadId, setActiveThreadId] = useState(mobileChatThreadsSeed[0]?.id ?? "");
  const [draftPrompt, setDraftPrompt] = useState("");
  const idCounterRef = useRef(600);

  useEffect(() => {
    if (!isHistoryOpen) {
      return;
    }

    setIsHistoryMounted(true);

    let enterFrameTwo: number | null = null;
    const enterFrameOne = window.requestAnimationFrame(() => {
      enterFrameTwo = window.requestAnimationFrame(() => {
        setIsHistoryAnimatedIn(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(enterFrameOne);
      if (enterFrameTwo !== null) {
        window.cancelAnimationFrame(enterFrameTwo);
      }
    };
  }, [isHistoryOpen]);

  useEffect(() => {
    if (isHistoryOpen || !isHistoryMounted) {
      return;
    }

    setIsHistoryAnimatedIn(false);
    const timeout = window.setTimeout(() => {
      setIsHistoryMounted(false);
    }, historyCloseMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [historyCloseMs, isHistoryMounted, isHistoryOpen]);

  const activeThread = useMemo(
    () =>
      threads.find((thread) => thread.id === activeThreadId) ??
      threads[0] ??
      null,
    [activeThreadId, threads],
  );

  const groupedHistoryThreads = useMemo(
    () =>
      historyBucketOrder
        .map((bucket) => ({
          bucket,
          label: historyBucketLabel[bucket],
          threads: threads.filter((thread) => thread.updatedAtBucket === bucket),
        }))
        .filter((group) => group.threads.length > 0),
    [threads],
  );

  const nextId = useCallback((prefix: string) => {
    idCounterRef.current += 1;
    return `${prefix}-${idCounterRef.current}`;
  }, []);

  const handleSelectThread = useCallback((threadId: string) => {
    setActiveThreadId(threadId);
    setIsHistoryOpen(false);
    setDraftPrompt("");
  }, []);

  const handleCreateNewChat = useCallback(() => {
    const threadId = nextId("thread");

    const newThread: ChatThread = {
      id: threadId,
      title: "New chat",
      updatedAtLabel: "now",
      updatedAtBucket: "today",
      messages: [],
    };

    setThreads((previous) => [newThread, ...previous]);
    setActiveThreadId(threadId);
    setDraftPrompt("");
  }, [nextId]);

  const handleSend = useCallback(() => {
    const prompt = draftPrompt.trim();
    if (!prompt || !activeThreadId) {
      return;
    }

    const userMessage: ChatMessage = {
      id: nextId("chat"),
      role: "user",
      content: prompt,
    };
    const assistantMessage: ChatMessage = {
      id: nextId("chat"),
      role: "assistant",
      content: buildMobileChatAssistantReply(prompt),
    };

    setThreads((previous) => {
      const nextThreads = previous.map((thread) => {
        if (thread.id !== activeThreadId) {
          return thread;
        }

        const isFreshChat = thread.title === "New chat" && thread.messages.length <= 1;
        return {
          ...thread,
          title: isFreshChat ? toMobileChatThreadTitle(prompt) : thread.title,
          updatedAtLabel: "now",
          updatedAtBucket: "today" as const,
          messages: [...thread.messages, userMessage, assistantMessage],
        };
      });

      return moveThreadToTop(nextThreads, activeThreadId);
    });
    setDraftPrompt("");
  }, [activeThreadId, draftPrompt, nextId]);

  const handleVoiceInput = useCallback(() => {
    if (!activeThreadId) {
      return;
    }

    const voiceAckMessage: ChatMessage = {
      id: nextId("chat"),
      role: "assistant",
      content: mobileChatVoiceAcknowledgement,
    };

    setThreads((previous) => {
      const activeThread = previous.find((thread) => thread.id === activeThreadId);
      const hasUserMessage =
        activeThread?.messages.some((message) => message.role === "user") ?? false;
      if (!hasUserMessage) {
        return previous;
      }

      const nextThreads = previous.map((thread) =>
        thread.id === activeThreadId
          ? {
              ...thread,
              updatedAtLabel: "now",
              updatedAtBucket: "today" as const,
              messages: [...thread.messages, voiceAckMessage],
            }
          : thread,
      );

      return moveThreadToTop(nextThreads, activeThreadId);
    });
  }, [activeThreadId, nextId]);

  return (
    <>
      <MobileAppLayout
        primaryNav={mobilePrimaryNav}
        showBottomNav={false}
        fixedFooterBare
        floatingLayer={
          isHistoryMounted ? (
            <div
              className={cn(
                "absolute inset-0 z-10",
                isHistoryOpen ? "pointer-events-auto" : "pointer-events-none",
              )}
            >
              <button
                type="button"
                aria-label="Close chat history"
                className={cn(
                  "absolute inset-0 bg-black/10 supports-backdrop-filter:backdrop-blur-xs transition-opacity will-change-[opacity]",
                  isHistoryAnimatedIn
                    ? "opacity-100 duration-[240ms] ease-out"
                    : "opacity-0 duration-[220ms] ease-in",
                )}
                onClick={() => setIsHistoryOpen(false)}
              />
              <aside
                className={cn(
                  "relative flex h-full w-[86%] max-w-sm flex-col border-r border-border/70 bg-background shadow-lg transition-transform will-change-transform",
                  isHistoryAnimatedIn
                    ? "translate-x-0 duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
                    : "-translate-x-[102%] duration-[220ms] [transition-timing-function:cubic-bezier(0.4,0,1,1)]",
                )}
              >
                <header className="border-b border-border/70 px-4 pb-4 pt-14">
                  <h3 className="text-sm font-medium">Chat history</h3>
                </header>
                <ScrollArea className="min-h-0 flex-1">
                  <div className="space-y-3 p-3">
                    {groupedHistoryThreads.map((group) => (
                      <section key={group.bucket} className="space-y-2">
                        <div className="text-muted-foreground sticky top-0 z-10 w-full bg-background/95 px-3 py-2.5 text-[10px] uppercase tracking-[0.08em] supports-backdrop-filter:backdrop-blur-md">
                          {group.label}
                        </div>
                        <div className="space-y-2">
                          {group.threads.map((thread) => {
                            const isActive = thread.id === activeThread?.id;
                            return (
                              <button
                                key={thread.id}
                                type="button"
                                className={cn(
                                  "w-full border border-border/70 bg-background p-3 text-left transition-colors",
                                  isActive
                                    ? "border-secondary/55 bg-secondary/12"
                                    : "hover:bg-muted/45",
                                )}
                                onClick={() => handleSelectThread(thread.id)}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-xs">{thread.title}</p>
                                  <span className="text-muted-foreground shrink-0 text-[10px]">
                                    {thread.updatedAtLabel}
                                  </span>
                                </div>
                                <p className="text-muted-foreground mt-1 text-[11px] leading-snug">
                                  {toThreadPreview(thread)}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    ))}
                  </div>
                </ScrollArea>
              </aside>
            </div>
          ) : null
        }
        headerTitle={activeThread?.title ?? "New chat"}
        headerLeading={
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Go back"
              className="text-foreground/90 inline-flex size-8 items-center justify-center rounded-full border border-border/60 bg-background/65"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Open chat history"
              className="text-foreground/90 inline-flex size-8 items-center justify-center rounded-full border border-border/60 bg-background/65"
              onClick={() => setIsHistoryOpen(true)}
            >
              <ListIcon className="size-4" />
            </button>
          </div>
        }
        headerTrailing={
          <button
            type="button"
            aria-label="New chat"
            className="text-foreground/90 inline-flex size-8 items-center justify-center rounded-full border border-border/60 bg-background/65"
          >
            <PencilIcon className="size-4" />
          </button>
        }
        sectionTitle="Screen 07: Mobile Chat"
        sectionBullets={[
          "No-tabbar, end-user AI chat flow for shift support and training guidance.",
          "Header actions open history on the left and create a fresh chat on the right.",
          "Message stream uses existing chat bubble treatment and fixed composer controls.",
        ]}
      >
        {activeThread ? (
          <MobileChatContent
            threadId={activeThread.id}
            messages={activeThread.messages}
            draftPrompt={draftPrompt}
            onDraftPromptChange={setDraftPrompt}
            onSend={handleSend}
            onVoiceInput={handleVoiceInput}
          />
        ) : null}
      </MobileAppLayout>
    </>
  );
}
