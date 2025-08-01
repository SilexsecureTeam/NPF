import React, { useState } from "react";
import { BiLogoFacebook } from "react-icons/bi";
import { Link } from "react-router-dom";
import { SiInstagram } from "react-icons/si";
import { TbBrandX } from "react-icons/tb";
import useInsurance from "@/hooks/UseInsurance";
import { toast } from "react-toastify";
import { usePageViews } from "../../../hooks/usePageViews";
import Counter from "./Counter";
import { FaSpinner } from "react-icons/fa6";

export default function Footer() {
  const { SubmitToNewsLetter } = useInsurance();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { count: pageViewCount, isLoading: isPageViewLoading } = usePageViews();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setIsSubmitting(true);
      toast.promise(SubmitToNewsLetter(email), {
        pending: "Subscribing...",
        success: {
          render() {
            setEmail("");
            setIsSubmitting(false);
            return "Successfully subscribed to our newsletter!";
          },
        },
        error: {
          render() {
            setIsSubmitting(false);
            return "Failed to subscribe. Please try again.";
          },
        },
      });
    }
  };

  return (
    <footer className="text-white bg-green-800 py-10">
      <div className="px-8 sm:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About Us */}
          <div className="md:pl-20 flex flex-col justify-center">
            <h1 className="text-gray-100 pb-1 text-xs">ABOUT US</h1>
            <ul className="text-lg py-2 space-y-1">
              <li>
                <a href="/privacy-policy">Privacy</a>
              </li>
              <li>
                <a href="/claims">Claims</a>
              </li>
              <li>
                <a href="#">Third Party Claims</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mt-6">
              Subscribe for our <br /> newsletter
            </h1>
            <form
              onSubmit={handleSubmit}
              className="mt-5 flex items-center max-w-md"
            >
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-4 py-2 border border-white bg-green-800 focus:outline-none rounded-l-lg text-white"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white text-green-800 rounded-r-lg font-bold disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? "..." : "→"}
              </button>
            </form>

            <div className="pt-7">
              <h1 className="text-gray-100 pb-1 text-xs">CONTACT US</h1>
              <ul className="text-lg font-bold py-2 space-y-1">
                <li>
                  <a href="tel:+2349054110010">+234-905-411-0010</a>
                </li>
                <li>
                  <a href="tel:+2349054110011">+234-905-411-0011</a>
                </li>
                <li>
                  <a href="mailto:contact@npfinsurance.com">
                    contact@npfinsurance.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Address */}
          <div className="md:pl-20 flex flex-col justify-center">
            <h1 className="text-gray-100 pb-1 text-xs">ADDRESS</h1>
            <ul className="text-lg py-2 space-y-1">
              <li>Behind Louis Edet House</li>
              <li>Force Headquarters, Shehu Shagari Way</li>
              <li>Abuja</li>
            </ul>
          </div>
        </div>

        {/* Social Links & Page Views */}
        <div className="grid grid-cols-1 md:grid-cols-2 mt-10 items-center gap-6">
          <div className="flex space-x-9 md:pl-20">
            <Link to="https://www.facebook.com/profile.php?id=61569490243943">
              <BiLogoFacebook className="text-white text-xl" />
            </Link>
            <Link to="https://www.instagram.com/npfinsurance?igsh=MXV4a280dDBvNzNw">
              <SiInstagram className="text-white text-xl" />
            </Link>
            <Link to="https://x.com/npfInsurance?t=fr1lvo6fvgRCO37JhzPdHw&s=09">
              <TbBrandX className="text-white text-xl" />
            </Link>
          </div>

          {/* Page Views */}
          <div className="text-white text-sm text-right md:text-left md:pl-20">
            <div className="inline-flex items-center gap-4 bg-zinc-900/80 border border-white/10 shadow-inner backdrop-blur-sm px-4 py-3 rounded-2xl">
              <div className="flex flex-col">
                <span className="text-[13px] text-gray-400 leading-tight">
                  Visitors today
                </span>
                {isPageViewLoading ? (
                  <span className="text-white animate-pulse text-xl font-bold mt-2">
                    <FaSpinner className="animate-spin" />
                  </span>
                ) : (
                  <Counter number={pageViewCount ?? 0} />
                )}
              </div>
              <div className="p-2 bg-lime-500/10 rounded-full text-lime-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h2l.4 2M7 16h10l1-2H6l1 2zm0 0l1 2h8l1-2m-3-6h4m-4 0H9m4 0V4m0 6v4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-center text-gray-300 mt-10 pt-5 border-t border-white/10">
          &copy; {new Date().getFullYear()} - NPF Insurance Company LTD. All
          Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
