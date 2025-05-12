import { Link } from "react-router-dom"
import heroImg from "../../../assets/services/fireHero.png"


export default function FireAndSpecialsServiceLanding() {    
    return (
        <>
            {/* <!-- Hero section --> */}
            <div className="w-full relative">
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(270deg, rgba(255, 255, 255, 0.02) 31.72%, rgba(31, 131, 64, 0.2) 89.38%)'
                    }}></div>
                <img src={heroImg} alt="Hero img" className="w-full min-h-[400px] max-h-[420px] object-cover object-top" />    
                <div className="absolute bottom-[15%] right-[20%] text-left sm:text-left p-5 md:px-8 rounded-2xl">
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
                <div className="flex-1 shrink-0" >
                    <div className="mb-3 text-sm text-[#1F8340] font-semibold flex gap-2 items-center w-fit">
                        <div className="w-2 h-2 rounded-full bg-[#1F8340]" ></div>
                        <span>Explore our</span>
                    </div>
                    <h4 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-5" >
                        FIRE & SPECIAL PERILS
                    </h4>
                    <p className="font-medium text-[#000000] text-sm leading-7 md:text-base md:leading-8 text-justify" >
                        The Insurance Act 2003 makes it mandatory for every public building to be insured with a registered insurer against the risk of fire and special perils. Fire and special Perils Insurance covers the devastating effect fire can have on assets such as building and contents in the premises. This policy covers fire, explosions, bush fire, flood, impact, riot, strike, malicious damage, earthquake, burst pipes and all others included or added to the policy.
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
                <div className="border-[#00000033] border-2 bg-[#1F8340] text-white rounded-xl md:rounded-2xl p-5 lg:p-10 flex-1 w-full h-fit" >                    
                    <h4 className="font-semibold mb-6" >
                        SCHEDULE OF PROPERTY COVERED
                    </h4>                        
                    <div className={`font-medium text-white text-sm md:text-base text-justify`} >
                        <p>
                            On Building of Standard Construction including outbuilding, contents, machinery & stock, situate anywhere in Nigeria owned or held by the insured in trust or commission. Please advise value per building/location, value of contents, machinery and stock of items to be covered , to enable us indicate our rate.
                        </p>                        
                    </div>
                    
                </div>
            </section>
        </>
    )
}






