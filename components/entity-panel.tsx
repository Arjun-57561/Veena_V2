import React from "react";

interface EntityPanelProps {
  entities: { [key: string]: any };
  customerData: { [key: string]: any };
}

export default function EntityPanel({ entities, customerData }: EntityPanelProps) {
  // Merge entities and customerData for display
  const displayData = { ...entities, ...customerData };
  const keys = Object.keys(displayData);

  if (keys.length === 0) return null; // Do not render if no data

  return (
    <div className="bg-slate-800 text-blue-300 p-4 rounded max-w-xl mx-auto mt-6">
      <h3 className="font-semibold mb-2">Customer Information</h3>
      <ul className="list-disc list-inside">
        {keys.map((key) => (
          <li key={key} className="capitalize">
            <strong>{key.replace(/_/g, " ")}:</strong> {displayData[key]}
          </li>
        ))}
      </ul>
    </div>
  );
}
