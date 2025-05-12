import NextButton, { BackButton } from "./NextButton";
import ProgressBar from "./ProgressBar"
import successIllustration from "../../../assets/insurance/success-illustration.png"

const SuccessfulPayment = ({ currentStep, setCurrentStep }: { currentStep: number, setCurrentStep: React.Dispatch<React.SetStateAction<number>> }) => {
    
    return (
        <section className="">
            <div className="mx-auto text-center space-y-3 md:space-y-5">
                <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl text-black ">Upload Your Documents</h2>
                <div className="text-[#000000CC] font-semibold text-base md:text-lg text-center">
                    <p>
                        Attach a valid means of ID (e.g: Driver’s license, International passport or National ID) and Vehicle License
                    </p>
                    <p className="font-medium mt-5">
                        *Each document/image should not be more than 2MB in size
                    </p>
                </div>
            </div>

            <ProgressBar currentStep={currentStep} totalSteps={4} />            

            <div id="successful-payment"
                className="mt-8 lg:mt-14 text-center bg-white shadow-md p-5 sm:p-10 md:p-12 lg:p-20 mx-auto min-h-[400px] h-fit"
            > 
                <img src={successIllustration} alt="Success illustration" className="mx-auto max-w-[250px] md:max-w-none" />
                <h3 className="text-2xl md:text-3xl lg:text-4xl mt-20 lg:mt-[100px]" >
                    Congratulations!
                </h3>
                <div className="w-full md:max-w-[60%] lg:max-w-[80%] mx-auto mt-4">
                    <p className="text-sm md:text-lg lg:text-xl" >
                        You're just one step away from receiving your Third Party Insurance
                        Details—congratulations!
                    </p>
                </div>
            </div>            

            <div className="flex justify-between items-center mt-5">
                <BackButton currentStep={currentStep} setCurrentStep={setCurrentStep} />
                <NextButton
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}                        
                />
            </div>
        </section>
    )
}

export default SuccessfulPayment;