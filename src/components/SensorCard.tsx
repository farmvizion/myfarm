
interface SensorCardProps {
  label: string
  value: string | number
  icon: string
}

export default function SensorCard({ label, value, icon }: SensorCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow flex items-center gap-4">
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  )
}
