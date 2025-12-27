import { clsx } from "clsx";

interface RadioPillProps {
  label: string;
  value: string;
  checked: boolean;
  onSelect: (value: string) => void;
  description?: string;
}

export function RadioPill({
  label,
  value,
  checked,
  onSelect,
  description
}: RadioPillProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={clsx(
        "flex w-full flex-col items-start rounded-xl border px-4 py-3 text-left transition",
        checked
          ? "border-brand-500 bg-brand-50 text-brand-600 shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-brand-400 hover:bg-brand-50/60"
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      {description ? (
        <span className="mt-1 text-xs text-slate-500">{description}</span>
      ) : null}
    </button>
  );
}
