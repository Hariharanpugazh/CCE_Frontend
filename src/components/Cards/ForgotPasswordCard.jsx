
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import InputField from "../Common/InputField";
import login1 from "../../assets/images/LoginImg1.png";
import login2 from "../../assets/images/LoginImg2.png";
import login3 from "../../assets/images/LoginImg3.png";
import Squares from "../../components/ui/GridLogin";

export default function ForgotPasswordCard({
  page,
  formDataSetter,
  formData,
  onSubmit,
  onResendOTP,
  onVerifyOTP,
}) {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [index, setIndex] = useState(0); // ✅ Defined `index` state

  // Image Slider Logic
  const images = [login1, login2, login3];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (otpSent) {
        await onVerifyOTP(e);
        toast.success("OTP verified successfully!");
      } else {
        await onSubmit(e);
        toast.success("OTP sent successfully! Please check your email.");
        setOtpSent(true);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async (e) => {
    setLoading(true);
    try {
      await onResendOTP(e);
      toast.success("OTP resent successfully! Please check your email.");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div className="h-full w-full absolute top-0 left-0 z[-5]">
        {/* <img src={wavyPattern} alt="Background Pattern" className="w-full" /> */}
        <Squares
          speed={0.1}
          squareSize={40}
          direction="diagonal" // up, down, left, right, diagonal
          borderColor="	#FCF55F"
          hoverFillColor="#ffcc00"
        />
      </div>

      {/* Card container */}
      <div className="w-3/4 min-h-3/4 max-h-[85%] bg-white shadow-lg rounded-lg flex items-stretch p-2 relative">
        {/* Image Slider Section */}
        <div className="flex-1 flex justify-center items-center p-2">
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden">
            <AnimatePresence>
              <motion.img
                key={index}
                src={images[index]}
                alt={`Slide ${index + 1}`}
                className="absolute w-full h-full object-cover rounded-lg shadow-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.8 }}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Form section */}
        <div className="flex-1 p-6 flex flex-col items-center justify-evenly">
          <div className="flex flex-col space-y-2 items-center">
            <p className="text-4xl font-medium">{page.displayName}</p>
            <p className="text-[#838383] text-sm w-3/4 text-center">
              {otpSent
                ? "Enter the OTP sent to your email"
                : "Enter your email to receive a password reset OTP"}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-3/4 flex flex-col items-center"
          >
            <div className="space-y-2 mb-6 w-full">
              <InputField
                args={{
                  placeholder: "Enter your Email",
                  required: true,
                  type: "email",
                  disabled: otpSent, // Disable email after OTP is sent
                }}
                value={formData.email}
                setter={(val) =>
                  formDataSetter((prev) => ({ ...prev, email: val }))
                }
              />
              {otpSent && (
                <InputField
                  args={{
                    placeholder: "Enter OTP",
                    required: true,
                    title: "Please enter a 6-digit OTP",
                  }}
                  value={formData.token}
                  setter={(val) =>
                    formDataSetter((prev) => ({ ...prev, token: val }))
                  }
                />
              )}
            </div>

            {/* Dynamic submit button */}
            <button
              type="submit"
              className={`p-3 rounded-2xl w-full font-semibold transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#FECC00] hover:bg-[#eebc00]"
              }`}
              disabled={loading}
            >
              {loading
                ? otpSent
                  ? "Verifying..."
                  : "Sending..."
                : otpSent
                ? "Verify OTP"
                : "Send OTP"}
            </button>

            {otpSent && (
              <button
                type="button"
                onClick={handleResendOTP}
                className="mt-4 text-sm text-gray-600 hover:text-gray-800 underline"
                disabled={loading}
              >
                {loading ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
