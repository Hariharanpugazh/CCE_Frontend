// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { motion, AnimatePresence } from "framer-motion";
// import { InputField } from "../Common/InputField";
// import login1 from "../../assets/images/LoginImg1.png";
// import login2 from "../../assets/images/LoginImg2.png";
// import login3 from "../../assets/images/LoginImg3.png";
// import Squares from "../../components/ui/GridLogin";

// export default function ForgotPasswordCard({
//   page,
//   formDataSetter,
//   formData,
//   onSubmit,
//   onResendOTP,
//   onVerifyOTP,
// }) {
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);

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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (otpSent) {
//         await onVerifyOTP(e);
//         toast.success("OTP verified successfully!");
//       } else {
//         await onSubmit(e);
//         toast.success("OTP sent successfully! Please check your email.");
//         setOtpSent(true);
//       }
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "An error occurred. Please try again.";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOTP = async (e) => {
//     setLoading(true);
//     try {
//       await onResendOTP(e);
//       toast.success("OTP resent successfully! Please check your email.");
//     } catch (error) {
//       toast.error("Failed to resend OTP. Please try again.");
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
//           <div className="flex flex-col space-y-2 items-center">
//             <p className="text-4xl font-medium">{page.displayName}</p>
//             <p className="text-[#838383] text-sm w-3/4 text-center">
//               {otpSent
//                 ? "Enter the OTP sent to your email"
//                 : "Enter your email to receive a password reset OTP"}
//             </p>
//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="w-3/4 flex flex-col items-center"
//           >
//             <div className="space-y-2 mb-6 w-full">
//               <InputField
//                 args={{
//                   placeholder: "Enter your Email",
//                   required: true,
//                   type: "email",
//                   className:
//                     "w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400",
//                   disabled: otpSent, // Disable email after OTP is sent
//                 }}
//                 value={formData.email}
//                 setter={(val) =>
//                   formDataSetter((prev) => ({ ...prev, email: val }))
//                 }
//               />
//               {otpSent && (
//                 <InputField
//                   args={{
//                     placeholder: "Enter OTP",
//                     required: true,
//                     title: "Please enter a 6-digit OTP",
//                     className:
//                       "w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400",
//                   }}
//                   value={formData.token}
//                   setter={(val) =>
//                     formDataSetter((prev) => ({ ...prev, token: val }))
//                   }
//                 />
//               )}
//             </div>

//             {/* Dynamic submit button */}
//             <button
//               type="submit"
//               className={`p-3 rounded-2xl w-full font-semibold transition-colors ${
//                 loading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-[#FECC00] hover:bg-[#eebc00]"
//               }`}
//               disabled={loading}
//             >
//               {loading
//                 ? otpSent
//                   ? "Verifying..."
//                   : "Sending..."
//                 : otpSent
//                 ? "Verify OTP"
//                 : "Send OTP"}
//             </button>

//             {otpSent && (
//               <button
//                 type="button"
//                 onClick={handleResendOTP}
//                 className="mt-4 text-sm text-gray-600 hover:text-gray-800 underline"
//                 disabled={loading}
//               >
//                 {loading ? "Sending..." : "Resend OTP"}
//               </button>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { InputField } from "../Common/InputField";
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
            isMobile ? "h-100" : "flex-1 "
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
        <div className="flex-1 p-4 md:p-6 flex flex-col items-center justify-evenly">
          {/* Title & Subtitle */}
          <div className="flex flex-col space-y-2 items-center mb-6">
            <p className="text-2xl md:text-4xl font-medium text-center">
              {page.displayName}
            </p>
            <p className="text-[#838383] text-sm px-4 md:w-3/4 text-center">
              {otpSent
                ? "Enter the OTP sent to your email"
                : "Enter your email to receive a password reset OTP"}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full md:w-3/4 flex flex-col items-center px-4 md:px-0"
          >
            <div className="space-y-4 mb-6 w-full">
              {/* Email Input */}
              <InputField
                args={{
                  placeholder: "Enter your Email",
                  required: true,
                  type: "email",
                  className:
                    "w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400",
                  disabled: otpSent,
                }}
                value={formData.email}
                setter={(val) =>
                  formDataSetter((prev) => ({ ...prev, email: val }))
                }
              />

              {/* OTP Input */}
              {otpSent && (
                <InputField
                  args={{
                    placeholder: "Enter OTP",
                    required: true,
                    title: "Please enter a 6-digit OTP",
                    className:
                      "w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400",
                  }}
                  value={formData.token}
                  setter={(val) =>
                    formDataSetter((prev) => ({ ...prev, token: val }))
                  }
                />
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
              {loading
                ? otpSent
                  ? "Verifying..."
                  : "Sending..."
                : otpSent
                ? "Verify OTP"
                : "Send OTP"}
            </button>

            {/* Resend OTP Button */}
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
