import { useEffect, useState } from 'react'



interface VideoStreamProps {
  deviceId: string,
  apiKey: string
}

type DetectionEvent = {
  timestamp: string
  labels: string[]
  snapshotPath: string
  clipPath: string
}

export default function VideoStream({ deviceId, apiKey }: VideoStreamProps) {
  const backendHost = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
  const apiKeyTemp = "7a2b1c6c-9978-4775-9a39-58184dcca61d"


  const [detections, setDetections] = useState<DetectionEvent[]>([])
  useEffect(() => {
    fetch(`${backendHost}/api/edge/get/detected`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-device-id': deviceId,  // make sure `deviceId` is defined in your component
        'x-api-key': apiKey  // make sure `deviceId` is defined in your component

      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(setDetections)
      .catch(console.error);
  }, [deviceId]);
  const latest = detections[0]

  return (
    <div className="flex w-full h-[calc(100vh-4rem)] overflow-hidden"> {/* Adjust height if needed */}

      {/* Video View (Left side) */}
      {/* Video View (Left side) 

      <div className="flex-1 bg-black">
        <TwitchIframeEmbed />

      </div>
      */}

      <div className="flex-1 bg-black">
        <iframe src="https://satellitemap.space/" width="800px" height="480px" frameborder="0" title="Starlink Satellite Map"></iframe>
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
  )
}
