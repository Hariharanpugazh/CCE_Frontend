import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { FaBuilding, FaBriefcase, FaMapMarkerAlt, FaGraduationCap, FaUserTie } from "react-icons/fa";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

const JobEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedJob, setEditedJob] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = Cookies.get("jwt");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
            setUserRole(payload.role);
        }

        fetch(`https://cce-backend-54k0.onrender.com/api/job/${id}/`)
            .then(response => response.json())
            .then(data => {
                setJob(data.job);
                setEditedJob(data.job);
            })
            .catch(error => console.error("Error fetching job:", error));
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedJob(prevJob => ({
            ...prevJob,
            job_data: {
                ...prevJob.job_data,
                [name]: value
            }
        }));
    };

    const handleSave = () => {
        const token = Cookies.get("jwt");
        let role = null;
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
            role = payload.role; // Extract the role from the payload
        }

        const updatedJobData = {
            ...editedJob,
            edited: role // Include the role in the request payload
        };
        console.log(updatedJobData);

        fetch(`https://cce-backend-54k0.onrender.com/api/job-edit/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedJobData)
        })
        .then(response => response.json())
        .then(data => {
            setJob(data.job);
            setIsEditing(false);
        })
        .catch(error => console.error("Error saving job:", error));
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            fetch(`https://cce-backend-54k0.onrender.com/api/job-delete/${id}/`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    // Redirect based on the user role
                    if (userRole === "admin") {
                        navigate('/manage-jobs');
                    } else if (userRole === "superadmin") {
                        navigate('/superadmin-manage-jobs');
                    } else {
                        navigate('/jobs'); // Default fallback
                    }
                } else {
                    console.error("Error deleting job:", response.statusText);
                }
            })
            .catch(error => console.error("Error deleting job:", error));
        }
    };
    

    if (!job) return <p className="text-center text-lg font-semibold">Loading...</p>;

    return (
        <div className="flex flex-col min-h-screen">
            {/* Render appropriate navbar based on user role */}
            {userRole === "admin" && <AdminPageNavbar />}
            {userRole === "superadmin" && <SuperAdminPageNavbar />}

            <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row w-[70%] max-w-7xl bg-transparent rounded-lg overflow-hidden">
                    {/* Job Overview */}
                    <div className="lg:w-1/3 p-4 bg-white border border-gray-300 lg:mr-8 rounded-lg">
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Job Overview</h3>
                            {isEditing ? (
                                <>
                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700">Company Name:</label>
                                        <input
                                            type="text"
                                            name="company_name"
                                            value={editedJob.job_data.company_name}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700">Work Type:</label>
                                        <input
                                            type="text"
                                            name="work_type"
                                            value={editedJob.job_data.work_type}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700">Location:</label>
                                        <input
                                            type="text"
                                            name="job_location"
                                            value={editedJob.job_data.job_location}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700">Education:</label>
                                        <input
                                            type="text"
                                            name="education_requirements"
                                            value={editedJob.job_data.education_requirements}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700">Experience:</label>
                                        <input
                                            type="text"
                                            name="experience_level"
                                            value={editedJob.job_data.experience_level}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700">Salary:</label>
                                        <input
                                            type="text"
                                            name="salary_range"
                                            value={editedJob.job_data.salary_range}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-700 mb-2 flex items-center">
                                        <FaBuilding className="mr-2 text-gray-600" />
                                        <div className="flex flex-col">
                                        <h3 className="font-semibold">Company Name:</h3> 
                                        <span className="text-sm">{job.job_data.company_name}</span>
                                        </div>
                                    </p>

                                    <p className="text-gray-700 mb-2 flex items-center">
                                        <FaBriefcase className="mr-2 text-gray-600" />
                                        <div className="flex flex-col">
                                        <h3 className="font-semibold">Work Type:</h3> 
                                        <span className="text-sm">{job.job_data.work_type}</span>
                                        </div>
                                    </p>

                                    <p className="text-gray-700 mb-2 flex items-center">
                                        <FaMapMarkerAlt className="mr-2 text-gray-600" />
                                        <div className="flex flex-col">
                                        <h3 className="font-semibold">Location:</h3> 
                                        <span className="text-sm">{job.job_data.job_location}</span>
                                        </div>
                                    </p>

                                    <p className="text-gray-700 mb-2 flex items-center">
                                        <FaGraduationCap className="mr-2 text-lg text-gray-600" />
                                        <div className="flex flex-col">
                                        <h3 className="font-semibold">Education:</h3> 
                                        <span className="text-sm">{job.job_data.education_requirements}</span>
                                        </div>
                                    </p>

                                    <p className="text-gray-700 mb-2 flex items-center">
                                        <FaUserTie className="mr-2 text-gray-600" />
                                        <div className="flex flex-col">
                                        <h3 className="font-semibold">Experience:</h3> 
                                        <span className="text-sm">{job.job_data.experience_level} years</span>
                                        </div>
                                    </p>

                                    <p className="text-gray-700 mb-2 flex items-center">
                                        <RiMoneyRupeeCircleFill className="mr-2 text-gray-600" />
                                        <div className="flex flex-col">
                                        <h3 className="font-semibold">Salary:</h3> 
                                        <span className="text-sm">₹ {job.job_data.salary_range} per annum</span>
                                        </div>
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="flex justify-between items-center mb-2 mt-50">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                {isEditing ? "Cancel" : "Edit"}
                            </button>
                            {isEditing && (
                                <button
                                    onClick={handleSave}
                                    className="bg-green-600 text-white px-4 py-2 rounded ml-2"
                                >
                                    Save
                                </button>
                            )}
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded ml-2"
                            >
                                Delete
                            </button>
                        </div>   
                    </div>
                    

                    {/* Job Description and Other Details */}
                    <div className="lg:w-2/3 p-4 overflow-y-auto" style={{ maxHeight: '600px' }}>
                        {/* Job Description */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h3>
                            {isEditing ? (
                                <textarea
                                    name="job_description"
                                    value={editedJob.job_data.job_description}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            ) : (
                                <p className="text-gray-700">{job.job_data.job_description}</p>
                            )}
                        </div>

                        {/* Key Responsibilities */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Responsibilities</h3>
                            {isEditing ? (
                                <textarea
                                    name="key_responsibilities"
                                    value={editedJob.job_data.key_responsibilities}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            ) : (
                                <p className="text-gray-700">{job.job_data.key_responsibilities}</p>
                            )}
                        </div>

                        {/* Skills & Education */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Required Skills</h3>
                            {isEditing ? (
                                <>
                                
                                </>
                            ) : (
                                <>
                                    <div className="text-gray-700 mb-2">
                                        <strong>Skills:</strong>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {Array.isArray(job.job_data.required_skills) ? (
                                                job.job_data.required_skills.map((skill, index) => (
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
                                </>
                            )}
                        </div>

                        {/* Benefits */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Benefits</h3>
                            {isEditing ? (
                                <textarea
                                    name="benefits"
                                    value={editedJob.job_data.benefits}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            ) : (
                                <p className="text-gray-700">{job.job_data.benefits}</p>
                            )}
                        </div>

                        {/* Application Details */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Application Process</h3>
                            {isEditing ? (
                                <>
                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700">Application Deadline:</label>
                                        <input
                                            type="text"
                                            name="application_deadline"
                                            value={editedJob.job_data.application_deadline}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700">Application Instructions:</label>
                                        <textarea
                                            name="application_instructions"
                                            value={editedJob.job_data.application_instructions}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-700 mb-2"><strong>Deadline:</strong> {job.job_data.application_deadline}</p>
                                    <p className="text-gray-700 mb-2"><strong>Instructions:</strong> {job.job_data.application_instructions}</p>
                                </>
                            )}
                        </div>

                        {/* Contact Information */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
                            {isEditing ? (
                                <>
                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700">Contact Email:</label>
                                        <input
                                            type="text"
                                            name="contact_email"
                                            value={editedJob.job_data.contact_email}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700">Contact Phone:</label>
                                        <input
                                            type="text"
                                            name="contact_phone"
                                            value={editedJob.job_data.contact_phone}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-700 mb-2"><strong>Email:</strong> {job.job_data.contact_email}</p>
                                    <p className="text-gray-700 mb-2"><strong>Phone:</strong> {job.job_data.contact_phone}</p>
                                </>
                            )}
                        </div>

                        {/* Apply Button */}
                        <div className="text-left mt-8">
                            <a
                                href={job.job_data.company_website}
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

export default JobEdit;
