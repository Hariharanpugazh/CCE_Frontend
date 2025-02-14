import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
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
  lockoutTime,
  onForgotPassword,
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [index, setIndex] = useState(0);

  // Image Slider Logic
  const images = [login1, login2, login3];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Validate Email
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

      {/* Card Container */}
      <div className="w-3/4 min-h-3/4 max-h-[85%] bg-white shadow-lg rounded-lg flex items-stretch p-2 relative">
        {/* Image Slider Section */}
        <div className="flex-1  flex justify-center items-center p-2">
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

        {/* Login Form Section */}
        <div className="flex-1 p-6 flex flex-col items-center justify-evenly">
          {/* Title & Subtitle */}
          <div className="flex flex-col space-y-2 items-center">
            <p className="text-4xl font-medium">{page.displayName}</p>
            <p className="text-[#838383] text-md w-3/4 text-center">
              Welcome Back! Please log in to access your account.
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={onSubmit}
            className="w-3/4 flex flex-col items-center"
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
                  <p className="text-red-500 text-sm">{emailError}</p>
                )}
              </div>

              {/* Password Field with Eye Icon */}
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
                <div
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </div>
              </div>

              {/* Forgot Password */}
              <div className="w-full relative">
                {!window.location.href.includes("superadmin") && (
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-sm text-[#000000] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className={`p-3 rounded-2xl w-full font-semibold ${
                isLocked ? "bg-gray-300 cursor-not-allowed" : "bg-[#FECC00]"
              }`}
              disabled={isLocked}
            >
              {isLocked ? `Try again in ${lockoutTime}s` : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
