/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioPill } from "@/components/ui/radio-pill";
import { Conversation } from "@/components/conversation";
import { MetricCard } from "@/components/metrics";
import { CallTimeline } from "@/components/call-timeline";
import {
  type CallPlan,
  type LeadProfile,
  type Persona,
  type Tone,
  simulateCall
} from "@/lib/call-simulator";

const personaOptions: {
  value: Persona;
  label: string;
  description: string;
}[] = [
  {
    value: "listing-agent",
    label: "Listing Agent",
    description: "Convert homeowners into exclusive listing clients."
  },
  {
    value: "buyer-agent",
    label: "Buyer Agent",
    description: "Guide buyers toward offers that stand out."
  },
  {
    value: "property-manager",
    label: "Property Manager",
    description: "Retain tenants with proactive communication."
  },
  {
    value: "investor-relations",
    label: "Investor Relations",
    description: "Advise investors with performance insights."
  }
];

const toneOptions: { value: Tone; label: string }[] = [
  { value: "consultative", label: "Consultative" },
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "energetic", label: "Energetic" }
];

const followUpChannels = [
  { value: "email", label: "Email Recap" },
  { value: "text", label: "SMS Updates" },
  { value: "call", label: "Follow-up Call" }
] as const;

const followUpTimings = [
  { value: "same-day", label: "Same day" },
  { value: "next-day", label: "Next day" },
  { value: "48-hours", label: "Within 48 hours" }
] as const;

export default function Page() {
  const [persona, setPersona] = useState<Persona>("listing-agent");
  const [tone, setTone] = useState<Tone>("consultative");
  const [objective, setObjective] = useState(
    "Secure a listing presentation for next Tuesday."
  );
  const [lead, setLead] = useState<LeadProfile>({
    fullName: "Morgan Chen",
    propertyType: "single-family",
    location: "North Austin",
    budget: "$850k",
    motivation: "upsizing"
  });
  const [followUp, setFollowUp] = useState<CallPlan["followUp"]>({
    channel: "email",
    timing: "next-day"
  });

  const plan: CallPlan = useMemo(
    () => ({ persona, tone, objective, lead, followUp }),
    [persona, tone, objective, lead, followUp]
  );

  const steps = useMemo(() => simulateCall(plan), [plan]);

  const metrics = useMemo(() => calculateMetrics(plan), [plan]);
  const timelineItems = useMemo(
    () => buildTimeline(plan.persona, plan.lead.motivation),
    [plan]
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto w-full max-w-6xl px-6 pt-16">
        <section className="rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-slate-900 px-10 py-16 text-white shadow-xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              Real Estate Calling Agent
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
              Design smarter outreach calls that convert leads into warm
              conversations.
            </h1>
            <p className="mt-6 text-lg text-white/80">
              Shape the persona, tone, and follow-up strategy. This agent crafts
              a call outline, scripts key talking points, and highlights the
              follow-through that elevates your client experience.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <MetricCard label="Call Confidence" value={`${metrics.confidence}%`} />
            <MetricCard
              label="Fit Score"
              value={`${metrics.fitScore}%`}
              delta="Based on persona, tone, and motivation pairing"
            />
            <MetricCard
              label="Follow-up Timing"
              value={metrics.followUpLabel}
              delta="Recommended to stay top-of-mind"
            />
          </div>
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,350px)_minmax(0,1fr)]">
          <div className="space-y-6">
            <Card>
              <CardHeader
                title="Persona"
                description="Pick the role your caller is adopting."
              />
              <CardContent className="space-y-3">
                {personaOptions.map((option) => (
                  <RadioPill
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    description={option.description}
                    checked={persona === option.value}
                    onSelect={(value) => setPersona(value as Persona)}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title="Lead Profile"
                description="Tune the property and motivation details."
              />
              <CardContent className="space-y-4">
                <Field
                  label="Lead name"
                  value={lead.fullName}
                  onChange={(value) => setLead({ ...lead, fullName: value })}
                  placeholder="Jamie Patel"
                />
                <SelectField
                  label="Property type"
                  value={lead.propertyType}
                  onChange={(value) =>
                    setLead({
                      ...lead,
                      propertyType: value as LeadProfile["propertyType"]
                    })
                  }
                  options={[
                    { label: "Single-family", value: "single-family" },
                    { label: "Condo", value: "condo" },
                    { label: "Multi-family", value: "multi-family" },
                    { label: "Commercial", value: "commercial" }
                  ]}
                />
                <Field
                  label="Target area"
                  value={lead.location}
                  onChange={(value) => setLead({ ...lead, location: value })}
                  placeholder="Downtown Denver"
                />
                <Field
                  label="Budget / Rent ceiling"
                  value={lead.budget}
                  onChange={(value) => setLead({ ...lead, budget: value })}
                  placeholder="$1.2M"
                />
                <SelectField
                  label="Primary motivation"
                  value={lead.motivation}
                  onChange={(value) =>
                    setLead({
                      ...lead,
                      motivation: value as LeadProfile["motivation"]
                    })
                  }
                  options={[
                    { label: "Relocating", value: "relocating" },
                    { label: "Upsizing", value: "upsizing" },
                    { label: "Downsizing", value: "downsizing" },
                    { label: "Investing", value: "investing" }
                  ]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title="Call Strategy"
                description="Outline tone, objective, and follow-up."
              />
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Call objective
                  </label>
                  <textarea
                    value={objective}
                    onChange={(event) => setObjective(event.target.value)}
                    placeholder="Confirm a property tour, schedule valuation, etc."
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Tone calibration
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {toneOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setTone(option.value)}
                        className={`rounded-xl border px-4 py-2 text-sm transition ${
                          tone === option.value
                            ? "border-brand-500 bg-brand-50 text-brand-600 shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-brand-400 hover:bg-brand-50/60"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Follow-up plan
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {followUpChannels.map((channel) => (
                      <button
                        key={channel.value}
                        type="button"
                        onClick={() =>
                          setFollowUp({
                            ...followUp,
                            channel: channel.value
                          })
                        }
                        className={`rounded-xl border px-3 py-2 text-sm transition ${
                          followUp.channel === channel.value
                            ? "border-brand-500 bg-brand-50 text-brand-600"
                            : "border-slate-200 bg-white text-slate-600 hover:border-brand-400 hover:bg-brand-50/60"
                        }`}
                      >
                        {channel.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {followUpTimings.map((timing) => (
                      <button
                        key={timing.value}
                        type="button"
                        onClick={() =>
                          setFollowUp({
                            ...followUp,
                            timing: timing.value
                          })
                        }
                        className={`rounded-xl border px-3 py-2 text-sm transition ${
                          followUp.timing === timing.value
                            ? "border-brand-500 bg-brand-50 text-brand-600"
                            : "border-slate-200 bg-white text-slate-600 hover:border-brand-400 hover:bg-brand-50/60"
                        }`}
                      >
                        {timing.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-brand-100">
              <CardHeader
                title="Call Blueprint"
                description="Scripted flow generated from your selections."
              />
              <CardContent>
                <Conversation steps={steps} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title="Strategy Insights"
                description="Auto-generated guidance to personalize your outreach."
              />
              <CardContent className="space-y-4">
                <InsightGrid plan={plan} />
                <CallTimeline
                  personaLabel={
                    personaOptions.find((item) => item.value === plan.persona)
                      ?.label ?? "Agent"
                  }
                  items={timelineItems}
                />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

function calculateMetrics(plan: CallPlan) {
  const personaMatchWeight: Record<Persona, number> = {
    "listing-agent": plan.lead.motivation === "downsizing" ? 92 : 88,
    "buyer-agent": plan.lead.motivation === "upsizing" ? 93 : 85,
    "property-manager": plan.lead.motivation === "relocating" ? 84 : 79,
    "investor-relations": plan.lead.motivation === "investing" ? 95 : 80
  };

  const toneWeight: Record<Tone, number> = {
    friendly: 86,
    professional: 89,
    consultative: 92,
    energetic: 84
  };

  const followUpWeight =
    plan.followUp.channel === "email"
      ? 88
      : plan.followUp.channel === "text"
        ? 82
        : 90;

  const confidence = Math.round(
    (personaMatchWeight[plan.persona] +
      toneWeight[plan.tone] +
      followUpWeight) /
      3
  );

  return {
    confidence,
    fitScore: Math.round(personaMatchWeight[plan.persona]),
    followUpLabel: formatFollowUp(plan.followUp)
  };
}

function formatFollowUp(followUp: CallPlan["followUp"]) {
  const channelLabel =
    followUp.channel === "email"
      ? "Email summary"
      : followUp.channel === "text"
        ? "SMS touch"
        : "Call back";
  const timingLabel =
    followUp.timing === "same-day"
      ? "later today"
      : followUp.timing === "next-day"
        ? "tomorrow morning"
        : "within 48 hours";

  return `${channelLabel} ${timingLabel}`;
}

function buildTimeline(persona: Persona, motivation: LeadProfile["motivation"]) {
  const discoveryFocus =
    motivation === "upsizing"
      ? "Uncover family growth, workspace, and neighborhood requirements."
      : motivation === "downsizing"
        ? "Surface lifestyle shifts, maintenance goals, and ideal square footage."
        : motivation === "relocating"
          ? "Clarify timeline, relocation support, and community must-haves."
          : "Clarify cap rate targets, leverage strategy, and hold period.";

  const positioningFocus =
    persona === "listing-agent"
      ? "Explain marketing strategy and pricing intelligence."
      : persona === "buyer-agent"
        ? "Showcase access to pre-market inventory and negotiation approach."
        : persona === "property-manager"
          ? "Highlight service stack and tenant retention programs."
          : "Share analytics, financing partners, and portfolio planning.";

  return [
    {
      phase: "Warm Opening",
      focus: "Bridge context with prior touchpoint and set agenda.",
      prompt: "Confirm they have a quick moment and mirror their pace."
    },
    {
      phase: "Discovery",
      focus: discoveryFocus,
      prompt: "Ask layered questions and repeat back priority keywords."
    },
    {
      phase: "Positioning",
      focus: positioningFocus,
      prompt: "Anchor on a flagship success story that maps to this lead."
    },
    {
      phase: "Commitment",
      focus: "Secure a next step aligned with the lead's momentum.",
      prompt: "Confirm best contact method and share quick follow-up timeline."
    }
  ];
}

interface FieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function Field({ label, value, placeholder, onChange }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface InsightGridProps {
  plan: CallPlan;
}

function InsightGrid({ plan }: InsightGridProps) {
  const keyPoint = getKeyPoint(plan.persona, plan.lead.motivation);
  const objectionHandler = buildObjection(plan.lead.motivation);
  const reminder = buildReminder(plan.followUp.channel);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <InsightTile
        title="Leading Message"
        body={keyPoint}
        tone={plan.tone}
        highlight
      />
      <InsightTile title="Objection Prep" body={objectionHandler} />
      <InsightTile title="Follow-up Hook" body={reminder} />
    </div>
  );
}

interface InsightTileProps {
  title: string;
  body: string;
  tone?: Tone;
  highlight?: boolean;
}

function InsightTile({ title, body, tone, highlight }: InsightTileProps) {
  return (
    <div
      className={`rounded-2xl border px-4 py-4 text-sm shadow-sm ${
        highlight
          ? "border-brand-200 bg-brand-50 text-brand-900"
          : "border-slate-200 bg-white text-slate-600"
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-sm leading-relaxed">{body}</p>
      {tone ? (
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-brand-600">
          Tone: {tone}
        </p>
      ) : null}
    </div>
  );
}

function getKeyPoint(persona: Persona, motivation: LeadProfile["motivation"]) {
  if (persona === "listing-agent") {
    return motivation === "downsizing"
      ? "Frame concierge services and modern staging that minimize disruption while maximizing final sale price."
      : "Lead with recent neighborhood comps and marketing assets that showcase your premium launch plans.";
  }

  if (persona === "buyer-agent") {
    return motivation === "upsizing"
      ? "Spotlight lifestyle upgrades and flexible negotiation tactics to win bigger homes in competitive areas."
      : "Emphasize access to curated inventory and financing partners tailored to their move.";
  }

  if (persona === "property-manager") {
    return "Highlight retention playbooks, resident experience perks, and transparent reporting dashboards.";
  }

  return "Anchor on portfolio reviews, acquisition criteria, and a repeatable deal screening framework.";
}

function buildObjection(motivation: LeadProfile["motivation"]) {
  switch (motivation) {
    case "upsizing":
      return "If budget stretch is a concern, prep comps showing value appreciation and financing buffers.";
    case "downsizing":
      return "If they fear losing space, outline storage, layout efficiency, and low-maintenance perks.";
    case "relocating":
      return "If relocation timing is fuzzy, offer concierge move support and remote walkthroughs.";
    case "investing":
      return "If return is debated, bring rent comps, expense forecasts, and stress-tested scenarios.";
    default:
      return "Prepare market data that validates the path forward.";
  }
}

function buildReminder(channel: CallPlan["followUp"]["channel"]) {
  if (channel === "email") {
    return "Send a call summary with top three takeaways and curated attachments.";
  }

  if (channel === "text") {
    return "Keep SMS concise with one CTA and a trackable link to next steps.";
  }

  return "Block a 10-minute follow-up call to review action items live.";
}
