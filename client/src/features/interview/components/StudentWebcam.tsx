import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Mic, User } from 'lucide-react';

interface StudentWebcamProps {
  candidateName?: string;
  isListening: boolean;
}

export const StudentWebcam: React.FC<StudentWebcamProps> = ({
  candidateName = 'Candidate (You)',
  isListening,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      if (!isVideoEnabled) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        return;
      }

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (isMounted) {
            setHasPermission(false);
            setPermissionError('Webcam not supported in this browser environment.');
          }
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
          audio: false,
        });

        if (isMounted) {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasPermission(true);
          setPermissionError(null);
        }
      } catch (err: any) {
        console.warn('Webcam access was denied or unavailable:', err);
        if (isMounted) {
          setHasPermission(false);
          setPermissionError(
            err.name === 'NotAllowedError'
              ? 'Camera permission denied.'
              : 'Camera unavailable or disconnected.'
          );
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoEnabled]);

  const toggleVideo = () => {
    setIsVideoEnabled((prev) => !prev);
  };

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 border transition-all duration-300 flex flex-col items-center justify-center ${
        isListening
          ? 'border-rose-500/80 ring-2 ring-rose-500/40 shadow-lg shadow-rose-500/20'
          : 'border-slate-800'
      }`}
    >
      {/* Live Video Feed */}
      {isVideoEnabled && hasPermission ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        /* Camera Off / Denied Professional Placeholder */
        <div className="flex flex-col items-center justify-center space-y-2 p-4 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
            <User className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300">{candidateName}</p>
            <p className="text-[10px] text-slate-500">
              {permissionError || 'Camera Off'}
            </p>
          </div>
        </div>
      )}

      {/* Top Overlay: Candidate Name & Live Recording Status */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
        <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur border border-slate-800 text-[10px] font-semibold text-slate-200">
          {candidateName}
        </span>

        {/* Audio Recording Indicator */}
        {isListening ? (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/90 text-white text-[10px] font-bold shadow-md animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>Recording Voice...</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-900/70 backdrop-blur border border-slate-800 text-[9px] text-slate-400">
            <Mic className="w-2.5 h-2.5 text-emerald-400" />
            <span>Mic Ready</span>
          </div>
        )}
      </div>

      {/* Soundwaves Overlay when Speaking */}
      {isListening && (
        <div className="absolute bottom-10 inset-x-0 flex items-center justify-center gap-1 pointer-events-none z-10">
          {[40, 75, 100, 60, 90, 45, 80].map((height, i) => (
            <span
              key={i}
              className="w-1 bg-rose-400 rounded-full animate-pulse shadow-sm"
              style={{
                height: `${height * 0.28}px`,
                animationDelay: `${i * 120}ms`,
                animationDuration: '600ms',
              }}
            />
          ))}
        </div>
      )}

      {/* Bottom Overlay: Controls */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-10">
        <button
          type="button"
          onClick={toggleVideo}
          className={`p-1.5 rounded-lg border backdrop-blur text-xs transition ${
            isVideoEnabled
              ? 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
              : 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
          }`}
          title={isVideoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {isVideoEnabled ? (
            <Camera className="w-3.5 h-3.5" />
          ) : (
            <CameraOff className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
