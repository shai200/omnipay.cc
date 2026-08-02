"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

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
const reminderHashPrefix = "omn-reminder=";

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

/** Preview-only: base64url encode reminder prefs for URL hash (not a server schedule). */
function encodeReminderForHash(draft: ReminderDraftV1): string {
  const json = JSON.stringify(draft);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeReminderFromHash(token: string): ReminderDraftV1 | null {
  try {
    const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const pad =
      b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    const binary = atob(b64 + pad);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return parseReminderDraft(JSON.parse(json));
  } catch {
    return null;
  }
}

/** Preview-only: extract reminder prefs from a pasted URL, hash, or bare token. */
function extractReminderFromPaste(raw: string): ReminderDraftV1 | null {
  const text = raw.trim();
  if (!text) return null;
  try {
    if (text.includes("#") || text.startsWith("http")) {
      const asUrl = text.includes("://")
        ? new URL(text)
        : new URL(text, window.location.origin);
      const hash = asUrl.hash.replace(/^#/, "");
      if (hash.startsWith(reminderHashPrefix)) {
        return decodeReminderFromHash(
          decodeURIComponent(hash.slice(reminderHashPrefix.length)),
        );
      }
    }
  } catch {
    /* fall through */
  }
  const hashIdx = text.indexOf(`#${reminderHashPrefix}`);
  if (hashIdx >= 0) {
    return decodeReminderFromHash(
      decodeURIComponent(text.slice(hashIdx + 1 + reminderHashPrefix.length)),
    );
  }
  if (text.startsWith(reminderHashPrefix)) {
    return decodeReminderFromHash(
      decodeURIComponent(text.slice(reminderHashPrefix.length)),
    );
  }
  // Bare JSON export or bare base64url token.
  try {
    if (text.startsWith("{")) {
      return parseReminderDraft(JSON.parse(text));
    }
  } catch {
    /* fall through */
  }
  return decodeReminderFromHash(text);
}

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

/** Preview-only: stable fingerprint ignores savedAt so copy/verify compares fields. */
function canonicalReminderForFingerprint(draft: ReminderDraftV1): string {
  const { savedAt: _savedAt, ...rest } = draft;
  return JSON.stringify(rest);
}

/** Preview-only FNV-1a 32-bit hex — not a cryptographic hash. */
function fingerprintReminder(draft: ReminderDraftV1): string {
  const s = canonicalReminderForFingerprint(draft);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0").toUpperCase();
}

/** Human labels for preview reminder field diffs (ignores savedAt). */
const reminderFieldLabels: Record<
  Exclude<keyof ReminderDraftV1, "v" | "savedAt">,
  string
> = {
  cadence: "Cadence",
  sendWindow: "Send window",
  dropAlerts: "Drop alerts",
  dropThreshold: "Drop threshold",
  timezone: "Timezone",
  email: "Email",
};

function formatReminderDiffValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "(empty)";
    if (trimmed.length > 28) return `${trimmed.slice(0, 24)}…`;
    return trimmed;
  }
  return String(value);
}

type ReminderDiffLabel = "link" | "form" | "slot";

/** Preview-only: field-level diff, ignores v + savedAt. */
function diffReminderFields(
  current: ReminderDraftV1,
  other: ReminderDraftV1,
  otherLabel: ReminderDiffLabel = "link",
  currentLabel: ReminderDiffLabel = "slot",
): string[] {
  const keys = Object.keys(reminderFieldLabels) as Array<
    keyof typeof reminderFieldLabels
  >;
  const lines: string[] = [];
  for (const key of keys) {
    if (current[key] === other[key]) continue;
    lines.push(
      `${reminderFieldLabels[key]}: ${currentLabel} ${formatReminderDiffValue(current[key])} → ${otherLabel} ${formatReminderDiffValue(other[key])}`,
    );
  }
  return lines;
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
  const [reminderLinkCopied, setReminderLinkCopied] = useState(false);
  const [reminderExported, setReminderExported] = useState(false);
  const [reminderLinkPasted, setReminderLinkPasted] = useState(false);
  const [reminderImported, setReminderImported] = useState(false);
  const [reminderVerifyStatus, setReminderVerifyStatus] = useState<
    "idle" | "match" | "mismatch" | "invalid"
  >("idle");
  const [reminderVerifyAnchor, setReminderVerifyAnchor] = useState<
    "link" | "form"
  >("link");
  const [reminderDiffLines, setReminderDiffLines] = useState<string[]>([]);
  const [reminderFormSwapped, setReminderFormSwapped] = useState(false);
  const [reminderSlotFingerprint, setReminderSlotFingerprint] = useState<
    string | null
  >(null);
  const [reminderFormCleared, setReminderFormCleared] = useState(false);
  const [reminderFpCopied, setReminderFpCopied] = useState(false);
  const pasteReminderInputRef = useRef<HTMLInputElement>(null);
  const importReminderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = readReminderFromStorage();
    if (!saved) return;
    setReminderAvailable(true);
    setReminderSavedAt(saved.savedAt);
    setReminderSlotFingerprint(fingerprintReminder(saved));
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

  const reminderFormFingerprint = fingerprintReminder(buildReminderPayload());

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
      const fp = fingerprintReminder(payload);
      setReminderAvailable(true);
      setReminderBanner(false);
      setReminderSavedAt(payload.savedAt);
      setReminderSlotFingerprint(fp);
      setReminderVerifyStatus("idle");
      setReminderDiffLines([]);
      setReminderFormCleared(false);
      setReminderHint(
        `Reminder prefs saved (FP ${fp}) — Restore reminder reloads them. Nothing uploads to Omnipay servers.`,
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
      setReminderSlotFingerprint(null);
      setReminderHint("No saved reminder prefs in this browser.");
      return;
    }
    applyReminder(draft);
    const fp = fingerprintReminder(draft);
    setReminderAvailable(true);
    setReminderBanner(false);
    setReminderSavedAt(draft.savedAt);
    setReminderSlotFingerprint(fp);
    setReminderFormCleared(false);
    setReminderHint(
      `Reminder prefs restored (FP ${fp}) — confirm on Omnipay.cc after sign-in to make them live.`,
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
    setReminderSlotFingerprint(null);
    setReminderLinkCopied(false);
    setReminderExported(false);
    setReminderLinkPasted(false);
    setReminderImported(false);
    setReminderVerifyStatus("idle");
    setReminderDiffLines([]);
    setReminderFormSwapped(false);
    setReminderFormCleared(false);
    setReminderFpCopied(false);
    setReminderHint("Reminder prefs cleared from this browser.");
  }

  /** Preview-only: reset live form to defaults; Save reminder slot untouched. */
  function clearForm() {
    const slot = readReminderFromStorage();
    setCadence("weekly");
    setSendWindow("morning");
    setDropAlerts(true);
    setDropThreshold("10");
    setTimezone("local");
    setEmail("");
    setEmailTouched(false);
    setSubmitHint(null);
    setReminderVerifyStatus("idle");
    setReminderDiffLines([]);
    setReminderFormSwapped(false);
    setReminderFormCleared(true);
    window.setTimeout(() => setReminderFormCleared(false), 2000);
    const defaults: ReminderDraftV1 = {
      v: 1,
      savedAt: new Date().toISOString(),
      cadence: "weekly",
      sendWindow: "morning",
      dropAlerts: true,
      dropThreshold: "10",
      timezone: "local",
      email: "",
    };
    const formFp = fingerprintReminder(defaults);
    if (slot) {
      const slotFp = fingerprintReminder(slot);
      setReminderAvailable(true);
      setReminderSavedAt(slot.savedAt);
      setReminderSlotFingerprint(slotFp);
      setReminderBanner(false);
      setReminderHint(
        `Form cleared to defaults (FP ${formFp}) — Save reminder slot untouched (FP ${slotFp}).`,
      );
    } else {
      setReminderAvailable(false);
      setReminderBanner(false);
      setReminderSavedAt(null);
      setReminderSlotFingerprint(null);
      setReminderHint(
        `Form cleared to defaults (FP ${formFp}) — no Save reminder slot in this browser.`,
      );
    }
  }

  /** Preview-only: copy live form fingerprint (not a share URL). */
  async function copyReminderFormFp() {
    try {
      await navigator.clipboard.writeText(reminderFormFingerprint);
      setReminderFpCopied(true);
      window.setTimeout(() => setReminderFpCopied(false), 2000);
      setReminderHint(
        `Form FP ${reminderFormFingerprint} copied — cite when verifying across browsers. Slot untouched.`,
      );
    } catch {
      setReminderHint(
        "Copy form FP failed — clipboard may be blocked in this preview.",
      );
    }
  }

  /** Preview-only: copy Save reminder slot as a #omn-reminder= share URL (form untouched). */
  async function copyReminderLink() {
    const draft = readReminderFromStorage();
    if (!draft) {
      setReminderAvailable(false);
      setReminderBanner(false);
      setReminderSavedAt(null);
      setReminderSlotFingerprint(null);
      setReminderHint("No saved reminder prefs in this browser — Save reminder first.");
      return;
    }
    try {
      const encoded = encodeReminderForHash(draft);
      const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${reminderHashPrefix}${encoded}`;
      await navigator.clipboard.writeText(url);
      const fp = fingerprintReminder(draft);
      setReminderAvailable(true);
      setReminderSavedAt(draft.savedAt);
      setReminderSlotFingerprint(fp);
      setReminderLinkCopied(true);
      setReminderExported(false);
      setReminderLinkPasted(false);
      setReminderImported(false);
      setReminderVerifyStatus("idle");
      setReminderDiffLines([]);
      window.setTimeout(() => setReminderLinkCopied(false), 2000);
      setReminderHint(
        `Reminder link copied (FP ${fp}) — open / Paste reminder link on another browser. Form unchanged. Nothing uploads to Omnipay servers.`,
      );
      setSubmitHint(null);
    } catch {
      setReminderHint(
        "Copy reminder link failed — use Export reminder .json instead.",
      );
    }
  }

  /** Preview-only: download Save reminder slot as JSON (form untouched). */
  function exportReminderJson() {
    const draft = readReminderFromStorage();
    if (!draft) {
      setReminderAvailable(false);
      setReminderBanner(false);
      setReminderSavedAt(null);
      setReminderSlotFingerprint(null);
      setReminderHint("No saved reminder prefs in this browser — Save reminder first.");
      return;
    }
    const body = `${JSON.stringify(draft, null, 2)}\n`;
    try {
      const blob = new Blob([body], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "omnipay-reminder-prefs.json";
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      const fp = fingerprintReminder(draft);
      setReminderAvailable(true);
      setReminderSavedAt(draft.savedAt);
      setReminderSlotFingerprint(fp);
      setReminderExported(true);
      setReminderLinkCopied(false);
      setReminderLinkPasted(false);
      setReminderImported(false);
      setReminderVerifyStatus("idle");
      setReminderDiffLines([]);
      window.setTimeout(() => setReminderExported(false), 2000);
      setReminderHint(
        `Reminder JSON exported (FP ${fp}) — Import reminder on another browser to restore the slot. Form unchanged.`,
      );
      setSubmitHint(null);
    } catch {
      setReminderHint(
        "Export reminder failed — use Copy reminder link instead.",
      );
    }
  }

  /** Preview-only: write Save reminder slot from a #omn-reminder= paste (form untouched). */
  function applyPastedToReminderSlot(raw: string): boolean {
    const draft = extractReminderFromPaste(raw);
    if (!draft) {
      setReminderHint(
        "Paste reminder link failed — need a #omn-reminder= URL or Export reminder .json.",
      );
      return false;
    }
    try {
      window.localStorage.setItem(reminderStorageKey, JSON.stringify(draft));
    } catch {
      setReminderHint(
        "Paste reminder link failed — browser storage may be blocked in this preview.",
      );
      return false;
    }
    const fp = fingerprintReminder(draft);
    setReminderAvailable(true);
    setReminderSavedAt(draft.savedAt);
    setReminderSlotFingerprint(fp);
    setReminderBanner(false);
    setReminderLinkCopied(false);
    setReminderExported(false);
    setReminderLinkPasted(true);
    setReminderImported(false);
    setReminderVerifyStatus("idle");
    setReminderDiffLines([]);
    window.setTimeout(() => setReminderLinkPasted(false), 2000);
    setReminderHint(
      `Reminder prefs pasted from link (FP ${fp}) — form unchanged. Restore reminder to load into the form.`,
    );
    setSubmitHint(null);
    return true;
  }

  async function pasteReminderLinkFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        const field = pasteReminderInputRef.current?.value ?? "";
        if (field.trim() && applyPastedToReminderSlot(field)) {
          if (pasteReminderInputRef.current) {
            pasteReminderInputRef.current.value = "";
          }
          return;
        }
        setReminderHint(
          "Clipboard is empty — paste a #omn-reminder= link into the field, then Paste reminder link.",
        );
        pasteReminderInputRef.current?.focus();
        return;
      }
      if (!applyPastedToReminderSlot(text)) {
        pasteReminderInputRef.current?.focus();
      }
    } catch {
      const field = pasteReminderInputRef.current?.value ?? "";
      if (field.trim() && applyPastedToReminderSlot(field)) {
        if (pasteReminderInputRef.current) {
          pasteReminderInputRef.current.value = "";
        }
        return;
      }
      setReminderHint(
        "Clipboard read blocked — paste the #omn-reminder= link into the field, then Paste reminder link.",
      );
      pasteReminderInputRef.current?.focus();
    }
  }

  function openImportReminderPicker() {
    importReminderInputRef.current?.click();
  }

  /** Preview-only: compare a #omn-reminder= link to the Save reminder slot without applying. */
  function verifyReminderAgainstLink(raw: string): boolean {
    const slot = readReminderFromStorage();
    if (!slot) {
      setReminderAvailable(false);
      setReminderBanner(false);
      setReminderSavedAt(null);
      setReminderSlotFingerprint(null);
      setReminderVerifyStatus("invalid");
      setReminderVerifyAnchor("link");
      setReminderDiffLines([]);
      setReminderHint("No saved reminder prefs in this browser — Save reminder first.");
      return false;
    }
    const link = extractReminderFromPaste(raw);
    if (!link) {
      setReminderVerifyStatus("invalid");
      setReminderVerifyAnchor("link");
      setReminderDiffLines([]);
      setReminderHint(
        "Verify reminder vs link failed — need a #omn-reminder= URL/token (or paste into the field).",
      );
      return false;
    }
    const slotFp = fingerprintReminder(slot);
    const linkFp = fingerprintReminder(link);
    setReminderAvailable(true);
    setReminderSavedAt(slot.savedAt);
    setReminderSlotFingerprint(slotFp);
    setReminderVerifyAnchor("link");
    if (slotFp === linkFp) {
      setReminderVerifyStatus("match");
      setReminderDiffLines([]);
      setReminderHint(
        `Reminder link matches Save reminder (FP ${slotFp}) — form unchanged.`,
      );
    } else {
      const diffs = diffReminderFields(slot, link, "link", "slot");
      setReminderVerifyStatus("mismatch");
      setReminderDiffLines(diffs);
      setReminderHint(
        `Reminder link FP ${linkFp} ≠ Save reminder FP ${slotFp} — ${diffs.length} field${diffs.length === 1 ? "" : "s"} differ (see Diff). Paste reminder link would change the slot.`,
      );
    }
    setSubmitHint(null);
    return true;
  }

  /** Preview-only: list field diffs between Save reminder slot and a #omn-reminder= link. */
  function diffReminderAgainstLink(raw: string): boolean {
    const slot = readReminderFromStorage();
    if (!slot) {
      setReminderAvailable(false);
      setReminderBanner(false);
      setReminderSavedAt(null);
      setReminderSlotFingerprint(null);
      setReminderVerifyStatus("invalid");
      setReminderVerifyAnchor("link");
      setReminderDiffLines([]);
      setReminderHint("No saved reminder prefs in this browser — Save reminder first.");
      return false;
    }
    const link = extractReminderFromPaste(raw);
    if (!link) {
      setReminderVerifyStatus("invalid");
      setReminderVerifyAnchor("link");
      setReminderDiffLines([]);
      setReminderHint(
        "Diff reminder vs link failed — need a #omn-reminder= URL/token (or paste into the field).",
      );
      return false;
    }
    const slotFp = fingerprintReminder(slot);
    const linkFp = fingerprintReminder(link);
    setReminderAvailable(true);
    setReminderSavedAt(slot.savedAt);
    setReminderSlotFingerprint(slotFp);
    setReminderVerifyAnchor("link");
    if (slotFp === linkFp) {
      setReminderVerifyStatus("match");
      setReminderDiffLines([]);
      setReminderHint(
        `No field diffs — reminder link matches Save reminder (FP ${slotFp}).`,
      );
    } else {
      const diffs = diffReminderFields(slot, link, "link", "slot");
      setReminderVerifyStatus("mismatch");
      setReminderDiffLines(diffs);
      setReminderHint(
        `Diff reminder vs link: ${diffs.length} field${diffs.length === 1 ? "" : "s"} differ (link FP ${linkFp} ≠ Save reminder FP ${slotFp}). Form untouched.`,
      );
    }
    setSubmitHint(null);
    return true;
  }

  /** Preview-only: compare live reminder form to the Save reminder slot without writing. */
  function verifyReminderVsForm() {
    const slot = readReminderFromStorage();
    if (!slot) {
      setReminderAvailable(false);
      setReminderBanner(false);
      setReminderSavedAt(null);
      setReminderSlotFingerprint(null);
      setReminderVerifyStatus("invalid");
      setReminderVerifyAnchor("form");
      setReminderDiffLines([]);
      setReminderHint("No saved reminder prefs in this browser — Save reminder first.");
      return;
    }
    const form = buildReminderPayload();
    const formFp = fingerprintReminder(form);
    const slotFp = fingerprintReminder(slot);
    setReminderAvailable(true);
    setReminderSavedAt(slot.savedAt);
    setReminderSlotFingerprint(slotFp);
    setReminderVerifyAnchor("form");
    if (formFp === slotFp) {
      setReminderVerifyStatus("match");
      setReminderDiffLines([]);
      setReminderHint(
        `Form matches Save reminder (FP ${slotFp}) — nothing to restore.`,
      );
    } else {
      const diffs = diffReminderFields(form, slot, "slot", "form");
      setReminderVerifyStatus("mismatch");
      setReminderDiffLines(diffs);
      setReminderHint(
        `Form FP ${formFp} ≠ Save reminder FP ${slotFp} — ${diffs.length} field${diffs.length === 1 ? "" : "s"} differ (see Diff). Restore reminder to load saved prefs.`,
      );
    }
    setSubmitHint(null);
  }

  /** Preview-only: list field diffs between live reminder form and Save reminder slot. */
  function diffReminderVsForm() {
    const slot = readReminderFromStorage();
    if (!slot) {
      setReminderAvailable(false);
      setReminderBanner(false);
      setReminderSavedAt(null);
      setReminderSlotFingerprint(null);
      setReminderVerifyStatus("invalid");
      setReminderVerifyAnchor("form");
      setReminderDiffLines([]);
      setReminderHint("No saved reminder prefs in this browser — Save reminder first.");
      return;
    }
    const form = buildReminderPayload();
    const formFp = fingerprintReminder(form);
    const slotFp = fingerprintReminder(slot);
    setReminderAvailable(true);
    setReminderSavedAt(slot.savedAt);
    setReminderSlotFingerprint(slotFp);
    setReminderVerifyAnchor("form");
    if (formFp === slotFp) {
      setReminderVerifyStatus("match");
      setReminderDiffLines([]);
      setReminderHint(
        `No field diffs — form matches Save reminder (FP ${slotFp}).`,
      );
    } else {
      const diffs = diffReminderFields(form, slot, "slot", "form");
      setReminderVerifyStatus("mismatch");
      setReminderDiffLines(diffs);
      setReminderHint(
        `Diff reminder vs form: ${diffs.length} field${diffs.length === 1 ? "" : "s"} differ (form FP ${formFp} ≠ Save reminder FP ${slotFp}). Restore reminder to load saved prefs.`,
      );
    }
    setSubmitHint(null);
  }

  /** Preview-only: swap live reminder form ↔ Save reminder slot. */
  function swapReminderForm() {
    const slot = readReminderFromStorage();
    if (!slot) {
      setReminderAvailable(false);
      setReminderBanner(false);
      setReminderSavedAt(null);
      setReminderSlotFingerprint(null);
      setReminderHint("No saved reminder prefs in this browser — Save reminder first.");
      return;
    }
    const current = buildReminderPayload();
    const currentFp = fingerprintReminder(current);
    const slotFp = fingerprintReminder(slot);
    const nextSlot: ReminderDraftV1 = {
      ...current,
      savedAt: new Date().toISOString(),
    };
    const nextSlotFp = fingerprintReminder(nextSlot);
    try {
      window.localStorage.setItem(reminderStorageKey, JSON.stringify(nextSlot));
    } catch {
      setReminderHint(
        "Swap reminder ↔ form failed — browser storage may be blocked in this preview.",
      );
      return;
    }
    applyReminder(slot);
    setReminderAvailable(true);
    setReminderBanner(false);
    setReminderSavedAt(nextSlot.savedAt);
    setReminderSlotFingerprint(nextSlotFp);
    setReminderFormSwapped(true);
    setReminderFormCleared(false);
    window.setTimeout(() => setReminderFormSwapped(false), 2000);
    setReminderVerifyStatus("idle");
    setReminderDiffLines([]);
    setReminderHint(
      `Swapped reminder ↔ form (form was FP ${currentFp} → now FP ${slotFp}; Save reminder holds previous form, FP ${nextSlotFp}). Clear form resets the form while keeping the slot.`,
    );
    setSubmitHint(null);
  }

  async function verifyReminderVsLinkFromClipboard() {
    const slot = readReminderFromStorage();
    if (!slot) {
      setReminderAvailable(false);
      setReminderBanner(false);
      setReminderSavedAt(null);
      setReminderSlotFingerprint(null);
      setReminderHint("No saved reminder prefs in this browser — Save reminder first.");
      return;
    }
    setReminderSlotFingerprint(fingerprintReminder(slot));
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        const field = pasteReminderInputRef.current?.value ?? "";
        if (field.trim() && verifyReminderAgainstLink(field)) {
          return;
        }
        setReminderVerifyStatus("invalid");
        setReminderDiffLines([]);
        setReminderHint(
          "Clipboard is empty — paste a #omn-reminder= link into the field, then Verify reminder vs link.",
        );
        pasteReminderInputRef.current?.focus();
        return;
      }
      if (!verifyReminderAgainstLink(text)) {
        pasteReminderInputRef.current?.focus();
      }
    } catch {
      const field = pasteReminderInputRef.current?.value ?? "";
      if (field.trim()) {
        verifyReminderAgainstLink(field);
        return;
      }
      setReminderVerifyStatus("invalid");
      setReminderDiffLines([]);
      setReminderHint(
        "Clipboard read blocked — paste the #omn-reminder= link into the field, then Verify reminder vs link.",
      );
      pasteReminderInputRef.current?.focus();
    }
  }

  async function diffReminderVsLinkFromClipboard() {
    const slot = readReminderFromStorage();
    if (!slot) {
      setReminderAvailable(false);
      setReminderBanner(false);
      setReminderSavedAt(null);
      setReminderSlotFingerprint(null);
      setReminderHint("No saved reminder prefs in this browser — Save reminder first.");
      return;
    }
    setReminderSlotFingerprint(fingerprintReminder(slot));
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        const field = pasteReminderInputRef.current?.value ?? "";
        if (field.trim() && diffReminderAgainstLink(field)) {
          return;
        }
        setReminderVerifyStatus("invalid");
        setReminderDiffLines([]);
        setReminderHint(
          "Clipboard is empty — paste a #omn-reminder= link into the field, then Diff reminder vs link.",
        );
        pasteReminderInputRef.current?.focus();
        return;
      }
      if (!diffReminderAgainstLink(text)) {
        pasteReminderInputRef.current?.focus();
      }
    } catch {
      const field = pasteReminderInputRef.current?.value ?? "";
      if (field.trim()) {
        diffReminderAgainstLink(field);
        return;
      }
      setReminderVerifyStatus("invalid");
      setReminderDiffLines([]);
      setReminderHint(
        "Clipboard read blocked — paste the #omn-reminder= link into the field, then Diff reminder vs link.",
      );
      pasteReminderInputRef.current?.focus();
    }
  }

  function onImportReminderFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text =
          typeof reader.result === "string" ? reader.result : "";
        const draft = parseReminderDraft(JSON.parse(text));
        if (!draft) {
          setReminderHint(
            "Import reminder failed — file is not a valid Omnipay preview reminder v1.",
          );
          return;
        }
        try {
          window.localStorage.setItem(
            reminderStorageKey,
            JSON.stringify(draft),
          );
        } catch {
          setReminderHint(
            "Import reminder failed — browser storage may be blocked in this preview.",
          );
          return;
        }
        const fp = fingerprintReminder(draft);
        setReminderAvailable(true);
        setReminderSavedAt(draft.savedAt);
        setReminderSlotFingerprint(fp);
        setReminderBanner(false);
        setReminderLinkCopied(false);
        setReminderExported(false);
        setReminderLinkPasted(false);
        setReminderImported(true);
        setReminderVerifyStatus("idle");
        setReminderDiffLines([]);
        window.setTimeout(() => setReminderImported(false), 2000);
        setReminderHint(
          `Reminder prefs imported (FP ${fp}) — form unchanged. Restore reminder to load into the form.`,
        );
        setSubmitHint(null);
      } catch {
        setReminderHint(
          "Import reminder failed — choose a .json exported from Export reminder.",
        );
      }
    };
    reader.onerror = () => {
      setReminderHint("Import reminder failed — could not read that file.");
    };
    reader.readAsText(file);
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
      <ul
        className="mt-3 flex flex-wrap gap-2 text-xs"
        aria-label="Reminder fingerprint chips"
      >
        <li className="rounded-full border border-[var(--line)] bg-white px-2.5 py-1 font-mono text-[var(--foreground)]">
          Form FP {reminderFormFingerprint}
        </li>
        <li
          className={`rounded-full border border-[var(--line)] px-2.5 py-1 font-mono ${
            reminderSlotFingerprint
              ? "bg-[var(--accent)]/10 text-[var(--foreground)]"
              : "bg-[#f7f9fc] text-[var(--muted)]"
          }`}
        >
          Slot FP {reminderSlotFingerprint ?? "none"}
        </li>
      </ul>
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
        <button
          type="button"
          onClick={clearForm}
          className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40"
        >
          {reminderFormCleared ? "Form cleared" : "Clear form"}
        </button>
        <button
          type="button"
          onClick={() => {
            void copyReminderFormFp();
          }}
          className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40"
        >
          {reminderFpCopied ? "Form FP copied" : "Copy form FP"}
        </button>
        {reminderAvailable ? (
          <button
            type="button"
            onClick={() => {
              void copyReminderLink();
            }}
            className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40"
          >
            {reminderLinkCopied ? "Reminder link copied" : "Copy reminder link"}
          </button>
        ) : null}
        {reminderAvailable ? (
          <button
            type="button"
            onClick={exportReminderJson}
            className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40"
          >
            {reminderExported ? "Reminder exported" : "Export reminder"}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => {
            void pasteReminderLinkFromClipboard();
          }}
          className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40"
        >
          {reminderLinkPasted ? "Reminder link pasted" : "Paste reminder link"}
        </button>
        <button
          type="button"
          onClick={openImportReminderPicker}
          className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40"
        >
          {reminderImported ? "Reminder imported" : "Import reminder"}
        </button>
        {reminderAvailable ? (
          <button
            type="button"
            onClick={() => {
              void verifyReminderVsLinkFromClipboard();
            }}
            className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40"
          >
            {reminderVerifyAnchor === "link" && reminderVerifyStatus === "match"
              ? "Reminder=link match"
              : reminderVerifyAnchor === "link" &&
                  reminderVerifyStatus === "mismatch"
                ? "Reminder≠link"
                : "Verify reminder vs link"}
          </button>
        ) : null}
        {reminderAvailable ? (
          <button
            type="button"
            onClick={() => {
              void diffReminderVsLinkFromClipboard();
            }}
            className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40"
          >
            {reminderVerifyAnchor === "link" &&
            reminderDiffLines.length > 0 &&
            reminderVerifyStatus === "mismatch"
              ? `Diff reminder/link (${reminderDiffLines.length})`
              : "Diff reminder vs link"}
          </button>
        ) : null}
        {reminderAvailable ? (
          <button
            type="button"
            onClick={verifyReminderVsForm}
            className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40"
          >
            {reminderVerifyAnchor === "form" && reminderVerifyStatus === "match"
              ? "Reminder=form match"
              : reminderVerifyAnchor === "form" &&
                  reminderVerifyStatus === "mismatch"
                ? "Reminder≠form"
                : "Verify reminder vs form"}
          </button>
        ) : null}
        {reminderAvailable ? (
          <button
            type="button"
            onClick={diffReminderVsForm}
            className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40"
          >
            {reminderVerifyAnchor === "form" &&
            reminderDiffLines.length > 0 &&
            reminderVerifyStatus === "mismatch"
              ? `Diff reminder/form (${reminderDiffLines.length})`
              : "Diff reminder vs form"}
          </button>
        ) : null}
        {reminderAvailable ? (
          <button
            type="button"
            onClick={swapReminderForm}
            className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40"
          >
            {reminderFormSwapped ? "Reminder ↔ form ✓" : "Swap reminder ↔ form"}
          </button>
        ) : null}
        <input
          ref={pasteReminderInputRef}
          type="text"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder="#omn-reminder=… or full URL"
          aria-label="Paste reminder link"
          onPaste={(event) => {
            const text = event.clipboardData.getData("text");
            if (!text.trim()) return;
            event.preventDefault();
            if (applyPastedToReminderSlot(text)) {
              event.currentTarget.value = "";
            }
          }}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            const value = event.currentTarget.value;
            if (applyPastedToReminderSlot(value)) {
              event.currentTarget.value = "";
            }
          }}
          className="min-w-[12rem] flex-1 rounded-lg border border-[var(--line)] bg-white px-2.5 py-1 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none transition focus:border-[var(--accent)]"
        />
        <input
          ref={importReminderInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          aria-hidden
          tabIndex={-1}
          onChange={onImportReminderFile}
        />
      </p>
      {reminderDiffLines.length > 0 && reminderVerifyStatus === "mismatch" ? (
        <ul
          className="mt-2 max-h-40 list-disc space-y-1 overflow-y-auto rounded-lg border border-amber-300/50 bg-amber-50 px-4 py-2 text-xs text-amber-900"
          aria-label="Reminder field diffs"
        >
          {reminderDiffLines.slice(0, 12).map((line) => (
            <li key={line}>{line}</li>
          ))}
          {reminderDiffLines.length > 12 ? (
            <li>+{reminderDiffLines.length - 12} more fields</li>
          ) : null}
        </ul>
      ) : null}
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
