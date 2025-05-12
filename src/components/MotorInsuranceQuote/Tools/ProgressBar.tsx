import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const steps = [
  "Personal Details",
  "Vehicle Details",
  "Upload Details",
  "Payment Details",
];

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps = 4 }) => {
    //const progressPercentage = ((currentStep -1) / (totalSteps - 1)) * 100;
    const progressPercentage = () => {
        if (currentStep === 1) return 20;
        if (currentStep === 2) return 40;
        if (currentStep === 3) return 80;
        if (currentStep === 4) return 100;
    }
    //console.log(progressPercentage2());
    console.log(totalSteps);

  return (
    <div className="w-full mt-10 lg:mt-20">
      {/* Step Indicators */}
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-semibold
                ${index + 1 <= currentStep ? "bg-[#1F8340]" : "bg-[#DCDFDD]"}
              `}
            >
              {index + 1}
            </div>
            <span className={`${index + 1 <= currentStep ? "text-black font-medium":"text-black font-medium"} hidden md:block`}>
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-5 w-full h-4 bg-[#DCDFDD] overflow-hidden">
        <div
          className="h-full bg-[#1F8340] transition-all duration-300"
          style={{ width: `${progressPercentage()}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
