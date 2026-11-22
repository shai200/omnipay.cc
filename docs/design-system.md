# OmniPurchase design system

OmniPurchase is the product; OmniPay.cc is the parent company. All UI is built from the tokens and primitives below. Pages never use raw hex colors except for always-dark bands and brand marks.

## Tokens (`app/globals.css`)

| Group | Tokens | Notes |
| --- | --- | --- |
| Surfaces | `bg`, `surface`, `surface-2`, `surface-inverse`, `border`, `border-strong` | Light and dark values under `:root` and `[data-theme="dark"]`. |
| Text | `fg`, `fg-muted`, `fg-subtle`, `fg-inverse` | All are at least 4.9:1 on every surface (WCAG AA). |
| Brand | `brand`, `brand-hover`, `brand-fg`, `brand-soft`, `brand-soft-fg` | Indigo. `brand-fg` on `brand` is 7.9:1 (light) and 7.1:1 (dark). |
| Status | `success`, `warning`, `danger`, `info`, plus `-soft` backgrounds | Used by `Badge` and `Alert`. |
| Radius | `sm` 8px · `md` 12px · `lg` 16px · `xl` 24px | |
| Elevation | `shadow-xs` … `shadow-lg` | Softer, deeper shadows in dark mode. |
| Type | Geist Sans / Geist Mono | Display 40–60px with -0.035em tracking; body 15–18px; tabular numbers through `.tabular`. |
| Motion | `animate-fade-up`, `animate-fade-in`, `ease-out-soft` | 150–600ms. Turned off under `prefers-reduced-motion`. |

Tailwind exposes the tokens directly: `bg-surface`, `text-fg-muted`, `border-border`, `bg-brand`, `text-success` and so on. The `dark:` variant follows `data-theme`.

## Components (`app/components/ui`)

`Button` / `ButtonLink` (primary, secondary, outline, ghost, danger, onDark, onDarkOutline; sizes sm/md/lg; minimum 40–52px touch targets), `Card` + `CardHeader`, `Badge`, `Alert` (role=alert for errors, status otherwise), `Spinner`, `TextField`, `PasswordField`, `SelectField`, `Checkbox`, `RadioCard`, `Container`, `SectionHeading`, `Logo`, and an inline SVG icon set.

Every field renders a real `<label for>`, wires hints and errors through `aria-describedby`, and sets `aria-invalid`.

## Layout

- `PageShell`: sticky blurred header, skip link target, footer.
- `AppPage`: signed-in pages. Redirects to sign-in with `?next=`, waits for the profile, and shows a retry state if it fails to load.
- `AuthLayout`: split brand panel and form.
- `LegalLayout` + `.legal-prose`: styles legal markup without touching the copy.

## Content rules

- No testimonials, user counts, press logos or statistics unless they are real and sourced.
- No promises about returns and nothing that reads as financial advice. Alerts are "informational only".
- Do not edit legal or compliance copy (Terms, Privacy, Business Info, the copyright line, support emails, KYC wording).
