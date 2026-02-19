"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeftIcon,
  CheckCircle2Icon,
  CircleCheckIcon,
  CircleIcon,
  CircleXIcon,
  HelpCircleIcon,
  FileTextIcon,
  MessageSquareQuoteIcon,
  PlayCircleIcon,
  SendIcon,
} from "lucide-react";

import { useMobileFixedFooter } from "@/components/mobile-app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clientelingTrainingModuleDetail } from "@/lib/mobile-training-module-details-data";
import type {
  AssessmentReviewItem,
  FlashcardSection,
  MediaAsset,
} from "@/lib/mobile-training-module-details-data";
import type { ModuleSection } from "@/lib/mobile-training-modules-data";
import { cn } from "@/lib/utils";

type DetailSectionKey = "summary" | "medias" | "flashcards" | "assessment";
type FlashcardStage = "sections" | "learning" | "complete";
type FlashcardFeedback = "again" | "hard" | "good" | "easy";
type AssessmentStage = "start" | "running" | "review";

const detailSectionTabs: { id: DetailSectionKey; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "medias", label: "Medias" },
  { id: "flashcards", label: "Flash Cards" },
  { id: "assessment", label: "Assessment" },
];

const flashcardFeedbackButtons: {
  id: FlashcardFeedback;
  label: string;
  className: string;
}[] = [
  {
    id: "again",
    label: "Again",
    className: "border-rose-300/60 bg-rose-500/10 text-rose-700",
  },
  {
    id: "hard",
    label: "Hard",
    className: "border-amber-300/70 bg-amber-500/10 text-amber-700",
  },
  {
    id: "good",
    label: "Good",
    className: "border-emerald-300/70 bg-emerald-500/10 text-emerald-700",
  },
  {
    id: "easy",
    label: "Easy",
    className: "border-sky-300/70 bg-sky-500/10 text-sky-700",
  },
];

function statusBadgeClass(section: ModuleSection) {
  if (section === "completed") {
    return "border-emerald-600/55 text-emerald-700 bg-emerald-500/8";
  }
  if (section === "active") {
    return "border-blue-600/55 text-blue-700 bg-blue-500/8";
  }
  return "border-amber-600/55 text-amber-700 bg-amber-500/8";
}

function progressColorClass(section: ModuleSection) {
  if (section === "completed") {
    return "bg-emerald-600/75";
  }
  if (section === "active") {
    return "bg-secondary";
  }
  return "bg-muted-foreground/35";
}

function toYouTubeEmbedUrl(rawUrl: string) {
  const value = rawUrl.trim();
  if (!value) {
    return "";
  }

  if (value.includes("youtube.com/embed/")) {
    return value;
  }

  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "").trim();
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v")?.trim();
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
  } catch {
    return "";
  }

  return "";
}

function mediaKindIcon(kind: MediaAsset["kind"]) {
  if (kind === "video") {
    return PlayCircleIcon;
  }
  if (kind === "guide") {
    return FileTextIcon;
  }
  return MessageSquareQuoteIcon;
}

function formatPercent(value: number) {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}

function formatTimeSeconds(value: number, fixed = 0) {
  if (!Number.isFinite(value) || value <= 0) {
    return fixed === 0 ? "0s" : `0.${"0".repeat(fixed)}s`;
  }
  return `${value.toFixed(fixed)}s`;
}

export function MobileTrainingModuleDetailsContent() {
  const { setFixedFooter } = useMobileFixedFooter();
  const detail = clientelingTrainingModuleDetail;

  const [activeSection, setActiveSection] = useState<DetailSectionKey>("summary");

  const [flashcardStage, setFlashcardStage] = useState<FlashcardStage>("sections");
  const [activeFlashcardSectionId, setActiveFlashcardSectionId] = useState<
    string | null
  >(null);
  const [flashcardsDueBySectionId, setFlashcardsDueBySectionId] = useState<
    Record<string, number>
  >(() =>
    Object.fromEntries(
      detail.flashcardSections.map((section) => [section.id, section.cards.length]),
    ),
  );
  const [sessionTargetCards, setSessionTargetCards] = useState(0);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [completedFlashcards, setCompletedFlashcards] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [processingFeedback, setProcessingFeedback] =
    useState<FlashcardFeedback | null>(null);

  const [assessmentStage, setAssessmentStage] = useState<AssessmentStage>("start");
  const [assessmentQuestionIndex, setAssessmentQuestionIndex] = useState(0);
  const [selectedAssessmentChoiceByQuestionId, setSelectedAssessmentChoiceByQuestionId] =
    useState<Record<string, string>>({});
  const [assessmentStartedAt, setAssessmentStartedAt] = useState<number | null>(null);
  const [assessmentFinishedAt, setAssessmentFinishedAt] = useState<number | null>(
    null,
  );

  const feedbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current !== null) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const activeFlashcardSection = useMemo(
    () =>
      detail.flashcardSections.find((section) => section.id === activeFlashcardSectionId) ??
      null,
    [activeFlashcardSectionId, detail.flashcardSections],
  );
  const activeFlashcards = activeFlashcardSection?.cards ?? [];
  const currentFlashcard =
    flashcardIndex < sessionTargetCards
      ? (activeFlashcards[flashcardIndex] ?? null)
      : null;
  const activeSectionDue =
    activeFlashcardSection === null
      ? 0
      : (flashcardsDueBySectionId[activeFlashcardSection.id] ??
        activeFlashcardSection.cards.length);

  const assessmentQuestions = detail.assessmentQuestions;
  const totalAssessmentQuestions = assessmentQuestions.length;
  const currentAssessmentQuestion = assessmentQuestions[assessmentQuestionIndex] ?? null;
  const currentAssessmentChoiceId = currentAssessmentQuestion
    ? selectedAssessmentChoiceByQuestionId[currentAssessmentQuestion.id]
    : undefined;

  const assessmentProgress =
    assessmentStage === "review"
      ? 100
      : assessmentStage === "running" && totalAssessmentQuestions > 0
        ? (assessmentQuestionIndex / totalAssessmentQuestions) * 100
        : 0;

  const assessmentReviewItems: AssessmentReviewItem[] = useMemo(
    () =>
      assessmentQuestions.map((question) => {
        const correctChoice =
          question.choices.find((choice) => choice.isCorrect) ?? question.choices[0];
        const selectedChoiceId = selectedAssessmentChoiceByQuestionId[question.id];
        const selectedChoice = question.choices.find(
          (choice) => choice.id === selectedChoiceId,
        );

        return {
          questionId: question.id,
          question: question.question,
          isCorrect: selectedChoice?.id === correctChoice?.id,
          userAnswer: selectedChoice?.text ?? "No answer selected",
          correctAnswer: correctChoice?.text ?? "No correct answer seeded",
          explanation: question.explanation,
          quote: question.quote,
        };
      }),
    [assessmentQuestions, selectedAssessmentChoiceByQuestionId],
  );

  const assessmentCorrectCount = assessmentReviewItems.filter(
    (item) => item.isCorrect,
  ).length;
  const assessmentIncorrectCount =
    assessmentReviewItems.length - assessmentCorrectCount;
  const assessmentScore =
    assessmentReviewItems.length > 0
      ? (assessmentCorrectCount / assessmentReviewItems.length) * 100
      : 0;

  const assessmentTotalSeconds =
    assessmentStartedAt !== null && assessmentFinishedAt !== null
      ? Math.max(1, (assessmentFinishedAt - assessmentStartedAt) / 1000)
      : 0;
  const assessmentAverageSeconds =
    assessmentReviewItems.length > 0
      ? assessmentTotalSeconds / assessmentReviewItems.length
      : 0;

  const estimatedAssessmentMinutes = Math.max(
    2,
    Math.ceil(totalAssessmentQuestions * 0.7),
  );

  const launchFlashcardSection = useCallback(
    (section: FlashcardSection) => {
      const dueCount = flashcardsDueBySectionId[section.id] ?? section.cards.length;
      const nextTarget = Math.min(dueCount, section.cards.length);

      setActiveFlashcardSectionId(section.id);
      setFlashcardStage(nextTarget > 0 ? "learning" : "complete");
      setSessionTargetCards(nextTarget);
      setFlashcardIndex(0);
      setCompletedFlashcards(0);
      setIsAnswerVisible(false);
      setProcessingFeedback(null);
    },
    [flashcardsDueBySectionId],
  );

  const startFlashcardSession = useCallback(() => {
    if (!activeFlashcardSection) {
      return;
    }

    setFlashcardsDueBySectionId((previous) => ({
      ...previous,
      [activeFlashcardSection.id]: activeFlashcardSection.cards.length,
    }));
    setSessionTargetCards(activeFlashcardSection.cards.length);
    setFlashcardStage("learning");
    setFlashcardIndex(0);
    setCompletedFlashcards(0);
    setIsAnswerVisible(false);
    setProcessingFeedback(null);
  }, [activeFlashcardSection]);

  const handleFlashcardFeedback = useCallback(
    (feedback: FlashcardFeedback) => {
      if (!currentFlashcard || processingFeedback || !activeFlashcardSection) {
        return;
      }

      if (feedbackTimerRef.current !== null) {
        window.clearTimeout(feedbackTimerRef.current);
      }

      setProcessingFeedback(feedback);
      setCompletedFlashcards((previous) => previous + 1);
      setFlashcardsDueBySectionId((previous) => {
        const currentValue =
          previous[activeFlashcardSection.id] ?? activeFlashcardSection.cards.length;
        return {
          ...previous,
          [activeFlashcardSection.id]: Math.max(currentValue - 1, 0),
        };
      });

      feedbackTimerRef.current = window.setTimeout(() => {
        setProcessingFeedback(null);
        setIsAnswerVisible(false);
        setFlashcardIndex((previous) => {
          const nextIndex = previous + 1;
          if (nextIndex >= sessionTargetCards) {
            setFlashcardStage("complete");
            return previous;
          }
          return nextIndex;
        });
      }, 320);
    },
    [activeFlashcardSection, currentFlashcard, processingFeedback, sessionTargetCards],
  );

  const resetFlashcardsToSections = useCallback(() => {
    setFlashcardStage("sections");
    setActiveFlashcardSectionId(null);
    setSessionTargetCards(0);
    setFlashcardIndex(0);
    setCompletedFlashcards(0);
    setIsAnswerVisible(false);
    setProcessingFeedback(null);
  }, []);

  const startAssessment = useCallback(() => {
    setAssessmentStage("running");
    setAssessmentQuestionIndex(0);
    setSelectedAssessmentChoiceByQuestionId({});
    setAssessmentStartedAt(Date.now());
    setAssessmentFinishedAt(null);
  }, []);

  const resetAssessment = useCallback(() => {
    setAssessmentStage("start");
    setAssessmentQuestionIndex(0);
    setSelectedAssessmentChoiceByQuestionId({});
    setAssessmentStartedAt(null);
    setAssessmentFinishedAt(null);
  }, []);

  const handleAssessmentNext = useCallback(() => {
    if (!currentAssessmentQuestion || !currentAssessmentChoiceId) {
      return;
    }

    const isLastQuestion =
      assessmentQuestionIndex >= totalAssessmentQuestions - 1;

    if (isLastQuestion) {
      setAssessmentFinishedAt(Date.now());
      setAssessmentStage("review");
      return;
    }

    setAssessmentQuestionIndex((previous) => previous + 1);
  }, [
    assessmentQuestionIndex,
    currentAssessmentChoiceId,
    currentAssessmentQuestion,
    totalAssessmentQuestions,
  ]);

  const fixedFooter = useMemo(() => {
    if (
      activeSection === "flashcards" &&
      flashcardStage === "learning" &&
      activeFlashcardSection &&
      currentFlashcard
    ) {
      if (!isAnswerVisible) {
        return (
          <Button className="w-full" onClick={() => setIsAnswerVisible(true)}>
            Show Answer
          </Button>
        );
      }

      return (
        <div className="grid grid-cols-2 gap-1.5">
          {flashcardFeedbackButtons.map((feedback) => (
            <button
              key={feedback.id}
              type="button"
              disabled={processingFeedback !== null}
              onClick={() => handleFlashcardFeedback(feedback.id)}
              className={cn(
                "border px-2 py-1.5 text-[11px] transition-opacity disabled:opacity-70",
                feedback.className,
              )}
            >
              {processingFeedback === feedback.id ? "..." : feedback.label}
            </button>
          ))}
        </div>
      );
    }

    if (
      activeSection === "assessment" &&
      assessmentStage === "running" &&
      currentAssessmentQuestion
    ) {
      return (
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-[11px]">
            Question {assessmentQuestionIndex + 1} of {totalAssessmentQuestions}
          </p>
          <Button
            size="sm"
            disabled={!currentAssessmentChoiceId}
            onClick={handleAssessmentNext}
          >
            {assessmentQuestionIndex >= totalAssessmentQuestions - 1
              ? "Finish"
              : "Next"}
          </Button>
        </div>
      );
    }

    if (activeSection === "assessment" && assessmentStage === "review") {
      return (
        <div className="flex items-center justify-between gap-2">
          <Button variant="outline" size="sm" onClick={resetAssessment}>
            Back to Assessment
          </Button>
          <Button size="sm" onClick={startAssessment}>
            New Session
          </Button>
        </div>
      );
    }

    return null;
  }, [
    activeSection,
    activeFlashcardSection,
    assessmentQuestionIndex,
    assessmentStage,
    currentAssessmentChoiceId,
    currentAssessmentQuestion,
    currentFlashcard,
    flashcardStage,
    handleAssessmentNext,
    handleFlashcardFeedback,
    isAnswerVisible,
    processingFeedback,
    resetAssessment,
    startAssessment,
    totalAssessmentQuestions,
  ]);

  useEffect(() => {
    setFixedFooter(fixedFooter);

    return () => {
      setFixedFooter(null);
    };
  }, [fixedFooter, setFixedFooter]);

  return (
    <div className="space-y-4">
      <section className="border-border/70 space-y-3 border bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_35%,white_65%),color-mix(in_oklch,var(--background)_90%,var(--muted)_10%))] p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="border-secondary/55 bg-transparent">
              {detail.restaurantLabel}
            </Badge>
            <Badge variant="outline" className="border-secondary/55 bg-transparent">
              {detail.profileLabel}
            </Badge>
          </div>
          <Badge
            variant="outline"
            className={statusBadgeClass(detail.module.section)}
          >
            {detail.statusLabel}
          </Badge>
        </div>
        <p className="text-muted-foreground text-[11px] leading-snug">
          {detail.module.goal}
        </p>
        <div className="space-y-1">
          <div className="bg-muted/45 h-1.5 w-full border border-border/70">
            <div
              className={cn(
                "h-full transition-[width] duration-300",
                progressColorClass(detail.module.section),
              )}
              style={{ width: `${detail.module.progress}%` }}
            />
          </div>
          <div className="text-muted-foreground flex items-center justify-between text-[10px]">
            <span>Progress</span>
            <span>{formatPercent(detail.module.progress)}</span>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex w-max gap-1 border border-border/70 bg-background p-1">
            {detailSectionTabs.map((tab) => {
              const isActive = tab.id === activeSection;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={cn(
                    "rounded-none border px-2 py-1 text-[11px] transition-colors",
                    isActive
                      ? "border-secondary/50 bg-secondary/15 text-foreground"
                      : "border-transparent bg-transparent text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => setActiveSection(tab.id)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeSection === "summary" ? (
          <div className="space-y-3">
            <section className="border border-border/70 bg-background p-4">
              <p className="text-xs leading-relaxed">{detail.summary}</p>
            </section>
            <section className="border border-border/70 bg-background p-4">
              <div className="space-y-2.5">
                {detail.objectives.map((objective) => (
                  <div key={objective} className="flex items-start gap-2 text-xs">
                    <CircleCheckIcon className="mt-0.5 size-3 text-emerald-700" />
                    <p className="leading-snug">{objective}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="border border-border/70 bg-background p-4">
              <div className="flex flex-wrap gap-1.5">
                {detail.relatedModules.map((module) => (
                  <span
                    key={module.id}
                    className="border-border/70 inline-flex items-center border px-2 py-1 text-[10px]"
                  >
                    {module.title}
                  </span>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {activeSection === "medias" ? (
          <div className="space-y-3">
            {detail.medias.map((media) => {
              const Icon = mediaKindIcon(media.kind);
              const embedUrl = media.youtubeUrl
                ? toYouTubeEmbedUrl(media.youtubeUrl)
                : "";

              return (
                <article
                  key={media.id}
                  className="border-border/70 space-y-3 border bg-background p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs leading-tight">{media.title}</p>
                    <Badge variant="outline" className="border-secondary/55 bg-transparent">
                      <Icon className="size-3" />
                      {media.kind}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-snug">
                    {media.note}
                  </p>
                  {embedUrl ? (
                    <div className="border-border/60 aspect-video overflow-hidden border bg-black">
                      <iframe
                        title={media.title}
                        src={embedUrl}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="h-full w-full"
                      />
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : null}

        {activeSection === "flashcards" ? (
          <div className="space-y-3">
            {flashcardStage === "sections" ? (
              <section className="space-y-3">
                {detail.flashcardSections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    className="border-border/70 flex w-full items-center justify-between border bg-background px-3.5 py-3 text-left transition-colors hover:bg-muted/30"
                    onClick={() => launchFlashcardSection(section)}
                  >
                    <span className="text-xs">{section.title}</span>
                    <Badge variant="outline" className="border-secondary/55 bg-transparent">
                      {(flashcardsDueBySectionId[section.id] ?? section.cards.length)} cards due
                    </Badge>
                  </button>
                ))}
              </section>
            ) : null}

            {flashcardStage === "learning" && activeFlashcardSection && currentFlashcard ? (
              <section className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Back to flashcard sections"
                      onClick={resetFlashcardsToSections}
                      className="text-foreground/90 inline-flex size-6 items-center justify-center border border-border/70 bg-background"
                    >
                      <ChevronLeftIcon className="size-3.5" />
                    </button>
                    <p className="text-xs">{activeFlashcardSection.title}</p>
                  </div>
                  <Badge variant="outline" className="border-secondary/55 bg-transparent">
                    {activeSectionDue} cards due
                  </Badge>
                </div>

                <article className="border-border/70 border bg-background">
                  <div className="space-y-2 border-b border-border/70 bg-sky-500/8 px-4 py-3">
                    <p className="text-muted-foreground text-[10px] uppercase tracking-[0.12em]">
                      Question
                    </p>
                    <p className="text-xs leading-relaxed">{currentFlashcard.question}</p>
                  </div>
                  {isAnswerVisible ? (
                    <div className="space-y-2 bg-emerald-500/8 px-4 py-3">
                      <p className="text-muted-foreground text-[10px] uppercase tracking-[0.12em]">
                        Answer
                      </p>
                      <p className="text-xs leading-relaxed">{currentFlashcard.answer}</p>
                    </div>
                  ) : null}
                </article>
              </section>
            ) : null}

            {flashcardStage === "complete" && activeFlashcardSection ? (
              <section className="border-border/70 space-y-4 border bg-background p-4">
                <div className="space-y-2">
                  <p className="text-sm">Session complete</p>
                  <p className="text-muted-foreground text-[11px] leading-snug">
                    {sessionTargetCards > 0
                      ? `${completedFlashcards} cards reviewed. Next session is ready for pre-shift refresh.`
                      : "No cards due right now for this section."}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={resetFlashcardsToSections}
                  >
                    Back to Sections
                  </Button>
                  <Button className="flex-1" onClick={startFlashcardSession}>
                    Restart
                  </Button>
                </div>
              </section>
            ) : null}
          </div>
        ) : null}

        {activeSection === "assessment" ? (
          <div className="space-y-3">
            {assessmentStage === "start" ? (
              <section className="border-border/70 space-y-4 border bg-background p-4">
                <div className="space-y-2">
                  <p className="text-sm">Ready to assess</p>
                  <p className="text-muted-foreground text-[11px] leading-snug">
                    {totalAssessmentQuestions} questions · about{" "}
                    {estimatedAssessmentMinutes} minutes
                  </p>
                </div>
                <Button className="w-full" onClick={startAssessment}>
                  Start Assessment
                </Button>
              </section>
            ) : null}

            {assessmentStage === "running" && currentAssessmentQuestion ? (
              <section className="space-y-4">
                <div className="border-border/70 space-y-2 border bg-background p-4">
                  <div className="flex items-center justify-between gap-2 text-[10px]">
                    <span className="text-muted-foreground">Progress</span>
                    <span>{formatPercent(assessmentProgress)}</span>
                  </div>
                  <div className="bg-muted/45 h-1.5 w-full border border-border/70">
                    <div
                      className="h-full bg-secondary transition-[width] duration-200"
                      style={{ width: `${assessmentProgress}%` }}
                    />
                  </div>
                </div>

                <article className="border-border/70 space-y-3 border bg-background p-4">
                  <p className="text-sm leading-snug">{currentAssessmentQuestion.question}</p>
                  <div className="space-y-2">
                    {currentAssessmentQuestion.choices.map((choice) => {
                      const isSelected = currentAssessmentChoiceId === choice.id;
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() =>
                            setSelectedAssessmentChoiceByQuestionId((previous) => ({
                              ...previous,
                              [currentAssessmentQuestion.id]: choice.id,
                            }))
                          }
                          className={cn(
                            "border-border/70 flex w-full items-center justify-between border px-3 py-2.5 text-left text-xs transition-colors",
                            isSelected
                              ? "border-foreground/60 bg-muted/45"
                              : "bg-background hover:bg-muted/20",
                          )}
                        >
                          <span>{choice.text}</span>
                          {isSelected ? (
                            <CheckCircle2Icon className="size-3.5 text-foreground/75" />
                          ) : (
                            <CircleIcon className="size-3.5 text-muted-foreground/55" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </article>
              </section>
            ) : null}

            {assessmentStage === "review" ? (
              <section className="space-y-5">
                <div className="border-border/70 space-y-4 border bg-background p-5">
                  <div className="space-y-2.5">
                    <p className="text-sm">Assessment Complete</p>
                    <div className="bg-muted/45 h-1.5 w-full border border-border/70">
                      <div
                        className="h-full bg-secondary transition-[width] duration-300"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="border-border/70 space-y-2 border bg-background p-3.5">
                      <p className="text-muted-foreground text-[10px]">Score</p>
                      <p className="text-lg leading-none">{formatPercent(assessmentScore)}</p>
                      <p className="text-[10px] text-emerald-700">
                        {assessmentCorrectCount} correct
                      </p>
                      <p className="text-[10px] text-rose-700">
                        {assessmentIncorrectCount} incorrect
                      </p>
                    </div>
                    <div className="border-border/70 space-y-2 border bg-background p-3.5">
                      <p className="text-muted-foreground text-[10px]">Timing</p>
                      <p className="text-sm">{formatTimeSeconds(assessmentTotalSeconds)}</p>
                      <p className="text-[10px]">
                        Avg {formatTimeSeconds(assessmentAverageSeconds, 2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {assessmentReviewItems.map((item) => (
                    <article
                      key={item.questionId}
                      className={cn(
                        "overflow-hidden border",
                        item.isCorrect
                          ? "border-emerald-300/50 bg-emerald-500/[0.015]"
                          : "border-rose-300/50 bg-rose-500/[0.015]",
                      )}
                    >
                      <div
                        className={cn(
                          "space-y-4 p-5",
                          item.isCorrect
                            ? "bg-emerald-500/[0.05]"
                            : "bg-rose-500/[0.05]",
                        )}
                      >
                        <div className="space-y-2">
                          <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em]">
                            <span className="inline-flex size-5 items-center justify-center rounded-full bg-sky-500/15 text-sky-700">
                              <HelpCircleIcon className="size-3.5" />
                            </span>
                            <span>Question</span>
                          </div>
                          <p className="text-sm leading-relaxed">{item.question}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em]">
                            {item.isCorrect ? (
                              <span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700">
                                <CircleCheckIcon className="size-3.5" />
                              </span>
                            ) : (
                              <span className="inline-flex size-5 items-center justify-center rounded-full bg-rose-500/15 text-rose-700">
                                <CircleXIcon className="size-3.5" />
                              </span>
                            )}
                            <span>Answer</span>
                          </div>
                          {item.isCorrect ? (
                            <div className="space-y-1.5">
                              <p className="text-muted-foreground text-[11px]">Your answer</p>
                              <p className="text-sm leading-relaxed">{item.userAnswer}</p>
                            </div>
                          ) : (
                            <div className="space-y-2 text-sm leading-relaxed">
                              <p className="text-muted-foreground text-[11px]">Your answer</p>
                              <p className="line-through decoration-rose-700/75">
                                {item.userAnswer}
                              </p>
                              <p className="text-muted-foreground text-[11px]">
                                Correct answer
                              </p>
                              <p>{item.correctAnswer}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-border/60 bg-background/92 p-5">
                        <div className="text-muted-foreground flex items-center gap-1 text-[10px] uppercase tracking-[0.12em]">
                          <SendIcon className="size-3" />
                          <span>Explanation</span>
                        </div>
                        <p className="mt-2.5 text-sm leading-relaxed">{item.explanation}</p>
                        <blockquote className="mt-3 border-l-2 border-border/50 py-3 pl-3 text-[11px] leading-relaxed italic text-muted-foreground">
                          {item.quote}
                        </blockquote>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
