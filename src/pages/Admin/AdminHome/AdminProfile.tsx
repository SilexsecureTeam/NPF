import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAdminAuth from "@/hooks/useAdminAuth";
import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import { FaUserCircle, FaEnvelope, FaIdCard, FaCalendarAlt, FaClock, FaLock, FaArrowLeft } from "react-icons/fa";

// Define the user details type
interface AdminUserDetails {
  id: number;
  name: string;
  email: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

const AdminProfile = () => {
  const navigate = useNavigate();
  const { getAdminDetails, loading } = useAdminAuth();
  const [userDetails, setUserDetails] = useState<AdminUserDetails | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await getAdminDetails();
        setUserDetails(data.data);
      } catch (error: any) {
        setFetchError(error.toString());
        toast.error(error.toString());
        
        // If unauthorized, redirect to login
      }
    };

    fetchUserDetails();
    // Include dependencies to avoid ESLint warnings
  }, []);

  // Format date to a readable format
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <AdminDashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <button 
                  onClick={() => navigate("/admin/dashboard/home")}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600"
                >
                  <FaArrowLeft className="mr-1" />
                  Dashboard
                </button>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-sm font-medium text-gray-500">Profile</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-6 relative">
            <h2 className="text-2xl font-bold">Admin Profile</h2>
            <p className="text-green-100 mt-1"></p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
            </div>
          ) : fetchError ? (
            <div className="p-12 text-center">
              <div className="rounded-full bg-red-100 p-4 mx-auto w-20 h-20 flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p className="text-red-600 text-lg font-medium mb-2">Unable to Load Profile</p>
              <p className="text-gray-600 mb-6">{fetchError}</p>
              <button
                onClick={() => navigate("/admin/dashboard/home")}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Return to Dashboard
              </button>
            </div>
          ) : userDetails ? (
            <div className="p-0">
              {/* Profile Header with Avatar */}
              <div className="bg-gray-50 py-10 px-6 text-center border-b">
                <div className="inline-flex items-center justify-center h-32 w-32 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white text-3xl font-bold uppercase mb-4 shadow-lg">
                  {userDetails.name?.charAt(0) || "A"}
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{userDetails.name}</h3>
                <p className="text-gray-600 mt-1">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {userDetails.use_type.toUpperCase() }
                  </span>
                </p>
              </div>

              {/* Profile Details */}
              <div className="p-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h4>
                
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FaIdCard className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-4">
                      <h5 className="text-sm font-medium text-gray-500">User ID</h5>
                      <p className="mt-1 text-gray-900 font-medium">{userDetails.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FaEnvelope className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-4">
                      <h5 className="text-sm font-medium text-gray-500">Email Address</h5>
                      <p className="mt-1 text-gray-900 font-medium">{userDetails.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FaCalendarAlt className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-4">
                      <h5 className="text-sm font-medium text-gray-500">Account Created</h5>
                      <p className="mt-1 text-gray-900 font-medium">{formatDate(userDetails.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FaClock className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-4">
                      <h5 className="text-sm font-medium text-gray-500">Last Updated</h5>
                      <p className="mt-1 text-gray-900 font-medium">{formatDate(userDetails.updated_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="mt-10 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Security</h4>
                  
                  <div className="bg-gray-50 rounded-lg p-4 flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <FaLock className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-4">
                        <h5 className="font-medium text-gray-900">Password</h5>
                        <p className="text-sm text-gray-500 mt-1">Secure your account with a strong password</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate("/admin/dashboard/auth/change-pwd")}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
                    >
                      Change Password
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => navigate("/admin/dashboard/home")}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <FaArrowLeft className="mr-2" />
                    Return to Dashboard
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="rounded-full bg-gray-100 p-4 mx-auto w-20 h-20 flex items-center justify-center mb-4">
                <FaUserCircle className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No user details available</p>
              <button
                onClick={() => navigate("/admin/dashboard/home")}
                className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminProfile;