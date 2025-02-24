// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import "react-toastify/dist/ReactToastify.css";
// import { InputField } from "../Common/InputField";
// import login1 from "../../assets/images/LoginImg1.png";
// import login2 from "../../assets/images/LoginImg2.png";
// import login3 from "../../assets/images/LoginImg3.png";
// import Squares from "../../components/ui/GridLogin";

// export default function ResetPasswordCard({
//   formDataSetter,
//   formData,
//   onSubmit,
// }) {
//   const [loading, setLoading] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState("Weak");
//   const [passwordMatchError, setPasswordMatchError] = useState(false);
//   const navigate = useNavigate();
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [direction, setDirection] = useState(1); // 1 for right, -1 for left

//   const images = [login1, login2, login3];

//   useEffect(() => {
//     const slideInterval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 5000);

//     return () => clearInterval(slideInterval);
//   }, [images.length]);

//   const slideVariants = {
//     enter: (direction) => ({
//       x: direction > 0 ? 1000 : -1000,
//       opacity: 0,
//     }),
//     center: {
//       zIndex: 1,
//       x: 0,
//       opacity: 1,
//     },
//     exit: (direction) => ({
//       zIndex: 0,
//       x: direction < 0 ? 1000 : -1000,
//       opacity: 0,
//     }),
//   };

//   const slideTransition = {
//     duration: 0.8,
//     ease: [0.4, 0.0, 0.2, 1],
//   };

//   const evaluatePasswordStrength = (password) => {
//     if (!password) return "Weak";
//     if (
//       password.length >= 8 &&
//       /[A-Z]/.test(password) &&
//       /[!@#$%^&*(),.?":{}|<>]/.test(password)
//     ) {
//       return "Strong";
//     } else if (password.length >= 6 && /\d/.test(password)) {
//       return "Medium";
//     } else {
//       return "Weak";
//     }
//   };

//   const handlePasswordChange = (val) => {
//     formDataSetter((prevData) => ({ ...prevData, newPassword: val }));
//     setPasswordStrength(evaluatePasswordStrength(val));
//   };

//   const handleConfirmPasswordChange = (val) => {
//     formDataSetter((prevData) => ({ ...prevData, confirmPassword: val }));
//     setPasswordMatchError(val !== formData.newPassword && val !== "");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (formData.newPassword !== formData.confirmPassword) {
//       toast.error("Passwords do not match!");
//       setLoading(false);
//       return;
//     }

//     try {
//       await onSubmit(e);
//       toast.success("Password reset successfully! Redirecting to login...");
//       setTimeout(() => navigate("/"), 3000);
//     } catch (error) {
//       toast.error("Failed to reset password. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
//       {/* Background Image */}
//       <div className="h-full w-full absolute top-0 left-0 z[-5]">
//         {/* <img src={wavyPattern} alt="Background Pattern" className="w-full" /> */}
//         <Squares
//           speed={0.1}
//           squareSize={40}
//           direction="diagonal" // up, down, left, right, diagonal
//           borderColor="	#FCF55F"
//           hoverFillColor="#ffcc00"
//         />
//       </div>
//       {/* Card container */}
//       <div className="w-3/4 min-h-3/4 max-h-[85%] bg-white shadow-lg rounded-lg flex items-stretch p-2 relative">
//         {/* Image Slider Section */}
//         <div className="flex-1 flex justify-center rounded items-center p-1 overflow-hidden">
//           <div className="relative w-full h-full rounded-lg">
//             <AnimatePresence initial={false} custom={direction}>
//               <motion.img
//                 key={currentImageIndex}
//                 src={images[currentImageIndex]}
//                 custom={direction}
//                 variants={slideVariants}
//                 initial="enter"
//                 animate="center"
//                 exit="exit"
//                 transition={slideTransition}
//                 className="absolute w-full h-full rounded-lg object-cover"
//               />
//             </AnimatePresence>
//           </div>
//         </div>

//         {/* Form section */}
//         <div className="flex-1 p-6 flex flex-col items-center justify-evenly">
//           <div className="flex flex-col items-center space-y-4">
//             <p className="text-3xl font-medium">Create New Password</p>
//             <p className="text-gray-600 text-center">
//               Enter and confirm your new password below.
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="mt-6 space-y-4 w-3/4">
//             {/* New Password Field */}
//             <div className="space-y-2">
//               <InputField
//                 args={{
//                   placeholder: "Enter New Password",
//                   required: true,
//                   type: "password",
//                 }}
//                 value={formData.newPassword}
//                 setter={handlePasswordChange}
//               />
//               {/* Password Strength Indicator */}
//               <div
//                 className={`text-sm font-medium ${
//                   passwordStrength === "Strong"
//                     ? "text-green-600"
//                     : passwordStrength === "Medium"
//                     ? "text-yellow-500"
//                     : "text-red-600"
//                 }`}
//               >
//                 Password Strength: {passwordStrength}
//               </div>
//             </div>

//             {/* Confirm Password Field */}
//             <div className="space-y-2">
//               <InputField
//                 args={{
//                   placeholder: "Confirm New Password",
//                   required: true,
//                   type: "password",
//                 }}
//                 value={formData.confirmPassword}
//                 setter={handleConfirmPasswordChange}
//               />
//               {/* Password Match Indicator */}
//               {passwordMatchError && (
//                 <div className="text-sm font-medium text-red-600 w-full text-left">
//                   Passwords do not match. Please try again.
//                 </div>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className={`p-3 rounded-2xl w-full font-semibold transition-colors ${
//                 loading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-[#FECC00] hover:bg-[#eebc00]"
//               }`}
//               disabled={loading}
//             >
//               {loading ? "Resetting Password..." : "Reset Password"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { InputField } from "../Common/InputField";
import login1 from "../../assets/images/LoginImg1.png";
import login2 from "../../assets/images/LoginImg2.png";
import login3 from "../../assets/images/LoginImg3.png";
import Squares from "../../components/ui/GridLogin";

// Animation variants defined outside component to prevent recreation on each render
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

export default function ResetPasswordCard({
  formDataSetter,
  formData,
  onSubmit,
}) {
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("Weak");
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const navigate = useNavigate();
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

  const evaluatePasswordStrength = useCallback((password) => {
    if (!password) return "Weak";
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      return "Strong";
    } else if (password.length >= 6 && /\d/.test(password)) {
      return "Medium";
    } else {
      return "Weak";
    }
  }, []);

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
    <div className="w-full min-h-screen flex items-center justify-center relative p-4 overflow-hidden">
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
        {/* Image Slider Section - Responsive height on mobile */}
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

        {/* Form Section */}
        <div className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center space-y-4 mb-6">
            <p className="text-2xl md:text-3xl font-medium text-center">
              Create New Password
            </p>
            <p className="text-gray-600 text-sm md:text-base text-center px-4">
              Enter and confirm your new password below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-4 px-2"
          >
            {/* New Password Field */}
            <div className="space-y-2">
              <InputField
                args={{
                  placeholder: "Enter New Password",
                  required: true,
                  type: "password",
                  className:
                    "w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400",
                }}
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
                args={{
                  placeholder: "Confirm New Password",
                  required: true,
                  type: "password",
                  className:
                    "w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400",
                }}
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
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#FECC00] hover:bg-[#eebc00]"
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
