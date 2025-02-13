import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import AdminPageNavbar from '../../components/Admin/AdminNavBar';

export default function AchievementEdit() {
  const { id } = useParams();
  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedAchievement, setEditedAchievement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const token = Cookies.get("jwt");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/get-achievement/${id}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch (err) {
            throw new Error('Server returned an invalid response');
          }
          throw new Error(errorData.error || 'Failed to fetch achievement');
        }

        const data = await response.json();
        setAchievement(data);
        setEditedAchievement(data);

        // Decode base64 image if available
        if (data.photo) {
          setImagePreview(`data:image/png;base64,${data.photo}`);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievement();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAchievement((prevAchievement) => ({
      ...prevAchievement,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setNewImage(null);
    setImagePreview(null);
    setEditedAchievement((prevAchievement) => ({
      ...prevAchievement,
      photo: null, // Remove existing image from backend
    }));
  };

  const handleSave = async () => {
    try {
      let updatedData = { ...editedAchievement };

      if (newImage) {
        const reader = new FileReader();
        reader.readAsDataURL(newImage);
        reader.onloadend = async () => {
          updatedData.photo = reader.result.split(',')[1]; // Get only base64 part

          const response = await fetch(`http://localhost:8000/api/edit-achievement/${id}/`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update achievement');
          }

          setAchievement(updatedData);
          setIsEditing(false);
        };
      } else {
        const response = await fetch(`http://localhost:8000/api/edit-achievement/${id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update achievement');
        }

        setAchievement(updatedData);
        setIsEditing(false);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/delete-achievement/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete achievement');
        }
  
        alert("Achievement deleted successfully!");
        navigate('/superadmin-manage-jobs'); // Redirect after deletion
      } catch (error) {
        setError(error.message);
      }
    }
  };  

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdminPageNavbar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Edit Achievement</h2>
        {achievement && (
          <div className="bg-white shadow-md rounded-md p-6">
            <div className="flex justify-between items-center mb-4">
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
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input type="text" name="name" value={editedAchievement.name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Achievement Type</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="achievement_type"
                    value={editedAchievement.achievement_type}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                ) : (
                  <p>{achievement.achievement_type}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Company Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="company_name"
                    value={editedAchievement.company_name}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                ) : (
                  <p>{achievement.company_name}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Date of Achievement</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="date_of_achievement"
                    value={editedAchievement.date_of_achievement}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                ) : (
                  <p>{achievement.date_of_achievement}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Batch</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="batch"
                    value={editedAchievement.batch}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                ) : (
                  <p>{achievement.batch}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Achievement Description</label>
                <textarea name="achievement_description" value={editedAchievement.achievement_description} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Upload New Image</label>
                {imagePreview && (
                  <div className="mb-2">
                    <img src={imagePreview} alt="Achievement Preview" className="w-32 h-32 object-cover rounded-md" />
                    {isEditing && (
                      <button onClick={handleRemoveImage} className="bg-red-500 text-white px-2 py-1 rounded mt-2">Remove Image</button>
                    )}
                  </div>
                )}
                {isEditing && (
                  <input type="file" accept="image/*" onChange={handleImageChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
