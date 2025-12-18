# Linkbrain UI — Claude Code Instructions

Follow `Linkbrain UI/AGENTS.md` as the source of truth.

Non‑negotiables:
- Preserve design system consistency (layout, spacing, typography, colors).
- Ship UX-complete states: loading / empty / error / success.
- Use existing shadcn/Radix components in `src/components/ui` before inventing new ones.
- For modals/overlays: prefer Portal-based Radix/shadcn; fix stacking context/overflow before increasing z-index.
- If a screenshot is provided for a UI issue, treat it as ground truth and debug parents/stacking/overflow holistically.
- After implementing a request (e.g. i18n), do a quick “intent sweep” to catch adjacent missing spots.
- Never leak or log secrets from `.env*`; keep secret operations in `api/*`.
