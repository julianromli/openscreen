# Preset Feature Design

**Date:** 2026-01-11  
**Status:** Approved  
**Author:** Brainstorming session

---

## Overview

A preset system that lets users save, load, and manage video styling configurations with one-click application. Users can create unlimited custom presets and set one as the default that auto-applies to all new videos.

## Problem Statement

Currently, users must manually reconfigure padding, shadow, rounded corners, background image, and other styling settings every time they open a new video in the editor. This is repetitive and time-consuming for users who have a preferred style.

## Goals

- Enable users to save current settings as a named preset
- Allow one-click application of saved presets
- Support setting a default preset that auto-applies to new videos
- Provide full preset management (create, rename, delete, duplicate)

---

## Design Decisions

| Aspect       | Decision                                                  |
| ------------ | --------------------------------------------------------- |
| **Use Case**     | Quick recall - one-click to apply favorite style          |
| **Preset Count** | Unlimited custom presets + one default                    |
| **UI Location**  | Top of SettingsPanel (dropdown + save button)             |
| **Actions**      | Create, Select, Rename, Delete, Duplicate, Set as Default |
| **Storage**      | Electron Store (JSON file in app data folder)             |
| **Save Flow**    | Modal dialog for naming                                   |

---

## Data Structure

### Preset Interface

```typescript
interface Preset {
  id: string;              // Unique identifier (uuid)
  name: string;            // User-defined name
  createdAt: number;       // Timestamp for sorting
  isDefault: boolean;      // Only one preset can be default
  
  settings: {
    padding: number;           // 0-100
    shadowIntensity: number;   // 0-1
    borderRadius: number;      // 0-16
    motionBlurEnabled: boolean;
    showBlur: boolean;
    wallpaper: string;         // Image path, color hex, or gradient CSS
  }
}
```

### Settings Scope

**Included:**
- `padding` (0-100%)
- `shadowIntensity` (0-1)
- `borderRadius` (0-16px)
- `motionBlurEnabled` (boolean)
- `showBlur` (boolean)
- `wallpaper` (image/color/gradient string)

**Excluded (intentionally):**
- `cropRegion` - Video-specific, not a style
- `zoomRegions`, `trimRegions`, `annotations` - Timeline edits, not presets
- `aspectRatio`, `exportQuality` - Export settings, not visual style

---

## Storage

### Location

Presets stored in user's app data folder:
- Windows: `%APPDATA%/openscreen/presets.json`
- macOS: `~/Library/Application Support/openscreen/presets.json`
- Linux: `~/.config/openscreen/presets.json`

### File Structure

```json
{
  "version": 1,
  "defaultPresetId": "uuid-of-default-preset",
  "presets": [
    {
      "id": "abc-123",
      "name": "My Clean Style",
      "createdAt": 1736582400000,
      "isDefault": true,
      "settings": {
        "padding": 50,
        "shadowIntensity": 0.3,
        "borderRadius": 8,
        "motionBlurEnabled": true,
        "showBlur": false,
        "wallpaper": "wallpapers/wallpaper5.jpg"
      }
    }
  ]
}
```

---

## UI Design

### Layout

Located at top of `SettingsPanel.tsx`, before "Zoom Level" section:

```
┌─────────────────────────────────────────┐
│  Presets                                │
│  ┌─────────────────────┐  ┌──────────┐  │
│  │ Select preset...  ▼ │  │ + Save   │  │
│  └─────────────────────┘  └──────────┘  │
└─────────────────────────────────────────┘
```

### Dropdown Menu Contents

```
┌─────────────────────────────┐
│ ★ My Clean Style (Default)  │  ← Star icon for default
│   Minimal Look              │
│   Bold & Colorful           │
├─────────────────────────────┤
│   Reset to defaults         │  ← Resets to app defaults
└─────────────────────────────┘
```

### Preset Item Actions (on hover/right-click)

- Rename
- Duplicate
- Set as Default / Unset Default
- Delete

### Save Preset Modal

```
┌────────────────────────────────────┐
│  Save as Preset               [X]  │
├────────────────────────────────────┤
│  Name:                             │
│  ┌──────────────────────────────┐  │
│  │ My New Preset                │  │
│  └──────────────────────────────┘  │
│                                    │
│  [ ] Set as default preset         │
│                                    │
│         [Cancel]  [Save]           │
└────────────────────────────────────┘
```

---

## File Structure

### New Files

```
src/
├── components/video-editor/
│   ├── PresetSelector.tsx      # Dropdown + Save button component
│   └── SavePresetModal.tsx     # Modal dialog for naming presets
├── hooks/
│   └── usePresets.ts           # React hook for preset state & operations
electron/
├── presets.ts                  # Electron-side preset file operations
```

### Modified Files

| File                                          | Changes                                 |
| --------------------------------------------- | --------------------------------------- |
| `electron/main.ts`                            | Add IPC handlers for preset operations  |
| `electron/preload.ts`                         | Expose preset API to renderer           |
| `src/components/video-editor/VideoEditor.tsx` | Add preset state, load default on mount |
| `src/components/video-editor/SettingsPanel.tsx` | Add PresetSelector at top             |
| `src/components/video-editor/types.ts`        | Add Preset interface                    |

---

## Data Flow

### On App Start (VideoEditor mount)

1. VideoEditor mounts
2. Call `electronAPI.getPresets()`
3. Find preset where `isDefault === true`
4. If found → Apply `preset.settings` to state
5. If not found → Use current hardcoded defaults

### On Preset Select

1. User selects preset from dropdown
2. Apply `preset.settings` to all relevant state:
   - `setPadding(preset.settings.padding)`
   - `setShadowIntensity(preset.settings.shadowIntensity)`
   - `setBorderRadius(preset.settings.borderRadius)`
   - `setMotionBlurEnabled(preset.settings.motionBlurEnabled)`
   - `setShowBlur(preset.settings.showBlur)`
   - `setWallpaper(preset.settings.wallpaper)`
3. Show toast: "Applied preset: {name}"

### On Save Preset

1. User clicks "Save" button → Opens modal
2. User enters name, optionally checks "Set as default"
3. On confirm:
   - Collect current settings from state
   - Call `electronAPI.savePreset({ name, settings, isDefault })`
   - If `isDefault`, unset previous default
   - Refresh presets list
   - Show toast: "Preset saved: {name}"

### On Delete/Rename/Duplicate

- **Delete:** Confirm dialog → `electronAPI.deletePreset(id)`
- **Rename:** Inline edit or modal → `electronAPI.updatePreset(id, { name })`
- **Duplicate:** `electronAPI.savePreset({ ...existing, name: "Copy of X" })`
- **Set as Default:** `electronAPI.setDefaultPreset(id)`

---

## Edge Cases & Error Handling

| Scenario                      | Handling                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------ |
| No presets exist              | Dropdown shows "No presets yet" placeholder, only "Save" button is actionable |
| Default preset deleted        | Clear `defaultPresetId`, next video opens with hardcoded defaults              |
| Wallpaper path invalid        | On apply, if wallpaper file doesn't exist, fallback to first default wallpaper |
| Corrupt presets.json          | Catch parse error, backup corrupt file, start fresh with empty presets         |
| Duplicate preset name         | Allow it (names don't need to be unique, we use UUID for identity)             |
| Very long preset name         | Truncate display in dropdown (max ~25 chars with ellipsis)                     |
| Preset file permissions error | Show toast error, presets work in-memory only for that session                 |

## Future Considerations

- `version: 1` in JSON allows future schema migrations
- If new settings are added later, old presets apply what they have, new settings use defaults
- Potential for preset import/export feature in the future
- Potential for community preset sharing

---

## Implementation Order

1. **Types & Interfaces** - Add Preset types to `types.ts`
2. **Electron Backend** - Create `electron/presets.ts` with file operations
3. **IPC Handlers** - Add handlers in `main.ts` and expose in `preload.ts`
4. **React Hook** - Create `usePresets.ts` for state management
5. **UI Components** - Build `PresetSelector.tsx` and `SavePresetModal.tsx`
6. **Integration** - Wire up to `SettingsPanel.tsx` and `VideoEditor.tsx`
7. **Testing** - Manual testing of all CRUD operations and edge cases
