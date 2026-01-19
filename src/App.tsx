import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { ScrollToTop } from "@/components/ui";
import { Home, ProductDetails, Profile, Cart, Shop, Orders, OrderDetails } from "@/pages/main";
import { EmailAuth, VerifyOTP, KYC } from "@/pages/auth";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      delay: 100,
      offset: 100,
    });   
  }, []);
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<ProductDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        {/* Auth Routes */}
        <Route path="/auth" element={<EmailAuth />} />
        <Route path="/auth/verify-otp" element={<VerifyOTP />} />
        <Route path="/auth/kyc" element={<KYC />} />
      </Routes>
    </>
  );
}
