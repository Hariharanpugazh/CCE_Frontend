import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginCard from "../../components/Cards/LoginCard";
import ForgotPasswordCard from "../../components/Cards/ForgotPasswordCard";
import ResetPasswordCard from "../../components/Cards/ResetPasswordCard";
import { AppPages } from "../../utils/constants"; 

export default function StudentLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        token: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [otpSent, setOtpSent] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutTime, setLockoutTime] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Timer for lockout countdown
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

    /** Handle Student Login */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLocked) return;
    
        setIsLoading(true);
    
        try {
            const response = await fetch("https://cce-backend-54k0.onrender.com/api/stud/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                Cookies.set("jwt", data.token.jwt, { expires: 1, path: "/" });
                Cookies.set("username", data.username, { expires: 1, path: "/" });
                localStorage.setItem("student.email", formData.email);
    
                toast.success("Login successful! Redirecting...");
                navigate("/home");
            } else {
                if (data.error.includes("Too many failed attempts")) {
                    setIsLocked(true);
                    setLockoutTime(120);
                }
                toast.error(data.error || "Login failed");
                setIsLoading(false); // Ensure loading state is stopped
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error("Something went wrong. Please try again.");
            setIsLoading(false); // Ensure loading state is stopped
        }
    };
    
    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        try {
            const response = await fetch("https://cce-backend-54k0.onrender.com/api/student/google/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: credentialResponse.credential }),
                credentials: "include"
            });
    
            const data = await response.json();
    
            if (response.ok) {
                Cookies.set("jwt", data.token.jwt, { expires: 7, path: "/" });
                Cookies.set("username", data.username, { expires: 7, path: "/" });
    
                toast.success("Google login successful! Redirecting...");
                navigate("/home");
            } else if (data.error === "This account is inactive. Please contact the superadmin.") {
                toast.error(data.error); 
            } else if (response.status === 404) {
                toast.error("No student account found with this Google email.");
            } else {
                const errorMsg = data.error || "Google login failed";
                toast.error(errorMsg);
            }
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    
      const handleGoogleFailure = () => {
        toast.error("Google sign-in was unsuccessful");
      };
    
      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          handleLogin(e);
        }
      };

    /** Handle Forgot Password */
    const handleForgotPassword = () => {
        setIsForgotPassword(true);
    };

    /** Handle Reset Password */
    const handleResetPassword = () => {
        setIsResetPassword(true);
    };

    /** Submit Forgot Password */
    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        const email = formData.email;
    
        try {
            const response = await fetch("https://cce-backend-54k0.onrender.com/api/student-forgot-password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                toast.success(data.message);
                setOtpSent(true); // Show OTP field only on success
            } else {
                // Properly handle non-200 responses
                toast.error(data.error || "Something went wrong!");
                setOtpSent(false); // Prevent OTP field on error
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to send reset email. Please try again.");
            setOtpSent(false); // Ensure OTP field doesn't appear on failure
        }
    };
    

    /** Verify OTP */
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const { email, token } = formData;

        try {
            const response = await fetch("https://cce-backend-54k0.onrender.com/api/student-verify-otp/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, token }),
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
            toast.error("Failed to verify OTP. Please try again.");
        }
    };

    /** Submit Reset Password */
    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("https://cce-backend-54k0.onrender.com/api/student-reset-password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    token: formData.token,
                    newPassword: formData.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Password reset successful! Redirecting to login...");
                setTimeout(() => {
                    setIsResetPassword(false);
                    setIsForgotPassword(false);
                }, 3000);
            } else {
                toast.error(data.error || "Failed to reset password");
            }
        } catch (error) {
            console.error("Error during password reset:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <>
            {isForgotPassword ? (
                <ForgotPasswordCard
                    page={AppPages.forgotPassword}
                    formData={formData}
                    formDataSetter={setFormData}
                    onSubmit={handleForgotPasswordSubmit}
                    onResendOTP={handleForgotPasswordSubmit}
                    onVerifyOTP={handleVerifyOtp}
                />
            ) : isResetPassword ? (
                <ResetPasswordCard
                    page={AppPages.resetPassword}
                    formData={formData}
                    formDataSetter={setFormData}
                    onSubmit={handleResetPasswordSubmit}
                />
            ) : (
                <LoginCard
                    page={AppPages.studentLogin}
                    formData={formData}
                    formDataSetter={setFormData}
                    onSubmit={handleSubmit}
                    onForgotPassword={handleForgotPassword}
                    onResetPassword={handleResetPassword}
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                    isLocked={isLocked}
                    lockoutTime={lockoutTime}
                    isLoading={isLoading}
                />
            )}
    
            {/* Persistent ToastContainer for all cards */}
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}    