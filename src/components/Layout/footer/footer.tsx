import React, { useState } from "react";
import { BiLogoFacebook } from "react-icons/bi";
import { Link } from "react-router-dom";
import { SiInstagram } from "react-icons/si";
import { TbBrandX } from "react-icons/tb";
import useInsurance from "@/hooks/UseInsurance";
import { toast } from "react-toastify";

export default function Footer() {
  const {SubmitToNewsLetter} = useInsurance();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setIsSubmitting(true);
      
      toast.promise(
        SubmitToNewsLetter(email), 
        {
          pending: "Subscribing...",
          success: {
            render({ data: _data }) {
              setEmail("");
              setIsSubmitting(false);
              return "Successfully subscribed to our newsletter!";
            },
          },
          error: {
            render({ data: _data }) {
              setIsSubmitting(false);
              return "Failed to subscribe. Please try again.";
            },
          },
        }
      );
    }
  };
  
  return (
    <>
      <footer className="text-white bg-green-800 py-10 ">
        <div className="px-8 sm:px-16">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:pl-20 flex flex-col justify-center">
              <div>
                <h1 className="text-gray-100 pb-1 text-xs"> ABOUT US</h1>
                <div className="py-2">
                  <ul className="text-lg">
                    <li><a href="/privacy-policy">Privacy</a></li>
                    <li><a href="/claims">Claims</a></li>
                    <li><a href="">Third Party claims</a></li>
                    <li><a href="">About Us</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <div className="text-2xl font-bold w-full md:max-w-[350px]">
                <img src={'/assets/logo/footer-logo-cropped.png'} alt="NPF Logo" />
              </div>

              <h1 className=" text-2xl md:text-4xl font-bold pt-[-10px] text-white mt-6">Subscribe for our </h1>
              <h1 className="text-2xl md:text-4xl font-bold text-white">newsletter</h1>
              <form onSubmit={handleSubmit} className="mt-5 flex items-center max-w-md">
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow px-4 py-2 border border-white bg-green-800 focus:outline-none rounded-lg w-96"
                  disabled={isSubmitting}
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-800 text-white rounded-r-md flex items-center justify-center disabled:opacity-70"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "..." : "→"}
                </button>
              </form>

              <div className="pt-7">
                <h1 className="text-gray-100 pb-1 text-xs">CONTACT US</h1>
                <div className="py-2">
                  <ul className="text-lg font-bold">
                    <li>
                      <a href="tel:+2349054110010">+234-905-411-0010</a>
                    </li>
                    <li>
                      <a href="tel:+2349054110011">+234-905-411-0011</a>
                    </li>
                    <li>
                      <a href="mailto:contact@npfinsurance.com">contact@npfinsurance.com</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="md:pl-20 flex flex-col justify-center">
              <div>
                <h1 className="text-gray-100 pb-1 text-xs"> ADDRESS</h1>
                <div className="py-2">
                  <ul className="text-lg">
                    <li>Behind Louis Edet House</li>
                    <li>Force Headquarters, Shehu Shagari Way, </li>
                    <li> Abuja </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex space-x-9">
                <Link to={"https://www.facebook.com/profile.php?id=61569490243943"}>
                  <BiLogoFacebook className="text-white text-lg" />
                </Link>
                <Link to={"https://www.instagram.com/npfinsurance?igsh=MXV4a280dDBvNzNw"}>
                  <SiInstagram className="text-white text-lg" />
                </Link>
                <Link to={"https://x.com/npfInsurance?t=fr1lvo6fvgRCO37JhzPdHw&s=09"}>
                  <TbBrandX className="text-white text-lg" />
                </Link>
              </div>
            </div>

            <div className="text-[11px] md:pl-20">
              <p> &#x00A9; {new Date().getFullYear()} - NPF Insurance Company LTD. All Rights Reserved.</p>
              <p> </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}