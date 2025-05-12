import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import AdminDashboardLayout from "../Layout/AdminLayout/AdminLayout";
import useAdminAuth from "@/hooks/useAdminAuth";
import { AdminChangePasswordValues } from "@/types";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

// Form validation schema with correct field names
const schema = yup.object({
  current_password: yup.string()
    .required("Current password is required"),
  new_password: yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must include uppercase, lowercase, number and special character"
    ),
  new_password_confirmation: yup.string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("new_password")], "Passwords must match"),
}).required();

const AdminChangePassword = () => {
  const navigate = useNavigate();
  const { AdminChangePwd, loading } = useAdminAuth();
  
  // State to control password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize form with React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<AdminChangePasswordValues>({
    resolver: yupResolver(schema),
    mode: "onChange"
  });

  const onSubmit: SubmitHandler<AdminChangePasswordValues> = async (data) => {
    toast.promise(
      AdminChangePwd(data),
      {
        pending: "Changing password...",
        success: {
          render({ data }) {
            return data as string;
          }
        },
        error: {
          render({ data }) {
            return data as string;
          }
        },
      }
    );
  };

  return (
    <AdminDashboardLayout>
      <div className="flex min-h-screen bg-gray-50">
        <div className="m-auto w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <img src="/assets/logo/npf_logo.svg" alt="NPF Logo" className="mx-auto h-14 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
            <p className="mt-2 text-gray-600">
              Enter your current password and create a new password
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="current_password"
                  {...register("current_password")}
                  placeholder="Enter your current password"
                  className={`w-full py-2.5 px-4 border ${errors.current_password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showCurrentPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.current_password && (
                <p className="mt-1 text-sm text-red-600">{errors.current_password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="new_password"
                  {...register("new_password")}
                  placeholder="Create a new password"
                  className={`w-full py-2.5 px-4 border ${errors.new_password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.new_password && (
                <p className="mt-1 text-sm text-red-600">{errors.new_password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="new_password_confirmation"
                  {...register("new_password_confirmation")}
                  placeholder="Confirm your new password"
                  className={`w-full py-2.5 px-4 border ${errors.new_password_confirmation ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.new_password_confirmation && (
                <p className="mt-1 text-sm text-red-600">{errors.new_password_confirmation.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !isValid}
                className={`w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${(loading || !isValid) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Changing Password...
                  </div>
                ) : "Change Password"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/admin/dashboard/home")}
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminChangePassword;