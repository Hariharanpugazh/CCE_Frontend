import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

const StudyEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [studyMaterial, setStudyMaterial] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedStudyMaterial, setEditedStudyMaterial] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = Cookies.get("jwt");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserRole(payload.role);
        }
        
        fetch(`http://127.0.0.1:8000/api/study-material/${id}/`)
            .then(response => response.json())
            .then(data => {
                setStudyMaterial(data.study_material);
                setEditedStudyMaterial(data.study_material);
            })
            .catch(error => console.error("Error fetching study material:", error));
    }, [id]);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedStudyMaterial(prevStudyMaterial => ({
            ...prevStudyMaterial,
            study_material_data: {
                ...prevStudyMaterial.study_material_data,
                [name]: value
            }
        }));
    };

    const handleSave = () => {
        fetch(`http://127.0.0.1:8000/api/study-material-edit/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedStudyMaterial)
        })
        .then(response => response.json())
        .then(data => {
            setStudyMaterial(data.study_material);
            setIsEditing(false);
        })
        .catch(error => console.error("Error saving study material:", error));
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this study material?")) {
            fetch(`http://127.0.0.1:8000/api/study-material-delete/${id}/`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    navigate('/study-materials');
                } else {
                    console.error("Error deleting study material:", response.statusText);
                }
            })
            .catch(error => console.error("Error deleting study material:", error));
        }
    };

    if (!studyMaterial) return <p className="text-center text-lg font-semibold">Loading...</p>;

    return (
        <div className="max-w mx-auto p-4 sm:p-6 lg">
            {userRole === "admin" && <AdminPageNavbar />}
            {userRole === "superadmin" && <SuperAdminPageNavbar />}
            <div className="max-w mx-auto bg-white shadow-lg rounded-lg p-8 my-10 border border-gray-200">
                <div className="flex justify-between items-center mb-8">
                    <button onClick={() => setIsEditing(!isEditing)} className="bg-blue-600 text-white px-4 py-2 rounded">
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                    {isEditing && (
                        <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded ml-2">
                            Save
                        </button>
                    )}
                    <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded ml-2">
                        Delete
                    </button>
                </div>
                <div className="mb-8">
                    {isEditing ? (
                        <>
                            <label className="block mb-2 text-gray-700">Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={editedStudyMaterial.study_material_data.title}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </>
                    ) : (
                        <h2 className="text-3xl font-bold text-gray-900">{studyMaterial.study_material_data.title}</h2>
                    )}
                </div>
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Description</h3>
                    {isEditing ? (
                        <textarea
                            name="description"
                            value={editedStudyMaterial.study_material_data.description}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    ) : (
                        <p className="text-gray-700">{studyMaterial.study_material_data.description}</p>
                    )}
                </div>
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Text Content</h3>
                    {isEditing ? (
                        <textarea
                            name="text_content"
                            value={editedStudyMaterial.study_material_data.text_content}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    ) : (
                        <p className="text-gray-700">{studyMaterial.study_material_data.text_content}</p>
                    )}
                </div>
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Category</h3>
                    {isEditing ? (
                        <input
                            type="text"
                            name="category"
                            value={editedStudyMaterial.study_material_data.category}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    ) : (
                        <p className="text-gray-700">{studyMaterial.study_material_data.category}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudyEdit;
