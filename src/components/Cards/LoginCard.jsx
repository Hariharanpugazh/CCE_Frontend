import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from '@react-oauth/google';
import Squares from "../../components/ui/GridLogin";
import login1 from "../../assets/images/LoginImg1.png";
import login2 from "../../assets/images/LoginImg2.png";
import login3 from "../../assets/images/LoginImg3.png";

export default function LoginCard({
  page,
  formDataSetter,
  formData,
  onSubmit,
  isLocked,
  onSuccess,
  onError,
  lockoutTime,
  onForgotPassword,
  isLoading,
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const images = [login1, login2, login3];

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [images.length]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const slideTransition = {
    duration: 0.8,
    ease: [0.4, 0.0, 0.2, 1],
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    formDataSetter((prevData) => ({
      ...prevData,
      email: email,
    }));
    setEmailError(validateEmail(email) ? "" : "Enter a valid email.");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative p-4">
      {/* Background */}
      <div className="h-full w-full absolute top-0 left-0 z[-5]">
        <Squares
          speed={0.1}
          squareSize={isMobile ? 20 : 40}
          direction="diagonal"
          borderColor="#FCF55F"
          hoverFillColor="#ffcc00"
        />
      </div>

      {/* Card Container */}
      <div className="w-full max-w-6xl min-h-[600px] bg-white shadow-lg rounded-lg flex flex-col md:flex-row items-stretch p-2 md:p-4 relative">
        {/* Image Slider Section - Hidden on very small screens */}
        <div
          className={`${
            isMobile ? "h-100" : "flex-1"
          } flex justify-center rounded items-center p-1 overflow-hidden`}
        >
          <div className="relative w-full h-full rounded-lg">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="absolute w-full h-full rounded-lg object-cover"
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="flex-1 p-4 md:p-6 flex flex-col items-center justify-evenly">
          {/* Title & Subtitle */}
          <div className="flex flex-col space-y-2 items-center mb-6">
            <p className="text-2xl md:text-4xl font-medium text-center">
              {page.displayName}
            </p>
            <p className="text-[#838383] text-sm md:text-md w-full md:w-3/4 text-center">
              Welcome Back! Please log in to access your account.
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={onSubmit}
            className="w-full md:w-3/4 flex flex-col items-center"
          >
            <div className="space-y-4 mb-6 w-full relative">
              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your Email"
                  required
                  value={formData.email}
                  onChange={handleEmailChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your Password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    formDataSetter((prevData) => ({
                      ...prevData,
                      password: e.target.value,
                    }))
                  }
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="w-full relative h-8">
                {!window.location.href.includes("superadmin") && (
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="absolute right-0 text-sm text-[#000000] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className={`p-3 rounded-lg w-full font-semibold ${
                isLocked
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#FECC00] hover:bg-yellow-500 transition duration-300 flex items-center justify-center"
              }`}
              disabled={isLocked || isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging In...
                </>
              ) : isLocked ? (
                `Try again in ${lockoutTime}s`
              ) : (
                "Login"
              )}
            </button>
            {/* Google Sign-In Button */}
            <div className="mt-4 text-center">
              <p className="text-gray-500 mb-2">OR</p>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={onSuccess}  // Add this line
                  onError={onError} 
                  useOneTap
                  theme="outline"
                  shape="rectangular"
                  text="signin_with"
                  size="large"
                  context="signin"
                />
              </div>
            </div>
            </form>
        </div>
      </div>
    </div>
  );
}
