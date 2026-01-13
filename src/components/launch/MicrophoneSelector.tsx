import { useEffect, useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Switch } from "../ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { 
  getAudioSettings, 
  setAudioSettings,
  SAMPLE_RATE_OPTIONS,
  CHANNEL_COUNT_OPTIONS,
  type SampleRate,
  type ChannelCount,
} from "../../stores/audioSettings";
import { cn } from "@/lib/utils";
import { FaMicrophone, FaMicrophoneSlash, FaCheck } from "react-icons/fa";
import { ChevronDown, Settings } from "lucide-react";
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
  
  // Advanced Audio Settings
  /** Current sample rate */
  sampleRate: SampleRate;
  /** Callback when sample rate changes */
  onSampleRateChange: (rate: SampleRate) => void;
  /** Current channel count */
  channelCount: ChannelCount;
  /** Callback when channel count changes */
  onChannelCountChange: (count: ChannelCount) => void;
  /** Whether noise suppression is enabled */
  noiseSuppression: boolean;
  /** Callback when noise suppression changes */
  onNoiseSuppressionChange: (enabled: boolean) => void;
  /** Whether echo cancellation is enabled */
  echoCancellation: boolean;
  /** Callback when echo cancellation changes */
  onEchoCancellationChange: (enabled: boolean) => void;
  /** Whether auto gain control is enabled */
  autoGainControl: boolean;
  /** Callback when auto gain control changes */
  onAutoGainControlChange: (enabled: boolean) => void;
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
  // Advanced settings
  sampleRate,
  onSampleRateChange,
  channelCount,
  onChannelCountChange,
  noiseSuppression,
  onNoiseSuppressionChange,
  echoCancellation,
  onEchoCancellationChange,
  autoGainControl,
  onAutoGainControlChange,
}: MicrophoneSelectorProps) {
  // State for collapsible advanced settings
  const [showAdvanced, setShowAdvanced] = useState(false);
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

        {/* Advanced Settings Toggle */}
        <div className="px-3 py-2 border-t border-white/10">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between py-1 text-left group"
          >
            <div className="flex items-center gap-2">
              <Settings size={12} className="text-zinc-400" />
              <span className="text-xs text-zinc-300 group-hover:text-white transition-colors">
                Advanced Settings
              </span>
            </div>
            <ChevronDown 
              size={14} 
              className={cn(
                "text-zinc-400 transition-transform duration-200",
                showAdvanced && "rotate-180"
              )} 
            />
          </button>
        </div>

        {/* Advanced Settings Panel */}
        {showAdvanced && (
          <div className="px-3 py-2.5 border-t border-white/10 space-y-3">
            {/* Sample Rate */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Sample Rate</span>
              <Select 
                value={String(sampleRate)} 
                onValueChange={(v) => onSampleRateChange(Number(v) as SampleRate)}
              >
                <SelectTrigger className="w-24 h-7 text-xs bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SAMPLE_RATE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Channel Count */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Channels</span>
              <Select 
                value={String(channelCount)} 
                onValueChange={(v) => onChannelCountChange(Number(v) as ChannelCount)}
              >
                <SelectTrigger className="w-24 h-7 text-xs bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHANNEL_COUNT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Noise Suppression */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Noise Suppression</span>
              <Switch 
                checked={noiseSuppression} 
                onCheckedChange={onNoiseSuppressionChange}
                className="data-[state=checked]:bg-emerald-500 h-5 w-9"
              />
            </div>

            {/* Echo Cancellation */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Echo Cancellation</span>
              <Switch 
                checked={echoCancellation} 
                onCheckedChange={onEchoCancellationChange}
                className="data-[state=checked]:bg-emerald-500 h-5 w-9"
              />
            </div>

            {/* Auto Gain Control */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Auto Gain</span>
              <Switch 
                checked={autoGainControl} 
                onCheckedChange={onAutoGainControlChange}
                className="data-[state=checked]:bg-emerald-500 h-5 w-9"
              />
            </div>
          </div>
        )}

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
