import { useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { getAudioSettings, setAudioSettings } from "../../stores/audioSettings";
import { cn } from "@/lib/utils";
import { FaMicrophone, FaMicrophoneSlash, FaCheck } from "react-icons/fa";
import styles from "./LaunchWindow.module.css";

// ============================================
// Types
// ============================================

interface MicrophoneSelectorProps {
  /** Disable the selector (e.g., during recording) */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** List of available audio input devices */
  devices: MediaDeviceInfo[];
  /** Currently selected device ID */
  selectedDeviceId: string | null;
  /** Select a specific device by ID */
  selectDevice: (deviceId: string) => Promise<void>;
  /** Audio level 0-100, updated at ~60fps */
  audioLevel: number;
  /** Whether microphone is currently enabled */
  isEnabled: boolean;
  /** Enable microphone with default/first device */
  enable: () => Promise<void>;
  /** Disable microphone and stop stream */
  disable: () => void;
  /** Current error, if any */
  error: Error | null;
  /** Current permission state */
  permissionState: 'granted' | 'denied' | 'prompt' | 'unknown';
}

// ============================================
// Component
// ============================================

export function MicrophoneSelector({
  disabled = false,
  className,
  devices,
  selectedDeviceId,
  selectDevice,
  audioLevel,
  isEnabled,
  enable,
  disable,
  error,
  permissionState,
}: MicrophoneSelectorProps) {
  // Restore settings from localStorage on mount
  useEffect(() => {
    const savedSettings = getAudioSettings();
    
    if (savedSettings.enabled && savedSettings.deviceId) {
      // Attempt to restore the previously selected device
      selectDevice(savedSettings.deviceId).catch(() => {
        // If the saved device is no longer available, try enabling with default
        if (savedSettings.enabled) {
          enable().catch(console.error);
        }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist settings when they change
  useEffect(() => {
    setAudioSettings({
      deviceId: selectedDeviceId,
      enabled: isEnabled,
    });
  }, [selectedDeviceId, isEnabled]);

  // Handle device selection
  const handleDeviceSelect = useCallback(async (deviceId: string) => {
    await selectDevice(deviceId);
  }, [selectDevice]);

  // Handle mute toggle
  const handleMuteToggle = useCallback(() => {
    if (isEnabled) {
      disable();
    } else {
      enable().catch(console.error);
    }
  }, [isEnabled, enable, disable]);

  // Determine icon and state
  const hasDevices = devices.length > 0;
  const noMicrophoneDetected = !hasDevices || permissionState === 'denied';
  
  // Get icon based on state
  const getIcon = () => {
    if (noMicrophoneDetected || !isEnabled) {
      return <FaMicrophoneSlash size={14} className="text-zinc-400" />;
    }
    return <FaMicrophone size={14} className="text-white" />;
  };

  // Get tooltip text
  const getTooltip = () => {
    if (permissionState === 'denied') {
      return "Microphone permission denied";
    }
    if (!hasDevices) {
      return "No microphone detected";
    }
    if (error) {
      return error.message;
    }
    return isEnabled ? "Microphone enabled" : "Microphone disabled";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className={cn(
            "gap-1 text-white bg-transparent hover:bg-transparent px-0 text-xs",
            styles.electronNoDrag,
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled || noMicrophoneDetected}
          title={getTooltip()}
        >
          {getIcon()}
          <span className={cn(
            "hidden sm:inline",
            !isEnabled && "text-zinc-400"
          )}>
            Mic
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="center"
        sideOffset={12}
        className={cn(
          "w-64 p-0 border-0 overflow-hidden",
          styles.electronNoDrag
        )}
        style={{
          background: 'linear-gradient(135deg, rgba(30,30,40,0.95) 0%, rgba(20,20,30,0.92) 100%)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.4), 0 2px 8px 0 rgba(0,0,0,0.2)',
          border: '1px solid rgba(80,80,120,0.25)',
          borderRadius: 12,
        }}
      >
        {/* Header */}
        <div className="px-3 py-2.5 border-b border-white/10">
          <div className="flex items-center gap-2 text-white text-sm font-medium">
            <FaMicrophone size={12} className="text-white/70" />
            <span>Microphone</span>
          </div>
        </div>

        {/* Device List */}
        <div className="px-1.5 py-1.5 max-h-40 overflow-y-auto">
          {devices.length === 0 ? (
            <div className="px-2.5 py-3 text-center text-zinc-400 text-xs">
              No microphones found
            </div>
          ) : (
            devices.map((device) => (
              <button
                key={device.deviceId}
                onClick={() => handleDeviceSelect(device.deviceId)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors",
                  "hover:bg-white/5",
                  selectedDeviceId === device.deviceId && "bg-white/10"
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center",
                  selectedDeviceId === device.deviceId
                    ? "border-emerald-400 bg-emerald-400"
                    : "border-zinc-500"
                )}>
                  {selectedDeviceId === device.deviceId && (
                    <FaCheck size={8} className="text-zinc-900" />
                  )}
                </div>
                <span className={cn(
                  "text-xs truncate flex-1",
                  selectedDeviceId === device.deviceId
                    ? "text-white"
                    : "text-zinc-300"
                )}>
                  {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Audio Level Meter */}
        {isEnabled && (
          <div className="px-3 py-2.5 border-t border-white/10">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-zinc-400">Level</span>
              <span className="text-xs text-zinc-500">{Math.round(audioLevel)}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-75",
                  audioLevel > 80 ? "bg-red-500" : 
                  audioLevel > 50 ? "bg-yellow-500" : 
                  "bg-emerald-400"
                )}
                style={{ width: `${audioLevel}%` }}
              />
            </div>
          </div>
        )}

        {/* Mute Toggle */}
        <div className="px-3 py-2.5 border-t border-white/10">
          <button
            onClick={handleMuteToggle}
            className="w-full flex items-center gap-2.5 py-1.5 text-left group"
          >
            <div className={cn(
              "flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
              !isEnabled
                ? "border-zinc-500 bg-zinc-700"
                : "border-zinc-600 bg-transparent"
            )}>
              {!isEnabled && (
                <FaCheck size={8} className="text-zinc-300" />
              )}
            </div>
            <span className="text-xs text-zinc-300 group-hover:text-white transition-colors">
              Mute microphone
            </span>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-3 py-2 bg-red-500/10 border-t border-red-500/20">
            <p className="text-xs text-red-400 truncate" title={error.message}>
              {error.message}
            </p>
          </div>
        )}

        {/* Permission Denied Warning */}
        {permissionState === 'denied' && (
          <div className="px-3 py-2 bg-amber-500/10 border-t border-amber-500/20">
            <p className="text-xs text-amber-400">
              Microphone access denied. Please enable in system settings.
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default MicrophoneSelector;
