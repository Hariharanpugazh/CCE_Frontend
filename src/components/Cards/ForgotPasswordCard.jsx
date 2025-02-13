import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../Common/InputField";
import wavyPattern from "../../assets/images/wavy-circles.png";

export default function ForgotPasswordCard({
  page,
  formDataSetter,
  formData,
  onSubmit,
  onResendOTP,
  onVerifyOTP, // New prop for OTP verification
}) {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (otpSent) {
        // Call verification handler if OTP was sent
        await onVerifyOTP(e);
        toast.success("OTP verified successfully!");
        // Handle post-verification logic here (e.g., redirect to password reset)
      } else {
        // Initial OTP submission
        await onSubmit(e);
        toast.success("OTP sent successfully! Please check your email.");
        setOtpSent(true);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred. Please try again.";
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
      {/* Background pattern */}
      <div className="h-full w-full absolute z-[-1] flex items-center top-[10%]">
        <img src={wavyPattern} alt="Decorative background" className="" />
      </div>

      {/* Card container */}
      <div className="w-3/4 min-h-3/4 max-h-[85%] bg-white shadow-lg rounded-lg flex items-stretch p-2">
        {/* Illustration section */}
        <div className="flex-1 bg-yellow-100 rounded-lg"></div>

        {/* Form section */}
        <div className="flex-1 p-6 flex flex-col items-center justify-evenly">
          <div className="flex flex-col space-y-2 items-center">
            <p className="text-4xl font-medium">{page.displayName}</p>
            <p className="text-[#838383] text-sm w-3/4 text-center">
              {otpSent ? "Enter the OTP sent to your email" : "Enter your email to receive a password reset OTP"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-3/4 flex flex-col items-center">
            <div className="space-y-2 mb-6 w-full">
              <InputField
                args={{ 
                  placeholder: "Enter your Email", 
                  required: true,
                  type: "email",
                  disabled: otpSent // Disable email after OTP is sent
                }}
                value={formData.email}
                setter={(val) => formDataSetter((prev) => ({ ...prev, email: val }))}
              />
              {otpSent && (
                <InputField
                  args={{ 
                    placeholder: "Enter OTP", 
                    required: true,
                    // pattern: "\\d{6}", // Assuming 6-digit OTP
                    title: "Please enter a 6-digit OTP"
                  }}
                  value={formData.token}
                  setter={(val) => formDataSetter((prev) => ({ ...prev, token: val }))}
                />
              )}
            </div>

            {/* Dynamic submit button */}
            <button
              type="submit"
              className={`p-3 rounded-2xl w-full font-semibold transition-colors ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#FECC00] hover:bg-[#eebc00]"
              }`}
              disabled={loading}
            >
              {loading ? (
                otpSent ? "Verifying..." : "Sending..."
              ) : otpSent ? "Verify OTP" : "Send OTP"}
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