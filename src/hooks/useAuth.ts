import { useAuthStore } from "@/store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/config/api";
import { toast } from "sonner";
import type { KYCType } from "@/schemas/auth";

interface AuthResponse {
  success: boolean;
  message: string;
  user?: IUser;
  isNewUser?: boolean;
}

export default function useAuth() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const emailAuth = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>("/v1/auth/authenticate", {
        email,
      });

      if (response.data.success) {
        // Store email in sessionStorage for OTP verification page
        sessionStorage.setItem("authEmail", email);

        // If user is returned and not new, they're logged in directly
        if (response.data.user && !response.data.user.isNewUser) {
          setUser(response.data.user);
          toast.success("Login successful");
          navigate("/");
          return;
        }

        // If user is new or needs OTP verification, redirect to verify-otp
        toast.success("Verification code sent to your email");
        navigate("/auth/verify-otp");
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to authenticate";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>("/v1/auth/verify-otp", {
        otp,
      });

      if (response.data.success && response.data.user) {
        setUser(response.data.user);

        // Check if user is new
        if (response.data.isNewUser) {
          // Store OTP verification status
          sessionStorage.setItem("otpVerified", "true");
          toast.success("OTP verified successfully");
          navigate("/auth/kyc");
        } else {
          // Existing user - redirect to home
          toast.success("Login successful");
          navigate("/");
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>("/v1/auth/resend-otp");

      if (response.data.success) {
        toast.success("Verification code sent to your email");
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to resend OTP";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const kyc = async (data: KYCType) => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>("/v1/auth/kyc", data);

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        // Clear session storage
        sessionStorage.removeItem("authEmail");
        sessionStorage.removeItem("otpVerified");
        toast.success("Profile completed successfully");
        navigate("/");
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to complete profile";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post("/v1/auth/logout");
      setUser(null);
      // Clear session storage
      sessionStorage.removeItem("authEmail");
      sessionStorage.removeItem("otpVerified");
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to logout";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await api.get<AuthResponse>("/v1/auth/check", {
        silent: true, // Don't show error toasts for this request
      });

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        return response.data.user;
      }
      return null;
    } catch {
      // Silently fail - user is not authenticated
      setUser(null);
      return null;
    }
  };

  return {
    emailAuth,
    verifyOTP,
    resendOTP,
    kyc,
    logout,
    checkAuth,
    user,
    isLoading,
  };
}
