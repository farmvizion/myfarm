import React, { useState } from "react";

import RiceImage from "../assets/rice.jpg";
import WheatImage from "../assets/wheat.jpeg";
import AppleImage from "../assets/apple.jpg";
import OliveImage from "../assets/olive.jpeg";

import App from "../App";

// Define your 16 images here (adjust paths as needed)
const items = [
  { id: 1, label: "Rice", image: RiceImage },
  { id: 2, label: "Wheat", image: WheatImage },
  { id: 3, label: "Apple", image: AppleImage },
  { id: 4, label: "Olive", image: OliveImage },
];

const FarmForm: React.FC = () => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>(
    {}
  );

  const toggleItem = (id: number) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = Object.keys(selectedItems).filter(
      (k) => selectedItems[parseInt(k, 10)]
    );
    alert(
      `Text: ${text}\nCategory: ${category}\nSelected items: ${chosen.join(
        ", "
      )}`
    );
  };

  const categories = [
    { value: "", label: "Select category" },
    { value: "fruit", label: "Fruit" },
    { value: "vegetable", label: "Vegetable" },
    { value: "grain", label: "Grain" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Welcome to my farm! - Willkommen auf meiner Farm!
      </h2>

      {/* Text input and dropdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Enter something…"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        >
          {categories.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={!opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

{/* 4x4 Image Checkbox Grid */}
<div className="grid grid-cols-4 gap-4">
  {items.map((item) => (
    <div
      key={item.id}
      className="relative w-full h-32 border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
      onClick={() => toggleItem(item.id)}
    >
      <img
        src={item.image}
        alt={item.label}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 w-full bg-white bg-opacity-75 text-center text-gray-700 py-1">
        {item.label}
      </div>
      {selectedItems[item.id] && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
      <input
        type="checkbox"
        checked={!!selectedItems[item.id]}
        onChange={() => toggleItem(item.id)}
        className="hidden"
      />
    </div>
  ))}
</div>



      <button
        type="submit"
        className="w-full py-2 rounded-md text-white font-medium bg-green-600 hover:bg-green-700 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default FarmForm;
