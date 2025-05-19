import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useInsurance from '@/hooks/UseInsurance';

import callImg from "../../assets/contact/call-now.svg";
import addressImg from "../../assets/contact/address.svg";
import policyImg from "../../assets/contact/policy.svg";
import supportImg from "../../assets/contact/support.svg";
import reportImg from "../../assets/contact/report.svg";
import { Send, Check} from 'lucide-react';
import { toast } from 'react-toastify';
import { FeedBackForm } from '@/types';

const schema = yup.object({
    full_name: yup.string().required('Full name is required'),
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    phone_number: yup.string().required(),
    subject: yup.string().required('Please select a subject'),
    message: yup.string().required('Message is required').min(10, 'Message must be at least 10 characters')
}).required();

export default function Contact() {
    // Get contact page data from API
    const [contactData, setContactData] = useState<any>(null);
    const { getContactPage, sendFeedBackForm } = useInsurance();
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    // React Hook Form setup with our local interface
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FeedBackForm>({
        resolver: yupResolver(schema)
    });

    // Fetch contact page data when component mounts
    useEffect(() => {
        const fetchContactData = async () => {
            try {
                const response = await getContactPage();
                console.log("Contact page data:", response);

                if (response && response.data) {
                    setContactData(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch contact page data:", error);
            }
        };
        fetchContactData();
    }, []);

    // Submit form handler
    const onSubmit = async (data: FeedBackForm) => {
        setFormStatus('submitting');
        
        try {
            await toast.promise(
                sendFeedBackForm(data),
                {
                    pending: 'Sending your message...',
                    success: {
                        render({ data }: { data: any }) {
                            setFormStatus('success');
                            reset(); // Reset form on success
                            return <div>{data as string}</div>;
                        }
                    },
                    error: {
                        render({ data }: { data: any }) {
                            setFormStatus('error');
                            return <div>{data as string}</div>;
                        }
                    }
                }
            );
        } catch (error) {
            setFormStatus('error');
            console.error("Form submission error:", error);
        }
    };

    return (
        <>
            {/* <!-- Hero section --> */}
            <div className="w-full">
                <img
                    src={`https://dash.npfinsurance.com/uploads/${contactData?.image}`}
                    alt="Hero img"
                    className="w-full min-h-[250px] max-h-[500px] md:max-h-[700px] object-cover object-left"
                />
            </div>
            <section className="bg-white py-10 md:py-16 lg:py-20 px-7 md:px-20 xl:px-[200px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10 lg:gap-20 mx-auto">
                    {
                        contactCardData.map((data, index) => (
                            <ContactCard key={index} img={data.img} title={data.title} description={data.description} />
                        ))
                    }
                </div>
            </section>

            {/* Combined Contact Info and Feedback Form Section - Side by Side on Large Screens */}
            <section className="bg-[#F8FAF9] py-10 md:py-16 lg:py-20 px-7 md:px-20 xl:px-[200px]">
                <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10 xl:gap-16">
                    {/* Left side - Contact Info */}
                    <div className="lg:w-5/12 mb-10 lg:mb-0 lg:sticky lg:top-10">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
                            <div className="bg-white px-6 lg:px-8 py-8 flex items-start w-full gap-4 border-[#E2E1E1] border rounded-lg shadow-sm">
                                <img src={callImg} alt="contact enquiry" className="w-10 h-10 mt-1" />
                                <div className="">
                                    <span className="text-sm text-[#383C39] font-bold mb-2 block">Enquiry Now</span>
                                    <p className="text-xl font-black">
                                        {contactData?.detail || "Contact us for more information"}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white px-6 lg:px-8 py-8 flex items-start w-full gap-4 border-[#E2E1E1] border rounded-lg shadow-sm">
                                <img src={addressImg} alt="address" className="w-10 h-10 mt-1" />
                                <div className="font-medium">
                                    <span className="text-sm lg:text-base text-[#383C39] font-bold mb-2 block">Address</span>
                                    <p className="text-sm">
                                        {contactData?.address || "Our company address goes here"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Feedback Form */}
                    <div className="lg:w-7/12">
                        <div className="mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold mb-3">We Value Your Feedback</h2>
                            <p className="text-gray-600">
                                Have questions, comments, or suggestions? We'd love to hear from you. Your feedback helps us improve our services and better meet your insurance needs.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-[#E2E1E1]">
                            
                            {formStatus === 'success' ? (
                                <div className="flex flex-col items-center justify-center py-10">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <Check className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h3>
                                    <p className="text-gray-600 text-center">
                                        Your message has been received. We'll get back to you as soon as possible.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="full_name"
                                                {...register('full_name')}
                                                className={`w-full px-4 py-2.5 border ${errors.full_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                                                placeholder="Your name"
                                            />
                                            {errors.full_name && (
                                                <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                {...register('email')}
                                                className={`w-full px-4 py-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                                                placeholder="your.email@example.com"
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number 
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone_number"
                                                {...register('phone_number')}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                placeholder="+234 800 000 0000"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                                Subject <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="subject"
                                                {...register('subject')}
                                                className={`w-full px-4 py-2.5 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                                            >
                                                <option value="">Select a topic</option>
                                                <option value="General Inquiry">General Inquiry</option>
                                                <option value="Policy Question">Policy Question</option>
                                                <option value="Claims">Claims</option>
                                                <option value="Feedback">Feedback</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errors.subject && (
                                                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                            Your Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            {...register('message')}
                                            rows={5}
                                            className={`w-full px-4 py-2.5 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                                            placeholder="Please provide details about your inquiry or feedback..."
                                        ></textarea>
                                        {errors.message && (
                                            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={formStatus === 'submitting'}
                                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
                                        >
                                            {formStatus === 'submitting' ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Submit Feedback
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

const ContactCard = ({ img, title, description }: { img: string, title: string, description: string }) => {
    return (
        <div className="bg-[#1F834026] p-5 text-center rounded-2xl">
            <img src={img} alt="" className="block mx-auto mb-10 md:mb-1 lg:mb-8" />
            <div className="text-[#000000]" >
                <h3 className="font-semibold text-base lg:text-lg mb-3">{title}</h3>
                <p className="text-sm md:text-xs lg:text-base text-[#00000080]">
                    {description}
                </p>
            </div>
        </div>
    );
};

// Renamed to avoid conflict with the state variable name
const contactCardData = [
    {
        title: "Policy Questions",
        description: "To ask questions about your insurance policy , please contact NPFinsurance.",
        img: policyImg
    },
    {
        title: "Report a Claim",
        description: "We guide you through the simple, hassle-free process of securing your claim.",
        img: reportImg
    },
    {
        title: "Ongoing Support",
        description: "Enjoy peace of mind with our 24/7 support and assistance whenever you need it.",
        img: supportImg
    },
];