"use client";

import { FormEvent, useState } from "react";

const cadences = [
  { id: "weekly", label: "Weekly", detail: "Steady habit" },
  { id: "biweekly", label: "Bi-weekly", detail: "Paycheck pace" },
  { id: "monthly", label: "Monthly", detail: "Long game" },
] as const;

const sendWindows = [
  { id: "morning", label: "Morning", detail: "Before markets roar" },
  { id: "afternoon", label: "Afternoon", detail: "Midday check-in" },
  { id: "evening", label: "Evening", detail: "After work" },
] as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ReminderTease() {
  const [cadence, setCadence] =
    useState<(typeof cadences)[number]["id"]>("weekly");
  const [sendWindow, setSendWindow] =
    useState<(typeof sendWindows)[number]["id"]>("morning");
  const [dropAlerts, setDropAlerts] = useState(true);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitHint, setSubmitHint] = useState<string | null>(null);

  const trimmedEmail = email.trim();
  const emailStatus = !trimmedEmail
    ? "empty"
    : emailPattern.test(trimmedEmail)
      ? "valid"
      : "invalid";

  const selectedCadence =
    cadences.find((option) => option.id === cadence) ?? cadences[0];
  const selectedWindow =
    sendWindows.find((option) => option.id === sendWindow) ?? sendWindows[0];

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    setEmailTouched(true);
    if (emailStatus !== "valid") {
      event.preventDefault();
      setSubmitHint(
        emailStatus === "empty"
          ? "Add an email so we know where to send reminders."
          : "That email does not look valid yet — fix it or finish on Omnipay.cc.",
      );
      return;
    }
    setSubmitHint(null);
  }

  return (
    <form
      action="https://omnipay.cc/reminders"
      method="get"
      onSubmit={onSubmit}
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
      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-[var(--foreground)]">
          Preferred send window
        </legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {sendWindows.map((option) => {
            const selected = sendWindow === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSendWindow(option.id)}
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
        <input type="hidden" name="send_window" value={sendWindow} />
      </fieldset>
      <label className="mt-6 block text-sm font-medium text-[var(--foreground)]">
        Email for reminders
        <input
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setSubmitHint(null);
          }}
          onBlur={() => setEmailTouched(true)}
          placeholder="you@company.com"
          aria-invalid={emailTouched && emailStatus === "invalid"}
          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
        />
      </label>
      {emailTouched && emailStatus === "invalid" ? (
        <p className="mt-2 text-xs text-amber-700" role="status">
          Enter a valid email (name@domain) to continue.
        </p>
      ) : null}
      {emailStatus === "valid" ? (
        <p className="mt-2 text-xs text-emerald-700" role="status">
          Looks good — we&apos;ll preview reminders to {trimmedEmail}.
        </p>
      ) : null}
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
      <p className="mt-5 rounded-xl border border-[var(--line)] bg-[#f7f9fc] px-4 py-3 text-sm leading-6 text-[var(--foreground)]">
        Reminder preview:{" "}
        <span className="font-semibold">{selectedCadence.label}</span> cadence ·{" "}
        <span className="font-semibold">{selectedWindow.label}</span> window
        {dropAlerts ? " + drop alerts" : ""}
        {emailStatus === "valid" ? ` → ${trimmedEmail}` : ""} — confirm on
        Omnipay.cc after sign-in.
      </p>
      {submitHint ? (
        <p className="mt-3 text-xs text-amber-700" role="alert">
          {submitHint}
        </p>
      ) : null}
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
