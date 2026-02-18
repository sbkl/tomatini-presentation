import type { ComponentProps, ReactNode } from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type WebAppPageHeaderProps = ComponentProps<"header"> & {
  title: string;
  actions?: ReactNode;
};

export function WebAppPageHeader({
  title,
  actions,
  className,
  ...props
}: WebAppPageHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between border-b border-border/70 bg-background/80 px-4",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="leading-tight">
          <h2 className="text-sm">{title}</h2>
        </div>
      </div>
      {actions ? <div>{actions}</div> : null}
    </header>
  );
}
