import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import ApplicationCard from "../../components/Students/ApplicationCard";
import { AppPages } from "../../utils/constants";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import AdminProfile from "./AdminProfile";
import SuperAdminProfile from "./SuperAdminProfile";
import StudentProfile from "./StudentProfile";

export default function Profile() {

  const [userRole, setUserRole] = useState(null);



  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      console.log("Decoded JWT Payload:", payload); // Debugging line
      setUserRole(!payload.student_user ? payload.role : "student"); // Assuming the payload has a 'role' field
    }
  }, []);

  return (
    <div className="flex flex-col">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      {userRole === "student" && <StudentPageNavbar />}
  

      {userRole === "admin" && <AdminProfile />}
      {userRole === "superadmin" && <SuperAdminProfile />}
      {userRole === "student" && <StudentProfile />}
    </div>
  );
}
