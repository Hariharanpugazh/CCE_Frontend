import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import { ToastContainer, toast } from "react-toastify"; // Import Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
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
    
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutTime, setLockoutTime] = useState(0);
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
    
        try {
            const response = await fetch("https://1xpug8kx2c.execute-api.us-east-1.amazonaws.com/dev/api/stud/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Store JWT token and username in cookies
                Cookies.set("jwt", data.token.jwt, { expires: 1, path: "/" }); // Store JWT
                Cookies.set("username", data.username, { expires: 1, path: "/" }); // Store username
                
                // Store email in localStorage
                localStorage.setItem("student.email", formData.email);
    
                toast.success("Login successful! Redirecting...");
                navigate("/home"); // Redirect to student dashboard
            } else {
                if (data.error.includes("Too many failed attempts")) {
                    setIsLocked(true);
                    setLockoutTime(120); // 2-minute lockout
                }
                toast.error(data.error || "Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error("Something went wrong. Please try again.");
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
        const response = await fetch("http://localhost:8000/api/student-forgot-password/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
            toast.success(data.message);

            // Transition to Reset Password step
            setIsForgotPassword(false);
            setIsResetPassword(true);

            // Prepare formData for Reset Password step
            setFormData({
                email: email, // Keep email pre-filled
                token: "", // Clear token field for user input
                newPassword: "", // Clear new password field
                confirmPassword: "", // Clear confirm password field
            });
        } else {
            toast.error(data.error || "Something went wrong!");
        }
    } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to send reset email. Please try again.");
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
            const response = await fetch("http://localhost:8000/api/student-reset-password/", {
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

/** Render Forgot Password Page */
if (isForgotPassword) {
    return (
        <ForgotPasswordCard
            page={AppPages.forgotPassword}
            formData={formData}
            formDataSetter={setFormData}
            onSubmit={handleForgotPasswordSubmit}
        />
    );
}

/** Render Reset Password Page */
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

    /** Render Login Page */
    return (
        <>
            <LoginCard
                page={AppPages.studentLogin}
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
