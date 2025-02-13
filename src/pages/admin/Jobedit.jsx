import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
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
            setUserRole(payload.role); // Assuming the payload has a 'role' field
        }

        fetch(`http://127.0.0.1:8000/api/job/${id}/`)
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

        fetch(`http://127.0.0.1:8000/api/job-edit/${id}/`, {
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
            fetch(`http://127.0.0.1:8000/api/job-delete/${id}/`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    navigate('/jobs'); // Redirect to the jobs list page after deletion
                } else {
                    console.error("Error deleting job:", response.statusText);
                }
            })
            .catch(error => console.error("Error deleting job:", error));
        }
    };

    if (!job) return <p className="text-center text-lg font-semibold">Loading...</p>;

    return (
        <div className="max-w mx-auto p-4 sm:p-6 lg ">
            {/* Render appropriate navbar based on user role */}
            {userRole === "admin" && <AdminPageNavbar />}
            {userRole === "superadmin" && <SuperAdminPageNavbar />}
            <div className="max-w mx-auto bg-white shadow-lg rounded-lg p-8 my-10 border border-gray-200">
                <div className="flex justify-between items-center mb-8">
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

                {/* Job Title & Company */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        {isEditing ? (
                            <>
                                <label className="block mb-2 text-gray-700">Job Title:</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editedJob.job_data.title}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded mb-4"
                                />
                            </>
                        ) : (
                            <h2 className="text-3xl font-bold text-gray-900">{job.job_data.title}</h2>
                        )}
                        {isEditing ? (
                            <>
                                <label className="block mb-2 text-gray-700">Company Name:</label>
                                <input
                                    type="text"
                                    name="company_name"
                                    value={editedJob.job_data.company_name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded mt-2"
                                />
                            </>
                        ) : (
                            <p className="text-lg text-gray-700 mt-2">{job.job_data.company_name}</p>
                        )}
                    </div>
                    <a
                        href={job.job_data.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                    >
                        Visit Company Website
                    </a>
                </div>

                {/* Job Overview */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Job Overview</h3>
                    {isEditing ? (
                        <>
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
                                <label className="block mb-2 text-gray-700">Work Schedule:</label>
                                <input
                                    type="text"
                                    name="work_schedule"
                                    value={editedJob.job_data.work_schedule}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-gray-700">Salary Range:</label>
                                <input
                                    type="text"
                                    name="salary_range"
                                    value={editedJob.job_data.salary_range}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-gray-700">Experience Level:</label>
                                <input
                                    type="text"
                                    name="experience_level"
                                    value={editedJob.job_data.experience_level}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-700 mb-2"><strong>Location:</strong> {job.job_data.job_location}</p>
                            <p className="text-gray-700 mb-2"><strong>Work Type:</strong> {job.job_data.work_type}</p>
                            <p className="text-gray-700 mb-2"><strong>Work Schedule:</strong> {job.job_data.work_schedule}</p>
                            <p className="text-gray-700 mb-2"><strong>Salary Range:</strong> {job.job_data.salary_range}</p>
                            <p className="text-gray-700 mb-2"><strong>Experience Level:</strong> {job.job_data.experience_level}</p>
                        </>
                    )}
                </div>

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
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Required Skills & Qualifications</h3>
                    {isEditing ? (
                        <>
                            <div className="mb-4">
                                <label className="block mb-2 text-gray-700">Education Requirements:</label>
                                <input
                                    type="text"
                                    name="education_requirements"
                                    value={editedJob.job_data.education_requirements}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
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
                            <p className="text-gray-700 mb-2"><strong>Education:</strong> {job.job_data.education_requirements}</p>
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
                <div className="text-center mt-8">
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
    );
};

export default JobEdit;
