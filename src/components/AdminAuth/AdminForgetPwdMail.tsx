import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAdminAuth from "@/hooks/useAdminAuth";

// Form validation schema
const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required")
}).required();

// Type for form data
type FormData = {
  email: string;
};

export const AdminForgotPasswordEmail = () => {
  const { requestPasswordReset, loading } = useAdminAuth();
  const navigate = useNavigate();
  
  // Initialize react-hook-form
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid } 
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange"
  });
  
  // Define the onSubmit function
  const onSubmit = async (data: FormData) => {
    toast.promise(
      requestPasswordReset(data.email),
      {
        pending: "Sending reset code...",
        success: {
          render({ data }) {
            return <div>{data as string}</div>;
          }
        },
        error: {
          render({ data }) {
            return <div>{data as string}</div>;
          }
        }
      }
    );
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="m-auto w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <img src="/assets/logo/npf_logo.svg" alt="NPF Logo" className="mx-auto h-14 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Forgot Your Password?</h2>
          <p className="mt-2 text-gray-600">
            Enter your email address and we'll send you a password reset code
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input 
                id="email" 
                {...register("email")}
                type="email" 
                placeholder="your@email.com"
                className={`pl-10 w-full py-2.5 px-4 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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
                  Processing...
                </div>
              ) : "Send Reset Code"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate("/admin/dashboard/auth/signin")}
            className="text-sm font-medium text-green-600 hover:text-green-500"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPasswordEmail;