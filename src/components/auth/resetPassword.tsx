
import OTPInput from "react-otp-input";
import bgImg from "../../assets/auth/bgImg.png";
import passwordImg from "../../assets/auth/reset.svg"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { baseUrl } from "@/services/axios-client";


export default function ResetPasswordComponent() {

    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        password: "",
        password_confirmation: "",
        email: sessionStorage.getItem("forgotPasswordEmail")
    })
    
    const handleInputChange = (e:any) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleResetPassword = async (e: any) => {
      e.preventDefault();
      const toastId = toast.loading("Processing...")

        if (
            formData.email === "" ||
            formData.password === "" ||
            formData.password_confirmation === ""       
        ) {
            toast.error("Please fill all the required fields");
            toast.dismiss(toastId)
            return;
        }

        if (formData.password !== formData.password_confirmation) {
        toast.error("Passwords do not match");
        toast.dismiss(toastId)
        return;
        }
        
      if(otp == ''){
          toast.error("Please fill in otp");
          toast.dismiss(toastId)
          return;
      }
      try {
        const resetPasswordRequest = await fetch(`${baseUrl}/user/reset-password`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...formData,
                otp: otp
            }),
        });

        const resetPasswordResponse = await resetPasswordRequest.json();
        console.log(resetPasswordResponse);

        if (resetPasswordRequest.ok) {
            toast.success(resetPasswordResponse.message || "Password reset successfully");
            sessionStorage.removeItem("forgotPasswordEmail");
            setTimeout(() => {
                navigate('/auth/signin')
            },500)
        } else {
            toast.error(resetPasswordResponse.message || "Password reset failed");
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
                    <h2 className="text-2xl md:text-3xl font-semibold mb-2">Reset your password</h2>
                    <p className="text-[#4D4E50] md:text-lg">Reset your password by entering a new password and otp sent to you</p>
                </div>

                <form className='w-full md:max-w-[65%]' >
                    
                    <input
                        type="password"
                        placeholder="Enter new password"
                        name="password"
                        className="w-full border-2 border-[#D3CDCD] px-4 py-2 lg:py-2.5 mb-4 focus:outline-none"
                        onChange={handleInputChange}
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        name="password_confirmation"
                        className="w-full border-2 border-[#D3CDCD] px-4 py-2 lg:py-2.5 mb-4 focus:outline-none"
                        onChange={handleInputChange}
                    />
                    
                    <div className="mx-auto">
                        {/* <label htmlFor="text-left">Enter Otp</label> */}
                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={4}
                            renderInput = {(props) => <input {...props} /> }
                                renderSeparator = {<span style={{ width: "4px" }}></span>}
                                inputStyle = {{
                                    marginBottom:"",
                                    width: "50px",
                                    marginInline:"auto",
                                    height: "50px",
                                    border: "2px solid #D3CDCD",
                                    /* borderRadius:"5.3px", */
                                    //padding: "13px 20px",
                                    outline: "none",
                                    textAlign: "center",
                                    fontSize:  "14px",
                                    fontWeight: "700",
                                    background: "#FFFFFF",
                                    caretColor: "#38CB89"
                                }}
                        />
                      </div>
                    <button
                        onClick={handleResetPassword}
                        className="mt-8 w-full bg-green-600 text-white py-2.5 rounded hover:bg-green-700 transition">
                        Submit
                    </button>
                </form>
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
