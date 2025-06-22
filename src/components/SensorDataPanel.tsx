// src/components/SensorDataPanel.tsx
import SensorCard from './SensorCard'
import useSensorData from '../hooks/useSensorData'

export default function SensorDataPanel() {
  const { sensorData, loading, error } = useSensorData('device123')

  if (loading) return <p>Loading sensor data...</p>
  if (error) return <p className="text-red-600">Error: {error}</p>
  if (!sensorData) return <p>No sensor data available.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <SensorCard label="Temperature" value={`${sensorData.temperature} °C`} icon="🌡️" />
      <SensorCard label="Humidity" value={`${sensorData.humidity} %`} icon="💧" />
      <SensorCard label="Soil Moisture" value={`${sensorData.soilMoisture} %`} icon="🌱" />
      <SensorCard label="Water Level" value={`${sensorData.waterLevel} %`} icon="🚰" />
      <SensorCard label="Plant Status" value={sensorData.plantStatus} icon="🌿" />
    </div>
  )
}
