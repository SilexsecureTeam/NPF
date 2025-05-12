import { Link } from "react-router-dom"
import heroImg from "../../assets/insurance/hero.png"
import downArrow from "../../assets/insurance/down-arrow.svg"
import { useState } from "react";


export default function MotorInsuranceQuoteLanding() {
    const [featuresDisplay, setFeaturesDisplay] = useState(true);
    return (
        <>
            {/* <!-- Hero section --> */}
            <div className="w-full">
                <img src={heroImg} alt="Hero img" className="w-full max-h-[500px] md:max-h-[700px]" />    
            </div>
            <section className="bg-[#1F834008] py-8 md:py-12 px-7 md:px-20 lg:px-[160px] xl:px-[200px]" >                
                <div className="mb-20 lg:mb-28 mx-auto text-center space-y-3 md:space-y-5" >
                    <div className=" text-sm text-[#1F8340] font-semibold text-center flex gap-2 items-center w-fit mx-auto">
                        <div className="w-2 h-2 rounded-full bg-[#1F8340]" ></div>
                        <span>OUR SERVICES</span>
                    </div>
                    <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl text-black ">Let's get started on your car insurance quote</h2>
                    <p className="text-[#00000080] font-medium text-sm md:text-base w-full md:w-[50%] lg:w-[40%] mx-auto text-center">
                        Fill in your vehicle details beginning with year, below. Or enter
                        your VIN and we can pre-fill some of the required information.
                    </p>
                </div>

                <div className="w-full max-w-[1000px] mx-auto space-y-10 xl:space-y-20">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-10 lg:gap-12" >
                        <div className="w-full md:w-[300px] h-[250px] md:h-[200px] xl:h-[250px] shrink-0 bg-[#141B3466] rounded-[10px]" ></div>
                        <div className="flex flex-col justify-between gap-3" >
                            <h3 className="font-bold text-lg lg:text-xl" >
                                Third Party Insurance
                            </h3>
                            <p className="text-base lg:text-xl font-medium text-[#00000080]" >
                                Third-Party Car Insurance is mandatory in Nigeria, covering liability for injuries, deaths, or property damage to others. It protects vehicle owners from legal and financial risks.
                            </p>
                            <Link to={`/motor-insurance-quote-form?insurance-type=third-party`} className="bg-[#1F8340] py-2 xl:py-3.5 px-6 xl:px-9 font-medium text-white rounded-full w-fit">
                                Buy Now
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 md:gap-10 lg:gap-12" >
                        <div className="w-full md:w-[300px] h-[250px] md:h-[200px] xl:h-[250px] shrink-0 bg-[#1F834033] rounded-[10px]" ></div>
                        <div className="flex flex-col justify-between gap-3" >
                            <h3 className="font-bold text-lg lg:text-xl" >
                                Premium Insurance
                            </h3>
                            <p className="text-base lg:text-xl font-medium text-[#00000080]" >
                                Third-Party Car Insurance is mandatory in Nigeria, covering liability for injuries, deaths, or property damage to others. It protects vehicle owners from legal and financial risks.
                            </p>
                            <Link to = {`/motor-insurance-quote-form?insurance-type=premium`} className="bg-[#1F8340] py-2 xl:py-3.5 px-6 xl:px-9 font-medium text-white rounded-full w-fit">
                                Buy Now
                            </Link>
                        </div>
                    </div>
                </div>                
            </section>
            <section className="bg-white py-8 md:py-12 px-7 md:px-20 lg:px-[160px] xl:px-[200px] flex flex-col md:flex-row gap-10" >
                <div className="flex-1" >
                    <div className="mb-3 text-sm text-[#1F8340] font-semibold flex gap-2 items-center w-fit">
                        <div className="w-2 h-2 rounded-full bg-[#1F8340]" ></div>
                        <span>FEATURES</span>
                    </div>
                    <h4 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-5" >
                        What We Offer
                    </h4>
                    <p className="font-medium text-[#00000080] text-sm leading-7 md:text-base md:leading-8" >
                        Our Comprehensive Motor Insurance provides the widest cover against fire, theft and other damages caused to your vehicle. It also covers death, bodily injury and damages to the vehicle or property of third parties caused by the insured vehicle(s).
                    </p>
                </div>
                <div className="border-[#00000033] border-2 rounded-xl md:rounded-2xl p-5 flex-1 w-full h-fit" >
                    <div className="flex items-center justify-between cursor-pointer"
                        onClick={() => setFeaturesDisplay(!featuresDisplay)}
                    >
                        <h4 className="font-semibold" >
                            Benefits
                        </h4>
                        <img src={downArrow} alt="Down arrow" className={`w-10 h-10 ${featuresDisplay ? "" : "rotate-180"} transition-all duration-500`}  />
                    </div>
                    <div className={`${featuresDisplay ? "" : "hidden"} mt-3 `} >
                        <ul className="list-disc font-medium text-[#00000080] space-y-5 pl-6 text-sm md:text-base" >
                            <li>Accidental damages to own vehicle</li>
                            <li>Loss/damage to own vehicle by fire or theft</li>
                            <li>Covers damage to another’s property up to 3 million naira.</li>
                            <li>Accidental total and permanent disability to the insured to a limit of ₦1,000,000.00</li>
                            <li>We cover your medical expense including that of other vehicle’s passenger(s) to a limit of ₦100,000.00 in the event of a hospitalization due to accident.</li>
                        </ul>
                    </div>
                    
                </div>
            </section>
        </>
    )
}






