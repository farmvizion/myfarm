import { useEffect, useRef, useState } from 'react';
import sunflowerVideo from '../assets/sunflower.mp4';

interface VideoStreamProps {
  deviceId: string;
  apiKey: string;
}

type DetectionEvent = {
  timestamp: string;
  labels: string[];
  snapshotPath: string;
  clipPath: string;
};

export default function VideoStream({ deviceId, apiKey }: VideoStreamProps) {
  const backendHost = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const [detections, setDetections] = useState<DetectionEvent[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetch(`${backendHost}/api/edge/get/detected`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-device-id': deviceId,
        'x-api-key': apiKey,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(setDetections)
      .catch(console.error);
  }, [deviceId, apiKey]);

  const latest = detections[0];

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (!videoRef.current.paused) {
        videoRef.current.play().catch(console.error); // play in case unmute doesn't trigger playback
      }
    }
  };

  return (
    <div className="flex w-full h-[calc(100vh-4rem)] overflow-hidden">
      {/* Video View (Left side) */}
      <div className="flex-1 bg-black flex flex-col items-center justify-center">
        <video
          ref={videoRef}
          src={sunflowerVideo}
          width="800"
          height="480"
          loop
          autoPlay
          muted={isMuted}
          playsInline
          className="object-cover rounded"
        />
        <button
          onClick={toggleMute}
          className="mt-4 px-4 py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600"
        >
          {isMuted ? '🔇 Unmute' : '🔊 Mute'}
        </button>
      </div>

      {/* Detection Panel (Right side) */}
      <div className="w-[30%] max-w-[400px] h-full bg-white overflow-y-auto p-4 border-l border-green-300">
        <h3 className="text-lg font-semibold text-green-700 mb-4">Recent Detection</h3>

        {latest ? (
          <>
            <div className="text-sm text-gray-600 mb-2">
              Time: {new Date(latest.timestamp).toLocaleString()}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {latest.labels.map((label, i) => (
                <span
                  key={i}
                  className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full font-medium"
                >
                  {label}
                </span>
              ))}
            </div>
            <img
              src={`${backendHost}/${latest.snapshotPath}`}
              alt="Snapshot"
              className="w-full rounded mb-2"
            />
            <a
              href={`${backendHost}/${latest.clipPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-green-700 underline"
            >
              ▶ Watch Clip
            </a>
          </>
        ) : (
          <p className="text-sm text-gray-500">No recent detections.</p>
        )}
      </div>
    </div>
  );
}
