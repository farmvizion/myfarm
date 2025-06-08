import { Leaf } from "lucide-react";

interface AlertBoxProps {
  message: string;
  onClose?: () => void;
}

export default function AlertBox({ message, onClose }: AlertBoxProps) {
  return (
    <div className="flex items-center justify-between space-x-4 bg-green-100 text-green-800 px-4 py-3 rounded-xl shadow border border-green-300 mb-4">
      <div className="flex items-center space-x-2">
        <Leaf className="w-5 h-5 text-green-600" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-green-700 hover:text-green-900 text-sm font-bold"
        >
          ✕
        </button>
      )}
    </div>
  );
}
