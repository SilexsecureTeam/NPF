
import { useState } from "react";
import bgImg from "../../assets/auth/bgImg.png";
import passwordImg from "../../assets/auth/password.svg"
import { toast } from "react-toastify";
import { baseUrl } from "@/services/axios-client";
import { useNavigate } from "react-router-dom";


export default function ForgotPasswordComponent() {

    const navigate = useNavigate()
    const [email, setEmail] = useState('');

    const handleForgotPassword = async (e: any) => {
        e.preventDefault();
        console.log('what is going on')
        const toastId = toast.loading("Processing...")        
        if(email == ''){
            toast.error("Please fill in the email address");
            toast.dismiss(toastId)
            return;
        }
        try {
            const forgotPasswordRequest = await fetch(`${baseUrl}/user/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
            });

            const forgotPasswordResponse = await forgotPasswordRequest.json();
            console.log(forgotPasswordResponse);

            if (forgotPasswordRequest.ok) {
                toast.success(forgotPasswordResponse.message || "Otp sent successfully");
                sessionStorage.setItem("forgotPasswordEmail", email);
                setTimeout(() => {
                    navigate('/auth/reset-password');
                },500)
            } else {
                toast.error(forgotPasswordResponse.message || "Otp request failed");
            }
        } catch (error) {
            console.error("Error during signIn:", error);
            toast.error("Something went wrong, please try again.");
        } finally {
            toast.dismiss(toastId)
        }
    };

    return (
        <div className="h-screen md:flex bg-white shadow-lg rounded-2xl overflow-hidden w-full ">          
            {/* Left Section - Form */}
            
            <div className="md:w-1/2 p-8 flex flex-col items-center justify-center text-center">
                {/* <img src="/assets/logo/logo4.jpg" alt="Company Logo" className="max-w-[50%] mx-auto mb-1" />   */}
                <img src="/assets/logo/npf_logo.svg" alt="Company Logo" className="max-w-[80%] mx-auto mb-1 cursor-pointer" onClick={() => navigate("/")} />
                <div className="mb-6">
                    <img src={passwordImg} alt="otp key" className="max-w-16 lg:max-w-20 mx-auto mb-4" />
                    <h2 className="text-2xl md:text-3xl font-semibold mb-2">Forgot Password</h2>
                    <p className="text-[#4D4E50] md:text-lg">Enter the email address registered with your account</p>
                </div>

                <form className='w-full md:max-w-[65%]' >
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full border-2 border-[#D3CDCD] px-4 py-2 lg:py-2.5 mb-4 focus:outline-none"
                        onChange={(e:any)=> setEmail(e.target.value)}
                    />
                    <button
                        onClick={handleForgotPassword}
                        className="mt-8 w-full bg-green-600 text-white py-2.5 rounded hover:bg-green-700 transition">
                        Reset password
                    </button>
                </form>
                
                <div className="mt-8 md:max-w-[70%] mx-auto">
                    <p className="text-sm lg:text-base text-[#3C3939] text-center">
                    This site is protected by reCAPTCHA and the Google <a href="#" className="underline">Privacy Policy</a> and
                    <a href="#" className="underline"> Terms of Service</a> | <a href="#" className="underline">Contact us</a>
                    </p>
                </div>
            </div>

            {/* Right Section - Image */}
            <div className="w-1/2 bg-gray-100 hidden md:flex">
                <div className="h-full w-6 bg-[#EFEB05] mr-1" ></div>
                <div className="h-full w-6 bg-[#009345]" ></div>
                <img
                    src={bgImg}
                    alt="Placeholder"
                    className="w-full max-h-screen object-cover"
                />
            </div>
        </div>
    );
}
