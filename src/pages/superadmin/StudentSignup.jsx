

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import login1 from "../../assets/images/LoginImg1.png";
import login2 from "../../assets/images/LoginImg2.png";
import login3 from "../../assets/images/LoginImg3.png";
import Squares from "../../components/ui/GridLogin";

export default function StudentSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    year: "",
    college_name: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const images = [login1, login2, login3];
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Real-time validation
    if (name === "email") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: value.includes("@sns") ? "" : "Use your domain id",
      }));
    }
    if (name === "confirmPassword") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword:
          value === formData.password ? "" : "Passwords do not match",
      }));
    }
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const checkPasswordStrength = useCallback((password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    setPasswordStrength(strength);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      email,
      password,
      confirmPassword,
      department,
      year,
      college_name,
    } = formData;

    const newErrors = {};

    if (!email.includes("@sns")) {
      newErrors.email = "Use your domain id";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/student-signup/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            department,
            year,
            college_name,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully!");
        setTimeout(() => navigate("/manage-student"), 2000);
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordStrengthIndicator = ({ strength }) => {
    const getColor = () => {
      if (strength === 0) return "bg-gray-300";
      if (strength === 1) return "bg-red-500";
      if (strength === 2) return "bg-yellow-500";
      if (strength === 3) return "bg-blue-500";
      if (strength === 4) return "bg-green-500";
    };

    return (
      <div className="mt-2">
        <div className="flex justify-between mb-1">
          <span className="text-sm">Password Strength:</span>
          <span className="text-sm font-medium">
            {strength === 0
              ? "Very Weak"
              : strength === 1
              ? "Weak"
              : strength === 2
              ? "Fair"
              : strength === 3
              ? "Good"
              : "Strong"}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getColor()}`}
            style={{ width: `${strength * 25}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="h-full w-full absolute top-0 left-0 z[-5]">
        <Squares
          speed={0.1}
          squareSize={40}
          direction="diagonal"
          borderColor="#FCF55F"
          hoverFillColor="#ffcc00"
        />
      </div>

      {/* Form Container */}
      <div className="w-3/4 min-h-3/4 max-h-[98%] bg-white shadow-lg rounded-lg flex items-stretch p-2 relative">
        {/* Image Slider */}
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

        {/* Form Section */}
        <div className="flex-1 p-1 flex flex-col items-center justify-evenly">
          <p className="text-3xl font-medium mb-1 pt-1">Student Sign Up</p>
          <p className="text-[#838383] text-sm w-3/4 text-center mb-2">
            Create a new student account by filling out the details below.
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-3/4 flex flex-col items-center"
          >
            <div className="space-y-4 mb-5 w-full relative">
              {/* Name Field */}
              <input
                type="text"
                placeholder="Enter your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-400"
                required
              />

              {/* Email Field */}
              <input
                type="email"
                placeholder="Enter your Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 rounded-md border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-yellow-400`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}

              {/* Department Field */}
              <input
                type="text"
                placeholder="Enter your Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-400"
                required
              />

              {/* Year Field */}
              <input
                type="text"
                placeholder="Enter your Year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-400"
                required
              />

              {/* College Name Field */}
              <input
                type="text"
                placeholder="Enter your College Name"
                name="college_name"
                value={formData.college_name}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-400"
                required
              />

              {/* Password Field with Eye Icon */}
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
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
              <PasswordStrengthIndicator strength={passwordStrength} />

              {/* Confirm Password Field with Eye Icon */}
              <div className="relative">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm your Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <div
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {confirmPasswordVisible ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}

              <button
                type="submit"
                className="p-2 rounded-2xl w-full font-semibold bg-[#FECC00] hover:bg-yellow-500 transition duration-300 flex items-center justify-center"
                disabled={isLoading}
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
                    Signing Up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
