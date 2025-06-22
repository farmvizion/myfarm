import { useEffect, useState } from 'react'

type DetectionEvent = {
  timestamp: string
  labels: string[]
  snapshotPath: string
  clipPath: string
}

export default function VideoStream() {
  const [detections, setDetections] = useState<DetectionEvent[]>([])

  useEffect(() => {
    fetch('http://farmvizion-device.local:3000/api/get/detected')
      .then(res => res.json())
      .then(setDetections)
      .catch(console.error)
  }, [])

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
        <img
          src="http://farmvizion-device.local:8080/video_feed"
          alt="Live Camera Feed"
          className="w-full h-full object-contain"
        />
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
              src={`http://farmvizion-device.local:3000/${latest.snapshotPath}`}
              alt="Snapshot"
              className="w-full rounded mb-2"
            />
            <a
              href={`http://farmvizion-device.local:3000/${latest.clipPath}`}
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
