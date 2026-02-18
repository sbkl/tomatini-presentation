"use client";

import { useState, type ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BellIcon,
  BookOpenIcon,
  CheckIcon,
  ChartColumnIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MessageSquareTextIcon,
  UserIcon,
  UserRoundCheckIcon,
  ChevronsUpDownIcon,
} from "lucide-react";

import { Logo } from "@/components/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type WebNavItem<Id extends string = string> = {
  id: Id;
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
};

const defaultPrimaryNav = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    isActive: true,
  },
  { id: "modules", label: "Training Modules", icon: BookOpenIcon },
  { id: "coaching", label: "Coaching", icon: UserRoundCheckIcon },
  { id: "progress", label: "Progress", icon: ChartColumnIcon },
  { id: "communication", label: "Announcements", icon: MessageSquareTextIcon },
] as const satisfies readonly WebNavItem[];

export function defineWebNav<const TPrimaryNav extends readonly WebNavItem[]>(
  navItems: TPrimaryNav,
) {
  return navItems;
}

export type RestaurantOption = {
  id: string;
  title: string;
  subtitle: string;
  concept: "La Petite Maison" | "LPM RESTAURANT & BAR" | "Le CAFE";
  disabled?: boolean;
};

type SidebarUser = {
  name: string;
  email: string;
  initials: string;
};

export const appRestaurants: RestaurantOption[] = [
  {
    id: "london",
    title: "London",
    subtitle: "Mayfair",
    concept: "La Petite Maison",
  },
  {
    id: "dubai",
    title: "Dubai",
    subtitle: "DIFC, Gate Village 08",
    concept: "La Petite Maison",
  },
  {
    id: "abu-dhabi",
    title: "Abu Dhabi",
    subtitle: "Al Maryah Island",
    concept: "La Petite Maison",
  },
  {
    id: "hong-kong",
    title: "Hong Kong",
    subtitle: "H Queen's, Central",
    concept: "La Petite Maison",
  },
  {
    id: "riyadh",
    title: "Riyadh",
    subtitle: "Al Olaya District",
    concept: "La Petite Maison",
  },
  {
    id: "limassol",
    title: "Limassol",
    subtitle: "Parklane Resort, Pyrgos",
    concept: "La Petite Maison",
  },
  {
    id: "doha",
    title: "Doha",
    subtitle: "Al Maha Island, Lusail",
    concept: "La Petite Maison",
  },
  {
    id: "mykonos",
    title: "Mykonos",
    subtitle: "Anandes Hotel",
    concept: "La Petite Maison",
  },
  {
    id: "kuwait",
    title: "Kuwait",
    subtitle: "Gulf Street Waterfront (Opening 2026)",
    concept: "La Petite Maison",
  },
  {
    id: "marbella",
    title: "Marbella",
    subtitle: "Boho Club, Costa del Sol",
    concept: "La Petite Maison",
  },
  {
    id: "maldives",
    title: "Maldives",
    subtitle: "Rosewood Ranfaru (Opening 2027)",
    concept: "La Petite Maison",
  },
  {
    id: "miami",
    title: "Miami",
    subtitle: "Brickell Bay Drive",
    concept: "LPM RESTAURANT & BAR",
  },
  {
    id: "las-vegas",
    title: "Las Vegas",
    subtitle: "The Cosmopolitan, Las Vegas Strip",
    concept: "LPM RESTAURANT & BAR",
  },
  {
    id: "le-cafe-soon",
    title: "Dubai",
    subtitle: "Concept Launching Soon",
    concept: "Le CAFE",
    disabled: false,
  },
];

const defaultUser: SidebarUser = {
  name: "Sebastien Koziel",
  email: "sebastien@sbkl.ltd",
  initials: "SK",
};

export interface WebAppLayoutProps<
  PrimaryNavItems extends readonly WebNavItem[],
> extends ComponentProps<"div"> {
  primaryNav?: PrimaryNavItems;
  activeNavItemId?: PrimaryNavItems[number]["id"];
  sectionTitle?: string;
  sectionBullets?: readonly string[];
  restaurants?: RestaurantOption[];
  user?: SidebarUser;
}

export function WebAppLayout<
  const PrimaryNavItems extends readonly WebNavItem[] =
    typeof defaultPrimaryNav,
>({
  primaryNav = defaultPrimaryNav as unknown as PrimaryNavItems,
  activeNavItemId,
  sectionTitle,
  sectionBullets,
  restaurants = appRestaurants,
  user = defaultUser,
  children,
  className,
  ...props
}: WebAppLayoutProps<PrimaryNavItems>) {
  const [activeRestaurantId, setActiveRestaurantId] = useState(
    restaurants[0]?.id ?? "",
  );
  const activeRestaurant =
    restaurants.find((restaurant) => restaurant.id === activeRestaurantId) ??
    restaurants[0];
  const resolvedPrimaryNav = primaryNav as readonly WebNavItem[];
  const resolvedActiveNavItemId =
    activeNavItemId ?? resolvedPrimaryNav.find((item) => item.isActive)?.id;

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
      <div className="w-full rounded-[12px] overflow-hidden bg-[radial-gradient(circle_at_top,oklch(0.97_0.02_32),transparent_50%),linear-gradient(oklch(0.99_0.004_95),oklch(0.97_0.012_80))] p-4 sm:p-8 lg:p-12">
        <div
          className={cn(
            "relative mx-auto h-[80vh] w-full overflow-hidden border border-border bg-card shadow-[0_30px_90px_-55px_oklch(0.6489_0.1708_28.21)]",
            className,
          )}
          {...props}
        >
          <SidebarProvider defaultOpen={false} className="h-[70vh] min-h-0">
            <Sidebar
              collapsible="icon"
              className="absolute inset-y-0! left-0! h-full! border-r border-border/70"
            >
            <SidebarHeader className="p-2">
              {activeRestaurant ? (
                <RestaurantSwitcher
                  restaurants={restaurants}
                  activeRestaurant={activeRestaurant}
                  onRestaurantChange={setActiveRestaurantId}
                />
              ) : null}
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup className="px-1">
                <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
                  {resolvedPrimaryNav.map(({ id, label, icon: Icon }) => (
                    <SidebarMenuItem key={id}>
                      <SidebarMenuButton
                        tooltip={label}
                        isActive={id === resolvedActiveNavItemId}
                        aria-label={label}
                      >
                        <Icon />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-2 pt-0">
              <SidebarUserMenu user={user} />
            </SidebarFooter>
          </Sidebar>
            <SidebarInset className="h-full min-h-0 bg-muted/20">
              <section className="flex min-h-0 flex-1">
                <div className="h-full min-h-0 w-full">{children}</div>
              </section>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </div>
    </section>
  );
}

function RestaurantSwitcher({
  restaurants,
  activeRestaurant,
  onRestaurantChange,
}: {
  restaurants: RestaurantOption[];
  activeRestaurant: RestaurantOption;
  onRestaurantChange: (restaurantId: string) => void;
}) {
  const { isMobile } = useSidebar();
  const conceptOrder: RestaurantOption["concept"][] = [
    "La Petite Maison",
    "LPM RESTAURANT & BAR",
    "Le CAFE",
  ];
  const groupedRestaurants = conceptOrder
    .map((concept) => ({
      concept,
      items: restaurants.filter((restaurant) => restaurant.concept === concept),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="justify-start data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground in-data-[collapsible=icon]:justify-center"
              />
            }
          >
            <Logo className="size-8 border-none p-0.5 shadow-none" />
            <div className="grid flex-1 text-left text-xs leading-tight in-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">
                {activeRestaurant.title}
              </span>
              <span className="text-muted-foreground truncate text-[10px]">
                {activeRestaurant.subtitle}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4 in-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align={isMobile ? "end" : "start"}
            side={isMobile ? "bottom" : "right"}
          >
            {groupedRestaurants.map((group, index) => (
              <DropdownMenuGroup key={group.concept}>
                {index > 0 ? <DropdownMenuSeparator /> : null}
                <DropdownMenuLabel>{group.concept}</DropdownMenuLabel>
                {group.items.map((restaurant) => (
                  <DropdownMenuItem
                    key={restaurant.id}
                    disabled={restaurant.disabled}
                    onClick={() => {
                      if (!restaurant.disabled) {
                        onRestaurantChange(restaurant.id);
                      }
                    }}
                    className="items-start"
                  >
                    <div className="grid gap-0.5">
                      <span>{restaurant.title}</span>
                      <span className="text-muted-foreground text-[10px]">
                        {restaurant.subtitle}
                      </span>
                    </div>
                    {activeRestaurant.id === restaurant.id ? (
                      <CheckIcon className="ml-auto mt-0.5 size-4" />
                    ) : null}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function SidebarUserMenu({ user }: { user: SidebarUser }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="justify-start data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground in-data-[collapsible=icon]:justify-center"
              />
            }
          >
            <div className="bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border/70 flex size-8 items-center justify-center border text-xs font-medium">
              {user.initials}
            </div>
            <div className="grid flex-1 text-left text-xs leading-tight in-data-[collapsible=icon]:hidden">
              <span className="truncate font-bold text-secondary">
                {user.name}
              </span>
              <span className="text-muted-foreground truncate text-[10px]">
                {user.email}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4 in-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align="end"
            side={isMobile ? "bottom" : "top"}
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
