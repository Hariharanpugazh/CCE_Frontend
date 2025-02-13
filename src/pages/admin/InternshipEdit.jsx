import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

const InternshipEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [internship, setInternship] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedInternship, setEditedInternship] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/internship/${id}/`)
            .then(response => response.json())
            .then(data => {
                setInternship(data.internship.internship_data);
                setEditedInternship(data.internship.internship_data);
            })
            .catch(error => console.error("Error fetching internship:", error));
    }, [id]);

    useEffect(() => {
        const token = Cookies.get("jwt");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
            console.log("Decoded JWT Payload:", payload); // Debugging line
            setUserRole(payload.role); // Assuming the payload has a 'role' field
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedInternship(prevInternship => ({
            ...prevInternship,
            [name]: value
        }));
    };

    const handleSave = () => {
        const token = Cookies.get("jwt");
        let role = null;
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
            role = payload.role; // Extract the role from the payload
        }
    
        const updatedInternshipData = {
            ...editedInternship,
            edited: role
        };
    
        fetch(`http://127.0.0.1:8000/api/internship-edit/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedInternshipData)
        })
        .then(response => response.json())
        .then(data => {
            // Ensure the response structure matches what the component expects
            if (data.internship && data.internship.internship_data) {
                setInternship(data.internship.internship_data);
                setIsEditing(false);
            } else {
                console.error("Unexpected response structure:", data);
            }
        })
        .catch(error => console.error("Error saving internship:", error));
    };
    
    

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this internship?")) {
            fetch(`http://127.0.0.1:8000/api/internship-delete/${id}/`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    navigate('/internships'); // Redirect to the internships list page after deletion
                } else {
                    console.error("Error deleting internship:", response.statusText);
                }
            })
            .catch(error => console.error("Error deleting internship:", error));
        }
    };

    if (!internship) return <p className="text-center text-lg font-semibold">Loading...</p>;

    return (
    <div>
    {/* Render appropriate navbar based on user role */}
    {userRole === "admin" && <AdminPageNavbar />}
    {userRole === "superadmin" && <SuperAdminPageNavbar />}
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 my-10 border border-gray-200">
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

            {/* Internship Title & Company */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    {isEditing ? (
                        <>
                            <label className="block mb-2 text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={editedInternship.title}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mb-4"
                            />
                        </>
                    ) : (
                        <h2 className="text-3xl font-bold text-gray-900">{internship.title}</h2>
                    )}
                    {isEditing ? (
                        <>
                            <label className="block mb-2 text-gray-700">Company Name</label>
                            <input
                                type="text"
                                name="company_name"
                                value={editedInternship.company_name}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mt-2"
                            />
                        </>
                    ) : (
                        <p className="text-lg text-gray-700 mt-2">{internship.company_name}</p>
                    )}
                </div>
                <a
                    href={internship.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                >
                    Visit Company Website
                </a>
            </div>

            {/* Internship Overview */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Internship Overview</h3>
                {isEditing ? (
                    <>
                        <label className="block mb-2 text-gray-700">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={editedInternship.location}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <label className="block mb-2 text-gray-700">Duration</label>
                        <input
                            type="text"
                            name="duration"
                            value={editedInternship.duration}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <label className="block mb-2 text-gray-700">Stipend</label>
                        <input
                            type="text"
                            name="stipend"
                            value={editedInternship.stipend}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <label className="block mb-2 text-gray-700">Application Deadline</label>
                        <input
                            type="text"
                            name="application_deadline"
                            value={editedInternship.application_deadline}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <label className="block mb-2 text-gray-700">Internship Type</label>
                        <input
                            type="text"
                            name="internship_type"
                            value={editedInternship.internship_type}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-4"
                        />
                    </>
                ) : (
                    <>
                        <p className="text-gray-700 mb-2"><strong>Location:</strong> {internship.location}</p>
                        <p className="text-gray-700 mb-2"><strong>Duration:</strong> {internship.duration}</p>
                        <p className="text-gray-700 mb-2"><strong>Stipend:</strong> {internship.stipend}</p>
                        <p className="text-gray-700 mb-2"><strong>Application Deadline:</strong> {internship.application_deadline}</p>
                        <p className="text-gray-700 mb-2"><strong>Internship Type:</strong> {internship.internship_type}</p>
                    </>
                )}
            </div>

            {/* Internship Description */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Internship Description</h3>
                {isEditing ? (
                    <textarea
                        name="job_description"
                        value={editedInternship.job_description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />
                ) : (
                    <p className="text-gray-700">{internship.job_description}</p>
                )}
            </div>

            {/* Skills Required */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills Required</h3>
                {isEditing ? (
                    <textarea
                        name="skills_required"
                        value={editedInternship.skills_required ? editedInternship.skills_required.join(', ') : ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded mb-4"
                    />
                ) : (
                    <div className="text-gray-700 mb-2">
                        <div className="flex flex-wrap gap-2 mt-2">
                            {internship.skills_required && internship.skills_required.map((skill, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Apply Button */}
            <div className="text-center mt-8">
                <a
                    href={internship.job_link}
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

export default InternshipEdit;
