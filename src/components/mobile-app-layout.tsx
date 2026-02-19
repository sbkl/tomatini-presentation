"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import {
  BatteryFullIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  MessageCircleIcon,
  SignalHighIcon,
  UserIcon,
  WifiIcon,
} from "lucide-react";

import type { MobileNavItem } from "@/components/mobile-nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export { defineMobileNav, type MobileNavItem } from "@/components/mobile-nav";

const defaultPrimaryNav = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: SignalHighIcon,
    isActive: true,
  },
] as const satisfies readonly MobileNavItem[];

type MobileUser = {
  name: string;
  email: string;
  initials: string;
};

const defaultMobileUser: MobileUser = {
  name: "Sebastien Koziel",
  email: "sebastien@sbkl.ltd",
  initials: "SK",
};

export interface MobileAppLayoutProps<
  PrimaryNavItems extends readonly MobileNavItem[],
> extends ComponentProps<"div"> {
  sectionTitle?: string;
  sectionBullets?: readonly string[];
  primaryNav?: PrimaryNavItems;
  activeNavItemId?: PrimaryNavItems[number]["id"];
  user?: MobileUser;
  children: ReactNode;
}

export function MobileAppLayout<
  const PrimaryNavItems extends readonly MobileNavItem[] =
    typeof defaultPrimaryNav,
>({
  sectionTitle,
  sectionBullets,
  primaryNav = defaultPrimaryNav as unknown as PrimaryNavItems,
  activeNavItemId,
  user = defaultMobileUser,
  children,
  className,
  ...props
}: MobileAppLayoutProps<PrimaryNavItems>) {
  const resolvedPrimaryNav = primaryNav as readonly MobileNavItem[];
  const defaultActiveNavId =
    resolvedPrimaryNav.find((item) => item.isActive)?.id ??
    resolvedPrimaryNav[0]?.id;
  const [uncontrolledActiveNavId, setUncontrolledActiveNavId] = useState<
    string | undefined
  >(defaultActiveNavId);

  const resolvedActiveNavId = activeNavItemId ?? uncontrolledActiveNavId;
  const activeNavItem =
    resolvedPrimaryNav.find((item) => item.id === resolvedActiveNavId) ??
    resolvedPrimaryNav[0];

  return (
    <section className="mx-auto w-full max-w-7xl space-y-4">
      {sectionTitle ? (
        <div className="w-full space-y-2 px-1">
          <h2 className="text-lg">{sectionTitle}</h2>
          {sectionBullets?.length ? (
            <ul className="text-muted-foreground list-disc space-y-1 pl-4 text-sm">
              {sectionBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      <div className="w-full rounded-[12px] border border-border/70 bg-[radial-gradient(circle_at_top,oklch(0.97_0.02_32),transparent_50%),linear-gradient(oklch(0.99_0.004_95),oklch(0.97_0.012_80))] p-4 sm:p-8 lg:p-10">
        <div
          className={cn("mx-auto w-full max-w-[430px]", className)}
          {...props}
        >
          <PhoneFrame>
            <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[2.4rem] border border-border/70 bg-card">
              <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-7 w-36 -translate-x-1/2 rounded-full border border-black/70 bg-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]" />

              <div className="relative z-10 flex h-full min-h-0 flex-col">
                <div className="relative min-h-0 flex-1">
                  <div className="absolute inset-x-0 top-0 z-30 overflow-hidden rounded-t-[2.4rem] bg-background/75 supports-backdrop-filter:bg-background/35 supports-backdrop-filter:backdrop-blur-xl [backdrop-filter:blur(20px)_saturate(180%)] [-webkit-backdrop-filter:blur(20px)_saturate(180%)] mask-[linear-gradient(to_bottom,black_0%,black_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_88%,transparent_100%)]">
                    <MobileStatusBar />
                    <header className="relative flex h-12 items-center justify-center px-4">
                      <h3 className="text-center text-sm">
                        {activeNavItem?.label ?? "App"}
                      </h3>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <MobileHeaderUserMenu user={user} />
                      </div>
                    </header>
                  </div>

                  <ScrollArea className="h-full min-h-0 bg-muted/20">
                    <div className="px-3 pb-36 pt-24">{children}</div>
                  </ScrollArea>
                </div>

                <nav className="absolute inset-x-0 bottom-0 z-20 px-2 pb-2 pt-1.5">
                  <div className="flex w-full items-end justify-between gap-2">
                    <div className="flex max-w-full items-center gap-1 rounded-full border border-border/50 bg-background/80 px-1.5 py-1 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.55)] supports-backdrop-filter:bg-background/10 supports-backdrop-filter:backdrop-blur-2xl [backdrop-filter:blur(24px)_saturate(170%)] [-webkit-backdrop-filter:blur(24px)_saturate(170%)]">
                      {resolvedPrimaryNav.map(({ id, label, icon: Icon }) => {
                        const isActive = id === resolvedActiveNavId;

                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => {
                              if (activeNavItemId === undefined) {
                                setUncontrolledActiveNavId(id);
                              }
                            }}
                            aria-label={label}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                              "flex h-[52px] w-[56px] flex-none flex-col items-center justify-center gap-0.5 rounded-full text-[11px] leading-none transition-all",
                              isActive
                                ? "w-[76px] bg-muted text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]"
                                : "text-secondary/90 hover:text-foreground",
                            )}
                          >
                            <Icon
                              className={cn(
                                "size-5",
                                isActive ? "text-primary" : "text-inherit",
                              )}
                            />
                            <span className="truncate">{label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      aria-label="Open chat"
                      className="flex h-[60px] w-[60px] shrink-0 flex-none items-center justify-center rounded-full border border-border/50 bg-background/80 text-secondary/90 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.55)] transition-colors hover:text-foreground supports-backdrop-filter:bg-background/10 supports-backdrop-filter:backdrop-blur-2xl [backdrop-filter:blur(24px)_saturate(170%)] [-webkit-backdrop-filter:blur(24px)_saturate(170%)]"
                    >
                      <MessageCircleIcon className="size-[26px]" />
                    </button>
                  </div>
                  <div className="pointer-events-none mx-auto mt-2 h-1 w-24 rounded-full bg-foreground/28" />
                </nav>
              </div>
            </div>
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative aspect-390/844 w-full">
      <div className="pointer-events-none absolute -left-[3px] top-[17%] h-10 w-[3px] rounded-r-full bg-zinc-500/80" />
      <div className="pointer-events-none absolute -left-[3px] top-[24%] h-16 w-[3px] rounded-r-full bg-zinc-500/80" />
      <div className="pointer-events-none absolute -right-[3px] top-[22%] h-20 w-[3px] rounded-l-full bg-zinc-500/80" />

      <div className="absolute inset-0 rounded-[3.15rem] bg-[linear-gradient(150deg,#63666d_0%,#1f2126_55%,#0f1013_100%)] p-[10px] shadow-[0_40px_90px_-45px_rgba(17,17,17,0.7),0_20px_45px_-25px_rgba(17,17,17,0.55)]">
        <div className="absolute inset-[5px] rounded-[2.9rem] border border-white/10" />
        <div className="relative size-full overflow-hidden rounded-[2.75rem] bg-black p-[5px]">
          <div className="size-full overflow-hidden rounded-[2.45rem]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileStatusBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-10 items-center justify-between px-6 text-[11px] font-medium",
        className,
      )}
    >
      <span className="tracking-[0.06em]">9:41</span>
      <div className="text-muted-foreground flex items-center gap-1">
        <SignalHighIcon className="size-3.5 text-foreground" />
        <WifiIcon className="size-3.5 text-foreground" />
        <BatteryFullIcon className="size-3.5 text-foreground" />
      </div>
    </div>
  );
}

function MobileHeaderUserMenu({ user }: { user: MobileUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        render={
          <button
            type="button"
            className="rounded-full border border-white/45 bg-white/45 p-0.5 supports-backdrop-filter:bg-white/30 supports-backdrop-filter:backdrop-blur-md"
          />
        }
      >
        <span className="bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border/70 flex size-7 items-center justify-center rounded-full border text-[10px] font-medium">
          {user.initials}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex items-center gap-2">
              <div className="bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border/70 flex size-8 items-center justify-center border text-xs font-medium">
                {user.initials}
              </div>
              <div className="grid gap-0.5">
                <span className="truncate font-bold text-secondary">
                  {user.name}
                </span>
                <span className="text-muted-foreground truncate">
                  {user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BellIcon />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
