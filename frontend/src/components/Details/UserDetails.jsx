import React from "react";
import LineData from "../LineData";

const UserDetails = ({ publicKey, companyName, czTotal, czDepositBalance, solBalance, czBalance }) => {
  return (
    <div id="userDetails" className="p-6 space-y-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-start border-b-2 border-gray-900 pb-5">
        {companyName}
      </h1>
      <LineData name="Public Key" value={publicKey} canCopied={true} />
      {czTotal !== 0 && (
        <>
          <LineData name="Total Carbon Credit Requirement" value={czTotal} />
          <LineData name="Remaining Carbon Credits Needed" value={czDepositBalance} />
        </>
      )}
      <LineData name="Sol Balance" value={`${solBalance}`} />
      <LineData name="CZ Balance" value={`${czBalance}`} />
    </div>
  );
};

export default UserDetails;
