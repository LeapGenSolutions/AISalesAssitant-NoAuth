// src/components/SpendingChart.js
import React from "react";

function SpendingChart() {
  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-6">
      <h3 className="text-lg font-semibold text-white">Spending</h3>
      <div className="text-white text-2xl my-4">$5800 / YTD</div>
      <div className="w-full h-40 bg-gray-600 rounded-lg"></div>
      <p className="text-blue-400 mt-2">Most expensive month: September 2022</p>
    </div>
  );
}

export default SpendingChart;
