/**
 * Audio Settings Store
 * 
 * Persistence layer for microphone settings that survives app restarts.
 * Uses localStorage for browser/Electron renderer process storage.
 */

// ============================================
// Types
// ============================================

export interface AudioSettings {
  deviceId: string | null;
  enabled: boolean;
}

// ============================================
// Constants
// ============================================

export const STORAGE_KEY = 'openscreen:audioSettings';

export const DEFAULT_SETTINGS: AudioSettings = {
  deviceId: null,
  enabled: false,
};

// ============================================
// Helper Functions
// ============================================

/**
 * Safely access localStorage
 * Returns null if localStorage is unavailable
 */
function getLocalStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    // localStorage may be unavailable (e.g., in some security contexts)
    return null;
  }
}

/**
 * Safely parse JSON with fallback to default
 */
function safeParseJSON(json: string | null): Partial<AudioSettings> | null {
  if (!json) return null;
  
  try {
    const parsed = JSON.parse(json);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
    return null;
  } catch {
    // Invalid JSON, return null
    return null;
  }
}

// ============================================
// API Functions
// ============================================

/**
 * Get current audio settings from localStorage
 * Returns default settings if not found or on error
 */
export function getAudioSettings(): AudioSettings {
  const storage = getLocalStorage();
  if (!storage) {
    return { ...DEFAULT_SETTINGS };
  }

  try {
    const stored = storage.getItem(STORAGE_KEY);
    const parsed = safeParseJSON(stored);
    
    if (!parsed) {
      return { ...DEFAULT_SETTINGS };
    }

    // Merge with defaults to ensure all properties exist
    return {
      deviceId: parsed.deviceId !== undefined ? parsed.deviceId : DEFAULT_SETTINGS.deviceId,
      enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : DEFAULT_SETTINGS.enabled,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Save audio settings to localStorage
 * Supports partial updates - merges with existing settings
 */
export function setAudioSettings(settings: Partial<AudioSettings>): void {
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }

  try {
    const current = getAudioSettings();
    const updated: AudioSettings = {
      ...current,
      ...settings,
    };
    
    storage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is full or unavailable
  }
}

/**
 * Clear audio settings from localStorage
 */
export function clearAudioSettings(): void {
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}
