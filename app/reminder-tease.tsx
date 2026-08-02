"use client";

import { FormEvent, useEffect, useState } from "react";

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

const dropThresholds = [
  { id: "5", label: "5%", detail: "Sensitive" },
  { id: "10", label: "10%", detail: "Balanced" },
  { id: "20", label: "20%", detail: "Big dips only" },
] as const;

const timezones = [
  { id: "local", label: "Local device" },
  { id: "america-new_york", label: "US Eastern" },
  { id: "america-los_angeles", label: "US Pacific" },
  { id: "europe-london", label: "London" },
  { id: "asia-singapore", label: "Singapore" },
] as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Preview-only reminder prefs in this browser — not a server-side schedule. */
const reminderStorageKey = "omnipay-preview-reminder-v1";

type ReminderDraftV1 = {
  v: 1;
  savedAt: string;
  cadence: (typeof cadences)[number]["id"];
  sendWindow: (typeof sendWindows)[number]["id"];
  dropAlerts: boolean;
  dropThreshold: (typeof dropThresholds)[number]["id"];
  timezone: (typeof timezones)[number]["id"];
  email: string;
};

function isCadenceId(value: unknown): value is (typeof cadences)[number]["id"] {
  return typeof value === "string" && cadences.some((c) => c.id === value);
}

function isSendWindowId(
  value: unknown,
): value is (typeof sendWindows)[number]["id"] {
  return typeof value === "string" && sendWindows.some((w) => w.id === value);
}

function isDropThresholdId(
  value: unknown,
): value is (typeof dropThresholds)[number]["id"] {
  return (
    typeof value === "string" && dropThresholds.some((t) => t.id === value)
  );
}

function isTimezoneId(
  value: unknown,
): value is (typeof timezones)[number]["id"] {
  return typeof value === "string" && timezones.some((t) => t.id === value);
}

function parseReminderDraft(raw: unknown): ReminderDraftV1 | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (obj.v !== 1) return null;
  if (typeof obj.savedAt !== "string" || !obj.savedAt) return null;
  if (!isCadenceId(obj.cadence)) return null;
  if (!isSendWindowId(obj.sendWindow)) return null;
  if (typeof obj.dropAlerts !== "boolean") return null;
  if (!isDropThresholdId(obj.dropThreshold)) return null;
  if (!isTimezoneId(obj.timezone)) return null;
  if (typeof obj.email !== "string") return null;
  return {
    v: 1,
    savedAt: obj.savedAt,
    cadence: obj.cadence,
    sendWindow: obj.sendWindow,
    dropAlerts: obj.dropAlerts,
    dropThreshold: obj.dropThreshold,
    timezone: obj.timezone,
    email: obj.email,
  };
}

function readReminderFromStorage(): ReminderDraftV1 | null {
  try {
    const raw = window.localStorage.getItem(reminderStorageKey);
    if (!raw) return null;
    return parseReminderDraft(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function ReminderTease() {
  const [cadence, setCadence] =
    useState<(typeof cadences)[number]["id"]>("weekly");
  const [sendWindow, setSendWindow] =
    useState<(typeof sendWindows)[number]["id"]>("morning");
  const [dropAlerts, setDropAlerts] = useState(true);
  const [dropThreshold, setDropThreshold] =
    useState<(typeof dropThresholds)[number]["id"]>("10");
  const [timezone, setTimezone] =
    useState<(typeof timezones)[number]["id"]>("local");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitHint, setSubmitHint] = useState<string | null>(null);
  const [reminderAvailable, setReminderAvailable] = useState(false);
  const [reminderBanner, setReminderBanner] = useState(false);
  const [reminderHint, setReminderHint] = useState<string | null>(null);
  const [reminderSavedAt, setReminderSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const saved = readReminderFromStorage();
    if (!saved) return;
    setReminderAvailable(true);
    setReminderSavedAt(saved.savedAt);
    setReminderBanner(true);
    setReminderHint(
      "Saved reminder prefs found in this browser — Restore reminder to reload them.",
    );
  }, []);

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
  const selectedThreshold =
    dropThresholds.find((option) => option.id === dropThreshold) ??
    dropThresholds[1];
  const selectedTimezone =
    timezones.find((option) => option.id === timezone) ?? timezones[0];

  function buildReminderPayload(): ReminderDraftV1 {
    return {
      v: 1,
      savedAt: new Date().toISOString(),
      cadence,
      sendWindow,
      dropAlerts,
      dropThreshold,
      timezone,
      email: trimmedEmail,
    };
  }

  function applyReminder(draft: ReminderDraftV1) {
    setCadence(draft.cadence);
    setSendWindow(draft.sendWindow);
    setDropAlerts(draft.dropAlerts);
    setDropThreshold(draft.dropThreshold);
    setTimezone(draft.timezone);
    setEmail(draft.email);
    setEmailTouched(Boolean(draft.email.trim()));
    setSubmitHint(null);
  }

  function saveReminder() {
    const payload = buildReminderPayload();
    try {
      window.localStorage.setItem(reminderStorageKey, JSON.stringify(payload));
      setReminderAvailable(true);
      setReminderBanner(false);
      setReminderSavedAt(payload.savedAt);
      setReminderHint(
        "Reminder prefs saved in this browser — Restore reminder reloads them. Nothing uploads to Omnipay servers.",
      );
      setSubmitHint(null);
    } catch {
      setReminderHint(
        "Save reminder failed — browser storage may be blocked in this preview.",
      );
    }
  }

  function restoreReminder() {
    const draft = readReminderFromStorage();
    if (!draft) {
      setReminderAvailable(false);
      setReminderBanner(false);
      setReminderSavedAt(null);
      setReminderHint("No saved reminder prefs in this browser.");
      return;
    }
    applyReminder(draft);
    setReminderAvailable(true);
    setReminderBanner(false);
    setReminderSavedAt(draft.savedAt);
    setReminderHint(
      "Reminder prefs restored — confirm on Omnipay.cc after sign-in to make them live.",
    );
  }

  function clearReminder() {
    try {
      window.localStorage.removeItem(reminderStorageKey);
    } catch {
      /* ignore */
    }
    setReminderAvailable(false);
    setReminderBanner(false);
    setReminderSavedAt(null);
    setReminderHint("Reminder prefs cleared from this browser.");
  }

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
      {reminderBanner ? (
        <p
          className="mb-4 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-3 text-sm text-[var(--foreground)]"
          role="status"
        >
          Saved reminder prefs found
          {reminderSavedAt
            ? ` (${new Date(reminderSavedAt).toLocaleString()})`
            : ""}
          .{" "}
          <button
            type="button"
            onClick={restoreReminder}
            className="font-semibold text-[var(--accent-deep)] underline underline-offset-2"
          >
            Restore reminder
          </button>
        </p>
      ) : null}
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
        Reminder timezone
        <select
          name="timezone"
          value={timezone}
          onChange={(event) =>
            setTimezone(event.target.value as (typeof timezones)[number]["id"])
          }
          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
        >
          {timezones.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
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
      {dropAlerts ? (
        <fieldset className="mt-4">
          <legend className="text-sm font-medium text-[var(--foreground)]">
            Drop alert threshold
          </legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {dropThresholds.map((option) => {
              const selected = dropThreshold === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setDropThreshold(option.id)}
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
          <input type="hidden" name="drop_threshold" value={dropThreshold} />
        </fieldset>
      ) : null}
      <p className="mt-5 rounded-xl border border-[var(--line)] bg-[#f7f9fc] px-4 py-3 text-sm leading-6 text-[var(--foreground)]">
        Reminder preview:{" "}
        <span className="font-semibold">{selectedCadence.label}</span> cadence ·{" "}
        <span className="font-semibold">{selectedWindow.label}</span> window ·{" "}
        <span className="font-semibold">{selectedTimezone.label}</span>
        {dropAlerts
          ? ` + drop alerts ≥${selectedThreshold.label}`
          : ""}
        {emailStatus === "valid" ? ` → ${trimmedEmail}` : ""} — confirm on
        Omnipay.cc after sign-in.
      </p>
      <p
        className="mt-3 flex flex-wrap gap-2"
        aria-label="Reminder draft tools"
      >
        <button
          type="button"
          onClick={saveReminder}
          className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40"
        >
          Save reminder
        </button>
        {reminderAvailable ? (
          <button
            type="button"
            onClick={restoreReminder}
            className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40"
          >
            Restore reminder
          </button>
        ) : null}
        {reminderAvailable ? (
          <button
            type="button"
            onClick={clearReminder}
            className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40"
          >
            Clear reminder
          </button>
        ) : null}
      </p>
      {reminderHint ? (
        <p className="mt-2 text-xs text-[var(--muted)]" role="status">
          {reminderHint}
        </p>
      ) : null}
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
