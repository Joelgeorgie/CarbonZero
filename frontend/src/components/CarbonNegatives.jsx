import React, { useEffect, useState } from "react";
import axios from "axios";

const CarbonNegatives = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/companies/cztotal-zero");
        
        // Exclude the company with the specified public key
        const filteredCompanies = response.data.companies.filter(
          (company) => company.publicKey !== "DEeu5eisQA2k68uusV6LWcCyrRzEuMkdJGa2uFDsXNeL"
        );

        setCompanies(filteredCompanies);
      } catch (error) {
        console.error("Error fetching carbon-negative companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="p-6 w-full">
      {/* Table Header */}
      <div className="text-white flex justify-around bg-gray-800 p-4 rounded-md font-semibold">
        <h1 className="w-1/2 text-start">Name</h1>
        <h1 className="w-1/2 text-start">Public Key</h1>
      </div>

      {/* Table Body */}
      <div className="mt-4">
        {companies.length > 0 ? (
          companies.map((company, index) => (
            <div
              key={index}
              className="text-white flex justify-around p-4 border-b border-gray-700"
            >
              <p className="w-1/2 text-start">{company.name}</p>
              
              {/* Clickable Public Key */}
              <p
                className="w-1/2 text-start truncate text-green-400 cursor-pointer"
                onClick={() => window.open(`https://explorer.solana.com/address/${company.publicKey}?cluster=custom`, "_blank")}
              >
                {company.publicKey}
              </p>
            </div>
          ))
        ) : (
          <p className="text-white mt-4">No carbon-negative companies found.</p>
        )}
      </div>
    </div>
  );
};

export default CarbonNegatives;
