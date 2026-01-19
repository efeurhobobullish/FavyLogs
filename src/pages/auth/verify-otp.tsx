import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ButtonWithLoader } from "@/components/ui";
import useAuth from "@/hooks/useAuth";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOTP, resendOTP, isLoading } = useAuth();

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem("authEmail");
    if (!storedEmail) {
      navigate("/auth");
      return;
    }
    setEmail(storedEmail);
    // Focus first input
    inputRefs.current[0]?.focus();
  }, [navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    
    try {
      await verifyOTP(otpCode);
    } catch (error) {
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      console.error(error);
      
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP();
    } catch (error) {
      console.error(error);
      // Error is already handled in the hook
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white p-8 md:p-10">
    

        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-3">
            Verify OTP
          </h1>
          <p className="text-muted text-sm md:text-base mb-2">
            Enter the 6-digit code sent to
          </p>
          <p className="text-main font-semibold">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 md:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 md:w-14 md:h-16 bg-secondary text-center text-2xl font-bold border-2 border-line text-main focus:outline-none focus:border-main transition-colors font-space"
                disabled={isLoading}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.join("").length !== 6}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Verifying...</span>
            ) : (
              <>
                <span>Verify</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <button
          onClick={() => navigate("/auth")}
          className="h-12 w-full btn font-space border border-line mt-4 text-muted hover:text-main hover:bg-line transition-all duration-300"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="text-center mt-6 center gap-2 flex-wrap">
          <p className="text-sm text-muted">Didn't receive the code?</p>
          <ButtonWithLoader
            type="button"
            onClick={handleResendOTP}
            className="text-sm text-main font-space font-semibold uppercase hover:text-main/80 transition-colors"
            initialText="Resend OTP"
            loadingText="Resending OTP..."
            loading={isLoading}
          />
          
        </div>
      </div>
    </AuthLayout>
  );
}

