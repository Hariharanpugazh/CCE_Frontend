const apiBaseURL = "https://cce-backend-54k0.onrender.com";

const AppPages = {
  studentLogin: {
    route: "/login",
    name: "studentLogin",
    displayName: "Student Portal",
  },

  adminLogin: {
    route: "/admin/login",
    name: "adminLogin",
    displayName: "Admin Portal",
  },

  superUserLogin: {
    route: "/superAdmin/login",
    name: "superUserLogin",
    displayName: "Super Admin Portal",
  },

  internShipDashboard: {
    route: "/internships",
    name: "internDashboard",
    displayName: "Internships",
  },

  jobDashboard: {
    route: "/jobs",
    name: "jobDashboard",
    displayName: "Jobs",
  },

  adminHome: {
    route: "/internships",
    name: "internDashboard",
    displayName: "Admin Dashboard",
  },

  adminInternShipDashboard: {
    route: "/admin/internships",
    name: "internDashboard",
    displayName: "Internships",
  },

  adminJobDashboard: {
    route: "/jobs",
    name: "jobDashboard",
    displayName: "Jobs",
  },

  forgotPassword: {
    route: "/forgot-password",
    name: "forgotPassword",
    displayName: "Forgot Password",
  },

  resetPassword: {
    route: "/reset-password",
    name: "resetPassword",
    displayName: "Reset Password",
  },
};

const apiEndpoints = {
  adminSignup: `${apiBaseURL}/api/signup/`,
  adminLogin: `${apiBaseURL}/api/login/`,
  postInternship: `${apiBaseURL}/api/internship_post`,
  getInternships: `${apiBaseURL}/api/internship/`,

  // Superadmin
  superAdminSignup: `${apiBaseURL}/api/superadmin_signup/`,
  superAdminLogin: `${apiBaseURL}/api/superadmin_login/`,

  // Student
  studentSignup: `${apiBaseURL}/api/stud/signup/`,
  studentLogin: `${apiBaseURL}/api/stud/login/`,
};

const Departments = {
  TNPC: "TNPC",
  ArmyAndDefence: "Army and Defence",
  ITDevelopment: "IT & Development",
  Civil: "Civil",
  Banking: "Banking",
  UPSC: "UPSC",
  Biomedical: "Biomedical",
  TNPCc: "TNPSC",
  ArmyAndDefencec: "Army and Defence Systems",
};

export { AppPages, apiBaseURL, apiEndpoints, Departments };



