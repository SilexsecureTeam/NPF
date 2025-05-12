import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";

const ClaimForm = () => {
    return (
        <div className="p-6">
            <div className="flex mb-10">
                <div className="bg-[#1F8340] w-3 h-9" >
                </div>
                <div className="bg-[#EFEB05] text-[#374557] flex items-center px-2 font-semibold">
                    CLAIMS PROCESS
                </div>
            </div>
            <div className="mt-4 space-y-4">
                <input type="text" placeholder="Policy Number" className="w-full p-2 border border-gray-300" />
                <input type="text" placeholder="Reg. Number" className="w-full p-2 border border-gray-300" />
                <input type="email" placeholder="Email Address" className="w-full p-2 border border-gray-300" />
                <textarea placeholder="Comments" className="w-full p-2 border border-gray-300 h-32"></textarea>
            </div>
            <div className="mt-4">
                <p className="text-sm font-medium">Upload Supporting Documents</p>
                <button className="bg-[#47AA49] text-white px-4 py-2 mt-2">Browse</button>
            </div>
        </div>
    );
};

/* const ClaimProcessSteps = () => {
  return (
    <div className="mt-6 text-sm">
      <p className="text-red-600 font-semibold">Registration: <span className="text-black">Notify us of the accident, theft, or claim by filling the form above.</span></p>
      <p className="text-red-600 font-semibold mt-2">Documentation: <span className="text-black">Upload all necessary documents depending on the kind of claim.</span></p>
      <p className="text-red-600 font-semibold mt-2">Processing: <span className="text-black">Claim is received and processed.</span></p>
      <p className="text-red-600 font-semibold mt-2">Settlement: <span className="text-black">Claim is settled on confirmation.</span></p>
    </div>
  );
}; */

export default function DashboardClaimsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <ClaimForm />
        {/* <ClaimProcessSteps /> */}
        {/* <div className="mt-6 flex justify-center">
          <img src="/assets/images/accident.png" alt="Car Accident" className="max-w-full h-auto" />
        </div> */}
      </div>
    </DashboardLayout>
  );
}
