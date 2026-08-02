"use client";

import { useState } from "react";

const cadences = [
  { id: "weekly", label: "Weekly", detail: "Steady habit" },
  { id: "biweekly", label: "Bi-weekly", detail: "Paycheck pace" },
  { id: "monthly", label: "Monthly", detail: "Long game" },
] as const;

export function ReminderTease() {
  const [cadence, setCadence] =
    useState<(typeof cadences)[number]["id"]>("weekly");
  const [dropAlerts, setDropAlerts] = useState(true);

  return (
    <form
      action="https://omnipay.cc/reminders"
      method="get"
      className="mt-12 max-w-xl"
    >
      <fieldset>
        <legend className="text-sm font-medium text-[var(--foreground)]">
          Reminder cadence
        </legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {cadences.map((option) => {
            const selected = cadence === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setCadence(option.id)}
                aria-pressed={selected}
                className={`rounded-xl px-3 py-3 text-left transition-colors ${
                  selected
                    ? "bg-[var(--accent)] text-white"
                    : "border border-[var(--line)] bg-white text-[var(--foreground)] hover:border-[var(--accent)]/40"
                }`}
              >
                <span className="block text-sm font-semibold">
                  {option.label}
                </span>
                <span
                  className={`mt-1 block text-xs ${
                    selected ? "text-sky-100/85" : "text-[var(--muted)]"
                  }`}
                >
                  {option.detail}
                </span>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="cadence" value={cadence} />
      </fieldset>
      <label className="mt-6 block text-sm font-medium text-[var(--foreground)]">
        Email for reminders
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
        />
      </label>
      <label className="mt-4 flex items-start gap-3 text-sm text-[var(--foreground)]">
        <input
          type="checkbox"
          name="drop_alerts"
          value="1"
          checked={dropAlerts}
          onChange={(event) => setDropAlerts(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-[var(--line)] accent-[var(--accent)]"
        />
        <span>
          <span className="font-semibold">Also send drop alerts</span>
          <span className="mt-1 block text-[var(--muted)]">
            Get notified after major dips so you can buy when the market is
            giving specials.
          </span>
        </span>
      </label>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[var(--accent-deep)]"
        >
          Set up your reminders
        </button>
        <p className="text-sm text-[var(--muted)]">
          Sign in on Omnipay.cc to customize alerts.
        </p>
      </div>
    </form>
  );
}
