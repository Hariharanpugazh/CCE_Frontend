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
    const [isLoading, setIsLoading] = useState(false);
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
    
        setIsLoading(true);
    
        try {
            const response = await fetch("https://cce-backend.onrender.com/api/superadmin_login/", {
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
                    const response = await fetch("https://cce-backend.onrender.com/api/superadmin/google/login/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ token: credentialResponse.credential }),
                        credentials: "include" // Ensures cookies are handled correctly
                    });
            
                    const data = await response.json();
            
                    if (response.ok) {
                        Cookies.set("jwt", data.token.jwt, { expires: 7, path: "/" });
                        Cookies.set("username", data.username, { expires: 7, path: "/" });
            
                        toast.success("Google login successful! Redirecting...");
                        navigate("/superadmin-dashboard");
                  }
                } catch (error) {
                  console.error("Google login error:", error);
                  
                  if (error.response?.status === 404) {
                    toast.error("No student account found with this Google email.");
                  } else {
                    const errorMsg = error.response?.data?.error || "Google login failed";
                    setErrorMessage(errorMsg);
                    toast.error(errorMsg);
                  }
                } finally {
                    setIsLoading(false);
                }
              };
            
              const handleGoogleFailure = () => {
                toast.error("Google sign-in was unsuccessful");
              };

    return (
        <>
            <LoginCard
                page={AppPages.superUserLogin}
                formData={formData}
                formDataSetter={setFormData}
                onSubmit={handleSubmit}
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                isLocked={isLocked}
                lockoutTime={lockoutTime}
                isLoading={isLoading}
            />
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}
