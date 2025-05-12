import { useState, useEffect } from 'react';
import bgImg from "../../assets/auth/bgImg.png";
import otpImg from "../../assets/auth/otp.svg"
import OTPInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { baseUrl } from '@/services/axios-client';

const OTPVerificationComponent = () => {

  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(100);
  const [resendEnabled, setResendEnabled] = useState(true);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setResendEnabled(true);
    }
  }, [timer]);

  const handleResend = async (e:any) => {
    e.preventDefault();
    if (resendEnabled) {
      setTimer(100);
      setResendEnabled(false);      
      const toastId = toast.loading("Resending otp...")
      try {
          const resendOtpRequest = await fetch(`${baseUrl}/user/resent-otp`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: sessionStorage.getItem("otpEmail")
              }),
          });

          const resendOtpResponse = await resendOtpRequest.json();
          console.log(resendOtpResponse);

          if (resendOtpRequest.ok) {
              toast.success(resendOtpResponse.message || "Otp resent successfully");
          } else {
              toast.error(resendOtpResponse.message || "otp resend failed");
          }
        } catch (error) {
          console.error("Error during signIn:", error);
          toast.error("Something went wrong, please try again.");
        } finally {
          toast.dismiss(toastId)
        }      
    }
  };

  const handleVerifyOtp = async (e: any) => {
      e.preventDefault();
      const toastId = toast.loading("Processing...")

      if(otp == ''){
          toast.error("Please fill in otp");
          toast.dismiss(toastId)
          return;
      }
      try {
        const otpVerificationRequest = await fetch(`${baseUrl}/user/verifyOtp`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
              otp,
              email: sessionStorage.getItem("signupEmail") || sessionStorage.getItem("otpEmail")
            }),
        });

        const otpVerificationResponse = await otpVerificationRequest.json();
        console.log(otpVerificationResponse);

        if (otpVerificationRequest.ok) {
            toast.success("User verified successfully");
            navigate('/auth/signin')
        } else {
            toast.error(otpVerificationResponse.message || "otp verification failed");
        }
      } catch (error) {
        console.error("Error during signIn:", error);
        toast.error("Something went wrong, please try again.");
      } finally {
        toast.dismiss(toastId)
      }
  };

  return (
        <div className="md:h-screen md:flex bg-white shadow-lg rounded-2xl overflow-hidden w-full ">          
        
            <div className="md:w-1/2 p-8 flex flex-col items-center justify-center text-center">
                {/* <img src="/assets/logo/logo4.jpg" alt="Company Logo" className="max-w-[50%] mx-auto mb-1" />   */}
                <img src="/assets/logo/npf_logo.svg" alt="Company Logo" className="max-w-[80%] mx-auto mb-1 cursor-pointer" onClick={() => navigate("/")} />
                <div className="text-center">
                    <img src={otpImg} alt="otp key" className="max-w-16 lg:max-w-20 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">OTP Verification</h2>
                    <p className="text-sm text-gray-600 mb-4">We sent a code to {sessionStorage.getItem("signupEmail") || sessionStorage.getItem("otpEmail")}</p>

                    <div className="sm:max-w-[50%] mx-auto">
                      <div className="mx-auto">
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
                      <div className="flex justify-between items-center mt-4">
                          <span className="text-green-600">{Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</span>
                          {!resendEnabled ? (
                          <span className="text-gray-400">Didn't get a code?</span>
                          ) : (
                          <button onClick={handleResend} className="text-green-600 font-medium">Resend</button>
                          )}
                      </div>
                    </div>
                    
                    <button onClick={handleVerifyOtp} className="mt-8 w-full bg-green-600 text-white py-2.5 md:py-3 rounded-lg hover:bg-green-700 transition">
                        Create Account
                    </button>

                    <p className="text-xs text-[#3C3939] mt-4">
                        This site is protected by reCAPTCHA and the Google
                        <a href="#" className="text-blue-500 ml-1">Privacy Policy</a> and
                        <a href="#" className="text-blue-500 ml-1">Terms of Service</a>.
                        <a href="#" className="text-blue-500 ml-1">Contact us</a>
                    </p>
                </div>
            </div>
          
            { /* Right Section - Image */}
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
};

export default OTPVerificationComponent;
