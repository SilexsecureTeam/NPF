import heroImg from "../../assets/insurance/hero.png";
import { useEffect, useState } from "react";
// import PersonalDetails from "./Tools/PersonalDetails";
import VehicleDetails from "./Tools/VehicleDetails";
import UploadDetails from "./Tools/UploadDetails";
import Checkout from "./Tools/Checkout";
import SuccessfulPayment from "./Tools/SuccessfulPayment";
import { useNavigate, useSearchParams } from "react-router-dom";
import { baseUrl } from "@/services/axios-client";
import { toast } from "react-toastify";

// Form storage key
const FORM_STORAGE_KEY = "motorInsuranceFormData";

export default function MotorInsuranceQuote() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Load saved form state on component mount
  const loadSavedFormState = () => {
    const savedData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setCurrentStep(parsedData.currentStep || 2);
        setVehicleData(parsedData.vehicleData || null);
        setSelectedIdType(parsedData.selectedIdType || "");
        // Upload data contains File objects which can't be serialized to JSON
        // We'll handle this separately in the individual component
        return true;
      } catch (error) {
        console.error("Error loading saved form data", error);
      }
    }
    return false;
  };

  // Save current form state
  const saveFormState = (step: number, vData: any, idType: string) => {
    const dataToSave = {
      currentStep: step,
      vehicleData: vData,
      selectedIdType: idType,
      // We don't save uploadData here since File objects can't be serialized
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
  };

  // Clear saved form when completed
  const clearSavedForm = () => {
    localStorage.removeItem(FORM_STORAGE_KEY);
  };
  
  const [currentStep, setCurrentStep] = useState(2);
  const [vehicleData, setVehicleData] = useState(null);
  const [uploadData, setUploadData] = useState<{ nin: File | null; vehicleLicense: File | null; utilityBill: File | null; } | null>({
    nin: null,
    vehicleLicense: null,
    utilityBill: null,
  });
  const [selectedIdType, setSelectedIdType] = useState<string>("");
  const [pageDisplay, setPageDisplay] = useState<string>('normal');

  // Handle step changes with persistence
  const handleStepChange = (newStep: number, newVehicleData?: any) => {
    setCurrentStep(newStep);
    
    // Save data when moving to a new step
    if (newVehicleData) {
      setVehicleData(newVehicleData);
      saveFormState(newStep, newVehicleData, selectedIdType);
    } else {
      saveFormState(newStep, vehicleData, selectedIdType);
    }
    
    // Clear saved data on form completion
    if (newStep === 5) {
      clearSavedForm();
    }
  };

  // Load user data on component mount
  // Load user data on component mount
  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");

    if (!storedUserData) {
      sessionStorage.setItem("cameFromMotorInsurance", "true");
      navigate("/auth/signup");
    } else {
      // Load saved form progress after authenticating
      loadSavedFormState();
    }
  }, [navigate]);
  // Save current form state whenever relevant data changes
  useEffect(() => {
    if (vehicleData || currentStep > 2) {
      saveFormState(currentStep, vehicleData, selectedIdType);
    }
  }, [currentStep, vehicleData, selectedIdType]);

  // Payment verification logic
  useEffect(() => {
    const token = sessionStorage.getItem("authToken")
    const paymentReference = searchParams.get("reference");
    
    let retries = 0;
    const maxRetries = 10;

    if (paymentReference) {
      setPageDisplay('processingPayment');

      const verifyPayment = async () => {
        try {
          const response = await fetch(`${baseUrl}/payment/callbacks?reference=${paymentReference}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
          const result = await response.json();
          
          if((result as any)?.errors){
            setPageDisplay('normal');
            console.error("Error verifying payment:", result.errors);
            toast.error("Error verifying payment. Please try again late or contact support.");
            setTimeout(() => {
              navigate("/dashboard")
            }, 5000);
            return;
          }
          
          if (result.payment.status === "success") {
            setPageDisplay('normal');
            clearSavedForm(); // Clear form data on successful payment
            navigate("/dashboard/home");
          } else if (result.payment.status === "pending" && retries < maxRetries) {
            setTimeout(verifyPayment, 5000)
            retries++;
          } else {
            setPageDisplay('normal');
            setCurrentStep(4);
          }
        } catch (error) {
          setPageDisplay('normal');
          console.error("Error verifying payment:", error);
          setCurrentStep(4);
        }
      };
      
      verifyPayment();
    }
  }, [searchParams, navigate]);

  if (pageDisplay === 'processingPayment') {
    return (
      <>
        <div className="w-full">
          <img src={heroImg} alt="Hero img" className="w-full max-h-[300px] md:max-h-[500px]" />
        </div>
        <section className="flex flex-col gap-4 justify-center items-center h-full py-20">          
          <h3 className="font-semibold text-lg text-red-500">
            PROCESSING PAYMENT, PLEASE DON'T CLOSE OR REFRESH THIS PAGE WHILE PAYMENT IS IN PROGRESS...
          </h3>
          <p className="font-medium text-base text-[#2F2F2F] px-3" >
            Your payment is being processed, please wait...
          </p>
        </section>
      </>
    );
  }
  
  return (
    <>
      <div className="w-full">
        <img src={heroImg} alt="Hero img" className="w-full max-h-[500px] md:max-h-[700px]" />
      </div>
      <main className="bg-[#1F834008] py-8 md:py-12 px-7 md:px-20 lg:px-[160px] xl:px-[200px]">
        {currentStep === 2 && (
          <VehicleDetails
            currentStep={currentStep}
            setCurrentStep={(step) => {
              const newStep = typeof step === 'function' ? step(currentStep) : step;
              handleStepChange(newStep, vehicleData);
            }}
            setVehicleData={(data) => {
              setVehicleData(data);
              saveFormState(currentStep, data, selectedIdType);
            }}
            initialValues={vehicleData}
            setSelectedIdType={(type) => {
              const newType = typeof type === 'function' ? type(selectedIdType) : type;
              setSelectedIdType(newType);
              saveFormState(currentStep, vehicleData, newType);
            }}
          />
        )}
        {currentStep === 3 && (
          <UploadDetails
            currentStep={currentStep}
            setCurrentStep={(step) => {
              const newStep = typeof step === 'function' ? step(currentStep) : step;
              handleStepChange(newStep, vehicleData);
            }}
            setUploadData={setUploadData}
            initialValues={uploadData || { nin: null, vehicleLicense: null, utilityBill: null }}
            selectedIdType={selectedIdType}
          />
        )}
        {currentStep === 4 && (
          <Checkout
            currentStep={currentStep}
            setCurrentStep={(step) => {
              const newStep = typeof step === 'function' ? step(currentStep) : step;
              handleStepChange(newStep, vehicleData);
            }}
            setVehicleData={setVehicleData}
            vehicleData={vehicleData}
            uploadData={uploadData}
          />
        )}
        {currentStep === 5 && (
          <SuccessfulPayment
            currentStep={currentStep}
            setCurrentStep={(step) => {
              setCurrentStep(step);
              clearSavedForm(); // Clear saved form on completion
            }}
          />
        )}
      </main>
    </>
  );
}