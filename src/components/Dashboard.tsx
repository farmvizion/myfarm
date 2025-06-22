import  { useEffect, useState } from 'react'
import SensorCard from './SensorCard'
import { fetchLatestSensorData, type SensorData } from '../services/sensorApi'

interface DashboardProps {
  deviceId: string
}

export default function Dashboard({ deviceId }: DashboardProps) {
  const [sensorData, setSensorData] = useState<SensorData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    fetchLatestSensorData(deviceId)
      .then((data) => {
        setSensorData(data)
        setError(null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [deviceId])

  if (loading) return <p>Loading sensor data...</p>
  if (error) return <p className="text-red-600">Error: {error}</p>
  if (!sensorData) return <p>No sensor data available</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <SensorCard label="Temperature" value={`${sensorData.temperature} °C`} icon="🌡️" />
      <SensorCard label="Humidity" value={`${sensorData.humidity} %`} icon="💧" />
      <SensorCard label="Soil Moisture" value={`${sensorData.soil_moisture} %`} icon="🌱" />
      <SensorCard label="Water Level" value={`${sensorData.water_level} %`} icon="🚰" />
      <SensorCard label="Plant Status" value={sensorData.plant_status} icon="🌿" />
    </div>
  )
}
