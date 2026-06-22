import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-white/10 bg-white/7 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-cyan-100",
        className
      )}
    >
      {children}
    </span>
  );
}

