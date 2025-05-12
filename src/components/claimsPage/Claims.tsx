import { Link } from "react-router-dom";

export default function Claims() {    
    return (
        <>
            {/* Hero section */}
            <div className="w-full relative min-h-[400px] max-h-[420px] bg-[#1F8340] flex items-center justify-center">                
                <div className="text-center p-5 md:px-8 lg:py-10 text-[#FFFFFF]">
                    <div className="text-3xl sm:text-5xl font-bold">
                        <h1 className='text-2xl md:text-3xl lg:text-5xl xl:text-5xl text-[#EFEB05] inline-block px-4 py-2'>
                            Claims
                        </h1>
                    </div>
                    <div className="my-1 text-lg sm:text-xl py-3">
                        <p><Link to="/" >Home</Link> -&gt; Claims</p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <section className="bg-white text-[#000000] py-12 md:py-20 lg:py-28 px-7 md:px-20 lg:px-[120px] xl:px-[160px] text-base lg:text-lg">
                <p className="mb-8">
                    In line with our commitment to providing a smooth and timely resolution of your claims, please find below our target timelines for settlements. We are dedicated to making the process as stress-free and seamless as possible. If your expectations are not met, kindly reach out to us at <a href="mailto:contact@npfinsurance.com" className="text-[#1F8340] font-semibold">contact@npfinsurance.com</a>.
                </p>

                {/* Life Policies */}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-1">Life Policies</h2>
                <table className="mb-20 w-full border-collapse text-sm lg:text-base"/*  style={{ borderCollapse: 'separate', borderSpacing:'0em 10px'} */ >
                    <tbody>
                        <tr className="border-b border-t-4 border-[#000000]">
                            <td className = "text-center w-1/3 p-3">Maturity</td>
                            <td className = "text-center w-1/3 p-3">Savings / Endowment Policies</td>
                            <td className = "text-center w-1/3 p-3">Acknowledgement within 24 hours of receipt of the maturity notice</td>
                        </tr>
                        <tr className="border-b border-[#000000]">
                            <td className="text-center w-1/3 p-3" ></td>
                            <td className="text-center w-1/3 p-3" >Benefit Payment (Savings)</td>
                            <td className="text-center w-1/3 p-3" >Payment on maturity date</td>
                        </tr>
                        <tr className="border-b border-[#000000]">
                            <td></td>
                            <td className="text-center w-1/3 p-3" >Benefit Payment (Endowment)</td>
                            <td className="text-center w-1/3 p-3" >Payment within 3 working days after documentation for all amount</td>
                        </tr>
                        <tr className="border-b border-[#000000]">
                            <td className="text-center w-1/3 p-3" >Surrender</td>
                            <td></td>
                            <td className="text-center w-1/3 p-3" >Acknowledgement within 24 hours of receipt of surrender request</td>
                        </tr>
                        <tr className="border-b border-[#000000]">
                            <td></td>
                            <td className="text-center w-1/3 p-3" >Benefit Payment</td>
                            <td className="text-center w-1/3 p-3" >Within 3 working days for all amount</td>
                        </tr>
                        <tr className="border-b border-[#000000]">
                            <td className="text-center w-1/3 p-3" >Death Claims</td>
                            <td></td>
                            <td className="text-center w-1/3 p-3" >Acknowledgement within 24 hours of receipt of claim notification</td>                            
                        </tr>
                         <tr className="border-b border-[#000000]">
                            <td></td>
                            <td className="text-center w-1/3 p-3" >Payment of Claim</td>
                            <td className="text-center w-1/3 p-3" >Payment within 3 working days after documentation for all amount</td>
                        </tr>
                    </tbody>
                </table>

                {/* Non-Life Policies */}
                <div className="border-b-4 border-b-[#000000] mb-6">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-1">Non-Life Policies</h2>
                </div>
                <table className="w-full border-collapse text-sm lg:text-base"/*  style={{ borderCollapse: 'separate', borderSpacing:'0em 10px'} */ >
                    <tbody>
                        <tr className="border-b border-[#000000]">                    
                            <td></td>
                            <td className = "text-center w-1/2 p-3 text-xl md:text-2xl lg:text-3xl font-semibold">Target Timeline</td>
                        </tr>
                        <tr className="border-b border-[#000000]">
                            <td className="text-center w-1/2 p-3" >Claim Notification</td>
                            <td className="text-center w-1/2 p-3" >Acknowledge within 24 hours of receipt of notification.</td>
                        </tr>
                        <tr className="border-b border-[#000000]">
                            <td className="text-center w-1/2 p-3" >Motor Claims Payment</td>
                            <td className="text-center w-1/2 p-3" >Within 48 hours on receipt of executed discharge voucher</td>
                        </tr>
                        <tr className="border-b border-[#000000]">
                            <td className="text-center w-1/2 p-3" >Non-Motor Claims Payment</td>
                            <td className="text-center w-1/2 p-3" >Within 3 working days on receipt of executed discharge voucher</td>
                        </tr>
                    </tbody>
                </table>

               
            </section>
        </>
    );
}
