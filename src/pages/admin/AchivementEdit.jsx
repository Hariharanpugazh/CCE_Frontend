import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { IoMdArrowDropdown } from "react-icons/io";


export default function AchievementEdit() {
  const { id } = useParams();
  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedAchievement, setEditedAchievement] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const token = Cookies.get("jwt");
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const fileInputRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const response = await fetch(`https://cce-backend-54k0.onrender.com/api/get-achievement/${id}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch (err) {
            throw new Error("Server returned an invalid response");
          }
          throw new Error(errorData.error || "Failed to fetch achievement");
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
      [name]: value,
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
    if (window.confirm("Are you sure you want to remove this image?")) {
      setNewImage(null);
      setImagePreview(null);
      setEditedAchievement((prevAchievement) => ({
        ...prevAchievement,
        photo: null, // Remove existing image from backend
      }));
    }
  };

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      setUserRole(payload.role); // Assuming the payload has a 'role' field
    }
  }, []);

  const handleSave = async () => {
    try {
      // Add date validation
      const selectedDate = new Date(editedAchievement.date_of_achievement);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

      if (selectedDate > today) {
        setError("Date of achievement cannot be in the future");
        return;
      }

      const updatedData = { ...editedAchievement };

      if (newImage) {
        const reader = new FileReader();
        reader.readAsDataURL(newImage);
        reader.onloadend = async () => {
          updatedData.photo = reader.result.split(",")[1]; // Get only base64 part

          const response = await fetch(`https://cce-backend-54k0.onrender.com/api/edit-achievement/${id}/`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update achievement");
          }

          setAchievement(updatedData);
          navigate("/admin-achievements"); // Redirect to the previous page
        };
      } else {
        const response = await fetch(`https://cce-backend-54k0.onrender.com/api/edit-achievement/${id}/`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update achievement");
        }

        setAchievement(updatedData);
        navigate("/admin-achievements"); // Redirect to the previous page
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      try {
        const response = await fetch(`https://cce-backend-54k0.onrender.com/api/delete-achievement/${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete achievement");
        }

        alert("Achievement deleted successfully!");

        // Navigate based on user role
        if (userRole === "admin") {
          navigate(-1);
        } else if (userRole === "superadmin") {
          navigate(-1);
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleCancel = () => {
    // Navigate based on user role
    if (userRole === "admin") {
      navigate(-1);
    } else if (userRole === "superadmin") {
      navigate(-1);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Navbar */}
      <div className="w-64">
        {userRole === "admin" && <AdminPageNavbar />}
        {userRole === "superadmin" && <SuperAdminPageNavbar />}
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="w-full h-[700px] mt-8 mx-auto bg-white shadow-lg rounded-lg p-8 border border-gray-300">
          <h1 className="text-2xl font-semibold mb-4">Edit Achievements</h1>
          {achievement && (
            <div>
              <div className="relative flex items-center ml-15 mb-6">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Achievement"
                    className="w-[150px] h-[150px] object-cover rounded-full"
                    style={{ position: "absolute", top: "20px", left: "20px" }}
                  />
                ) : (
                  <div 
                    className="w-[150px] h-[150px] rounded-full bg-yellow-500 flex items-center justify-center text-4xl font-bold text-white"
                    style={{ position: "absolute", top: "20px", left: "20px" }}
                  >
                    {getInitials(editedAchievement.name)}
                  </div>
                )}
                <div className="flex space-x-2 ml-[180px] mt-[165px]  ">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="bg-yellow-500 text-black px-4 py-2 rounded-md ml-4 mr-8 relative -top-8"
                  >
                    Upload picture
                  </button>
                  <button
                    onClick={handleRemoveImage}
                    className="bg-gray-300 text-black px-4 py-2 rounded-md  relative -top-8"
                  >
                    Remove picture
                  </button>
                </div>
              </div>
              <hr className="mb-6 border-gray-300 relative -top-5 mr-40 ml-15" />

              <form className="space-y-6 mr-55 ml-22 ">
                <div className="space-y-5  ">
                  <div className="flex space-x-20 ">
                    <div className="flex-1">
                      <div className="relative border-2 border-gray-400 rounded-lg w-full mb-5  ">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={editedAchievement.name}
                          onChange={handleChange}
                          maxLength={100} // Set character limit
                          className="w-full py-2 px-1 text-gray-700 focus:outline-none focus:border-blue-500 rounded-sm"
                          placeholder=" "
                        />
                        <label className="absolute top-[-10px] left-2 bg-white text-sm text-gray-600 px-1">Name</label>
                      </div>
                    </div>
                    <div className="flex-1 ">
                      <div className="relative border-2 border-gray-400 rounded-lg w-full  mb-5 ">
                        <select
                          id="achievement_type"
                          name="achievement_type"
                          value={editedAchievement.achievement_type}
                          onChange={handleChange}
                          className="w-full py-2 px-2 text-gray-700 focus:outline-none focus:border-blue-500 rounded-sm appearance-none" // Added appearance-none
                        >
                          <option value="">Select Achievement Type</option>
                          <option value="Job Placement">Job Placement</option>
                          <option value="Internship">Internship</option>
                          <option value="Certification">Certification</option>
                          <option value="Exam Cracked">Exam Cracked</option>
                        </select>
                        <label className="absolute top-[-10px] left-2 bg-white text-sm text-gray-600 px-1">Achievement Type</label>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          ▼
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-6 ">
                    <div className="flex-1  mr-20">
                      <div className="relative border-2 border-gray-400 rounded-lg w-full  mb-5 ">
                        <input
                          type="text"
                          id="company_name"
                          name="company_name"
                          value={editedAchievement.company_name}
                          onChange={handleChange}
                          maxLength={50} // Set character limit
                          className="w-full py-2 px-2 text-gray-700 focus:outline-none focus:border-blue-500 rounded-sm"
                          placeholder=" "
                        />
                        <label className="absolute top-[-10px] left-2 bg-white text-sm text-gray-600 px-1">Company Name</label>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="relative border-2 border-gray-400 rounded-lg w-full mb-5">
                        <input
                          type="date"
                          id="date_of_achievement"
                          name="date_of_achievement"
                          value={editedAchievement.date_of_achievement}
                          onChange={(e) => {
                            const selectedDate = new Date(e.target.value);
                            const today = new Date();
                            today.setHours(23, 59, 59, 999); // Set to end of today
                            
                            if (selectedDate > today) {
                              setError("Achievement date must be today or earlier");
                              return;
                            }
                            setError(null);
                            handleChange(e);
                          }}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full py-2 px-2 text-gray-700 focus:outline-none focus:border-blue-500 rounded-sm"
                          placeholder=" "
                        />
                        <label className="absolute top-[-10px] left-2 bg-white text-sm text-gray-600 px-1">Date of Achievement</label>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="relative border-2 border-gray-400 rounded-lg w-full mb-5">
                      <textarea
                        id="achievement_description"
                        name="achievement_description"
                        value={editedAchievement.achievement_description}
                        onChange={handleChange}
                        maxLength={300} // Set character limit
                        className="w-full py-2 px-2 text-gray-700 focus:outline-none focus:border-blue-500 rounded-sm"
                        placeholder=" "
                      ></textarea>
                      <label className="absolute top-[-10px] left-2 bg-white text-sm text-gray-600 px-1 ">Achievement Description</label>
                    </div>
                  </div>

                  <div>
                    <div className="relative   mr-125  border-2 border-gray-400 rounded-lg    ">
                      <input
                        type="text"
                        id="batch"
                        name="batch"
                        value={editedAchievement.batch}
                        onChange={handleChange}
                        maxLength={9} // Set character limit
                        className="w-full py-2 px-2 text-gray-700 focus:outline-none focus:border-blue-500 rounded-sm"
                        placeholder=" "
                      />
                      <label className="absolute top-[-10px] left-2 bg-white text-sm text-gray-600 px-1 ">Batch</label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
          <div className="text-right flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="bg-white border border-gray-600 text-gray-600 px-4 py-2 rounded-md mb-8"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-white border border-red-600 text-red-600 px-4 py-2 rounded-md mb-8"
            >
              Delete
            </button>
            <button
              onClick={handleSave}
              className="bg-yellow-500 text-black px-4 py-2 rounded-md mb-8"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}