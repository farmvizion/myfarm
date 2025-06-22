import  { useEffect, useState } from 'react'
import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
} from 'recharts'
import { fetchSensorHistory } from '../services/sensorApi'

// ✅ Define prop type here
type TimeSeriesChartProps = {
    deviceId: string
}

export default function TimeSeriesChart({ deviceId }: TimeSeriesChartProps) {
    const [timeSeriesData, setTimeSeriesData] = useState<any[]>([])

    useEffect(() => {
        async function load() {
            const data = await fetchSensorHistory(deviceId)
            setTimeSeriesData(data.map((entry: any) => ({
                date: entry.timestamp.slice(0, 10),
                temperature: entry.temperature,
                humidity: entry.humidity,
                waterLevel: entry.water_level,
                pestLevel: entry.pest_level,
                plantHealthIndex: entry.plant_health_index,
            })))
        }
        load()
    }, [deviceId])

    return timeSeriesData.length === 0 ? (
        <div className="text-center text-gray-500 p-6 bg-white rounded shadow">
            No sensor data available for the selected device.
        </div>
    ) : (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={timeSeriesData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#c7f0c7" />
                <XAxis dataKey="date" tick={{ fill: '#276749' }} />
                <YAxis tick={{ fill: '#276749' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#2f855a" name="Temperature (°C)" />
                <Line type="monotone" dataKey="humidity" stroke="#38a169" name="Humidity (%)" />
                <Line type="monotone" dataKey="waterLevel" stroke="#68d391" name="Water Level (%)" />
                <Line type="monotone" dataKey="pestLevel" stroke="#e53e3e" name="Pest Level" />
                <Line type="monotone" dataKey="plantHealthIndex" stroke="#9ae6b4" name="Plant Health Index" />
            </LineChart>
        </ResponsiveContainer>
    )

}
