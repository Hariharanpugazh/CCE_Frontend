import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

import Pagination from "../../components/Admin/pagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Adminjobposts from "../../components/Students/AdminJobPosts";

function StylishInput({ label, value, readOnly, onChange }) {   
    const [focused, setFocused] = useState(false);

    return (
        <div className="relative w-full">
            <label
                className={`absolute left-4 top-0 transform -translate-y-1/2 px-1 bg-white text-gray-500 text-sm transition-all 
                ${focused || value ? "text-gray-500" : "text-gray-400"}`}
            >
                {label}
            </label>
            <input
                type="text"
                value={value}
                readOnly={readOnly}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md bg-white text-black text-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
        </div>
    );
}

export default function AdminDetailPage() {
    const { id } = useParams();
    const [admin, setAdmin] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const ITEMS_PER_PAGE = 6;
    const [editMode, setEditMode] = useState(false);
    
    const [formData, setFormData] = useState({
        
        name: "",
        email: "",
        department: "",
        college_name: "",
    });
    const [currentPage, setCurrentPage] = useState(1);

    const tabs = ["Job", "Internship", "Achievement"]; // Tabs
    const [activeTab, setActiveTab] = useState(tabs[0]); // State for active tab

    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const response = await axios.get(`https://cce-backend-54k0.onrender.com/api/admin-details/${id}/`);
                setAdmin(response.data.admin);
                setJobs(response.data.jobs);
                setFormData({
                    name: response.data.admin.name,
                    email: response.data.admin.email,
                    department: response.data.admin.department,
                    college_name: response.data.admin.college_name,
                });
            } catch (err) {
                console.error("Error fetching admin details:", err);
                setError("Failed to load admin details.");
            }
        };

        fetchAdminDetails();
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        if (!admin) return;

        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post(`https://cce-backend-54k0.onrender.com/api/admin-status/${id}/`, {
                status: newStatus,
            });

            if (response.status === 200) {
                setAdmin((prevAdmin) => ({ ...prevAdmin, status: newStatus }));
                toast.success(`The account is now ${newStatus}.`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update admin status.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
        }
        setLoading(false);
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.put(`https://cce-backend-54k0.onrender.com/api/admin/${id}/edit/`, formData);

            if (response.status === 200) {
                setAdmin((prevAdmin) => ({ ...prevAdmin, ...formData }));
                toast.success("Admin details updated successfully.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
                setEditMode(false);
            }
        } catch (error) {
            console.error("Error updating admin details:", error);
            toast.error("Failed to update admin details.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const generateCSV = () => {
        const csvRows = [];

        let last_login = admin.last_login ? new Date(admin.last_login).toLocaleString() : "Never"
        last_login = last_login.replace(/,/g, " ");

        const adminHeaders = ["Name", "Email", "Department", "College Name", "Status", "Last Login", "Date Created"];
        const adminValues = [
            admin.name,
            admin.email,
            admin.department,
            admin.college_name,
            admin.status,
            last_login,
            admin.created_at ? new Date(admin.created_at).toLocaleDateString() : "Unknown"
        ];

        csvRows.push(adminHeaders.join(","));
        csvRows.push(adminValues.join(","));

        if (jobs.length > 0) {
            const jobHeaders = ["Job Title", "Company", "Location", "Published Date"];
            csvRows.push("\n" + jobHeaders.join(","));

            jobs.forEach(job => {
                let location = job.job_location;
                location = location.replace(/,/g, " ");
                const jobValues = [
                    job.title,
                    job.company_name,
                    location,
                    job.updated_at ? new Date(job.updated_at).toLocaleDateString() : "Unknown"
                ];
                csvRows.push(jobValues.join(","));
            });
        }

        return csvRows.join("\n").trim();
    };

    const downloadCSV = () => {
        const csvData = generateCSV();
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "admin_details.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const indexOfLastJob = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstJob = indexOfLastJob - ITEMS_PER_PAGE;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

    if (error) {
        return <p className="text-red-600">{error}</p>;
    }

    if (!admin) {
        return <p className="text-gray-600">Loading...</p>;
    }

    return (
        <div className="flex">
            <SuperAdminPageNavbar />
            <div className="mt-5 flex-1 p-6">
                <div className="grid h-full grid-cols-1 lg:grid-cols-2 gap-2 justify-center items-stretch">
                    <div className="w-full p-6 border-r flex flex-col justify-center border-gray-300"> {/* Removed margin-top and adjusted width */}
                        <h1 className="text-center font-semibold text-2xl text-gray-900 mb-4">Admin Details</h1>
                        <p className="text-center text-sm text-gray-600 mb-2">
                            View and edit admin account details below<br/> Account Status:{" "}
                            <span className={`font-bold ${admin.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                                {admin.status}
                            </span>
                        </p>
                        {message && <p className="text-blue-600 font-semibold">{message}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                            {editMode ? (
                                <>
                                    <StylishInput
                                        label="Name"
                                        value={formData.name}
                                        readOnly={false}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <StylishInput
                                        label="Email"
                                        value={formData.email}
                                        readOnly={false}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <StylishInput
                                        label="Department"
                                        value={formData.department}
                                        readOnly={false}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    />
                                    <StylishInput
                                        label="College Name"
                                        value={formData.college_name}
                                        readOnly={false}
                                        onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                                    />
                                </>
                            ) : (
                                <>
                                    <StylishInput label="Name" value={admin.name || "N/A"} readOnly={true} />
                                    <StylishInput label="Email" value={admin.email || "N/A"} readOnly={true} />
                                    <StylishInput label="College Name" value={admin.college_name || "N/A"} readOnly={true} />
                                    <StylishInput label="Department" value={admin.department || "N/A"} readOnly={true} />
                                    <StylishInput
                                        label="Date Created"
                                        value={admin.created_at ? new Date(admin.created_at).toLocaleDateString() : "Unknown"}
                                        readOnly={true}
                                    />
                                    <StylishInput
                                        label="Last Login"
                                        value={admin.last_login ? new Date(admin.last_login).toLocaleString() : "Never"}
                                        readOnly={true}
                                    />
                                </>
                            )}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-4 justify-center">
                            {admin.status === "Active" ? (
                                <button
                                    onClick={() => handleStatusChange("Inactive")}
                                    disabled={loading}
                                    className="px-8 py-2 border border-red text-red-500 rounded-md shadow  transition-all duration-200"
                                >
                                    {loading ? "Processing..." : "Inactive"}
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleStatusChange("Active")}
                                    disabled={loading}
                                    className="px-8 py-2 border border-green text-green-700 rounded-md shadow  transition-all duration-200"
                                >
                                    {loading ? "Processing..." : "Activate"}
                                </button>
                            )}

                            {editMode ? (
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-8 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-all duration-200"
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            ) : (
                                <button
                                    onClick={handleEdit}
                                    className="px-8 py-2 bg-yellow-500 text-white rounded-md shadow hover:bg-yellow-600 transition-all duration-200"
                                >
                                    Edit info
                                </button>
                            )}
                        </div>
                    </div>
                            
                    <div className="w-full p-4 flex flex-col justify-center"> {/* Adjusted width */}
                        <h3 className="text-center  text-2xl font-bold mt-6 mb-2">Admin's Job Posts</h3>
                        <p className="text-center text-sm text-gray-600 mb-4">Explore the job postings made by this admin.</p>
                        <div className="flex  space-x-6 mb-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    className={`pb-2 text-lg font-medium ${
                                        activeTab === tab ? "border-b-2 border-yellow-500 text-black" : "text-gray-500"
                                    }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {jobs.length === 0 ? (
                            <p className="text-gray-600">This admin has not posted any jobs yet.</p>
                        ) : (
                            <>
                                <div className="flex flex-col gap-4"> {/* Changed to flex-col for column layout */}
                                    {currentJobs.map((job) => (
                                        <Adminjobposts
                                            key={job._id}
                                            application={job}
                                            handleCardClick={() => {}}
                                            isSaved={undefined}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={downloadCSV}
                                        className="px-4 py-2 border border-black text-black rounded-md shadow transition-all duration-200"
                                    >
                                        Download CSV
                                    </button>
                                </div>

                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={jobs.length}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
