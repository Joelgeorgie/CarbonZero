import React, { useState } from "react";
import Navbar from "./Navbar";
import AllCompanies from "./AllCompanies";
import CarbonNegatives from "./CarbonNegatives";
import CarbonPositives from "./CarbonPositives";
const Companies = () => {
  const [selectedTab, setSelectedTab] = useState("all");

  return (
    <div className="h-screen bg-gray-900">
      <Navbar />
      <div className=" w-full flex flex-col py-5">
        {/* Buttons Section */}
        <div className="flex flex-row text-white items-center px-20 py-5 space-x-4">
          <button
            className={`px-5 py-2 rounded-lg border border-green-400
                 transition ${
              selectedTab === "all" ? "bg-green-400 text-gray-900" : "bg-gray-800"
            }`}
            onClick={() => setSelectedTab("all")}
          >
            All Companies
          </button>
          <button
            className={`px-5 py-2 rounded-lg border border-green-400 transition ${
              selectedTab === "negative" ? "bg-green-400 text-gray-900" : "bg-gray-800"
            }`}
            onClick={() => setSelectedTab("negative")}
          >
            Carbon Negative
          </button>
          <button
            className={`px-5 py-2 rounded-lg border border-green-400 transition ${
              selectedTab === "positive" ? "bg-green-400 text-gray-900" : "bg-gray-800"
            }`}
            onClick={() => setSelectedTab("positive")}
          >
            Carbon Positive
          </button>
        </div>

        {/* Content Section */}
        <div className="text-white px-20 mt-5">
          {selectedTab === "all" && <div>📊 Showing all companies...<AllCompanies/></div>}
          {selectedTab === "negative" && <div>🌱 Showing Carbon Negative companies...<CarbonNegatives/></div>}
          {selectedTab === "positive" && <div>🔥 Showing Carbon Positive companies...<CarbonPositives/></div>}
        </div>
      </div>
    </div>
  );
};

export default Companies;
