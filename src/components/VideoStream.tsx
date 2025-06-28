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
  const [modalImage, setModalImage] = useState<string | null>(null);
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
        videoRef.current.play().catch(console.error);
      }
    }
  };

  return (
    <>
      <div className="flex w-full h-[calc(100vh-4rem)] overflow-hidden">
        {/* Video View */}
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

        {/* Detection Panel */}
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
                onClick={() => setModalImage(`${backendHost}/${latest.snapshotPath}`)}
                className="w-full rounded mb-2 cursor-pointer hover:shadow-lg"
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

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Modal Snapshot"
            className="max-w-full max-h-full rounded shadow-lg"
            onClick={e => e.stopPropagation()} // Prevent modal close when clicking image
          />
          <button
            onClick={() => setModalImage(null)}
            className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full px-3 py-1 hover:bg-opacity-75"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
