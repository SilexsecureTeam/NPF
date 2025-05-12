import { Link } from "react-router-dom"
import heroImg from "../../../assets/services/machineryHero.png"


export default function MachineryInsuranceServiceLanding() {    
    return (
        <>
            {/* <!-- Hero section --> */}
            <div className="w-full relative" >
                <img
                    src={heroImg} alt="Hero img" className="w-full min-h-[400px] max-h-[420px] object-cover object-top" />    
                <div className="absolute bottom-[15%] right-[20%] text-left sm:text-left bg-white bg-opacity-85 p-5 md:px-8 lg:py-10">
                    <div className="text-3xl sm:text-5xl font-bold">
                        <h1 className='text-2xl md:text-3xl lg:text-5xl xl:text-5xl'  >Your <span className="text-green-800">Safety Net</span> for</h1>
                        <h1 className='text-2xl md:text-3xl lg:text-5xl xl:text-5xl' >Life's Uncertainties</h1>
                    </div>
                    <div className="my-1 text-lg sm:text-xl py-3">
                        <p className="text-[#00000080]">
                            Protecting you and your loved ones with reliable <br />
                            coverage when you need it most.
                        </p>
                    </div>
                </div>
            </div>
            <section className="bg-[#1F834008] py-12 md:py-20 lg:py-28 px-7 md:px-20 lg:px-[120px] xl:px-[160px] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 lg:gap-20" >
                <div className="w-full" >
                    <div className="mb-3 text-sm text-[#1F8340] font-semibold flex gap-2 items-center w-fit">
                        <div className="w-2 h-2 rounded-full bg-[#1F8340]" ></div>
                        <span>Explore our</span>
                    </div>
                    <h4 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-5" >
                        MACHINERY BREAKDOWN INSURANCE
                    </h4>
                    <p className="font-medium text-[#00000080] text-sm leading-7 md:text-base md:leading-8 text-justify" >
                        This important form of protection is available to cover all the Machinery (already fixed and in use) against damage caused by breakdown from sources within the machinery. 
                        The breakdown could result to the machinery while:  
                        <ul className="list-disc pl-4">
                            <li>Working or at rest</li>
                            <li>Being dismantled, moved or re-erected for the purpose of cleaning, inspection, repair or installation in another position within the premises stated in the policy.</li>
                        </ul>
                    </p>
                    <Link to={'/make-a-claim'} >

                        <button className="mt-7 md:mt-14 relative px-4 py-1.5 text-white text-sm font-bold rounded-full bg-red-600 border-[5px] border-white shadow-lg">
                        Make a claim
                            <span className="absolute inset-0 rounded-full border-2 border-[#000000] -m-1.5"></span>
                            <span className="absolute -left-1.5 top-0 h-full w-1 bg-[#1F834008] rounded-full"></span>
                            <span className="absolute -right-1.5 top-0 h-full w-1 bg-[#1F834008] rounded-full"></span>
                        </button>
                    </Link>

                </div>
                <div className="rounded-xl md:rounded-2xl p-5 lg:p-10 w-full h-fit bg-white shadow-lg" > 
                    <h4 className="font-semibold mb-6 text-[#000000] pl-5" >
                        Breakdown is the unforeseen damage resulting from: 
                    </h4>                        
                    <div className={`font-medium text-[#00000080] text-sm md:text-base`} >
                        <ul className="list-none space-y-2 mb-8" >
                            <li className="pl-5">
                                Defective material design, construction or erection, vibration, maladjustment, misalignment, loosening of parts, abnormal stresses, self-heating, excessive electrical pressure from any cause, short circuits, open circuits, or arcing, failure of protecting, measuring or regulating devices etc. 
                            </li>
                            <li className="flex gap-1.5 items-center" >
                                <img src="/assets/images/check.svg" alt="" className="w-4 h-4" />
                                <span>Falling, impact, collision or similar occurrences obstruction or the entry of foreign bodies  </span>
                            </li>
                            <li className="flex gap-1.5 items-center" >
                                <img src="/assets/images/check.svg" alt="" className="w-4 h-4" />
                                <span>Any other causes not specifically excluded.  </span>
                            </li>

                            <li className="pl-5 pt-6">
                                The type of machinery to which it might apply are as follows: 
                            </li>
                            <li className="flex gap-1.5 items-center" >
                                <img src="/assets/images/check.svg" alt="" className="w-4 h-4" />
                                <span>Generators</span>
                            </li>
                            <li className="flex gap-1.5 items-center" >
                                <img src="/assets/images/check.svg" alt="" className="w-4 h-4" />
                                <span>Transformer </span>
                            </li>
                            <li className="flex gap-1.5 items-center" >
                                <img src="/assets/images/check.svg" alt="" className="w-4 h-4" />
                                <span>Compressor </span>
                            </li>
                            <li className="flex gap-1.5 items-center" >
                                <img src="/assets/images/check.svg" alt="" className="w-4 h-4" />
                                <span>Pumps </span>
                            </li>
                            <li className="flex gap-1.5 items-center" >
                                <img src="/assets/images/check.svg" alt="" className="w-4 h-4" />
                                <span>Boilers </span>
                            </li>
                            <li className="flex gap-1.5 items-center" >
                                <img src="/assets/images/check.svg" alt="" className="w-4 h-4" />
                                <span>Pressure or vacuum vessels </span>
                            </li>
                            <li className="flex gap-1.5 items-center" >
                                <img src="/assets/images/check.svg" alt="" className="w-4 h-4" />
                                <span>Process Machinery </span>
                            </li>
                        </ul>
                    </div>
                    
                </div>
            </section>
        </>
    )
}






