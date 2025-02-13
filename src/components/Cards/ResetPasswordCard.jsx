import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../Common/InputField";
import wavyPattern from "../../assets/images/wavy-circles.png";

export default function ResetPasswordCard({ formDataSetter, formData, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("Weak");
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const navigate = useNavigate();

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
      {/* Background pattern */}
      <div className="h-full w-full absolute z-[-1] flex items-center top-[10%]">
        <img src={wavyPattern} alt="Decorative background" />
      </div>

      {/* Card container */}
      <div className="w-3/4 min-h-3/4 max-h-[85%] bg-white shadow-lg rounded-lg flex items-stretch p-2">
        {/* Illustration section */}
        <div className="flex-1 bg-yellow-100 rounded-lg"></div>

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
