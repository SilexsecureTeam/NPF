interface NextButtonProps {
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    onClick?: () => void;
}

const NextButton = ({ currentStep, setCurrentStep, onClick }: NextButtonProps) => {
  return (
      <button type="submit" className="bg-[#1F8340] text-sm font-semibold text-white py-2.5 px-[52px] ml-auto block"
          disabled={currentStep === 4}
          onClick={(e) => {            
              e.preventDefault();
              // return if there's an onClick function
              if (onClick) {
                  onClick();    
                  return;                  
              }            
            if (currentStep === 4) {
                return;
            }
            setCurrentStep((prev) => prev + 1)
            window.scrollTo(0, 600);
        }}
    >
        Next
    </button>
  );
}

const BackButton = ({ currentStep, setCurrentStep }: NextButtonProps) => {

    return (
        <button className="text-[#1F8340] text-sm font-semibold block"
            disabled={currentStep === 1}
            onClick={(e) => {
                e.preventDefault();
                if (currentStep === 1) {
                    return;
                }
                setCurrentStep((prev) => prev - 1)
                window.scrollTo(0, 600);
            }}
        >
            Back
        </button>
    );
}

export default NextButton;
export { BackButton };