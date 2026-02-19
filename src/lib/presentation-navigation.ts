export type PresentationPlatform = "web" | "mobile";

export const LAST_VISITED_STORAGE_KEY: Record<PresentationPlatform, string> = {
  web: "presentation:last-web-screen",
  mobile: "presentation:last-mobile-screen",
};

export function toPresentationSectionId(
  platform: PresentationPlatform,
  screenId: string,
) {
  return `${platform}-${screenId}`;
}

export function toPresentationHash(
  platform: PresentationPlatform,
  screenId: string,
) {
  return `#${toPresentationSectionId(platform, screenId)}`;
}

export function parsePresentationHash(hash: string): {
  platform: PresentationPlatform;
  screenId: string;
} | null {
  const normalized = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!normalized) {
    return null;
  }

  const separatorIndex = normalized.indexOf("-");
  if (separatorIndex <= 0) {
    return null;
  }

  const platform = normalized.slice(0, separatorIndex).toLowerCase();
  if (platform !== "web" && platform !== "mobile") {
    return null;
  }

  const screenId = normalized.slice(separatorIndex + 1).trim().toLowerCase();
  if (!screenId) {
    return null;
  }

  return {
    platform,
    screenId,
  };
}

export function isEditableElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  if (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    tagName === "button"
  ) {
    return true;
  }

  return target.isContentEditable;
}

export function hasScrollableAncestor(
  target: HTMLElement | null,
  boundary: HTMLElement,
  direction: "up" | "down",
) {
  let current = target;

  while (current && current !== boundary) {
    const style = window.getComputedStyle(current);
    const canScrollY =
      (style.overflowY === "auto" || style.overflowY === "scroll") &&
      current.scrollHeight > current.clientHeight + 1;

    if (canScrollY) {
      if (
        direction === "down" &&
        current.scrollTop + current.clientHeight < current.scrollHeight - 1
      ) {
        return true;
      }
      if (direction === "up" && current.scrollTop > 1) {
        return true;
      }
    }

    current = current.parentElement;
  }

  return false;
}
