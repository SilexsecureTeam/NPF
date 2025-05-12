import ProgressBar from "./ProgressBar";
import { FormEvent, useState, useEffect } from "react";
import DocumentCard from "./DocumentCard";
import fireIcon from "../../../assets/insurance/fire-02.svg";
import carIcon from "../../../assets/insurance/car-02.png";
import trafficIcon from "../../../assets/insurance/traffic-incident.svg";
import { BackButton } from "./NextButton";

interface UploadDetailsProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setUploadData: (data: { nin: File | null; vehicleLicense: File | null; utilityBill: File | null }) => void;
  initialValues: {
    nin: File | null;
    vehicleLicense: File | null;
    utilityBill: File | null;
  };
  selectedIdType: string; 
}

const UploadDetails = ({
  currentStep,
  setCurrentStep,
  setUploadData,
  initialValues,
  selectedIdType, 
}: UploadDetailsProps) => {
  const [display] = useState("uploadDocuments");
  const [error, setError] = useState("");
  const [nin, setnin] = useState<File | null>(initialValues?.nin || null);
  const [vehicleLicense, setVehicleLicense] = useState<File | null>(initialValues?.vehicleLicense || null);
  const [utilityBill, setUtilityBill] = useState<File | null>(initialValues?.utilityBill || null);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setnin(initialValues?.nin || null);
    setVehicleLicense(initialValues?.vehicleLicense || null);
    setUtilityBill(initialValues?.utilityBill || null);
  }, [initialValues]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "nin" | "vehicleLicense" | "utilityBill") => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      setSelectedDocument(type);
      setPreviewUrl(URL.createObjectURL(file));
      if (type === "nin") {
        setnin(file);
        setVehicleLicense(null);
        setUtilityBill(null);
      } else if (type === "vehicleLicense") {
        setVehicleLicense(file);
        setnin(null);
        setUtilityBill(null);
      } else if (type === "utilityBill") {
        setUtilityBill(file);
        setnin(null);
        setVehicleLicense(null);
      }
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nin && !vehicleLicense && !utilityBill) {
      setError("At least one document is required");
    } else {
      setError("");
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 600);
      setUploadData({ nin, vehicleLicense, utilityBill });
    }
  };

  return (
    <section>
      <div className="mx-auto text-center space-y-3 md:space-y-5">
        <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl text-black">
          Upload Your Documents
        </h2>
        <div className="text-[#000000CC] font-semibold text-base md:text-lg text-center">
          <p>
            Attach a valid means of ID (e.g: Driver’s license, International
            passport or National ID) and Vehicle License
          </p>
          <p className="font-medium mt-5">
            *Each document/image should not be more than 2MB in size
          </p>
        </div>
      </div>

      <ProgressBar currentStep={currentStep} totalSteps={4} />

      <form
        id="upload-details"
        className="mt-8 lg:mt-14 py-5 font-medium text-sm md:text-base"
        onSubmit={onSubmit}
      >
        {display === "uploadDocuments" && (
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center p-3 md:p-6">
            {selectedIdType === "nin" && (
              <div>
                <label htmlFor="nin">
                  <DocumentCard
                    title="NIN"
                    description="Official documents issued by government, Driver licence, NIN, Voters Card, and International Passport"
                    icon={trafficIcon}
                    className={`${
                      selectedDocument === "nin" ? "bg-green-200 border-green-500" : ""
                    }`}
                  />
                </label>
                <input
                  type="file"
                  id="nin"
                  name="nin"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "nin")}
                  disabled={!!selectedDocument && selectedDocument !== "nin"}
                />
              </div>
            )}

            {selectedIdType === "vehicleLicense" && (
              <div>
                <label htmlFor="vehicleLicense">
                  <DocumentCard
                    title="VEHICLE LICENSE"
                    description="Document issued by government authority that allows vehicle to be legally driven on public roads."
                    icon={fireIcon}
                    className={`${
                      selectedDocument === "vehicleLicense" ? "bg-green-200 border-green-500" : ""
                    }`}
                  />
                </label>
                <input
                  type="file"
                  id="vehicleLicense"
                  name="vehicleLicense"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "vehicleLicense")}
                  disabled={!!selectedDocument && selectedDocument !== "vehicleLicense"}
                />
              </div>
            )}

            {selectedIdType === "utilityBill" && (
              <div>
                <label htmlFor="utility_bill">
                  <DocumentCard
                    title="UTILITY BILL"
                    description="A bill statement issued by service provider for essential services like electricity, water, or gas."
                    icon={carIcon}
                    className={`${
                      selectedDocument === "utilityBill" ? "bg-green-200 border-green-500" : ""
                    }`}
                  />
                </label>
                <input
                  type="file"
                  id="utility_bill"
                  name="utility_bill"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "utilityBill")}
                  disabled={!!selectedDocument && selectedDocument !== "utilityBill"}
                />
              </div>
            )}
          </div>
        )}

        {previewUrl && (
          <div className="text-center mt-5">
            <img src={previewUrl} alt="Selected Document Preview" className="mx-auto max-w-xs" />
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex justify-between items-center mt-5">
          <BackButton currentStep={currentStep} setCurrentStep={setCurrentStep} />
          <button
            type="submit"
            className="bg-[#1F8340] text-sm font-semibold text-white py-2.5 px-[52px] ml-auto block"
          >
            Next
          </button>
        </div>
      </form>
    </section>
  );
};

export default UploadDetails;
