import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";

const CertificateCard = ({ image }: {image:any}) => (
    <div className="">
        <img src={image} alt="" className="w-full max-h-[400px] mb-3" />
        <div className="flex justify-between items-center text-[10px] md:text-xs lg:text-sm" >
            <button className="text-white bg-[#000000] px-2 py-1" >
                Generate Certificate
            </button>
            <button className="text-white bg-[#47AA49] px-2 py-1" >
                Approved Cerificate
            </button>
        </div>
    </div>
);


export default function DashboardCertificatesPage() {
    return (
        <DashboardLayout>
            <div className="p-6">                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <CertificateCard image="/assets/images/certificate.png" />
                    <CertificateCard image="/assets/images/certificate.png" />
                    <CertificateCard image="/assets/images/certificate.png" />
                    <CertificateCard image="/assets/images/certificate.png" />
                </div>
            </div>
        </DashboardLayout>
    );
}
