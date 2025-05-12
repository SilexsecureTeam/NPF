import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import useAdminAuth from "@/hooks/useAdminAuth";
import { PasswordResetValues } from "@/types";

// Form validation schema with 4-digit OTP and email
const schema = yup.object({
    email: yup.string().required(), // Add email to schema to match PasswordResetValues type
    otp: yup.string()
        .required("OTP code is required")
        .matches(/^[0-9]{4}$/, "OTP must be exactly 4 digits"),
    password: yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            "Password must include uppercase, lowercase, number and special character"
        ),
    password_confirmation: yup.string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),
}).required();

export const AdminResetPassword = () => {
    const { loading, resetAndVerifyPassword } = useAdminAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");

    // Initialize form with React Hook Form
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid }
    } = useForm<PasswordResetValues>({
        resolver: yupResolver(schema),
        mode: "onChange"
    });

    // Get email from location state
    useEffect(() => {
        if (location.state?.email) {
            const emailValue = location.state.email;
            setEmail(emailValue);
            
            // Set email in form data
            setValue("email", emailValue, { 
                shouldValidate: true,
                shouldDirty: true
            });
        } else {
            // If no email in state, show error and redirect
            toast.error("Email information missing. Please try again.");
            navigate("/admin/dashboard/auth/forgot-password");
        }
    }, [location.state, navigate, setValue]);

    // Handle form submission
    const onSubmit: SubmitHandler<PasswordResetValues> = async (data) => {
        if (!data.email) {
            toast.error("Email information missing. Please try again.");
            return;
        }

        await toast.promise(
            resetAndVerifyPassword(data),
            {
                pending: "Resetting your password...",
                success: {
                    render({ data }) {
                        navigate("/admin/dashboard/auth/signin");
                        return data as string;
                    }
                },
                error: {
                    render({ data }) {
                        return data as string;
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
                    <h2 className="text-2xl font-bold text-gray-800">Reset Your Password</h2>
                    <p className="mt-2 text-gray-600">
                        Enter the code sent to your email and create a new password
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        {/* Hidden input for email registration */}
                        <input 
                            type="hidden" 
                            {...register("email")} 
                            defaultValue={email}
                        />
                        {/* Display email as read-only field */}
                        <input
                            type="email"
                            id="email-display"
                            value={email}
                            readOnly
                            className="w-full py-2.5 px-4 bg-gray-100 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                            OTP Code (4 digits)
                        </label>
                        <input
                            id="otp"
                            type="text"
                            maxLength={4}
                            inputMode="numeric"
                            {...register("otp")}
                            placeholder="Enter 4-digit OTP code"
                            className={`w-full py-2.5 px-4 border ${errors.otp ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                        />
                        {errors.otp && (
                            <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register("password")}
                            placeholder="Create a new password"
                            className={`w-full py-2.5 px-4 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register("password_confirmation")}
                            placeholder="Confirm your new password"
                            className={`w-full py-2.5 px-4 border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                        />
                        {errors.password_confirmation && (
                            <p className="mt-1 text-sm text-red-600">{errors.password_confirmation.message}</p>
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
                                    Resetting...
                                </div>
                            ) : "Reset Password"}
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

export default AdminResetPassword;