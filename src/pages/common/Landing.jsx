import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Squares from "../../components/ui/GridLogin";
import { ChevronRight, Shield, Users, GraduationCap } from "lucide-react";

function EnhancedLandingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Animated Background */}
      <div className="h-full w-full absolute top-0 left-0 z-10 opacity-40">
        <Squares
          speed={0.15}
          squareSize={40}
          direction="diagonal"
          borderColor="#FECC00"
          hoverFillColor="#FECC00"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-6 bg-yellow-400/20 px-4 py-2 rounded-full"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-yellow-700 font-semibold">Welcome to iHub Platform</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Welcome to Our Platform
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore a world of opportunities designed to empower students, staff,
            and administrators. Join us to access cutting-edge resources,
            collaborative tools, and tailored experiences.
          </p>
        </motion.div>

        {/* Role Selection Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {/* SuperAdmin Card */}
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group"
          >
            <Link to="/superadmin" className="block">
              <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
                <div className="mb-4">
                  <Shield className="w-12 h-12 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">SuperAdmin</h3>
                <p className="text-gray-600 mb-4">Full system control and management capabilities</p>
                <div className="flex items-center text-yellow-500 font-semibold group-hover:gap-2 transition-all">
                  <span>Access Portal</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Admin Card */}
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group"
          >
            <Link to="/admin" className="block">
              <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
                <div className="mb-4">
                  <Users className="w-12 h-12 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Admin</h3>
                <p className="text-gray-600 mb-4">Manage users and monitor system activities</p>
                <div className="flex items-center text-yellow-500 font-semibold group-hover:gap-2 transition-all">
                  <span>Access Portal</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Student Card */}
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group"
          >
            <Link to="/student" className="block">
              <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
                <div className="mb-4">
                  <GraduationCap className="w-12 h-12 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Student</h3>
                <p className="text-gray-600 mb-4">Access learning resources and track progress</p>
                <div className="flex items-center text-yellow-500 font-semibold group-hover:gap-2 transition-all">
                  <span>Access Portal</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="absolute bottom-8 text-gray-500 text-sm z-10 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <span className="font-medium">© 2025 iHub.</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>All rights reserved.</span>
        </motion.div>
      </div>
    </div>
  );
}
export default EnhancedLandingPage;