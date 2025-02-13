import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";

const InternshipPreview = () => {
    const { id } = useParams();
    const [internship, setInternship] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);

    // ✅ Move JWT decoding ABOVE any conditional returns
    useEffect(() => {
        const token = Cookies.get("jwt");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
                console.log("Decoded JWT Payload:", payload);

                if (payload.role) {
                    setUserRole(payload.role);
                } else if (payload.student_user) {
                    setUserRole("student"); // ✅ Default to "student" if student_user is present
                }

                if (payload.role === "admin") {
                    setUserId(payload.admin_user);
                } else if (payload.role === "superadmin") {
                    setUserId(payload.superadmin_user);
                } else if (payload.student_user) {
                    setUserId(payload.student_user);
                }
            } catch (error) {
                console.error("Invalid JWT token:", error);
            }
        }
    }, []);

    // ✅ Move this AFTER the JWT effect
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/internship/${id}/`)
            .then((response) => response.json())
            .then((data) => setInternship(data.internship))
            .catch((error) => console.error("Error fetching internship:", error));
    }, [id]);

    if (!internship) {
        return <p className="text-center text-lg font-semibold">Loading...</p>;
    }

    return (
        <div>
            {/* ✅ Dynamically Render Navbar Based on Role */}
            {userRole === "admin" && <AdminPageNavbar />}
            {userRole === "superadmin" && <SuperAdminPageNavbar />}
            {userRole === "student" && <StudentPageNavbar />}
            
            <div className="w-4/5 mx-auto bg-white shadow-lg rounded-lg p-8 my-10 border border-gray-200">
                <div className="border-b pb-4 mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">{internship.internship_data.title}</h2>
                    <p className="text-lg text-gray-700 mt-2">{internship.internship_data.company_name}</p>
                    <a href={internship.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                        Visit Company Website
                    </a>
                </div>

                <div className="border-b pb-4 mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Internship Overview</h3>
                    <p className="text-gray-700"><strong>Location:</strong> {internship.internship_data.location}</p>
                    <p className="text-gray-700"><strong>Duration:</strong> {internship.internship_data.duration}</p>
                    <p className="text-gray-700"><strong>Stipend:</strong> {internship.internship_data.stipend}</p>
                    <p className="text-gray-700"><strong>Type:</strong> {internship.internship_data.internship_type}</p>
                </div>

                <div className="border-b pb-4 mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-700">{internship.internship_data.job_description}</p>
                </div>

                <div className="border-b pb-4 mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Skills Required</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {internship.internship_data.required_skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-8">
                    <a href={internship.internship_data.job_link} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md">
                        Apply Now
                    </a>
                </div>
            </div>
        </div>
    );
};

export default InternshipPreview;
