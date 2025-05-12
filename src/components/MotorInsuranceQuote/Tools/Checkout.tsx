import ProgressBar from "./ProgressBar";
import { BackButton } from "./NextButton";
import UseInsurance from "@/hooks/UseInsurance";
import { toast } from "react-toastify";
import useFetchPaymentAmount from "@/hooks/UseFetchPaymentAmount";
import { useEffect, useState } from "react";

const Checkout = ({
  currentStep,
  setCurrentStep,
  /* userData, */
  vehicleData: propVehicleData,
  setVehicleData,
  uploadData,
}: {
  currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    setVehicleData: React.Dispatch<React.SetStateAction<any>>;
  /* userData: any; */
  vehicleData: any;
  uploadData: any;
}) => {
  const { submitInsuranceDetails, initializePayment, loading } = UseInsurance();

  const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
  /* const handlePayNow = async () => {
    if (!userData || !vehicleData || !uploadData) {
      toast.error("Missing required data. Please go back and complete all steps.");
      return;
    }
    const response = await submitInsuranceDetails( vehicleData, uploadData);
    if (response && response.message) {
      if (!(response instanceof Error)) {
        toast.success(response.message);
        const paymentResponse = await initializePayment(userData.id);
        if (paymentResponse && paymentResponse.data.authorization_url) {
          toast.success("Redirecting to payment gateway...");
          window.open(paymentResponse.data.authorization_url, "_self");
        } else {
          toast.error("Payment initialization failed");
        }
      }
    }
  }; */

  const [isSubmitted, setIsSubmitted] = useState(false);

  /* const handlePayNow = async () => { Mine
    if (!vehicleData || !uploadData) {
        toast.error("Missing required data. Please go back and complete all steps.");
        return;
    }

    const response = await submitInsuranceDetails(vehicleData, uploadData);
    
    if (!response) {
        toast.error("Failed to submit insurance details. Please try again.");
        return;
    }

    toast.success(response.message);
    const paymentResponse = await initializePayment(response.userId);

    if (paymentResponse && paymentResponse.data.authorization_url) {
        toast.success("Redirecting to payment gateway...");
        window.open(paymentResponse.data.authorization_url, "_self");
    } else {
        toast.error("Payment initialization failed");
    }        
  }; */


  const handleSubmitDetails = async () => {
    if (!vehicleData || !uploadData) {
      toast.error("Missing required data. Please go back and complete all steps.");
      return;
    }

    //Why is insurance_package required
    //vehicleData.insurance_package = vehicleData.insurance_package;

    const response = await submitInsuranceDetails(vehicleData, uploadData);

    if (!response) {
      //toast.error("Failed to submit insurance details. Please try again.");
      return;
    }

    toast.success(response.message);
    setIsSubmitted(true);
  };

  const handlePayNow = async () => {
    //console.log(vehicleData)
    const storedVehicleData = JSON.parse(sessionStorage.getItem("vehicleData") as string);
    const paymentResponse = await initializePayment(userData.id, storedVehicleData.id);

    if (paymentResponse?.data?.authorization_url) {
      toast.success("Redirecting to payment gateway...");
      window.open(paymentResponse.data.authorization_url, "_self");
    } else {
      toast.error("Payment initialization failed");
    }
  };



  // This config is to get vehicleData from session storage and retry payment when payment fails
  const [vehicleData, setLocalVehicleData] = useState<any>(() => {
    const storedVehicleData = sessionStorage.getItem("vehicleData");
    return storedVehicleData ? JSON.parse(storedVehicleData) : propVehicleData;
  });

  useEffect(() => {
    const storedVehicleData = sessionStorage.getItem("vehicleData");
    if (storedVehicleData) {
      const parsedData = JSON.parse(storedVehicleData);
      setLocalVehicleData(parsedData);
      setVehicleData(parsedData); // Ensure it syncs with parent state
    }

    const storedDocumentData = sessionStorage.getItem("documentData");
    if (storedVehicleData && storedDocumentData) {
      setIsSubmitted(true);
    }
  }, [setVehicleData]);



  const { amount, loadingAmount, fetchAmount } = useFetchPaymentAmount();

  useEffect(() => {
  if (isSubmitted) {
    fetchAmount(userData.id);
  }
}, [isSubmitted, userData.id]);

  

  return (
    <section className="">
      <div className="mx-auto text-center space-y-3 md:space-y-5">
        <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl text-black ">
          Checkout
        </h2>
        <p className="text-[#00000080] font-medium text-sm md:text-base w-full md:w-[50%] lg:w-[40%] mx-auto text-center">
          Review your details and proceed to payment.
        </p>
      </div>

      <ProgressBar currentStep={currentStep} totalSteps={4} />

      { !isSubmitted &&
        <div className="mt-8 lg:mt-14 py-5 space-y-6 md:space-y-12 text-[#000000] font-medium text-sm md:text-base">
          <div>
            <div className="text-white p-1 bg-green-600 max-w-[50%] mb-5">
              <h3 className="font-semibold text-lg">Personal Details</h3>
            </div>
            <p className="text-base">
              <span className="font-semibold">Insurance Type:</span>{" "}
              {vehicleData.insurance_package === "third_party"
                ? "Third Party"
                : "premium"}
            </p>
            <p className="text-base">
              <span className="font-semibold">User Type:</span> {userData.use_type}
            </p>
            <p className="text-base">
              <span className="font-semibold">Category:</span> {vehicleData.category}
            </p>
            <p className="text-base">
              <span className="font-semibold">Sub Category:</span> {vehicleData.sub_category}
            </p>
            <p className="text-base">
              <span className="font-semibold">Full Name:</span> {userData.title}{" "}
              {userData.first_name} {userData.last_name}
            </p>
            <p className="text-base">
              <span className="font-semibold">Email:</span> {userData.email}
            </p>
            <p className="text-base">
              <span className="font-semibold">Phone:</span>{" "}
              {userData.phone_number}
            </p>
            <p className="text-base">
              <span className="font-semibold">Drivers License:</span>{" "}
              {vehicleData.driver_license} (Expires on {vehicleData.license_expire_year}
              )
            </p>
            <p className="text-base">
              <span className="font-semibold">Years of Driving Experience:</span>{" "}
              {vehicleData.year_of_driving}
            </p>
          </div>

          <div>
            <div className="text-white p-1 bg-green-600 max-w-[50%] mb-3">
              <h3 className="font-semibold text-lg">Vehicle Details</h3>
            </div>
            <p className="text-base">
              <span className="font-semibold">Registration Number:</span>{" "}
              {vehicleData.vehicle_registration_number}
            </p>
            <p className="text-base">
              <span className="font-semibold">Value:</span>{" "}
              {vehicleData.value_amount.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </p>
            <p className="text-base">
              <span className="font-semibold">Make:</span>{" "}
              {vehicleData.maker.toLocaleUpperCase()}
            </p>
            <p className="text-base">
              <span className="font-semibold">Model:</span>{" "}
              {vehicleData.model.toLocaleUpperCase()}
            </p>
            <p className="text-base">
              <span className="font-semibold">Body Color:</span>{" "}
              {vehicleData.body_color}
            </p>
            <p className="text-base">
              <span className="font-semibold">Year of Manufacture:</span>{" "}
              {vehicleData.year}
            </p>
            <p className="text-base">
              <span className="font-semibold">Chassis Number:</span>{" "}
              {vehicleData.chassis_number}
            </p>
            <p className="text-base">
              <span className="font-semibold">Engine Number:</span>{" "}
              {vehicleData.engine_number}
            </p>
            <p className="text-base">
              <span className="font-semibold">With Effect From:</span>{" "}
              {vehicleData.with_effect_from}
            </p>
          </div>

          <div>
            <div className="text-white p-1 bg-green-600 max-w-[50%] mb-3">
              <h3 className="font-semibold text-lg">Uploaded Documents</h3>
            </div>
            {uploadData.nin?.name && (
              <div className="text-base">
                <span className="font-semibold">NIN:</span>{" "}
                {uploadData.nin.name}
              </div>
            )}
            {uploadData.vehicleLicense?.name && (
              <div className="text-base">
                <span className="font-semibold">Vehicle License:</span>{" "}
                {uploadData.vehicleLicense.name}
              </div>
            )}
            {uploadData.utilityBill?.name && (
              <div className="text-base">
                <span className="font-semibold">Utility Bill:</span>{" "}
                {uploadData.utilityBill.name}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-5">
            <BackButton currentStep={currentStep} setCurrentStep={setCurrentStep} />
            <button
              onClick={handleSubmitDetails}
              className="bg-[#1F8340] text-sm font-semibold text-white py-2.5 px-10"
            >
              {loading ? "Submitting..." : "Submit Details"}
            </button>
          </div>
        </div>
      }

      { isSubmitted &&      
      <>
        <div className="bg-white shadow-md p-5 md:p-8 lg:p-20 mx-auto space-y-4 md:space-y-8">
          <p className="text-lg md:text-xl font-medium text-[#000000CC]">
            Dear {userData.first_name},
          </p>
          <p className="text-[#00000080] font-medium">
            Based on the details you have provided, The amount to pay below:
          </p>
          <p className="font-semibold text-sm md:text-xl text-[#000000CC]">
             {vehicleData.insurance_package === "third_party"
                ? "Third Party"
                : "Premium"} -{" "}
            {loadingAmount ? (
              "Loading..."
            ) : amount ? (
              amount.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              }) + ""
            ) : (
              "Not available"
            )}
            
          </p>
        </div>
        <hr className="my-5" />
        <p>
          By clicking the button below, you agree to our Terms and Conditions and
          Privacy Policy
        </p>

        <div className="flex justify-between items-center mt-5">
          <BackButton currentStep={currentStep} setCurrentStep={setCurrentStep} />
          <button
            onClick={handlePayNow}
            className="bg-[#1F8340] text-sm font-semibold text-white py-2.5 px-[52px] ml-auto block"
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </>
      }

      
      
    </section>
  );
};

export default Checkout;
