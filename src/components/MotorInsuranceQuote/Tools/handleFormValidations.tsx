export interface IFormValues {
    category: string;
    title: string;
    firstName: string;
    surname: string;
    email: string;
    phone: string;
    driverLicenceNumber: string;
    driverLicenceExpiryDate: string;
    yearsOfDriving: string;
    vehicleRegistrationNumber: string;
    valueAmount: string;
    vehicleUse: string;
    make: string;
    model: string;
    bodyColor: string;
    carYear: string;
    carType: string;
    chassisNumber: string;
    engineNumber: string;
    effectFrom: string;
    validId: File | null;
    vehicleLicense: File | null;
    utilityBill: File | null;
}

export const handleValidation = (e: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLButtonElement>, currentStep: number, setCurrentStep: React.Dispatch<React.SetStateAction<number>>,) => {
    e.preventDefault();
    console.log("Form submitted");
    const form = e.currentTarget;
    // Check form validity
    if (!form.checkValidity()) {
        form.reportValidity(); // Show validation messages
        return;
    }

    if (currentStep === 4) {
        return;
    }
    setCurrentStep((prev) => prev + 1)
    window.scrollTo(0, 600);
}
