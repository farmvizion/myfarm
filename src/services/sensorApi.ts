export interface SensorData {
    id: number
    device_id: string
    temperature: number
    humidity: number
    soil_moisture: number
    water_level: number
    plant_status: string
    pest_level: number
    plant_health_index: number
    timestamp: string
}

const backendHost = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export async function fetchLatestSensorData(deviceId: string, apiKey: string) {
    const apiKeyTemp = "7a2b1c6c-9978-4775-9a39-58184dcca61d"
    try {
        const res = await fetch(`${backendHost}/api/edge/sensors/latest`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-device-id': deviceId,  // 👈 match backend expectation
                'x-api-key': apiKey  // 👈 match backend expectation

            }
        })

        if (!res.ok) throw new Error(`API error: ${res.statusText}`)
        const data = await res.json()
        return data
    } catch (error) {
        console.error('Failed to fetch latest sensor data:', error)
        throw error
    }
}


export async function fetchSensorHistory(deviceId: string, apiKey: string): Promise<any[]> {
      const apiKeyTemp = "7a2b1c6c-9978-4775-9a39-58184dcca61d"

  try {

     const res = await fetch(`${backendHost}/api/edge/sensors/history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-device-id': deviceId,  // 👈 match backend expectation
                'x-api-key': apiKey  // 👈 match backend expectation

            }
        })

    if (!res.ok) throw new Error(`API error: ${res.statusText}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Failed to fetch sensor history:', error)
    return []
  }
}
