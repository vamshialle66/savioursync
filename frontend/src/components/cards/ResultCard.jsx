import React, { useState } from "react";
import DonorCard from "./DonorCard";
import BloodBankCard from "./BloodBankCard";
import HospitalCard from "./HospitalCard";

const ResultCard = ({ item, onNotify }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const renderCardByType = () => {
    switch (item.type) {
      case "donor":
        return <DonorCard item={item} isExpanded={isExpanded} onNotify={onNotify} />;
      case "bloodbank":
        return <BloodBankCard item={item} isExpanded={isExpanded} />;
      case "hospital":
        return <HospitalCard item={item} isExpanded={isExpanded} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="cursor-pointer"
      onClick={toggleExpand}
    >
      {renderCardByType()}
    </div>
  );
};

export default ResultCard;
