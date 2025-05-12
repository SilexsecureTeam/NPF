import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAdminAuth from '@/hooks/useAdminAuth';
import { toast } from 'react-toastify';
import { setOtpMail } from './store';

export default function AdminOtpVerificationPage() {
    const location = useLocation();
    const dispatch = useDispatch();
    
    // Get auth hook functionality
    const { VerifyAdminLogin, handleResendOTP, loading, otpMail } = useAdminAuth();
    
    // Get email from location state as fallback
    const emailFromState = location.state?.email;
    
    // Display email (prioritize Redux store)
    const displayEmail = otpMail || emailFromState || 'your email';
    
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [timeLeft, setTimeLeft] = useState(120);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    // Update Redux store with email from navigation state if needed
    useEffect(() => {
        if (emailFromState && !otpMail) {
            dispatch(setOtpMail(emailFromState));
        }
    }, [emailFromState, otpMail, dispatch]);
    
    // Handle countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return;
        
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) clearInterval(timer);
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format time as mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Initialize refs array
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 4);
    }, []);

    const handleChange = (index: number, value: string) => {
        // Allow only digits
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input if value is entered
            if (value && index < 3) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace to clear current and focus previous
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputRefs.current[index - 1]?.focus();
        }

        // Handle arrow keys for navigation
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        // If pasted content is numeric and has the right length
        if (/^\d+$/.test(pastedData)) {
            const digits = pastedData.split('').slice(0, 4);
            const newOtp = [...otp];

            digits.forEach((digit, index) => {
                if (index < 4) {
                    newOtp[index] = digit;
                }
            });

            setOtp(newOtp);

            // Focus on the next empty input or the last one if all filled
            const nextEmptyIndex = newOtp.findIndex(val => val === '');
            if (nextEmptyIndex !== -1) {
                inputRefs.current[nextEmptyIndex]?.focus();
            } else {
                inputRefs.current[3]?.focus();
            }
        }
    };

    // Handle OTP verification
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check if OTP is complete
        if (otp.some(digit => digit === '')) {
            toast.error('Please enter the complete 4-digit OTP');
            return;
        }

        const otpCode = otp.join('');
        
        try {
            setIsVerifying(true);
            await VerifyAdminLogin(emailFromState,otpCode);
            toast.success('OTP verification successful!');
            // Navigation happens in the hook after setting user and token
        } catch (error: any) {
            console.error('OTP verification error:', error);
            toast.error(typeof error === 'string' ? error : 'Failed to verify OTP');
        } finally {
            setIsVerifying(false);
        }
    };

    // Handle OTP resend
    const resendOTP = async () => {
        if (timeLeft > 0 || isResending) return;
        
        try {
            setIsResending(true);
            await handleResendOTP();
            toast.success('A new OTP has been sent to your email');
            setTimeLeft(120); 
        } catch (error: any) {
            console.error('Resend OTP error:', error);
            toast.error(typeof error === 'string' ? error : 'Failed to resend OTP');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-md">
                <div className="p-8 flex flex-col items-center justify-center">
                    <img
                        src="/assets/logo/npf_logo.svg"
                        alt="NPF Logo"
                        className="max-w-[40%] mx-auto cursor-pointer mb-6"
                    />

                    <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-center">
                        OTP Verification
                    </h2>

                    <p className="text-gray-600 md:text-md text-center mb-6">
                        Please enter the 4-digit code sent to
                        <span className="font-semibold block text-green-700">
                            {displayEmail}
                        </span>
                    </p>

                    <form className="w-full max-w-md" onSubmit={handleVerifyOTP}>
                        <div className="flex justify-between mb-8">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    autoFocus={index === 0}
                                    disabled={isVerifying || loading}
                                    className="w-12 h-12 text-center text-xl font-bold border-2 border-[#D3CDCD] rounded-md mx-1 
                                              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                                              disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                />
                            ))}
                        </div>

                        <p className="text-center text-gray-600 mb-4">
                            Resend code in <span className="font-semibold">{formatTime(timeLeft)}</span>
                        </p>

                        <div className="flex flex-col space-y-4">
                            <button
                                type="submit"
                                disabled={isVerifying || loading || otp.some(d => d === '')}
                                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 
                                         transition focus:outline-none focus:ring-2 focus:ring-green-500
                                         disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isVerifying || loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : "Verify OTP"}
                            </button>

                            <button
                                type="button"
                                onClick={resendOTP}
                                disabled={isResending || loading || timeLeft > 0}
                                className={`w-full py-3 rounded-lg transition
                                         ${timeLeft > 0 || isResending || loading
                                           ? 'bg-gray-100 text-gray-500 border border-gray-300 cursor-not-allowed' 
                                           : 'bg-transparent text-green-600 border border-green-600 hover:text-green-800 hover:border-green-800'}`}
                            >
                                {isResending || (loading && timeLeft === 0) ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : "Resend Code"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm">
                        <Link to="/admin/dashboard/auth/signin" className="text-gray-600 hover:text-green-600">
                            ← Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}