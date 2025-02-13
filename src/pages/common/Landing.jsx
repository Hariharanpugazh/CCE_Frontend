import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function EnhancedLandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-gray-800 to-gray-900 text-white">
      <motion.h1
        className="text-5xl font-extrabold mb-6 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to Our Platform
      </motion.h1>

      <motion.p
        className="text-lg text-center max-w-3xl mb-12 text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Explore a world of opportunities designed to empower students, staff, and administrators. Join us to access cutting-edge resources, collaborative tools, and tailored experiences.
      </motion.p>

      <div className="flex space-x-8">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/superadmin">
            
            <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-10 py-4 rounded-full shadow-lg hover:from-red-600 hover:to-pink-600 focus:ring-4 focus:ring-pink-300 transition-all text-lg font-semibold">
              SuperAdmin Portal
            </button>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/admin">
            <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-10 py-4 rounded-full shadow-lg hover:from-green-600 hover:to-teal-600 focus:ring-4 focus:ring-teal-300 transition-all text-lg font-semibold">
              Admin Portal
            </button>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/student">
          <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-10 py-4 rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-600 focus:ring-4 focus:ring-indigo-300 transition-all text-lg font-semibold">
              Student Portal
            </button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        © 2025 iHub. All rights reserved.
      </motion.div>
    </div>
  );
}

export default EnhancedLandingPage;
