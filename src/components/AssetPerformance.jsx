// src/components/AssetPerformance.js
import React from "react";

function AssetPerformance() {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Assets</h3>
      <div className="w-40 h-40 bg-blue-500 rounded-full flex items-center justify-center text-2xl text-white mb-4">
        +12.5%
      </div>
      <table className="w-full text-white">
        <thead>
          <tr>
            <th className="text-left">Asset</th>
            <th className="text-left">Recommendation</th>
            <th className="text-left">YTD Performance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Stocks</td>
            <td>Buy</td>
            <td className="text-green-500">+12.5%</td>
          </tr>
          <tr>
            <td>Bonds</td>
            <td>Sell</td>
            <td className="text-red-500">-8.47%</td>
          </tr>
          <tr>
            <td>Cash</td>
            <td>Hold</td>
            <td className="text-green-500">+5.63%</td>
          </tr>
          <tr>
            <td>Home Equity</td>
            <td>Buy</td>
            <td className="text-red-500">-3.02%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AssetPerformance;
