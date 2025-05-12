import { AdminChangePasswordValues, AdminRegistrationData, LoginFormInputs, PasswordResetValues } from "@/types";
import axiosClient from "@/services/axios-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOtpMail, setToken, setAdmin } from "@/components/AdminAuth/store";
import { RootState } from "@/components/AdminAuth/context/rootReducer";
import { AppDispatch } from "@/components/AdminAuth/context";

export default function useAdminAuth() {

    const client = axiosClient();
    const [loading, setLoading] = useState(false);
    const router = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    // Get email from Redux store
    const otpMail = useSelector((state: RootState) => state.auth.otp_mail);

    const AdminRegistration = async (adminData: AdminRegistrationData) => {
        try {
            setLoading(true);
          const res =   await client.post("/admin/register", adminData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log(res);
            

            // Save email in Redux store
            dispatch(setOtpMail(adminData.email));

            // Navigate to OTP page with email in state for fallback
            router("/admin/dashboard/auth/otp-verification", {
                state: { email: adminData.email }
            });

            return Promise.resolve("OTP Sent to your email address");
        } catch (error: any) {
            if (error?.response?.status === 500) {
                return Promise.reject("Email already exists");
            }

            console.error("Error during admin registration:", error);
            const errorMessage = error?.response?.data?.message || "An error occurred during registration";
            return Promise.reject(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };

    const AdminverifyOTP = async (otp: string) => {
        // Get email from Redux store
        const email = otpMail;

        if (!email) {
            return Promise.reject("Email not found. Please register again.");
        }

        try {
            setLoading(true);
            const response = await client.post("/admin/verifyOtp", { email, otp }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // If verification is successful, store user data and token
            if (response.data?.user && response.data?.token) {
                dispatch(setAdmin(response.data.user));
                dispatch(setToken(response.data.token));
            }

            router("/admin/dashboard/home");
            return Promise.resolve("Account verified successfully");
        } catch (error: any) {
            if (error?.response?.status === 500) {
                return Promise.reject("Invalid OTP");
            }
            if (error?.response?.status === 400) {
                return Promise.reject("OTP expired, please resend OTP");
            }
            console.error("Error during OTP verification:", error);
            const errorMessage = error?.response?.data?.message || "Invalid OTP";
            return Promise.reject(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };

    
    const handleResendOTP = async () => {
        // Get email from Redux store
        const email = otpMail;

        if (!email) {
            return Promise.reject("Email not found. Please register again.");
        }

        try {
            setLoading(true);
            await client.post("/admin/resent-otp", { email }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return Promise.resolve("OTP Sent to your email address");
        } catch (error: any) {
            console.error("Error during resend OTP:", error);
            const errorMessage = error?.response?.data?.message || "An error occurred during resend OTP";
            return Promise.reject(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };

  

    const AdminLogout = async () => {
        try {
            setLoading(true);
            localStorage.removeItem("token");
            dispatch(setToken(""));
            dispatch(setAdmin(null));
            router("/admin/dashboard/auth/signin");
            return Promise.resolve("Logged out successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || "An error occurred";
            return Promise.reject(`${errorMessage}`);
        }
        finally {
            setLoading(false);
        }

    }

    const requestPasswordReset = async (email: string) => {
        try {
            setLoading(true);
            const response = await client.post("/admin/forgot-password", { email }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            dispatch(setOtpMail(email));
            router("/admin/dashboard/auth/reset-pwd-verification",
                {
                    state: { email: email } 
                }
            )
            return Promise.resolve(response.data.message);
        } catch (error: any) {
            if (error?.response?.status === 500 || error?.response?.status === 400) {
                return Promise.reject("Email not found");
            }
            console.error("Error during password reset request:", error);
            const errorMessage = error?.response?.data?.message || "An error occurred during password reset request";
            return Promise.reject(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }

    const resetAndVerifyPassword = async (data: PasswordResetValues) => {
        try {
            setLoading(true);
             await client.post("/admin/reset-password", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            router("/admin/dashboard/auth/signin")
            return Promise.resolve("Password reset successfully");
        } catch (error: any) {
            // if (error?.response?.status === 500 || error?.response?.status === 400) {
            //     return Promise.reject("Invalid OTP or password reset failed");
            // }
            console.error("Error during password reset:", error);
            const errorMessage = error?.response?.data?.message || "An error occurred during password reset";
            return Promise.reject(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }

    const AdminChangePwd = async (data: AdminChangePasswordValues) => {
        try {
            setLoading(true);
            
            // Get token from localStorage
            const token = localStorage.getItem("token");
            
            if (!token) {
                return Promise.reject("You are not authenticated. Please sign in again.");
            }
            
            const response = await client.post("/admin/change-password", data, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`  // Add token to authorization header
                },
            });
            router("/admin/dashboard/home")
            return Promise.resolve(response.data.message);
        } catch (error: any) {
            if (error?.response?.status === 401) {
                // Token might be expired or invalid
                localStorage.removeItem("token"); // Clear invalid token
                dispatch(setToken("")); // Clear token from Redux state
                
                // Redirect to login after error message
                setTimeout(() => {
                    router("/admin/dashboard/auth/signin");
                }, 2000);
                
                return Promise.reject("Session expired. Please sign in again.");
            }
            
            console.error("Error during password change:", error);
            const errorMessage = error?.response?.data?.message || "An error occurred during password change";
            return Promise.reject(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }

    const getAdminDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                return Promise.reject("You are not authenticated. Please sign in again.");
            }
            const response = await client.get("/admin/profile", {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            console.log(response);
            
            return response.data;
        } catch (error: any) {
            console.error("Error fetching admin details:", error);
            const errorMessage = error?.response?.data?.message || "An error occurred while fetching admin details";
            return Promise.reject(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }


    const AdminLogin = async (loginData: LoginFormInputs) => {
        try {
            setLoading(true);
            const response = await client.post("/admin/login", loginData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const token = response.data.data.token;
            const userData = response.data.data.detail;
            console.log(userData);
            if (token && userData) {
                const adminUser = {
                    username: userData.name,
                    id: userData.id.toString(),
                    email: userData.email,
                }
                localStorage.setItem("token", token);
                localStorage.setItem("userData", JSON.stringify(adminUser));
                dispatch(setToken(token));
                dispatch(setAdmin(adminUser));
            } else {
                throw new Error("Token not found");
            }
            router("/admin/dashboard/auth/admin-signin-verification",{
                state: { email: loginData.email } 
            });
            return Promise.resolve("Login successful,input OTP to gain access to account");
        } catch (error: any) {
            if (error?.response?.status === 401) {
                return Promise.reject("Invalid credentials");
            }
            if (error?.response?.status === 500) {
                return Promise.reject("Invalid credentials");
            }
            console.error("Error logging in", error);
            const errorMessage = error?.response?.data?.message || "An error occurred during login";
            return Promise.reject(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }
  



    const VerifyAdminLogin= async (email:string,otp:string)=>{
        try {
            setLoading(true);
            const response = await client.post("/admin/verifyOtp", { email, otp }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // If verification is successful, store user data and token
            if (response.data?.user && response.data?.token) {
                dispatch(setAdmin(response.data.user));
                dispatch(setToken(response.data.token));
            }

            router("/admin/dashboard/home");
            return Promise.resolve("Account verified successfully");
        } catch (error: any) {
            if (error?.response?.status === 500) {
                return Promise.reject("Invalid OTP");
            }
            if (error?.response?.status === 400) {
                return Promise.reject("OTP expired, please resend OTP");
            }
            console.error("Error during OTP verification:", error);
            const errorMessage = error?.response?.data?.message || "Invalid OTP";
            return Promise.reject(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }; 
    

      
    const LoginhandleResendOTP = async (email:string) => {
        try {
            setLoading(true);
            await client.post("/admin/resent-otp", { email }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return Promise.resolve("Login OTP Sent to your email address");
        } catch (error: any) {
            console.error("Error during resend OTP:", error);
            const errorMessage = error?.response?.data?.message || "An error occurred during resend OTP";
            return Promise.reject(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };
    

    return {
        loading,
        otpMail,
        AdminRegistration,
        AdminverifyOTP,
        handleResendOTP,
        AdminLogin,
        AdminLogout,
        requestPasswordReset,
        resetAndVerifyPassword,
        AdminChangePwd,
        getAdminDetails,
        VerifyAdminLogin,
        LoginhandleResendOTP,
    };
}