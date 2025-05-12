import { FaEye, FaEyeSlash } from "react-icons/fa6";
import bgImg from "../../assets/auth/bgImg.png";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { baseUrl } from "@/services/axios-client";
import { useNavigate } from "react-router-dom";
import downArrow from "../../assets/insurance/down-arrow.svg";
import { getFirstErrorMessage } from "@/services/utils";

export default function SignupComponent() {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [userFormData, setUserFormData] = useState({
    title: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone_number: "",
    use_type: "",
  });

  const handleInputChange = (e:any) => {
    setUserFormData({...userFormData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    const toastId = toast.loading("Processing...")
    console.log(userFormData)

    if (
      userFormData.first_name === "" ||
      userFormData.last_name === "" ||
      userFormData.email === "" ||
      userFormData.password === "" ||
      userFormData.password_confirmation === "" ||
      userFormData.phone_number === "" ||
      userFormData.title === "" || 
      userFormData.use_type === ""
    ) {
      toast.error("Please fill all the required fields");
      toast.dismiss(toastId)
      return;
    }

    if (userFormData.password !== userFormData.password_confirmation) {
      toast.error("Passwords do not match");
      toast.dismiss(toastId)
      return;
    }

    try {
      const signUpRequest = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userFormData),
      });

      const signUpResponse = await signUpRequest.json();
      console.log(signUpResponse);

      if (signUpRequest.ok) {
        toast.success(signUpResponse.message || "User signed up successfully");
        sessionStorage.setItem("signupEmail", userFormData.email);
        navigate("/auth/otp")        
      } else {
        if (signUpResponse.message === 'Validation error') {
            const firstError = getFirstErrorMessage(signUpResponse.errors);
            toast.error(firstError || "Validation error occurred.");
        } else {
            toast.error(signUpResponse.message || "Signup failed");
        }
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Something went wrong, please try again.");
    } finally {
      toast.dismiss(toastId)
    }
  };

  // Redirect to dashboard if authenticated
  useEffect(() => { 
      const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
      const isAuthenticated = !!userData.id;
      if (isAuthenticated) {
          navigate("/dashboard/home");
      }
  },[])

  return (
    <div className="md:h-screen md:flex bg-white shadow-lg rounded-2xl w-full overflow-hidden">
      {/* Left Section - Form */}
      <div className="md:w-1/2 h-full p-4 md:p-6 overflow-y-auto flex flex-col">
        <div className="text-center mb-4">
          <div className="h-16 flex justify-center items-center mb-2">
            <img 
              src="/assets/logo/npf_logo.svg" 
              alt="Company Logo" 
              className="h-full w-auto object-contain cursor-pointer" 
              onClick={() => navigate("/")}
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">Welcome Onboard!</h2>
          <p className="text-[#4D4E50] md:text-lg">Please enter your details</p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <form className="w-full max-w-md mx-auto space-y-3 py-2">
            <input
              type="text"
              placeholder="First Name"
              name="first_name"
              onChange={handleInputChange}
              className="w-full border-2 border-[#D3CDCD] px-4 py-2.5 rounded focus:outline-none"
            />
            <input
              type="text"
              placeholder="Last Name"
              name="last_name"
              onChange={handleInputChange}
              className="w-full border-2 border-[#D3CDCD] px-4 py-2.5 rounded focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              onChange={handleInputChange}
              className="w-full border-2 border-[#D3CDCD] px-4 py-2.5 rounded focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Phone No"
              name="phone_number"
              onChange={handleInputChange}
              className="w-full border-2 border-[#D3CDCD] px-4 py-2.5 rounded focus:outline-none"
            />
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Enter Password"
                name="password"
                onChange={handleInputChange}
                className="w-full border-2 border-[#D3CDCD] px-4 py-2.5 rounded pr-10 focus:outline-none"
              />
              <span className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600">
                {isPasswordVisible ? (
                  <FaEyeSlash onClick={() => setIsPasswordVisible(false)} />
                ) : (
                  <FaEye onClick={() => setIsPasswordVisible(true)} />
                )}
              </span>
            </div>
            <div className="relative">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                placeholder="Confirm Password"
                name="password_confirmation"
                onChange={handleInputChange}
                className="w-full border-2 border-[#D3CDCD] px-4 py-2.5 rounded pr-10 focus:outline-none"
              />
              <span className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600">
                {isConfirmPasswordVisible ? (
                  <FaEyeSlash onClick={() => setIsConfirmPasswordVisible(false)} />
                ) : (
                  <FaEye onClick={() => setIsConfirmPasswordVisible(true)} />
                )}
              </span>
            </div>

            <div className="relative">
              <select
                name="title"
                onChange={handleInputChange}
                className="w-full border-2 border-[#D3CDCD] px-4 py-2.5 rounded appearance-none focus:outline-none text-[#7A7575]"
              >
                <option value="">Select Title</option>
                <option value="MR">Mr</option>
                <option value="MRS">Mrs</option>
                <option value="MISS">Miss</option>
                <option value="MS">Ms</option>
                <option value="DR">Dr</option>
                <option value="PROF">Prof</option>
                <option value="ENGR">Engr</option>
                <option value="ARCH">Arch</option>
                <option value="BARR">Barr</option>
                <option value="CAPT">Capt</option>
                <option value="LT">Lt</option>
                <option value="MAJ">Maj</option>
                <option value="GEN">Gen</option>
                <option value="COL">Col</option>
                <option value="REV">Rev</option>
                <option value="PASTOR">Pastor</option>
                <option value="EVANG">Evang</option>
                <option value="CHIEF">Chief</option>
                <option value="PRINCE">Prince</option>
                <option value="PRINCESS">Princess</option>
                <option value="HON">Hon</option>
                <option value="SEN">Sen</option>
              </select>
              <img src={downArrow} alt="down-arrow" className="w-6 h-6 absolute transform right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                name="use_type"  
                onChange={handleInputChange}
                className="w-full border-2 border-[#D3CDCD] px-4 py-2.5 rounded appearance-none focus:outline-none text-[#7A7575]"
              >
                <option value="">Select Use Type</option>
                <option value="individual">Individual</option>
                <option value="corporate">Corporate</option>
              </select>
              <img src={downArrow} alt="down-arrow" className="w-6 h-6 absolute transform right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="pt-2">
              <button
                onClick={handleSignUp}
                className="w-full bg-green-600 text-white font-medium py-3 rounded-md hover:bg-green-700 transition shadow-md"
              >
                Sign up
              </button>
            </div>
            
            <p className="mt-4 text-center text-sm">
              Already have an NPF INSURANCE ACCOUNT? <a href="/auth/signin" className="text-[#009345] font-bold">Login</a>
            </p>
          </form>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="w-1/2 bg-gray-100 hidden md:block">
        <div className="h-full flex">
          <div className="h-full w-6 bg-[#EFEB05] mr-1"></div>
          <div className="h-full w-6 bg-[#009345]"></div>
          <div className="flex-1">
            <img
              src={bgImg}
              alt="NPF Insurance"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}