import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import { FaBuilding, FaBriefcase, FaMapMarkerAlt, FaGraduationCap, FaUserTie } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { format } from "date-fns";

const InternshipPreview = () => {
    const { id } = useParams();
    const [internship, setInternship] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = Cookies.get("jwt");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                console.log("Decoded JWT Payload:", payload);

                if (payload.role) {
                    setUserRole(payload.role);
                } else if (payload.student_user) {
                    setUserRole("student");
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

    useEffect(() => {
        fetch(`https://cce-backend-54k0.onrender.com/api/internship/${id}/`)
            .then((response) => response.json())
            .then((data) => setInternship(data.internship))
            .catch((error) => console.error("Error fetching internship:", error));
    }, [id]);

    if (!internship) {
        return <p className="text-center text-lg font-semibold">Loading...</p>;
    }

    const { internship_data } = internship;

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Dynamically Render Navbar Based on Role */}
            {userRole === "admin" && <AdminPageNavbar />}
            {userRole === "superadmin" && <SuperAdminPageNavbar />}
            {userRole === "student" && <StudentPageNavbar />}

            <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row w-full max-w-7xl bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Internship Overview */}
                    <div className="lg:w-1/3 p-6 border-r border-gray-300 bg-gray-50">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">{internship_data?.title}</h2>
                            <p className="text-gray-700 mb-2 flex items-center">
                                <FaBuilding className="mr-2 text-gray-600" />
                                <span className="text-sm">{internship_data?.company_name}</span>
                            </p>
                            <p className="text-gray-700 mb-2 flex items-center">
                                <FaBriefcase className="mr-2 text-gray-600" />
                                <span className="text-sm">{internship_data?.work_type}</span>
                            </p>
                            <p className="text-gray-700 mb-2 flex items-center">
                                <FaMapMarkerAlt className="mr-2 text-gray-600" />
                                <span className="text-sm">{internship_data?.location}</span>
                            </p>
                            <p className="text-gray-700 mb-2 flex items-center">
                                <FaGraduationCap className="mr-2 text-lg text-gray-600" />
                                <span className="text-sm">{internship_data?.education_requirements}</span>
                            </p>
                            <p className="text-gray-700 mb-2 flex items-center">
                                <FaUserTie className="mr-2 text-gray-600" />
                                <span className="text-sm">{internship_data?.experience_level} years</span>
                            </p>
                            <p className="text-gray-700 mb-2 flex items-center">
                                <RiMoneyRupeeCircleFill className="mr-2 text-gray-600" />
                                <span className="text-sm">₹ {internship_data?.stipend} per annum</span>
                            </p>
                        </div>
                    </div>

                    {/* Internship Description and Other Details */}
                    <div className="lg:w-2/3 p-6 overflow-y-auto" style={{ maxHeight: '600px' }}>
                        {/* Internship Description */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Internship Description</h3>
                            <p className="text-gray-700">{internship_data?.job_description}</p>
                        </div>

                        {/* Key Responsibilities */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Key Responsibilities</h3>
                            <p className="text-gray-700">{internship_data?.key_responsibilities}</p>
                        </div>

                        {/* Skills & Education */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Required Skills</h3>
                            <div className="text-gray-700 mb-2">
                                <strong>Skills:</strong>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {Array.isArray(internship_data?.required_skills) ? (
                                        internship_data?.required_skills.map((skill, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                            No skills available
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Benefits</h3>
                            <p className="text-gray-700">{internship_data?.benefits}</p>
                        </div>

                        {/* Application Details */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Application Process</h3>
                            <p className="text-gray-700 mb-2"><strong>Deadline:</strong> {format(new Date(internship_data?.application_deadline), "yyyy-MM-dd")}</p>
                            <p className="text-gray-700 mb-2"><strong>Instructions:</strong> {internship_data?.application_instructions}</p>
                        </div>

                        {/* Contact Information */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h3>
                            <p className="text-gray-700 mb-2"><strong>Email:</strong> {internship_data?.contact_email}</p>
                            <p className="text-gray-700 mb-2"><strong>Phone:</strong> {internship_data?.contact_phone}</p>
                        </div>

                        {/* Apply Button */}
                        <div className="text-center mt-8">
                            <a
                                href={internship_data?.job_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
                            >
                                Apply Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternshipPreview;
