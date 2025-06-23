import { useEffect, useState } from 'react'
type DetectionEvent = {
  id: number
  timestamp: string
  labels: string[]
  snapshotPath: string
  clipPath: string
}



interface DetectedEventsProps {
  deviceId: string,
  apiKey: string
}

  const backendHost = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

async function deleteDetection(id: number) {
  const res = await fetch(`${backendHost}/api/delete/detected/${id}`, { method: 'DELETE' })
  return await res.json()
}

async function deleteAllDetections() {
  const res = await fetch(`${backendHost}/api/delete/detected`, { method: 'DELETE' })
  return await res.json()
}

export default function DetectedEvents({ deviceId, apiKey }: DetectedEventsProps) {
  const apiKeyTemp = "7a2b1c6c-9978-4775-9a39-58184dcca61d"

  const [detections, setDetections] = useState<DetectionEvent[]>([])
  const [loading, setLoading] = useState(true)

  const handleDelete = async (id: number) => {
    await deleteDetection(id)
    setDetections(prev => prev.filter(d => d.id !== id))
  }

  const handleDeleteAll = async () => {
    if (confirm('Are you sure you want to delete all detection events?')) {
      await deleteAllDetections()
      setDetections([])
    }
  }


 useEffect(() => {
  fetch(`${backendHost}/api/edge/get/detected`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-device-id': deviceId,
      'x-api-key': apiKeyTemp
    }
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      setDetections(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
}, [deviceId, apiKeyTemp]);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-600">
        Loading detection data...
      </div>
    )
  }

  if (!detections.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No detections recorded yet.
      </div>
    )
  }

  const latest = detections[0]

  return (
    <div className="bg-white rounded-md shadow p-4 space-y-6 border border-green-200">
      <h3 className="text-lg font-bold text-green-800">AI Detection Events</h3>

      {/* Latest Detection */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-green-700">Latest Detection</h4>
          <button
            onClick={() => handleDelete(latest.id)}
            className="text-xs text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            {new Date(latest.timestamp).toLocaleString()}
          </div>
          <div className="flex flex-wrap gap-2">
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
            className="w-full max-h-60 object-cover rounded-md"
          />
          {latest.clipPath && (
            <a
              href={`${backendHost}/${latest.clipPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-700 underline mt-1 inline-block"
            >
              ▶ Watch Clip
            </a>
          )}
        </div>
      </div>

      {/* History */}
      <div>
        <h4 className="font-semibold text-green-700 mb-2">Previous Events</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2">
          {detections.slice(1).map((event, index) => (
            <div
              key={index}
              className="flex items-start gap-3 border border-green-100 rounded-md p-2 hover:bg-green-50"
            >
              <img
                src={`${backendHost}/${event.snapshotPath}`}
                alt="Snap"
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex flex-col">
                <div className="text-xs text-gray-500">
                  {new Date(event.timestamp).toLocaleString()}
                </div>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-xs text-red-500 hover:underline self-start"
                >
                  Delete
                </button>

                <div className="flex flex-wrap gap-1 mt-1">
                  {event.labels.map((label, i) => (
                    <span
                      key={i}
                      className="bg-green-100 text-green-700 px-2 py-0.5 text-xs rounded-full"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <a
                  href={`${backendHost}/${event.clipPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-700 underline mt-1"
                >
                  ▶ Clip
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleDeleteAll}
          className="text-sm text-red-600 underline hover:text-red-800"
        >
          Delete All
        </button>
      </div>

    </div>

  )
}
