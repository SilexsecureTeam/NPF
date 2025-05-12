import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import useInsurance from "@/hooks/UseInsurance";
import { useEffect, useState } from "react";
// Import useUserDetails no longer needed

// Define types to match the API response
interface Payment {
  id: number;
  user_id: number;
  vehicle_id: number;
  reference: string;
  amount: string;
  currency: string;
  status: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  title: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  phone_number: string;
  use_type: string;
  email_verified_at: string;
  created_at: string;
}

interface Vehicle {
  id: number;
  user_id: number;
  driver_license: string;
  license_expire_year: string;
  year_of_driving: number;
  category: string;
  sub_category: string;
  insurance_package: string;
  vehicle_registration_number: string;
  value_amount: string;
  motor_type: string;
  maker: string;
  model: string;
  body_color: string;
  year: string;
  car_type: string;
  chassis_number: string;
  engine_number: string;
  with_effect_from: string;
  created_at: string;
  payment: Payment;
  user: User;
}


export default function DashboardPaymentPage() {
    const { getAllUserPaymentsForClient } = useInsurance();
    const [payments, setPayments] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Add formatCurrency function that was missing
    const formatCurrency = (amount: number, currency: string = 'NGN') => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                // Get user ID directly from sessionStorage like in DashboardLayout
                const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
                const userId = userData.id;
                
                
                if (userId) {
                    const response = await getAllUserPaymentsForClient(userId);                    
                    // Handle the actual structure of the API response
                    if (response && response.vehicles) {
                        setPayments(response.vehicles);
                    } else if (Array.isArray(response)) {
                        // If response is directly an array
                        setPayments(response);
                    } else {
                        setError("No payment data found or unexpected data format");
                    }
                } else {
                    setError("User ID not found. Please try logging in again.");
                }
            } catch (err) {
                setError("Failed to fetch payment data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []); 

    // Format date to readable format
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            console.error("Date formatting error:", e);
            return "Invalid date";
        }
    };

  

    // Get the insurance package display name
    const getPackageDisplay = (packageType: string) => {
        switch(packageType) {
            case 'premium':
                return 'Premium';
            case 'third_party':
                return 'Third Party';
            default:
                return packageType?.charAt(0).toUpperCase() + packageType?.slice(1) || "Unknown";
        }
    };

    // Safely format currency with fallbacks - now using the local formatCurrency function
    const safeFormatCurrency = (amount: string | undefined, currency: string = 'NGN') => {
        if (!amount) return formatCurrency(0, currency);
        
        try {
            return formatCurrency(parseFloat(amount), currency);
        } catch (e) {
            console.error("Currency formatting error:", e);
            return formatCurrency(0, currency);
        }
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment History</h1>
                
                {loading && (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {!loading && !error && payments.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-8 rounded-lg text-center">
                        <p className="text-lg font-medium">No payment records found.</p>
                        <p className="text-sm mt-2">You haven't made any insurance payments yet.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {payments.map((vehicle) => (
                        <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-green-600 text-white p-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-bold">
                                        {vehicle?.maker || "Unknown"} {vehicle?.model || ""} ({vehicle?.year || "N/A"})
                                    </h2>
                                    <span className="text-sm bg-white text-green-600 px-3 py-1 rounded-full font-semibold">
                                        {vehicle?.payment?.status === 'success' ? 'Paid' : vehicle?.payment?.status || "Unknown"}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-5">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-gray-500 text-sm">Registration Number</p>
                                        <p className="font-medium">{vehicle?.vehicle_registration_number || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Insurance Type</p>
                                        <p className="font-medium">{getPackageDisplay(vehicle?.insurance_package || "")}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Category</p>
                                        <p className="font-medium">{vehicle?.category || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Sub-Category</p>
                                        <p className="font-medium">{vehicle?.sub_category || "N/A"}</p>
                                    </div>
                                </div>

                                <hr className="my-4" />
                                
                                {vehicle?.payment && (
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-gray-800 mb-2">Payment Details</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-500 text-sm">Amount</p>
                                                <p className="font-medium text-green-600">
                                                    {safeFormatCurrency(vehicle.payment.amount, vehicle.payment.currency)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm">Reference</p>
                                                <p className="font-medium text-sm">{vehicle.payment.reference || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm">Payment Date</p>
                                                <p className="font-medium">{formatDate(vehicle.payment.created_at)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm">Vehicle Value</p>
                                                <p className="font-medium">{safeFormatCurrency(vehicle.value_amount)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                               
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}