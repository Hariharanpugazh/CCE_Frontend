import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false); // Track sending state

  useEffect(() => {
    const storedEmail = localStorage.getItem("student.email");
    const storedName = Cookies.get("username");

    setFormData((prevData) => ({
      ...prevData,
      name: storedName || "",
      contact: storedEmail || "",
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true); // Set button to "Sending..."

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/contact-us/", formData, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success(response.data.message || "Message sent successfully!");

      setTimeout(() => {
        window.location.reload(); // Refresh page after success
      }, 1500); // Wait 1.5 seconds before refreshing
    } catch (error) {
      toast.error(error.response?.data.error || "Something went wrong!");
    } finally {
      setIsSending(false); // Reset button text
    }
  };

  return (
    <div>
      <StudentPageNavbar />
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white p-6">
        <div className="md:w-1/2 text-left p-6">
          <h2 className="text-3xl font-bold mb-4">Get in touch with us today!</h2>
          <p className="text-gray-600 mb-6">
            Whatever you need, whenever you need, our team is here to help and support you every step of the way.
          </p>
          <div className="mb-4">
            <p className="font-semibold">📧 Message Us</p>
            <p className="text-gray-600">support@gmail.com</p>
          </div>
          <div>
            <p className="font-semibold">📞 Call Us</p>
            <p className="text-gray-600">+91 98765 54321</p>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="md:w-1/2 bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-3 border rounded-lg bg-yellow-100"
              readOnly
            />
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="E-mail Id"
              className="w-full p-3 border rounded-lg bg-yellow-100"
              readOnly
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we help..."
              className="w-full p-3 border rounded-lg bg-yellow-100 h-32"
              required
            ></textarea>
            {/* Updated Button */}
            <button 
              type="submit" 
              className="w-full bg-yellow-400 text-black font-bold p-3 rounded-lg"
              disabled={isSending} // Disable button while sending
            >
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default ContactForm;