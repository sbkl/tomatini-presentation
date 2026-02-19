"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  BoldIcon,
  FileTextIcon,
  Heading1Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  MessageCircleIcon,
  MicIcon,
  Redo2Icon,
  SendHorizontalIcon,
  StrikethroughIcon,
  TextQuoteIcon,
  Trash2Icon,
  UnderlineIcon,
  Undo2Icon,
  UploadIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
  InputGroupText,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebAppPageHeader } from "@/components/web-app-page-header";
import { cn } from "@/lib/utils";

type AgentId = "host" | "chef" | "clienteling" | "foh" | "training";
type AgentSubmenuKey = "soul" | "documents";

type AgentMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

type AgentDocument = {
  id: string;
  name: string;
  type: string;
  sizeBytes: number;
  updatedAt: string;
};

type AgentProfile = {
  id: AgentId;
  name: string;
  roleDescription: string;
  soulMarkdown: string;
  documents: AgentDocument[];
  messages: AgentMessage[];
};

type SoulHistory = {
  past: string[];
  future: string[];
};

const agentOptions = [
  { id: "host", label: "Host Agent" },
  { id: "chef", label: "Chef Agent" },
  { id: "clienteling", label: "Clienteling Agent" },
  { id: "foh", label: "FOH Agent" },
  { id: "training", label: "Training Agent" },
] as const satisfies readonly { id: AgentId; label: string }[];

const outlinedSecondaryBadgeClass =
  "border-secondary/55 text-secondary bg-transparent";

function createInitialProfiles(): Record<AgentId, AgentProfile> {
  return {
    host: {
      id: "host",
      name: "Host Agent",
      roleDescription:
        "Voice of LPM spirit and culture, guiding tone and consistency across the platform.",
      soulMarkdown: `# Host Agent Soul

## Mission
- Protect the signature LPM welcome and guest rhythm.
- Keep all guidance elegant, warm, and operationally precise.

## Guardrails
- Preserve house tone before speed.
- Escalate to management when guest risk is high.

## Signature behaviors
> Every interaction should feel personal, calm, and intentional.`,
      documents: [
        {
          id: "host-doc-1",
          name: "LPM Culture Principles.md",
          type: "Markdown",
          sizeBytes: 34100,
          updatedAt: "2026-02-14",
        },
        {
          id: "host-doc-2",
          name: "Guest Arrival SOP.pdf",
          type: "PDF",
          sizeBytes: 152000,
          updatedAt: "2026-02-16",
        },
      ],
      messages: [
        {
          id: "host-chat-1",
          role: "user",
          content:
            "I need this agent to onboard new managers on LPM spirit before they write any service prompts.",
        },
        {
          id: "host-chat-2",
          role: "assistant",
          content:
            "Understood. I will anchor every response in welcome ritual, table cadence, and calm conflict language.",
        },
        {
          id: "host-chat-3",
          role: "user",
          content:
            "Add a strict reminder that premium guests should still receive the same baseline warmth as every table.",
        },
        {
          id: "host-chat-4",
          role: "assistant",
          content:
            "Done. Baseline hospitality equity is now explicit, with extra personalization layered only after baseline quality is met.",
        },
      ],
    },
    chef: {
      id: "chef",
      name: "Chef Agent",
      roleDescription:
        "Builds recipe content, checks service execution details, and keeps culinary language operation-ready.",
      soulMarkdown: `# Chef Agent Soul

## Mission
- Convert culinary intent into clear, service-ready recipe guidance.
- Keep standards aligned across mise-en-place, allergens, and pass timing.

## Guardrails
- Never invent ingredients not provided by admin.
- Flag missing allergen details before finalizing a recipe.`,
      documents: [
        {
          id: "chef-doc-1",
          name: "Recipe Authoring Standard.docx",
          type: "Word",
          sizeBytes: 99100,
          updatedAt: "2026-02-13",
        },
        {
          id: "chef-doc-2",
          name: "Allergen Callout Checklist.xlsx",
          type: "Spreadsheet",
          sizeBytes: 47200,
          updatedAt: "2026-02-15",
        },
      ],
      messages: [
        {
          id: "chef-chat-1",
          role: "user",
          content:
            "When this agent drafts a recipe, keep wording concise for station handoff, not storytelling.",
        },
        {
          id: "chef-chat-2",
          role: "assistant",
          content:
            "Acknowledged. I will produce short, actionable lines with explicit prep order, garnish, and allergen visibility.",
        },
        {
          id: "chef-chat-3",
          role: "user",
          content:
            "Also enforce a final line for service tools so FOH never guesses.",
        },
        {
          id: "chef-chat-4",
          role: "assistant",
          content:
            "Applied. Recipe templates now include a mandatory Service Tools section before publication.",
        },
      ],
    },
    clienteling: {
      id: "clienteling",
      name: "Clienteling Agent",
      roleDescription:
        "Advises on loyalty, guest memory, and relationship-building sequences for repeat high-value guests.",
      soulMarkdown: `# Clienteling Agent Soul

## Mission
- Strengthen guest loyalty through memory, anticipation, and follow-through.
- Guide teams on when and how to personalize without overstepping.

## Guardrails
- Prioritize relevance over volume in follow-up messages.
- Keep offers consistent with brand and local policy.`,
      documents: [
        {
          id: "clienteling-doc-1",
          name: "VIP Recovery Playbook.pdf",
          type: "PDF",
          sizeBytes: 208000,
          updatedAt: "2026-02-12",
        },
        {
          id: "clienteling-doc-2",
          name: "Loyalty Touchpoint Matrix.csv",
          type: "CSV",
          sizeBytes: 19800,
          updatedAt: "2026-02-16",
        },
      ],
      messages: [
        {
          id: "clienteling-chat-1",
          role: "user",
          content:
            "I want guidance for when to offer a gesture after a service recovery without training the guest to expect discounts.",
        },
        {
          id: "clienteling-chat-2",
          role: "assistant",
          content:
            "I will frame recovery around acknowledgment, tailored follow-up, and selective gestures linked to context, not habit.",
        },
        {
          id: "clienteling-chat-3",
          role: "user",
          content:
            "Add a script for reconnecting with dormant regulars before holiday periods.",
        },
        {
          id: "clienteling-chat-4",
          role: "assistant",
          content:
            "Added: segmented outreach cadence with message templates for dormant regulars, VIPs, and first-time returners.",
        },
      ],
    },
    foh: {
      id: "foh",
      name: "FOH Agent",
      roleDescription:
        "Supports floor teams with practical scripts for guest handling, escalations, and fidelity at table level.",
      soulMarkdown: `# FOH Agent Soul

## Mission
- Coach teams to handle guest scenarios with confidence and composure.
- Keep service decisions consistent during busy windows.

## Guardrails
- Keep language respectful even under pressure.
- Route safety, allergy, or conflict escalation immediately.`,
      documents: [
        {
          id: "foh-doc-1",
          name: "Service Escalation Ladder.pdf",
          type: "PDF",
          sizeBytes: 173200,
          updatedAt: "2026-02-11",
        },
        {
          id: "foh-doc-2",
          name: "Objection Handling Scripts.md",
          type: "Markdown",
          sizeBytes: 28600,
          updatedAt: "2026-02-14",
        },
      ],
      messages: [
        {
          id: "foh-chat-1",
          role: "user",
          content:
            "I need scenario coaching for a delayed main course where the guest is visibly upset.",
        },
        {
          id: "foh-chat-2",
          role: "assistant",
          content:
            "I will provide a three-step script: acknowledge, time-bound update, and ownership by a named team member.",
        },
        {
          id: "foh-chat-3",
          role: "user",
          content:
            "Add a branch for when the guest asks to speak with the manager immediately.",
        },
        {
          id: "foh-chat-4",
          role: "assistant",
          content:
            "Branch added with handoff language and pre-brief checklist so management receives full context in under 30 seconds.",
        },
      ],
    },
    training: {
      id: "training",
      name: "Training Agent",
      roleDescription:
        "Builds and maintains training modules, learning objectives, and reinforcement assets for teams.",
      soulMarkdown: `# Training Agent Soul

## Mission
- Convert operational standards into practical learning modules.
- Keep progression measurable across onboarding and role growth.

## Guardrails
- Every module must define outcomes, checks, and remediation path.
- Keep content short enough for shift-friendly learning.`,
      documents: [
        {
          id: "training-doc-1",
          name: "Module Blueprint Template.md",
          type: "Markdown",
          sizeBytes: 40100,
          updatedAt: "2026-02-15",
        },
        {
          id: "training-doc-2",
          name: "Assessment Rubric v2.pdf",
          type: "PDF",
          sizeBytes: 127600,
          updatedAt: "2026-02-16",
        },
      ],
      messages: [
        {
          id: "training-chat-1",
          role: "user",
          content:
            "For module authoring, force objectives first, then media, then flashcards.",
        },
        {
          id: "training-chat-2",
          role: "assistant",
          content:
            "Sequence set. Draft flow now enforces objective clarity before any media or assessment generation.",
        },
        {
          id: "training-chat-3",
          role: "user",
          content:
            "I also need coaching suggestions when a learner fails two attempts in a row.",
        },
        {
          id: "training-chat-4",
          role: "assistant",
          content:
            "Implemented. I will now propose remediation steps and manager follow-up after consecutive low scores.",
        },
      ],
    },
  };
}

function isAgentId(value: string): value is AgentId {
  return agentOptions.some((option) => option.id === value);
}

function formatFileSize(sizeBytes: number) {
  if (sizeBytes >= 1024 * 1024) {
    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(Math.round(sizeBytes / 1024), 1)} KB`;
}

function normalizeDocumentType(type: string, name: string) {
  const normalizedType = type.trim();
  if (normalizedType) {
    return normalizedType.toUpperCase();
  }

  const extension = name.split(".").pop()?.trim().toUpperCase();
  return extension || "File";
}

function buildAssistantReply(agentName: string, prompt: string) {
  return `Update saved for ${agentName}. I added your instruction to the working draft: "${prompt}".`;
}

function generateDocumentId(agentId: AgentId, index: number) {
  return `${agentId}-doc-upload-${index}`;
}

function SoulToolbarButton({
  title,
  disabled = false,
  onClick,
  children,
}: {
  title: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      className="size-7 border border-transparent text-foreground/80 hover:border-border/80 hover:bg-muted/40"
      disabled={disabled}
      aria-label={title}
      title={title}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function createSoulHistoryState(): Record<AgentId, SoulHistory> {
  return {
    host: { past: [], future: [] },
    chef: { past: [], future: [] },
    clienteling: { past: [], future: [] },
    foh: { past: [], future: [] },
    training: { past: [], future: [] },
  };
}

function createSoulHistoryMetaState(): Record<
  AgentId,
  { canUndo: boolean; canRedo: boolean }
> {
  return {
    host: { canUndo: false, canRedo: false },
    chef: { canUndo: false, canRedo: false },
    clienteling: { canUndo: false, canRedo: false },
    foh: { canUndo: false, canRedo: false },
    training: { canUndo: false, canRedo: false },
  };
}

export function AgentsDetailsContent() {
  const [activeAgentId, setActiveAgentId] = useState<AgentId>("host");
  const [activeSubmenu, setActiveSubmenu] = useState<AgentSubmenuKey>("soul");
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatPrompt, setChatPrompt] = useState("");
  const [profiles, setProfiles] = useState<Record<AgentId, AgentProfile>>(
    () => createInitialProfiles(),
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const soulHistoryRef = useRef<Record<AgentId, SoulHistory>>(
    createSoulHistoryState(),
  );
  const [soulHistoryMeta, setSoulHistoryMeta] = useState<
    Record<AgentId, { canUndo: boolean; canRedo: boolean }>
  >(() => createSoulHistoryMetaState());
  const idCounterRef = useRef(0);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const activeProfile = profiles[activeAgentId];
  const canUndoSoul = soulHistoryMeta[activeAgentId].canUndo;
  const canRedoSoul = soulHistoryMeta[activeAgentId].canRedo;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ block: "end" });
  }, [activeAgentId, activeProfile.messages.length]);

  const nextId = (prefix: string) => {
    idCounterRef.current += 1;
    return `${prefix}-${idCounterRef.current}`;
  };

  const syncSoulHistoryMeta = (agentId: AgentId) => {
    const history = soulHistoryRef.current[agentId];
    setSoulHistoryMeta((previous) => ({
      ...previous,
      [agentId]: {
        canUndo: history.past.length > 0,
        canRedo: history.future.length > 0,
      },
    }));
  };

  const updateActiveProfile = (updater: (profile: AgentProfile) => AgentProfile) => {
    setProfiles((previous) => ({
      ...previous,
      [activeAgentId]: updater(previous[activeAgentId]),
    }));
  };

  const handleSimulationSend = () => {
    const prompt = chatPrompt.trim();
    if (!prompt) {
      return;
    }

    updateActiveProfile((profile) => ({
      ...profile,
      messages: [
        ...profile.messages,
        {
          id: nextId("agent-chat"),
          role: "user",
          content: prompt,
        },
        {
          id: nextId("agent-chat"),
          role: "assistant",
          content: buildAssistantReply(profile.name, prompt),
        },
      ],
    }));
    setChatPrompt("");
  };

  const handlePromptKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      handleSimulationSend();
    }
  };

  const appendSoulMarkdown = (snippet: string) => {
    setProfiles((previous) => {
      const profile = previous[activeAgentId];
      const hasContent = profile.soulMarkdown.trim().length > 0;
      const nextSoul = hasContent
        ? `${profile.soulMarkdown}\n\n${snippet}`
        : snippet;
      if (nextSoul === profile.soulMarkdown) {
        return previous;
      }

      const history = soulHistoryRef.current[activeAgentId];
      history.past.push(profile.soulMarkdown);
      if (history.past.length > 120) {
        history.past.shift();
      }
      history.future = [];
      syncSoulHistoryMeta(activeAgentId);

      return {
        ...previous,
        [activeAgentId]: {
          ...profile,
          soulMarkdown: nextSoul,
        },
      };
    });
  };

  const setActiveSoulMarkdown = (nextSoul: string) => {
    setProfiles((previous) => {
      const profile = previous[activeAgentId];
      if (nextSoul === profile.soulMarkdown) {
        return previous;
      }

      const history = soulHistoryRef.current[activeAgentId];
      history.past.push(profile.soulMarkdown);
      if (history.past.length > 120) {
        history.past.shift();
      }
      history.future = [];
      syncSoulHistoryMeta(activeAgentId);

      return {
        ...previous,
        [activeAgentId]: {
          ...profile,
          soulMarkdown: nextSoul,
        },
      };
    });
  };

  const handleSoulUndo = () => {
    const history = soulHistoryRef.current[activeAgentId];
    const previousSoul = history.past.pop();
    if (typeof previousSoul !== "string") {
      return;
    }

    setProfiles((previous) => {
      const profile = previous[activeAgentId];
      history.future.push(profile.soulMarkdown);
      syncSoulHistoryMeta(activeAgentId);
      return {
        ...previous,
        [activeAgentId]: {
          ...profile,
          soulMarkdown: previousSoul,
        },
      };
    });
  };

  const handleSoulRedo = () => {
    const history = soulHistoryRef.current[activeAgentId];
    const nextSoul = history.future.pop();
    if (typeof nextSoul !== "string") {
      return;
    }

    setProfiles((previous) => {
      const profile = previous[activeAgentId];
      history.past.push(profile.soulMarkdown);
      if (history.past.length > 120) {
        history.past.shift();
      }
      syncSoulHistoryMeta(activeAgentId);
      return {
        ...previous,
        [activeAgentId]: {
          ...profile,
          soulMarkdown: nextSoul,
        },
      };
    });
  };

  const handleDocumentUpload = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const uploadedAt = new Date().toISOString().slice(0, 10);
    const nextDocuments = Array.from(files).map((file, index) => ({
      id: generateDocumentId(activeAgentId, idCounterRef.current + index + 1),
      name: file.name,
      type: normalizeDocumentType(file.type, file.name),
      sizeBytes: file.size,
      updatedAt: uploadedAt,
    }));

    idCounterRef.current += nextDocuments.length;
    updateActiveProfile((profile) => ({
      ...profile,
      documents: [...profile.documents, ...nextDocuments],
    }));
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <WebAppPageHeader
        title="Agents Details"
        actions={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={isChatOpen ? "Hide chat" : "Show chat"}
            title={isChatOpen ? "Hide chat" : "Show chat"}
            onClick={() => setIsChatOpen((previous) => !previous)}
          >
            <MessageCircleIcon />
          </Button>
        }
      />

      <div className="min-h-0 flex-1 p-4">
        <div className="flex h-full min-h-0 gap-3">
          <section
            className={cn(
              "min-h-0 overflow-hidden transition-[width,opacity,transform] duration-300 ease-out",
              isChatOpen
                ? "w-[42%] min-w-84 opacity-100 translate-x-0"
                : "w-0 min-w-0 opacity-0 -translate-x-12 pointer-events-none",
            )}
          >
            <div className="flex h-full min-h-0 flex-col gap-3">
              <div className="min-h-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-4 p-2 pr-3">
                    {activeProfile.messages.map((message) =>
                      message.role === "assistant" ? (
                        <p
                          key={message.id}
                          className="max-w-[88%] text-xs leading-relaxed text-foreground/90"
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
                </ScrollArea>
              </div>

              <InputGroup className="h-auto border-border bg-background shadow-[0_16px_24px_-22px_oklch(0.6489_0.1708_28.21)]">
                <InputGroupTextarea
                  value={chatPrompt}
                  onChange={(event) => setChatPrompt(event.target.value)}
                  onKeyDown={handlePromptKeyDown}
                  className="min-h-20 placeholder:text-foreground/45"
                  placeholder="Refine this agent behavior and content..."
                />
                <InputGroupAddon
                  align="block-end"
                  className="border-t border-border pt-2"
                >
                  <InputGroupText className="text-foreground/70">
                    Press Cmd/Ctrl + Enter to simulate
                  </InputGroupText>
                  <div className="ml-auto flex items-center gap-2">
                    <InputGroupButton
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Voice input"
                      title="Voice input"
                      onClick={() =>
                        updateActiveProfile((profile) => ({
                          ...profile,
                          messages: [
                            ...profile.messages,
                            {
                              id: nextId("agent-chat"),
                              role: "assistant",
                              content:
                                "Voice capture is not connected yet in this preview.",
                            },
                          ],
                        }))
                      }
                    >
                      <MicIcon />
                    </InputGroupButton>
                    <InputGroupButton
                      variant="default"
                      size="icon-sm"
                      aria-label="Send simulation prompt"
                      title="Send"
                      onClick={handleSimulationSend}
                    >
                      <SendHorizontalIcon />
                    </InputGroupButton>
                  </div>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </section>

          <section className="min-w-0 min-h-0 flex flex-1 flex-col border border-border bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_26%,white_74%),var(--background))]">
            <div className="border-b border-border/70 bg-background/75 px-3 py-2">
              <div className="flex flex-wrap items-start gap-2">
                <div className="min-w-56 flex-1">
                  <p className="text-muted-foreground mb-1 text-[10px] uppercase tracking-[0.16em]">
                    Agent
                  </p>
                  <Select
                    value={activeAgentId}
                    onValueChange={(value) => {
                      if (typeof value === "string" && isAgentId(value)) {
                        setActiveAgentId(value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-72">
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {agentOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Badge variant="outline" className={outlinedSecondaryBadgeClass}>
                  {activeProfile.name}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                {activeProfile.roleDescription}
              </p>
            </div>

            <Tabs
              value={activeSubmenu}
              onValueChange={(value) => setActiveSubmenu(value as AgentSubmenuKey)}
              className="min-h-0 flex-1"
            >
              <div className="border-b border-border/70 bg-background/70 px-3 py-2">
                <TabsList variant="line" className="w-full sm:w-auto">
                  <TabsTrigger value="soul">Soul</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="min-h-0 h-full">
                <div className="h-full">
                  <TabsContent value="soul" className="h-full">
                    <div className="h-full min-h-[560px] bg-background">
                      <div className="flex flex-wrap items-center border-b border-border/70 bg-background/85 px-2 py-1.5">
                        <div className="flex items-center gap-1">
                          <SoulToolbarButton
                            title="Undo"
                            disabled={!canUndoSoul}
                            onClick={handleSoulUndo}
                          >
                            <Undo2Icon className="size-3.5" />
                          </SoulToolbarButton>
                          <SoulToolbarButton
                            title="Redo"
                            disabled={!canRedoSoul}
                            onClick={handleSoulRedo}
                          >
                            <Redo2Icon className="size-3.5" />
                          </SoulToolbarButton>
                        </div>
                        <div className="mx-1 h-6 w-px bg-border/80" />
                        <div className="flex items-center gap-1">
                          <SoulToolbarButton
                            title="Heading 1"
                            onClick={() => appendSoulMarkdown("# Heading")}
                          >
                            <Heading1Icon className="size-3.5" />
                          </SoulToolbarButton>
                        </div>
                        <div className="mx-1 h-6 w-px bg-border/80" />
                        <div className="flex items-center gap-1">
                          <SoulToolbarButton
                            title="Bold"
                            onClick={() =>
                              appendSoulMarkdown("**Emphasized guidance**")
                            }
                          >
                            <BoldIcon className="size-3.5" />
                          </SoulToolbarButton>
                          <SoulToolbarButton
                            title="Italic"
                            onClick={() => appendSoulMarkdown("*Nuance or tone cue*")}
                          >
                            <ItalicIcon className="size-3.5" />
                          </SoulToolbarButton>
                          <SoulToolbarButton
                            title="Underline"
                            onClick={() => appendSoulMarkdown("<u>Key requirement</u>")}
                          >
                            <UnderlineIcon className="size-3.5" />
                          </SoulToolbarButton>
                          <SoulToolbarButton
                            title="Strikethrough"
                            onClick={() => appendSoulMarkdown("~~Deprecated behavior~~")}
                          >
                            <StrikethroughIcon className="size-3.5" />
                          </SoulToolbarButton>
                        </div>
                        <div className="mx-1 h-6 w-px bg-border/80" />
                        <div className="flex items-center gap-1">
                          <SoulToolbarButton
                            title="Bullet List"
                            onClick={() => appendSoulMarkdown("- New bullet point")}
                          >
                            <ListIcon className="size-3.5" />
                          </SoulToolbarButton>
                          <SoulToolbarButton
                            title="Ordered List"
                            onClick={() => appendSoulMarkdown("1. New numbered item")}
                          >
                            <ListOrderedIcon className="size-3.5" />
                          </SoulToolbarButton>
                          <SoulToolbarButton
                            title="Quote"
                            onClick={() => appendSoulMarkdown("> Quoted principle")}
                          >
                            <TextQuoteIcon className="size-3.5" />
                          </SoulToolbarButton>
                        </div>
                      </div>
                      <InputGroupTextarea
                        value={activeProfile.soulMarkdown}
                        onChange={(event) =>
                          setActiveSoulMarkdown(event.target.value)
                        }
                        className="min-h-[510px] border-0 bg-transparent px-3 py-3 font-mono text-xs leading-relaxed shadow-none focus-visible:ring-0"
                        placeholder="Write soul guidance using markdown..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="h-full">
                    <div className="h-full bg-background">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 px-3 py-2">
                        <p className="text-muted-foreground text-xs">
                          {activeProfile.documents.length} documents
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <UploadIcon className="size-3" />
                          Upload Documents
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(event) => {
                            handleDocumentUpload(event.target.files);
                            event.currentTarget.value = "";
                          }}
                        />
                      </div>

                      {activeProfile.documents.length === 0 ? (
                        <p className="text-muted-foreground px-3 py-4 text-xs">
                          No documents uploaded for this agent yet.
                        </p>
                      ) : (
                        <div className="divide-y divide-border/70">
                          {activeProfile.documents.map((document) => (
                            <article
                              key={document.id}
                              className="flex items-start gap-3 px-3 py-2.5"
                            >
                              <FileTextIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm">{document.name}</p>
                                <p className="text-muted-foreground text-[11px]">
                                  {document.type} · {formatFileSize(document.sizeBytes)} ·{" "}
                                  {document.updatedAt}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                aria-label={`Remove ${document.name}`}
                                onClick={() =>
                                  updateActiveProfile((profile) => ({
                                    ...profile,
                                    documents: profile.documents.filter(
                                      (item) => item.id !== document.id,
                                    ),
                                  }))
                                }
                              >
                                <Trash2Icon />
                              </Button>
                            </article>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </section>
        </div>
      </div>
    </div>
  );
}
