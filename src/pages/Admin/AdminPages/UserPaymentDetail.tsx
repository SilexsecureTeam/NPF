import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import useInsurance from "@/hooks/UseInsurance";
import { toast } from "react-toastify";
import { FaArrowLeft, FaDownload, FaUser, FaCar, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

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
}

interface Vehicle {
  id: number;
  user_id: number;
  driver_license: string;
  license_expire_year: string;
  year_of_driving: number;
  category?: string;
  sub_category?: string;
  insurance_package?: string;
  value_amount?: string;
  motor_type?: string;
  body_color?: string;
  chassis_number?: string;
  engine_number?: string;
  with_effect_from?: string;
  maker: string;
  model: string;
  year: string;
  car_type: string;
  vehicle_registration_number: string;
  created_at: string;
  updated_at?: string;
  payment: Payment;
  user: User;
}

const PaymentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const { getAllUserPayments } = useInsurance();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        setLoading(true);
        if (!id) {
          toast.error("Payment ID is missing");
          setTimeout(() => {
            navigate('/admin/dashboard/user-payments');
          }, 1500);
          return;
        }

        // Get all payments first
        const vehicles = await getAllUserPayments();
        
        if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
          toast.error("No payment data found");
         
          return;
        }
        
        // Find the vehicle with the payment matching our ID
        const matchedVehicle = vehicles.find(v => 
          v.payment && v.payment.id === parseInt(id)
        );
        
        if (matchedVehicle) {
          setVehicle(matchedVehicle);
        } else {
          toast.error("Payment with this ID not found");
        
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
        toast.error("Failed to load payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(parseFloat(amount));
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!vehicle || !vehicle.payment) {
    return (
      <AdminDashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900">Payment Not Found</h2>
              <p className="mt-2 text-gray-600">The payment details you're looking for could not be found.</p>
              <Link
                to="/admin/dashboard/user-payments"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <FaArrowLeft className="mr-2" /> Return to Payments
              </Link>
            </div>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  const { payment, user } = vehicle;
  
  return (
    <AdminDashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/admin/dashboard/user-payments"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
          >
            <FaArrowLeft className="mr-2" /> Back to Payments
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <FaDownload className="mr-2" /> Print Receipt
          </button>
        </div>

        {/* Payment Summary Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Payment Summary</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between mb-8">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-500">Payment Reference</p>
                <p className="text-lg font-semibold">{payment.reference}</p>
              </div>
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(payment.amount)}</p>
              </div>
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-500">Status</p>
                <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  payment.status === 'success'
                    ? 'bg-green-100 text-green-800'
                    : payment.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {payment.status.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-sm font-medium">{formatDate(payment.created_at)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                  <FaUser className="mr-2 text-green-600" /> Customer Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Customer Name</p>
                    <p className="font-medium">{user.title} {user.first_name} {user.middle_name || ''} {user.last_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="font-medium">{user.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Account Type</p>
                    <p className="font-medium capitalize">{user.use_type}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                  <FaCar className="mr-2 text-green-600" /> Vehicle Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Vehicle</p>
                    <p className="font-medium">{vehicle.maker} {vehicle.model} ({vehicle.year})</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Vehicle Type</p>
                    <p className="font-medium">{vehicle.car_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Registration Number</p>
                    <p className="font-medium">{vehicle.vehicle_registration_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Driver's License</p>
                    <p className="font-medium">{vehicle.driver_license} (Expires: {vehicle.license_expire_year})</p>
                  </div>
                  {vehicle.category && (
                    <div>
                      <p className="text-xs text-gray-500">Insurance Category</p>
                      <p className="font-medium">{vehicle.category} / {vehicle.sub_category || 'N/A'}</p>
                    </div>
                  )}
                  {vehicle.insurance_package && (
                    <div>
                      <p className="text-xs text-gray-500">Insurance Package</p>
                      <p className="font-medium capitalize">{vehicle.insurance_package.replace('_', ' ')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="mt-8 border rounded-lg p-4 bg-gray-50">
              <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                <FaMoneyBillWave className="mr-2 text-green-600" /> Payment Details
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Payment ID</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{payment.id}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Reference</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{payment.reference}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Amount</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{formatCurrency(payment.amount)}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Currency</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{payment.currency}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Status</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Created Date</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(payment.created_at)}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Last Updated</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(payment.updated_at)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transaction Timeline */}
            <div className="mt-8 border rounded-lg p-4 bg-gray-50">
              <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                <FaCalendarAlt className="mr-2 text-green-600" /> Transaction Timeline
              </h3>
              <div className="relative ml-3">
                <div className="absolute top-0 h-full border-l-2 border-green-300 left-3"></div>
                <ul className="space-y-6">
                  <li className="relative">
                    <div className="flex items-start mb-1">
                      <div className="absolute left-0 mt-1.5 -ml-1.5 bg-green-500 h-8 w-8 rounded-full flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <div className="ml-10">
                        <h4 className="font-semibold text-gray-900">Payment Created</h4>
                        <p className="text-sm text-gray-500">{formatDate(payment.created_at)}</p>
                        <p className="mt-1 text-sm text-gray-600">Payment was initiated with reference {payment.reference}</p>
                      </div>
                    </div>
                  </li>
                  <li className="relative">
                    <div className="flex items-start mb-1">
                      <div className={`absolute left-0 mt-1.5 -ml-1.5 h-8 w-8 rounded-full flex items-center justify-center
                        ${payment.status === 'success' ? 'bg-green-500' : 
                          payment.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                        {payment.status === 'success' ? (
                          <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : payment.status === 'pending' ? (
                          <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-10">
                        <h4 className="font-semibold text-gray-900">Payment {payment.status === 'success' ? 'Completed' : payment.status === 'pending' ? 'Processing' : 'Failed'}</h4>
                        <p className="text-sm text-gray-500">{formatDate(payment.updated_at)}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          {payment.status === 'success'
                            ? `Payment of ${formatCurrency(payment.amount)} was successfully processed`
                            : payment.status === 'pending'
                            ? 'Payment is being processed'
                            : 'Payment transaction failed'}
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default PaymentDetail;