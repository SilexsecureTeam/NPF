
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import bgImg from "../../assets/auth/bgImg.png";
//import googleImg from "../../assets/auth/google.svg";
//import linkedinImg from "../../assets/auth/linkedin.svg";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "@/services/axios-client";
import { getFirstErrorMessage } from "@/services/utils";



export default function SigninComponent() {

    const navigate = useNavigate();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [userFormData, setUserFormData] = useState({
        email: "",
        password: "",
    });

    const handleInputChange = (e:any) => {
        setUserFormData({...userFormData, [e.target.name]: e.target.value });
    };
    const handleSignIn = async (e: any) => {
        e.preventDefault();
        const toastId = toast.loading("Processing...")

        if(
            userFormData.email === "" ||
            userFormData.password === ""
        ){
            toast.error("Please fill all the required fields");
            toast.dismiss(toastId)
            return;
        }
        try {
        const signInRequest = await fetch(`${baseUrl}/user/login`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(userFormData),
        });

        const signInResponse = await signInRequest.json();
        console.log(signInResponse);

        if (signInRequest.ok) {
            toast.success("User logged in successfully");

            // Simulating a response with token and user details
            const { token, user } = signInResponse.data;

            // Save user data & token to sessionStorage
            sessionStorage.setItem("authToken", token);
            sessionStorage.setItem("userData", JSON.stringify(user));

            // Redirect based on where the user came from
            const cameFromMotorInsurance = sessionStorage.getItem("cameFromMotorInsurance");

            if (cameFromMotorInsurance) {
                navigate("/motor-insurance-quote-form")
                sessionStorage.removeItem("cameFromMotorInsurance"); // Remove after detecting it
            } else {
                navigate("/dashboard/home");
            }
        } else {
            
            if (signInResponse.message.includes("Please verify your Account")) {
                //toast.error(signInResponse.message || "signIn failed");
                toast.error("Attempt to resend otp")
                sessionStorage.setItem("otpEmail", userFormData.email)
                sessionStorage.removeItem("signupEmail");
                navigate("/auth/otp")
            }else if (signInResponse.message === "Validation failed") {
                const firstError = getFirstErrorMessage(signInResponse.errors);
                toast.error(firstError || "Validation error occurred."); // Display first error or generic message
            } else {
                toast.error(signInResponse.message || "Signin failed");
            }
        }
        } catch (error) {
            console.error("Error during signIn:", error);
            toast.error("Something went wrong, please try again.");
        } finally {
            toast.dismiss(toastId)
        }
    };

    // Redirect to dasboard if authenticated
    useEffect(() => { 
        const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
        const isAuthenticated = !!userData.id;
        if (isAuthenticated) {
            navigate("/dashboard/home");
        }
    },[])

    return (
        <div className="md:h-screen md:flex bg-white shadow-lg rounded-2xl overflow-hidden w-full ">        
            <div className="md:w-1/2 p-8 flex flex-col items-center justify-center text-center">
                <div className="mb-6">
                    <img src="/assets/logo/npf_logo.svg" alt="Company Logo" className="max-w-[80%] mx-auto cursor-pointer" onClick={() => navigate("/")} />
                    <h2 className="text-2xl md:text-3xl font-semibold mb-2">Welcome back!</h2>
                    <p className="text-[#4D4E50] md:text-lg">Please enter your details</p>
                </div>

                <form className='w-full md:max-w-[65%]' >
                    <input
                        type="email"
                        placeholder="Enter your email"
                        onChange={handleInputChange}
                        name="email"
                        className="w-full border-2 border-[#D3CDCD] px-4 py-2 lg:py-2.5 mb-5 focus:outline-none"
                    />
                    <div className="relative">
                        <input
                            type={isPasswordVisible ? "text":"password"}
                            placeholder="Enter your password"
                            onChange={handleInputChange}
                            name="password"    
                            className="w-full border-2 border-[#D3CDCD] px-4 py-2 lg:py-2.5 pr-10 focus:outline-none"
                        />
                        {isPasswordVisible ?              
                        <span className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer">
                            <FaEyeSlash onClick={() => {setIsPasswordVisible(false)}} />
                        </span>: 
                        <span className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer">
                            <FaEye onClick={() => {setIsPasswordVisible(true)}} />
                        </span>
                        }            
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <label className="flex items-center">
                        <input type="checkbox" className="mr-2" /> Remember me
                        </label>
                        <a href="/auth/forgot-password" className="text-[#009345] font-bold text-sm">Forgot your password?</a>
                    </div>

                    <button
                        onClick={handleSignIn}
                        className="mt-8 w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition">
                        Sign in
                    </button>
                </form>

                <p className="mt-4 text-center text-sm">
                    Don’t have a NPF account? <a href="/auth/signup" className="text-[#009345] font-bold">Sign up</a>
                </p>

                {/* <div className="flex items-center my-7">
                    <div className="flex-grow h-px w-full bg-gray-300"></div>
                    <span className="mx-2 text-[#151417] text-sm w-full flex-shrink-0">Or sign in with your work email</span>
                    <div className="flex-grow h-px w-full bg-gray-300"></div>
                </div>

                <div className="flex justify-center space-x-4">
                    <button className="border p-2 rounded-full hover:bg-gray-100">
                        <img src={googleImg} alt="Google" />
                    </button>
                    <button className="border p-2 rounded-full hover:bg-gray-100">
                        <img src={linkedinImg} alt="LinkedIn" />
                    </button>
                </div>

                <div className="mt-8 md:max-w-[70%] mx-auto">
                    <p className="text-sm lg:text-base text-[#3C3939] text-center">
                    This site is protected by reCAPTCHA and the Google <a href="#" className="underline">Privacy Policy</a> and
                    <a href="#" className="underline"> Terms of Service</a> | <a href="#" className="underline">Contact us</a>
                    </p>
                </div> */}
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
