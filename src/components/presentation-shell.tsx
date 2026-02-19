"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ListIcon,
  MonitorIcon,
  SmartphoneIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  LAST_VISITED_STORAGE_KEY,
  parsePresentationHash,
  toPresentationHash,
  toPresentationSectionId,
  type PresentationPlatform,
} from "@/lib/presentation-navigation";
import type {
  PresentationRegistry,
  PresentationScreen,
} from "@/lib/presentation-screens";

const SCROLL_SYNC_UNLOCK_MS = 220;
const NAV_POPOVER_MAX_HEIGHT = 576;
const SECTION_SCROLL_TOP_OFFSET = 55;

type PresentationSection = PresentationScreen & {
  sectionId: string;
};

export type PresentationShellProps = {
  registry: PresentationRegistry;
  className?: string;
};

function getPreferredScrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined") {
    return "auto";
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

function getDefaultLastVisited(registry: PresentationRegistry) {
  return {
    web: registry.web[0]?.screenId ?? "",
    mobile: registry.mobile[0]?.screenId ?? "",
  } satisfies Record<PresentationPlatform, string>;
}

export function PresentationShell({
  registry,
  className,
}: PresentationShellProps) {
  const webSections = useMemo(
    () =>
      registry.web.map((screen) => ({
        ...screen,
        sectionId: toPresentationSectionId(screen.platform, screen.screenId),
      })),
    [registry.web],
  );
  const mobileSections = useMemo(
    () =>
      registry.mobile.map((screen) => ({
        ...screen,
        sectionId: toPresentationSectionId(screen.platform, screen.screenId),
      })),
    [registry.mobile],
  );
  const sections = useMemo(
    () => [...webSections, ...mobileSections],
    [mobileSections, webSections],
  );
  const sectionById = useMemo(
    () => new Map(sections.map((section) => [section.sectionId, section])),
    [sections],
  );

  const initialNavigation = useMemo(() => {
    const lastVisited = getDefaultLastVisited(registry);

    if (typeof window !== "undefined") {
      const webStored = window.sessionStorage.getItem(
        LAST_VISITED_STORAGE_KEY.web,
      );
      if (
        webStored &&
        webSections.some((screen) => screen.screenId === webStored)
      ) {
        lastVisited.web = webStored;
      }

      const mobileStored = window.sessionStorage.getItem(
        LAST_VISITED_STORAGE_KEY.mobile,
      );
      if (
        mobileStored &&
        mobileSections.some((screen) => screen.screenId === mobileStored)
      ) {
        lastVisited.mobile = mobileStored;
      }
    }

    const parsedHash =
      typeof window !== "undefined"
        ? parsePresentationHash(window.location.hash)
        : null;
    const hashTarget =
      parsedHash?.platform === "web"
        ? webSections.find((screen) => screen.screenId === parsedHash.screenId)
        : parsedHash?.platform === "mobile"
          ? mobileSections.find(
              (screen) => screen.screenId === parsedHash.screenId,
            )
          : null;

    const initialSection = hashTarget ?? webSections[0] ?? sections[0] ?? null;
    if (initialSection) {
      lastVisited[initialSection.platform] = initialSection.screenId;
    }

    return {
      activeSectionId: initialSection?.sectionId ?? null,
      expandedGroups: {
        web: true,
        mobile: initialSection?.platform === "mobile",
      } satisfies Record<PresentationPlatform, boolean>,
      lastVisited,
    };
  }, [mobileSections, registry, sections, webSections]);

  const [expandedGroups, setExpandedGroups] = useState<
    Record<PresentationPlatform, boolean>
  >(() => initialNavigation.expandedGroups);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    () => initialNavigation.activeSectionId,
  );
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [navContentHeight, setNavContentHeight] = useState<number | null>(null);

  const isProgrammaticScrollRef = useRef(false);
  const unlockTimerRef = useRef<number | null>(null);
  const sectionRefs = useRef(new Map<string, HTMLElement>());
  const navContentInnerRef = useRef<HTMLDivElement>(null);
  const activeSectionIdRef = useRef<string | null>(activeSectionId);
  const hasInitializedScrollRef = useRef(false);

  const findSection = useCallback(
    (platform: PresentationPlatform, screenId: string) => {
      const platformSections =
        platform === "web" ? webSections : mobileSections;
      return (
        platformSections.find((screen) => screen.screenId === screenId) ?? null
      );
    },
    [mobileSections, webSections],
  );

  const updateHash = useCallback((section: PresentationSection) => {
    if (typeof window === "undefined") {
      return;
    }

    const nextHash = toPresentationHash(section.platform, section.screenId);
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, []);

  const updateLastVisited = useCallback((section: PresentationSection) => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        LAST_VISITED_STORAGE_KEY[section.platform],
        section.screenId,
      );
    }
  }, []);

  const navigateToSection = useCallback(
    (
      sectionId: string,
      options?: {
        behavior?: ScrollBehavior;
        updateHash?: boolean;
      },
    ) => {
      const section = sectionById.get(sectionId);
      if (!section) {
        return false;
      }

      const target = sectionRefs.current.get(sectionId);
      if (!target) {
        return false;
      }

      const behavior = options?.behavior ?? getPreferredScrollBehavior();
      isProgrammaticScrollRef.current = true;
      const nextTop =
        window.scrollY +
        target.getBoundingClientRect().top -
        SECTION_SCROLL_TOP_OFFSET;
      window.scrollTo({
        top: Math.max(0, nextTop),
        behavior,
      });

      setActiveSectionId(sectionId);
      activeSectionIdRef.current = sectionId;

      if (section.platform === "mobile") {
        setExpandedGroups((previous) =>
          previous.mobile ? previous : { ...previous, mobile: true },
        );
      }

      updateLastVisited(section);
      if (options?.updateHash !== false) {
        updateHash(section);
      }

      if (unlockTimerRef.current !== null) {
        window.clearTimeout(unlockTimerRef.current);
      }
      unlockTimerRef.current = window.setTimeout(
        () => {
          isProgrammaticScrollRef.current = false;
        },
        behavior === "smooth" ? SCROLL_SYNC_UNLOCK_MS : 40,
      );

      return true;
    },
    [sectionById, updateHash, updateLastVisited],
  );

  const getViewportSectionIndex = useCallback(() => {
    if (!sections.length) {
      return -1;
    }

    if (typeof window === "undefined") {
      return activeSectionIdRef.current
        ? sections.findIndex(
            (section) => section.sectionId === activeSectionIdRef.current,
          )
        : -1;
    }

    const anchor = Math.min(180, window.innerHeight * 0.22);
    let activeIndex = -1;
    let hasMeasuredSection = false;

    sections.forEach((section, index) => {
      const element = sectionRefs.current.get(section.sectionId);
      if (!element) {
        return;
      }
      hasMeasuredSection = true;

      const top = element.getBoundingClientRect().top;
      // Use an anchor-line crossing model for stable upward/downward transitions.
      if (top <= anchor + 1) {
        activeIndex = index;
      }
    });

    if (activeIndex !== -1) {
      return activeIndex;
    }

    if (!hasMeasuredSection) {
      return activeSectionIdRef.current
        ? sections.findIndex(
            (section) => section.sectionId === activeSectionIdRef.current,
          )
        : -1;
    }

    // Before the first section reaches the anchor line, keep first section active.
    return 0;
  }, [sections]);

  const navigateByOffset = useCallback(
    (offset: number) => {
      if (!sections.length) {
        return;
      }

      const currentIndex = getViewportSectionIndex();
      const safeCurrentIndex = currentIndex === -1 ? 0 : currentIndex;
      const targetIndex = Math.max(
        0,
        Math.min(sections.length - 1, safeCurrentIndex + offset),
      );

      const targetSection = sections[targetIndex];
      if (!targetSection || targetIndex === safeCurrentIndex) {
        return;
      }

      void navigateToSection(targetSection.sectionId);
    },
    [getViewportSectionIndex, navigateToSection, sections],
  );

  const syncActiveSectionById = useCallback(
    (candidateId: string) => {
      if (!candidateId || candidateId === activeSectionIdRef.current) {
        return;
      }

      const nextSection = sectionById.get(candidateId);
      if (!nextSection) {
        return;
      }

      activeSectionIdRef.current = candidateId;
      setActiveSectionId(candidateId);
      updateLastVisited(nextSection);
      updateHash(nextSection);

      if (nextSection.platform === "mobile") {
        setExpandedGroups((previous) =>
          previous.mobile ? previous : { ...previous, mobile: true },
        );
      }
    },
    [sectionById, updateHash, updateLastVisited],
  );

  const syncActiveSectionFromViewport = useCallback(() => {
    if (isProgrammaticScrollRef.current) {
      return;
    }

    const index = getViewportSectionIndex();
    if (index < 0) {
      return;
    }

    const section = sections[index];
    if (!section) {
      return;
    }

    syncActiveSectionById(section.sectionId);
  }, [getViewportSectionIndex, sections, syncActiveSectionById]);

  useEffect(() => {
    activeSectionIdRef.current = activeSectionId;
  }, [activeSectionId]);

  useEffect(() => {
    return () => {
      if (unlockTimerRef.current !== null) {
        window.clearTimeout(unlockTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (hasInitializedScrollRef.current || !activeSectionId) {
      return;
    }

    const initialSection = sectionById.get(activeSectionId);
    const target = sectionRefs.current.get(activeSectionId);
    if (!initialSection || !target) {
      return;
    }

    hasInitializedScrollRef.current = true;
    isProgrammaticScrollRef.current = true;
    const nextTop =
      window.scrollY +
      target.getBoundingClientRect().top -
      SECTION_SCROLL_TOP_OFFSET;
    window.scrollTo({
      top: Math.max(0, nextTop),
      behavior: "auto",
    });
    updateHash(initialSection);

    if (unlockTimerRef.current !== null) {
      window.clearTimeout(unlockTimerRef.current);
    }
    unlockTimerRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 40);
  }, [activeSectionId, sectionById, updateHash]);

  useEffect(() => {
    const onHashChange = () => {
      const parsedHash = parsePresentationHash(window.location.hash);
      if (!parsedHash) {
        return;
      }

      const target = findSection(parsedHash.platform, parsedHash.screenId);
      if (!target) {
        return;
      }

      void navigateToSection(target.sectionId, {
        behavior: "auto",
        updateHash: false,
      });
    };

    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [findSection, navigateToSection]);

  useEffect(() => {
    const observedSections = sections
      .map((section) => sectionRefs.current.get(section.sectionId))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!observedSections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      () => {
        syncActiveSectionFromViewport();
      },
      {
        root: null,
        rootMargin: "-22% 0px -48% 0px",
        threshold: [0, 0.01, 0.1, 0.3, 0.6, 1],
      },
    );

    observedSections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [sections, syncActiveSectionFromViewport]);

  useEffect(() => {
    let frameId: number | null = null;

    const onViewportChange = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        syncActiveSectionFromViewport();
      });
    };

    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);
    onViewportChange();

    return () => {
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [syncActiveSectionFromViewport]);

  useEffect(() => {
    if (!isNavOpen) {
      return;
    }

    const panel = navContentInnerRef.current;
    if (!panel) {
      return;
    }

    let frameId: number | null = null;

    const measure = () => {
      frameId = window.requestAnimationFrame(() => {
        const nextHeight = panel.scrollHeight;
        setNavContentHeight((previous) =>
          previous === nextHeight ? previous : nextHeight,
        );
      });
    };

    measure();
    const observer = new ResizeObserver(() => {
      measure();
    });
    observer.observe(panel);

    return () => {
      observer.disconnect();
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [isNavOpen]);

  const activeSection = activeSectionId
    ? sectionById.get(activeSectionId)
    : null;
  const activePlatform = activeSection?.platform ?? "web";
  const activePlatformLabel =
    activePlatform === "web" ? "Web Screens" : "Mobile Screens";
  const activePlatformSections =
    activePlatform === "web" ? webSections : mobileSections;
  const activePlatformPosition = activeSection
    ? activePlatformSections.findIndex(
        (section) => section.sectionId === activeSection.sectionId,
      ) + 1
    : 0;
  const activePlatformTotal = activePlatformSections.length;
  const platformProgressPercentage = activePlatformTotal
    ? (activePlatformPosition / activePlatformTotal) * 100
    : 0;
  const resolvedNavHeight =
    navContentHeight === null
      ? undefined
      : Math.min(navContentHeight, NAV_POPOVER_MAX_HEIGHT);
  const hasScrollableNavContent =
    navContentHeight !== null && navContentHeight > NAV_POPOVER_MAX_HEIGHT;

  return (
    <div className={cn("relative", className)}>
      <div className="min-w-0 space-y-24 pb-[60vh]">
        {sections.map((section) => (
          <section
            key={section.sectionId}
            id={section.sectionId}
            data-section-id={section.sectionId}
            ref={(element) => {
              if (element) {
                sectionRefs.current.set(section.sectionId, element);
              } else {
                sectionRefs.current.delete(section.sectionId);
              }
            }}
            className="scroll-mt-28 py-5"
          >
            {section.render()}
          </section>
        ))}
      </div>

      <div className="pointer-events-none fixed inset-x-0 top-5 z-50">
        <div className="mx-auto flex w-full max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
          <Popover
            open={isNavOpen}
            onOpenChange={(open) => {
              setIsNavOpen(open);
              if (!open) {
                setNavContentHeight(null);
              }
            }}
          >
            <PopoverTrigger
              render={(props) => (
                <Button
                  {...props}
                  type="button"
                  variant="outline"
                  className="pointer-events-auto size-14 rounded-full border-border/70 bg-background/92 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.4)] supports-backdrop-filter:bg-background/72 supports-backdrop-filter:backdrop-blur-md"
                  aria-label="Open presentation navigation"
                >
                  <ListIcon className="size-6" strokeWidth={2.2} />
                </Button>
              )}
            />
            <PopoverContent
              side="bottom"
              align="end"
              sideOffset={10}
              positionMethod="fixed"
              disableAnchorTracking
              className="nav-popover-container pointer-events-auto w-[340px] gap-0 overflow-hidden rounded-xl border-border/60 bg-background/92 p-4 supports-backdrop-filter:bg-background/78 supports-backdrop-filter:backdrop-blur-md"
              style={
                resolvedNavHeight === undefined
                  ? undefined
                  : { height: `${resolvedNavHeight}px` }
              }
            >
              <div
                ref={navContentInnerRef}
                className={cn(
                  "space-y-4",
                  hasScrollableNavContent && "max-h-144 overflow-y-auto pr-2",
                )}
              >
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Presentation Navigation
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {activePlatformLabel}
                    </span>
                    <span>
                      {activePlatformPosition}/{activePlatformTotal || 1}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted/80">
                    <div
                      className="h-full bg-secondary transition-[width] duration-200 ease-out"
                      style={{
                        width: `${platformProgressPercentage}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Button
                    type="button"
                    size="default"
                    variant="outline"
                    onClick={() => {
                      navigateByOffset(-1);
                    }}
                  >
                    <ArrowUpIcon />
                    Prev
                  </Button>
                  <Button
                    type="button"
                    size="default"
                    variant="outline"
                    onClick={() => {
                      navigateByOffset(1);
                    }}
                  >
                    <ArrowDownIcon />
                    Next
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {(["web", "mobile"] as const).map((platform) => {
                    const platformScreens =
                      platform === "web" ? webSections : mobileSections;
                    const isExpanded = expandedGroups[platform];
                    const isPlatformActive = activePlatform === platform;
                    const title =
                      platform === "web" ? "Web Screens" : "Mobile Screens";
                    const PlatformIcon =
                      platform === "web" ? MonitorIcon : SmartphoneIcon;

                    return (
                      <Collapsible
                        key={platform}
                        open={isExpanded}
                        onOpenChange={(open) => {
                          setExpandedGroups((previous) => ({
                            ...previous,
                            [platform]: open,
                          }));
                        }}
                        className="border border-border/60 bg-background/30"
                      >
                        <CollapsibleTrigger
                          className={cn(
                            "flex w-full items-center justify-between px-2.5 py-2 text-left text-[13px]",
                            isPlatformActive
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          <span className="inline-flex items-center gap-2">
                            <PlatformIcon className="size-3.5" />
                            {title}
                          </span>
                          {isExpanded ? (
                            <ChevronDownIcon className="size-3.5" />
                          ) : (
                            <ChevronRightIcon className="size-3.5" />
                          )}
                        </CollapsibleTrigger>

                        <CollapsibleContent className="nav-collapsible-content overflow-hidden border-t border-border/70">
                          <div className="min-h-0 space-y-1.5 p-1.5">
                            {platformScreens.map((screen, index) => {
                              const isActive =
                                activeSectionId === screen.sectionId;

                              return (
                                <button
                                  key={screen.sectionId}
                                  type="button"
                                  onClick={() => {
                                    void navigateToSection(screen.sectionId);
                                    setIsNavOpen(false);
                                  }}
                                  className={cn(
                                    "flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs transition-[opacity,background-color,color] duration-200 ease-out",
                                    isExpanded ? "opacity-100" : "opacity-0",
                                    isActive
                                      ? "bg-muted text-foreground"
                                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                                  )}
                                  style={
                                    isExpanded
                                      ? { transitionDelay: `${index * 24}ms` }
                                      : undefined
                                  }
                                  aria-current={isActive ? "true" : undefined}
                                >
                                  <span className="w-7 shrink-0 text-[11px] opacity-80">
                                    {String(screen.order).padStart(2, "0")}
                                  </span>
                                  <span className="truncate">
                                    {screen.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
