import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

const StudentStudyMaterial = () => {
    const [studymaterial, setStudymaterial] = useState([]);
    const [filter, setFilter] = useState("All");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchStudymaterials = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/all-study-material/");
                if (response.data && Array.isArray(response.data.study_materials)) {
                    setStudymaterial(response.data.study_materials);
                } else {
                    throw new Error("Unexpected response structure");
                }
            } catch (err) {
                setError("Failed to load study materials. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudymaterials();
    }, []);

    useEffect(() => {
        const token = Cookies.get("jwt");
        if (token) {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        console.log("Decoded JWT Payload:", payload); // Debugging line
        setUserRole(!payload.student_user ? payload.role : "student"); // Assuming the payload has a 'role' field
        }
    }, []);
    
    const filteredMaterials = studymaterial.filter(material =>
        filter === "All" || material.study_material_data?.category === filter
    );

    return (
        <div className="flex flex-col">
        {userRole === "admin" && <AdminPageNavbar />}
        {userRole === "superadmin" && <SuperAdminPageNavbar />}
        {userRole === "student" && <StudentPageNavbar />}
            <PageHeader
                page={{ displayName: "Study Material" }}
                filter={filter}
                setFilter={setFilter}
            /> 

            {/* Study Material Cards Grid with 3x3 layout */}
            <div className="self-center pl-7 pr-7 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && <p className="text-center text-gray-600">Loading study materials...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!loading && filteredMaterials.length === 0 && (
                    <p className="alert alert-danger w-full col-span-full text-center">
                        !! No Study Materials Found !!
                    </p>
                )}

                {!loading && filteredMaterials.length > 0 &&
                    filteredMaterials.map(material => (
                        <div key={material._id} className="border rounded-lg shadow-md p-4 bg-white flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{material.study_material_data?.title}</h3>
                                <p className="text-gray-600 mt-2">{material.study_material_data?.description}</p>
                                <p className="text-gray-700 mt-2">
                                    <strong>Content:</strong> {material.study_material_data?.text_content}
                                </p>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                {material.study_material_data?.link && (
                                    <a
                                        href={material.study_material_data.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline font-semibold"
                                    >
                                        View Material
                                    </a>
                                )}
                                <button className="bg-yellow-400 text-black font-bold p-2 rounded-lg hover:bg-yellow-500">
                                    Download
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default StudentStudyMaterial;
