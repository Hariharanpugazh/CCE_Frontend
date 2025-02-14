

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../Common/InputField";
import login1 from "../../assets/images/LoginImg1.png";
import login2 from "../../assets/images/LoginImg2.png";
import login3 from "../../assets/images/LoginImg3.png";
import Squares from "../../components/ui/GridLogin";

export default function ResetPasswordCard({ formDataSetter, formData, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("Weak");
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  // Image Slider Logic
  const images = [login1, login2, login3];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const evaluatePasswordStrength = (password) => {
    if (!password) return "Weak";
    if (password.length >= 8 && /[A-Z]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Strong";
    } else if (password.length >= 6 && /\d/.test(password)) {
      return "Medium";
    } else {
      return "Weak";
    }
  };

  const handlePasswordChange = (val) => {
    formDataSetter((prevData) => ({ ...prevData, newPassword: val }));
    setPasswordStrength(evaluatePasswordStrength(val));
  };

  const handleConfirmPasswordChange = (val) => {
    formDataSetter((prevData) => ({ ...prevData, confirmPassword: val }));
    setPasswordMatchError(val !== formData.newPassword && val !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      await onSubmit(e);
      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
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
          <div className="flex flex-col items-center space-y-4">
            <p className="text-3xl font-medium">Create New Password</p>
            <p className="text-gray-600 text-center">
              Enter and confirm your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 w-3/4">
            {/* New Password Field */}
            <div className="space-y-2">
              <InputField
                args={{ placeholder: "Enter New Password", required: true, type: "password" }}
                value={formData.newPassword}
                setter={handlePasswordChange}
              />
              {/* Password Strength Indicator */}
              <div
                className={`text-sm font-medium ${
                  passwordStrength === "Strong"
                    ? "text-green-600"
                    : passwordStrength === "Medium"
                    ? "text-yellow-500"
                    : "text-red-600"
                }`}
              >
                Password Strength: {passwordStrength}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <InputField
                args={{ placeholder: "Confirm New Password", required: true, type: "password" }}
                value={formData.confirmPassword}
                setter={handleConfirmPasswordChange}
              />
              {/* Password Match Indicator */}
              {passwordMatchError && (
                <div className="text-sm font-medium text-red-600 w-full text-left">
                  Passwords do not match. Please try again.
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`p-3 rounded-2xl w-full font-semibold transition-colors ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#FECC00] hover:bg-[#eebc00]"
              }`}
              disabled={loading}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
