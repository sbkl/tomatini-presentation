import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "size-12 border border-brand-muted shadow shadow-brand-muted p-0.5",
        className,
      )}
      {...props}
    >
      <Image
        src="/tomatini-logo.svg"
        alt="Tomatini"
        width={64}
        height={64}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
