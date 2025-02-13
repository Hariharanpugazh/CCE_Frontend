import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginCard from "../../components/Cards/LoginCard";
import ForgotPasswordCard from "../../components/Cards/ForgotPasswordCard";
import ResetPasswordCard from "../../components/Cards/ResetPasswordCard";
import { AppPages } from "../../utils/constants";

export default function AdminLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        newPassword: "",
        confirmPassword: "",
        token: "",
    });
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutTime, setLockoutTime] = useState(0);
    const navigate = useNavigate();

    // Clear cookies when entering the login page
    useEffect(() => {
        Cookies.remove("jwt");
        Cookies.remove("username");
    }, []);

    // ⏳ Timer for lockout countdown
    useEffect(() => {
        if (lockoutTime > 0) {
            const interval = setInterval(() => {
                setLockoutTime((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setIsLocked(false);
        }
    }, [lockoutTime]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLocked) return;
    
        try {
            const response = await fetch("http://localhost:8000/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Set JWT token in cookies
                Cookies.set("jwt", data.tokens.jwt, { expires: 1, path: "/" });
    
                // Set username in cookies
                Cookies.set("username", data.username, { expires: 1, path: "/" });
    
                toast.success("Login successful! Redirecting...");
                navigate("/admin/home");
            } else {
                if (data.error.includes("Too many failed attempts")) {
                    setIsLocked(true);
                    setLockoutTime(120); // ⏳ 5-minute lockout
                }
                toast.error(data.error || "Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };
    

    const handleForgotPassword = () => {
        setIsForgotPassword(true);
    };

    const handleResetPassword = () => {
        setIsResetPassword(true);
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        const email = formData.email;

        try {
            const response = await fetch("http://localhost:8000/api/forgot-password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                // setIsForgotPassword(false);
                // setIsResetPassword(true);
            } else {
                toast.error(data.error || "Something went wrong!");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to send reset email. Please try again.");
        }
    };
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const email = formData.email;
        const otp = formData.token;
        try {
            const response = await fetch("http://localhost:8000/api/verify-otp/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp }),
            });
            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setIsForgotPassword(false);
                setIsResetPassword(true);
            } else {
                toast.error(data.error || "Something went wrong!");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to send reset email. Please try again.");
        }
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        const { email, token, newPassword, confirmPassword } = formData;

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/reset-password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, token, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                navigate("/admin");
            } else {
                toast.error(data.error || "Something went wrong!");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to reset password. Please try again.");
        }
    };

    if (isForgotPassword) {
        return (
            <ForgotPasswordCard
                page={AppPages.forgotPassword}
                formData={formData}
                formDataSetter={setFormData}
                onSubmit={handleForgotPasswordSubmit}
                onResendOTP={handleForgotPasswordSubmit} // Resend OTP
                onVerifyOTP={handleVerifyOtp} //  Verify OTP and proceed to reset password
            />
        );
    }

    if (isResetPassword) {
        return (
            <ResetPasswordCard
                page={AppPages.resetPassword}
                formData={formData}
                formDataSetter={setFormData}
                onSubmit={handleResetPasswordSubmit}
            />
        );
    }

    return (
        <>
            <LoginCard
                page={AppPages.adminLogin}
                formData={formData}
                formDataSetter={setFormData}
                onSubmit={handleSubmit}
                onForgotPassword={handleForgotPassword}
                onResetPassword={handleResetPassword}
                isLocked={isLocked}
                lockoutTime={lockoutTime}
            />
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}