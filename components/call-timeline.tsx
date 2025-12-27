interface TimelineItem {
  phase: string;
  focus: string;
  prompt: string;
}

interface CallTimelineProps {
  personaLabel: string;
  items: TimelineItem[];
}

export function CallTimeline({ personaLabel, items }: CallTimelineProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-800">
          Call Flow Blueprint
        </h4>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600">
          {personaLabel}
        </span>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.phase}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {item.phase}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {item.focus}
            </p>
            <p className="mt-2 text-xs text-slate-500">{item.prompt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
