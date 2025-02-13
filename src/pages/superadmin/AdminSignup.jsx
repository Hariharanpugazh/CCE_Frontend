import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import wavyPattern from "../../assets/images/wavy-circles.png";

export default function AdminSignup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        department: "",
        college_name: "",
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword, department, college_name } = formData;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/admin-signup/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, department, college_name }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Signup successful! Redirecting...");
                navigate("/Management-home"); // Redirect to home page
            } else {
                toast.error(data.error || "Signup failed");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Image */}
            <div className="h-full w-full absolute z-[-1] flex items-center top-[10%]">
                <img src={wavyPattern} alt="Background Pattern" />
            </div>

            {/* Form Container */}
            <div className="w-3/4 min-h-3/4 max-h-[85%] bg-white shadow-lg rounded-lg flex items-stretch p-2">
                {/* Illustration Section */}
                <div className="flex-1 bg-yellow-100 rounded-lg"></div>

                {/* Form Section */}
                <div className="flex-1 p-6 flex flex-col items-center justify-evenly">
                    <p className="text-3xl">Admin Signup</p>
                    <div className="flex flex-col space-y-2 items-center">
                        <p className="text-[#838383] text-sm w-3/4 text-center">
                            Create a new account by filling out the details below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-3/4 flex flex-col items-center">
                        <div className="space-y-4 mb-6 w-full relative">
                            {/* Name Field */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter your Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    required
                                />
                            </div>

                            {/* Email Field */}
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    required
                                />
                            </div>

                            {/* Department Field */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter your Department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    required
                                />
                            </div>

                            {/* College Name Field */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter your College Name"
                                    name="college_name"
                                    value={formData.college_name}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    required
                                />
                            </div>

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
                                    {passwordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </div>
                            </div>

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
                                    {confirmPasswordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </div>
                            </div>
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            className="p-3 rounded-2xl w-full font-semibold bg-[#FECC00]"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
