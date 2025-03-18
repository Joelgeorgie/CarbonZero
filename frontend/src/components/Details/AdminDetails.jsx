import React from "react";
import { useNavigate } from "react-router-dom";
import LineData from "../LineData";

const AdminDetails = ({ publicKey, solBalance, czBalance }) => {
  const navigate = useNavigate();

  return (
    <div id="AdminDetails" className="p-6 space-y-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="font-bold justify-between border-b-2 border-gray-900 pb-5 flex">
        <h1 className="text-2xl">Admin</h1>
        <div
          className="text-xs flex text-center justify-center items-end cursor-pointer"
          onClick={() => navigate("/companies")}
        >
          Company List
        </div>
      </div>

      <div className="space-y-4">
        <LineData name="Public Key" value={publicKey} canCopied={true} />
        <LineData name="Token Mint Address" value="carQ4YQfUsjDRVwWXTvUxW5DwXWo5uCU7YuN9frvJ4w" canCopied={true} />
        <LineData name="Sol Balance" value={`${solBalance}`} />
        <LineData name="CZ Balance" value={`${czBalance}`} />
      </div>
    </div>
  );
};

export default AdminDetails;
