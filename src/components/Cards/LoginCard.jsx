import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import wavyPattern from "../../assets/images/wavy-circles.png";

export default function LoginCard({ page, formDataSetter, formData, onSubmit, isLocked, lockoutTime, onForgotPassword, onResetPassword }) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [emailError, setEmailError] = useState("");

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
        if (!validateEmail(email)) {
            setEmailError("Enter a valid email.");
        } else {
            setEmailError("");
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
            {/* bg image */}
            <div className="h-full w-full absolute z-[-1] flex items-center top-[10%]">
                <img src={wavyPattern} alt="" className="" />
            </div>

            {/* card */}
            <div className="w-3/4 min-h-3/4 max-h-[85%] bg-white shadow-lg rounded-lg flex items-stretch p-2">
                {/* illustration */}
                <div className="flex-1 bg-yellow-100 rounded-lg"></div>

                {/* form */}
                <div className="flex-1 p-6 flex flex-col items-center justify-evenly">
                    <div className="flex flex-col space-y-2 items-center">
                        <p className="text-4xl font-medium">{page.displayName}</p>
                        <p className="text-[#838383] text-sm w-3/4 text-center">
                            Welcome Back! Please log in to get access to your account.
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="w-3/4 flex flex-col items-center">
                        <div className="space-y-4 mb-6 w-full relative">
                            {/* Email Field */}
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your Email"
                                    required
                                    value={formData.email}
                                    onChange={handleEmailChange}
                                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
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
                                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                <div
                                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {passwordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </div>
                            </div>

                            {/* Forgot Password */}
                            { !window.location.href.includes("superadmin") && <button type="button" onClick={onForgotPassword} className="cursor-pointer text-sm">
                              Forgot Password?
                            </button>}
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
