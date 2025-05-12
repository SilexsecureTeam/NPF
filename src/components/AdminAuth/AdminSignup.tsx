import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import useAdminAuth from '@/hooks/useAdminAuth';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AdminRegistrationData } from '@/types';
import { toast } from 'react-toastify';
import AdminDashboardLayout from '../Layout/AdminLayout/AdminLayout';

const schema = Yup.object().shape({
    use_type: Yup.string().oneOf(["admin", "superadmin"], "Select a valid user type").required("User type is required"),
    name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    password_confirmation: Yup.string()
        .oneOf([Yup.ref('password'), undefined], "Passwords must match")
        .required("Confirm password is required"),
});

export default function AdminSignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { AdminRegistration } = useAdminAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
    });

    const onSubmit: SubmitHandler<AdminRegistrationData> = async (data) => {
        toast.promise(
            AdminRegistration(data), {
            pending: "Creating account...",
            success: {
                render({ data }) {
                    return <div>{data as string}</div>
                }
            },
            error: {
                render({ data }) {
                    return <div>{data as string}</div>
                }
            }
        },
        )
    }

    return (
        <>
          <AdminDashboardLayout>
          <div className="min-h-screen flex items-center justify-center p-4">
                <div className="md:flex bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-4xl">
                    {/* Left side - Form */}
                    <div className="md:w-1/2 p-8 flex flex-col items-center justify-center">
                        <div className="mb-6 text-center">
                            <img src="/assets/logo/npf_logo.svg" alt="NPF Logo" className="max-w-[50%] mx-auto cursor-pointer mb-6" />
                            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Create Admin Account</h2>
                            <p className="text-gray-600 md:text-lg">Enter your details to get started</p>
                        </div>

                        <form className='w-full max-w-md' onSubmit={handleSubmit(onSubmit)}>
                            {/* User Type Dropdown */}
                            <div className="mb-4">
                                <label htmlFor="use_type" className="block text-sm font-medium text-gray-700 mb-1 text-left">Admin Type</label>
                                <select
                                    id="use_type"
                                    className={`w-full border-2 ${errors.use_type ? 'border-red-500' : 'border-[#D3CDCD]'} rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white`}
                                    {...register("use_type")}
                                >
                                    <option value="">Select admin type</option>
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Super Admin</option>
                                </select>
                                {errors.use_type && <p className="mt-1 text-red-500 text-sm">{errors.use_type.message}</p>}
                            </div>

                            {/* Full Name Field */}
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 text-left">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter your full name"
                                    className={`w-full border-2 ${errors.name ? 'border-red-500' : 'border-[#D3CDCD]'} rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                    {...register("name")}
                                />
                                {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
                            </div>

                            {/* Email Field */}
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    className={`w-full border-2 ${errors.email ? 'border-red-500' : 'border-[#D3CDCD]'} rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                    {...register("email")}
                                />
                                {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
                                {!errors.email && touchedFields.email && (
                                    <p className="mt-1 text-green-500 text-sm">Email is valid</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 text-left">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="Create a password"
                                        className={`w-full border-2 ${errors.password ? 'border-red-500' : 'border-[#D3CDCD]'} rounded px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                        {...register("password")}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 text-left">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        placeholder="Confirm your password"
                                        className={`w-full border-2 ${errors.password_confirmation ? 'border-red-500' : 'border-[#D3CDCD]'} rounded px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                        {...register("password_confirmation")}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password_confirmation && <p className="mt-1 text-red-500 text-sm">{errors.password_confirmation.message}</p>}
                            </div>

                            <button
                                type="submit"
                                className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            >
                                Create Account
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm">
                            Already have an account? <Link to="/admin/dashboard/auth/signin" className="text-green-600 font-bold hover:underline">Sign in</Link>
                        </p>
                    </div>

                    {/* Right side - Image or additional info */}
                    <div className="hidden md:block md:w-1/2 bg-green-50">
                        <div className="h-full flex items-center justify-center p-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-green-800 mb-4">Administrator Access</h2>
                                <p className="text-gray-700">
                                    Create your admin account to manage the NPF Insurance platform.
                                    This area is restricted to authorized personnel only.
                                </p>
                                <img
                                    src="/assets/images/admin-illustration.svg"
                                    alt="Admin Illustration"
                                    className="max-w-[80%] mx-auto mt-8"
                                    onError={(e) => {
                                        e.currentTarget.src = "/assets/logo/npf_logo.svg";
                                        e.currentTarget.className = "max-w-[60%] mx-auto mt-8";
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </AdminDashboardLayout>
        </>
    )
}