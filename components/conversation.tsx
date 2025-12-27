import { motion } from "framer-motion";
import type { CallStep } from "@/lib/call-simulator";

interface ConversationProps {
  steps: CallStep[];
}

export function Conversation({ steps }: ConversationProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="flex items-start gap-3"
        >
          <div
            className={`mt-1 h-2 w-2 rounded-full ${
              step.speaker === "Agent" ? "bg-brand-500" : "bg-slate-400"
            }`}
          />
          <div>
            <p className="text-sm font-semibold text-slate-700">
              {step.speaker}
            </p>
            <p className="mt-1 text-sm text-slate-600">{step.message}</p>
            {step.annotation ? (
              <p className="mt-1 text-xs text-brand-600">{step.annotation}</p>
            ) : null}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
