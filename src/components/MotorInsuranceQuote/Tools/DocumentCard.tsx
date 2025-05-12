import React from "react";

interface DocumentCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ title, description, icon, isActive = false }) => {
  console.log(isActive)
  return (
    <div
      className={`cursor-pointer p-4 lg:p-6 md:h-[240px] lg:h-[250px] max-w-[280px] rounded-2xl shadow-md flex flex-col items-center text-center transition-all duration-300 
        hover:bg-[#1F8340] hover:text-white  bg-white text-[#00000080] group
      `}
    >    
          {icon && <img src={String(icon)} className="w-16 h-16" />}
          {!icon && <div className="w-16 h-16" />}
        <h3 className={`font-semibold text-lg lg:text-xl group-hover:text-white text-[#000000]`}>{title}</h3>
        <p className="text-sm mt-2">{description}</p>
    </div>
  );
};

export default DocumentCard;


/* 

<div
      className={`cursor-pointer p-4 lg:p-6 md:h-[240px] lg:h-[250px] max-w-[280px] rounded-2xl shadow-md flex flex-col items-center text-center transition-all duration-300 
        ${isActive ? "bg-[#1F8340] text-white" : "bg-white text-[#00000080]"}
      `}
    >    
          {icon && <img src={String(icon)} className="w-16 h-16" />}
          {!icon && <div className="w-16 h-16" />}
        <h3 className={`font-semibold text-lg lg:text-xl ${isActive ? "text-white" : "text-[#000000]"}`}>{title}</h3>
        <p className="text-sm mt-2">{description}</p>
    </div>


*/