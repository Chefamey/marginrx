import { moduleLabel } from "@/lib/modules";

export function ModuleBadge({ module }: { module: string }) {
  return (
    <span className="inline-flex rounded-full border border-jade/20 bg-jade/[0.08] px-2.5 py-1 text-xs font-semibold text-ink">
      {moduleLabel(module)}
    </span>
  );
}
