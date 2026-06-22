import { cn } from "@/lib/utils";

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-lg border border-border bg-card/80 p-4 shadow-2xl backdrop-blur", className)}>
      {children}
    </section>
  );
}
