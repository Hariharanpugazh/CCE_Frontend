import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import LoginCard from "../../components/Cards/LoginCard";
import { AppPages } from "../../utils/constants";

export default function SuperAdminLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [isLocked, setIsLocked] = useState(false); // Track lockout state
    const [lockoutTime, setLockoutTime] = useState(0); // Track remaining lockout time
    const navigate = useNavigate();

    // Clear cookies when entering the login page
    useEffect(() => {
        Cookies.remove("jwt");
        Cookies.remove("username");
    }, []);

    // Timer for lockout
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
            const response = await fetch("http://localhost:8000/api/superadmin_login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                Cookies.set("jwt", data.tokens.jwt, { expires: 1, path: "/" });
                Cookies.set("username", data.username, { expires: 1, path: "/" });
                toast.success("Login successful! Redirecting...");
                navigate("/superadmin-dashboard");
            } else {
                if (data.error.includes("Too many failed attempts")) {
                    setIsLocked(true);
                    setLockoutTime(120); // 5-minute lockout
                }
                toast.error(data.error || "Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <>
            <LoginCard
                page={AppPages.superUserLogin}
                formData={formData}
                formDataSetter={setFormData}
                onSubmit={handleSubmit}
                isLocked={isLocked}
                lockoutTime={lockoutTime}
            />
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}
