# Change Log

## 2026-02-19
- Integrated PR #153 project save/load workflow into local `main` by cherry-picking `491db0a` and `bd50b19` from `yusufm/projectsave`.
- Resolved conflicts in `electron/ipc/handlers.ts` and `src/components/video-editor/VideoEditor.tsx` while keeping autosave settings and cursor telemetry zoom suggestions.
- Added follow-up fix commit `fix: restore default crop import in video editor` to satisfy TypeScript checks.
- Verification completed with `npm test` (23 passing) and `npx tsc --noEmit`.
