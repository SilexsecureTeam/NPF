import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useAdminAuth from '@/hooks/useAdminAuth';
import { LoginFormInputs } from '@/types';
// Form validation schema
const schema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});



export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading] = useState(false);
    const { AdminLogin } = useAdminAuth();

    // You can replace this with your actual auth hook functionality
    // const { login } = useAdminAuth();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        toast.promise(
            AdminLogin(data), {
            pending: "Signing in...",
            success: {
                render({ data }) {
                    return <div>{data as string}</div>
                },
            },
            error: {
                render({ data }) {
                    return <div>{data as string}</div>
                },
            },
        }
        )
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-md">
                <div className="p-8 flex flex-col items-center justify-center">
                    <img
                        src="/assets/logo/npf_logo.svg"
                        alt="NPF Logo"
                        className="max-w-[50%] mx-auto cursor-pointer mb-6"
                    />

                    <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-center">
                        Admin Login
                    </h2>

                    <p className="text-gray-600 text-center mb-8">
                        Sign in to access your admin dashboard
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                className={`w-full px-4 py-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                placeholder="Enter your email"
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    className={`w-full px-4 py-2.5 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Remember Me and Forgot Password */}
                        <div className="flex items-center justify-between">
                            {/* <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  {...register('rememberMe')}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div> */}
                            <Link
                                to="/admin/dashboard/auth/reset-pwd"
                                className="text-sm font-semibold text-green-600 hover:text-green-700 transition"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 
                    transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                    disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    {/* <p className="mt-6 text-center text-sm">
                        Don't have an account?{' '}
                        <Link to="/admin/dashboard/auth/signup" className="font-semibold text-green-600 hover:text-green-700 transition">
                            Create an account
                        </Link>
                    </p> */}
                </div>
            </div>
        </div>
    );
}