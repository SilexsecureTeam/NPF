import { ReactNode, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, FileText, CreditCard, Award, BookOpen, HelpCircle } from "lucide-react";
import { MdMenu, MdClose } from 'react-icons/md';
import { Bell } from "lucide-react";
import { toast } from "react-toastify";
import { baseUrl } from "@/services/axios-client";

const menuItems = [
  { name: "Home", icon: <Home size={20} />, path: "/dashboard/home" },
  { name: "Claims", icon: <FileText size={20} />, path:  "/dashboard/claims"  },
  { name: "Payment", icon: <CreditCard size={20} />, path:  "/dashboard/payment"  },
  { name: "Certificates", icon: <Award size={20} />, path: /* "/dashboard/certificates" */ "#" },
  { name: "Training", icon: <BookOpen size={20} />, path:/*  "/dashboard/training" */ "#" },
];

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => {

  const navigate = useNavigate();
  const handleLogout = async () => {
  
    const token = sessionStorage.getItem("authToken");
    const toastId = toast.loading('Logging out...');
    try {      
      const response = await fetch(`${baseUrl}/user/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })      
      if (response.ok) {
        toast.success('Logged out successfully');
        localStorage.clear();
        sessionStorage.clear();
        //window.location.href = "/auth/signin";
        setTimeout(() => {
          navigate("/auth/signin");
        },500)
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Something went wrong, please try again.");
    } finally {
      toast.dismiss(toastId);
    }
  }
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black opacity-40 md:hidden z-40" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg p-5 lg:p-8 z-50 
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform md:translate-x-0`}
      >
        <div className="flex justify-between items-center">
          {/* <img src="/assets/logo/logo4.jpg" alt="Company Logo" className="max-w-[50%] mx-auto mb-1" /> */}
          <img src="/assets/logo/npf_logo.svg" alt="Company Logo" className="max-w-[80%] md:max-w-[100%] mx-auto" />
          <button className="md:hidden text-gray-700" onClick={toggleSidebar}>
            <MdClose size={24} />
          </button>
        </div>

        <nav className="mt-4 lg:mt-8 space-y-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-gray-700 transition rounded ${isActive && item.path !== "#" ? "bg-[#009345] text-white" : "hover:bg-green-100"
                }`
              }
              onClick={toggleSidebar} // Close sidebar when a link is clicked on mobile
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto py-4 space-y-3">
          <NavLink
            to="#"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md"
          >
            <HelpCircle size={20} className="mr-2" />
            Get Help
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  )
};


const Header = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => {
  const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
  return (
    <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100vw-256px)] bg-white text-black px-6 md:px-16 
      flex justify-between items-center z-10 shadow h-16"
    >
      <h1 className="text-xl font-bold">
        Home
      </h1>
      
      {/* Search Bar */}
      <div className="flex-1 mx-6 max-w-md hidden md:block">
        <div className="relative">
          <input
            type="text"
            placeholder="Search here..."
            className="w-full px-4 lg:px-8 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>
      
      {/* Icons and Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <button className="relative">
          <Bell className="text-gray-600" size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
        </button>
        
        {/* Profile Section */}
        <div className="flex items-center space-x-2">
          {/* <img
            src="/assets/images/profile.png"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          /> */}
          <div className="hidden md:block">
            <p className="text-sm font-semibold">{userData.first_name} {userData.last_name}</p>
            <p className="text-xs text-gray-500">{userData.email}</p>
          </div>
        </div>
        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleSidebar}>
          {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      </div>

      
    </header>
  );
};


const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const navigate = useNavigate()  
  // Redirect to login page if not authenticated
  useEffect(() => { 
    const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
    const isAuthenticated = !!userData.id;
    if (!isAuthenticated) {
      navigate("/auth/signin");
    }
  },[])

  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <main className="md:ml-64 bg-gray-50 min-h-screen w-full">
        <Header isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <div className="mt-16">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
