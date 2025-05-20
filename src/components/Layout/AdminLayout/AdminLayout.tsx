import { ReactNode, useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, FileText, Settings, ChevronLeft, ChevronRight, LogOut, NewspaperIcon, Package2Icon, CarIcon } from "lucide-react";
import { MdMenu, MdClose, MdPayments, MdFeedback } from 'react-icons/md';
import { Bell } from "lucide-react";
import { toast } from "react-toastify";
import { FaBlog, FaHome } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";
import { RiContactsLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "@/components/AdminAuth/context/rootReducer";
import useAdminAuth from "@/hooks/useAdminAuth";

// Regular menu items available to all admins
const regularMenuItems = [
    { name: "Home", icon: <Home size={20} />, path: "/admin/dashboard/home" },
    { name: "Services Page", icon: <FileText size={20} />, path: "/admin/dashboard/pages" },
    { name: "Blog", icon: <FaBlog size={20} />, path: "/admin/dashboard/blog" },
    { name: "Blog Post", icon: <NewspaperIcon size={20} />, path: "/admin/dashboard/blog-post" },
    { name: "Contact Page", icon: <RiContactsLine size={20} />, path: "/admin/dashboard/contact-page" },
    { name: "Board Page", icon: <FaChalkboardTeacher size={20} />, path: "/admin/dashboard/board" },
    { name: "Home Slider", icon: <FaHome size={20} />, path: "/admin/dashboard/home-slider" },
    { name: "User Payments", icon: <MdPayments size={20} />, path: "/admin/dashboard/user-payments" },
    { name: "Feedback & Newsletter", icon: <MdFeedback size={20} />, path: "/admin/dashboard/feedback" },
];

// Super admin only menu items
const superAdminMenuItems = [
    { name: "Packages", icon: <Package2Icon size={20} />, path: "/admin/dashboard/packages" },
    { name: "Vehicle Management", icon: <CarIcon size={20} />, path: "/admin/dashboard/vehicle" },
];

const AdminSidebar = ({
    isOpen,
    toggleSidebar,
    isCollapsed,
    toggleCollapse,
    isSuperAdmin
}: {
    isOpen: boolean,
    toggleSidebar: () => void,
    isCollapsed: boolean,
    toggleCollapse: () => void,
    isSuperAdmin: boolean
}) => {

    const navigate = useNavigate();
    const { AdminLogout } = useAdminAuth();

    // Get admin authentication state from Redux store
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const token = localStorage.getItem("token");
    // Combine menu items based on admin role
    const combinedMenuItems = [...regularMenuItems, ...(isSuperAdmin ? superAdminMenuItems : [])];

    // Redirect to admin login page if not authenticated as admin
    useEffect(() => {
        if (!token || !isAuthenticated) {
            toast.error("Not authenticated or session expired, redirecting to login");
            navigate("/admin/dashboard/auth/signin");
        } else if (!user) {
            console.log("Not authenticated as admin, redirecting to login");
            navigate("/admin/dashboard/auth/signin");
        }
    }, []);

    const handleLogout = async () => {
        try {
            const response = await AdminLogout();
            toast.success(response);
        } catch (error) {
            toast.error(String(error));
        }
    };

    return (
        <>
            {/* Overlay - only shown on mobile */}
            {isOpen && (
                <div className="fixed inset-0 bg-black opacity-40 md:hidden z-40" onClick={toggleSidebar}></div>
            )}

            {/* Sidebar with proper structure for scrolling */}
            <aside
                className={`fixed top-0 left-0 h-screen ${isCollapsed ? 'w-24' : 'w-64'} bg-white shadow-lg z-50 
                transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
                transition-all duration-300 ease-in-out flex flex-col`}
            >
                {/* Top section - Logo and collapse button */}
                <div className="flex-shrink-0 p-5">
                    <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
                        {isCollapsed ? (
                            <div className="font-bold text-lg text-center text-green-700">NPF</div>
                        ) : (
                            <>
                                <img src="/assets/logo/npf_logo.svg" alt="Company Logo" className="max-w-[80%] md:max-w-[100%] mx-auto" />
                                <button className="md:hidden text-gray-700" onClick={toggleSidebar}>
                                    <MdClose size={24} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Collapse toggle button - visible only on large screens */}
                    <button
                        onClick={toggleCollapse}
                        className="hidden md:flex absolute -right-3 top-10 bg-white rounded-full shadow-md p-1 border border-gray-200"
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>

                {/* Middle section - Scrollable navigation */}
                <div className="flex-grow overflow-y-auto py-3 px-4 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                    <nav className={`space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
                        {combinedMenuItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) => {
                                    // Base classes
                                    const baseClasses = `flex ${isCollapsed ? 'justify-center' : 'items-center'} px-4 py-2.5 transition rounded w-full`;

                                    // For collapsed mode
                                    if (isCollapsed) {
                                        return `${baseClasses} ${isActive ? 'bg-[#009345] text-white' : 'text-gray-700 hover:bg-green-100'}`;
                                    }

                                    // For expanded mode
                                    return `${baseClasses} ${isActive ? 'bg-[#009345] text-white' : 'text-gray-700 hover:bg-green-100'}`;
                                }}
                                onClick={() => {
                                    if (window.innerWidth < 768) {
                                        toggleSidebar(); // Close sidebar when a link is clicked only on mobile
                                    }
                                }}
                                title={isCollapsed ? item.name : ""}
                            >
                                <span className={isCollapsed ? '' : 'mr-3'}>{item.icon}</span>
                                {!isCollapsed && item.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Bottom section - Logout button */}
                <div className={`flex-shrink-0 p-4 ${isCollapsed ? 'px-2' : 'px-5'} border-t border-gray-200`}>
                    <button
                        onClick={handleLogout}
                        className={`w-full flex ${isCollapsed ? 'justify-center' : 'items-center'} px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md`}
                        title={isCollapsed ? "Logout" : ""}
                    >
                        <LogOut size={20} className={isCollapsed ? '' : 'mr-2'} />
                        {!isCollapsed && "Logout"}
                    </button>
                </div>
            </aside>
        </>
    )
};

const Header = ({
    toggleSidebar,
    isCollapsed,
    setIsSuperAdmin
}: {
    isOpen: boolean,
    toggleSidebar: () => void,
    isCollapsed: boolean,
    setIsSuperAdmin: (value: boolean) => void
}) => {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { AdminLogout, getAdminDetails } = useAdminAuth();
    const user = useSelector((state: RootState) => state.auth.user);
    // Track super admin status locally in component
    const [apiSuperAdmin, setApiSuperAdmin] = useState<boolean>(false);

    // Fetch admin details and check if super admin
    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const response = await getAdminDetails();

                // Log entire response for debugging
                console.log("Full admin details response:", response?.data);

                // Check different properties that might indicate super admin status
                const isSuperAdminFromApi =
                    response?.data?.use_type === "superadmin"

                console.log("Is super admin determined from API:", isSuperAdminFromApi);

                // Update local state
                setApiSuperAdmin(isSuperAdminFromApi);

                // Update parent component state
                setIsSuperAdmin(isSuperAdminFromApi);

                // Store in localStorage for persistence
                localStorage.setItem('isSuperAdmin', isSuperAdminFromApi ? 'true' : 'false');

            } catch (error) {
                console.error("Error fetching admin details:", error);

                // Fall back to localStorage if API call fails
                const storedStatus = localStorage.getItem('isSuperAdmin') === 'true';
                setApiSuperAdmin(storedStatus);
                setIsSuperAdmin(storedStatus);
            }
        };

        fetchAdminDetails();
    }, [setIsSuperAdmin]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle change password click
    const handleChangePassword = () => {
        navigate('/admin/dashboard/auth/change-pwd');
        setIsProfileDropdownOpen(false);
    };

    const handleCreateAdmin = () => {
        navigate('/admin/dashboard/auth/signup');
        setIsProfileDropdownOpen(false);
    }

    // Handle logout click
    const handleLogout = async () => {
        try {
            const response = await AdminLogout();
            localStorage.removeItem('isSuperAdmin'); // Clear super admin status on logout
            toast.success(response);
        } catch (error) {
            toast.error(String(error));
        }
        setIsProfileDropdownOpen(false);
    };

    // Handle profile click
    const handleViewProfile = () => {
        navigate('/admin/dashboard/profile');
        setIsProfileDropdownOpen(false);
    };

    return (
        <header className={`fixed top-0 ${isCollapsed ? 'md:left-24' : 'md:left-64'} left-0 right-0 bg-[#4B9E4B] text-white px-4 md:px-8 
      flex justify-between items-center z-30 shadow h-16 md:h-20 transition-all duration-300`}
        >
            {/* Menu toggle button - only visible on mobile */}
            <button className="md:hidden mr-2" onClick={toggleSidebar}>
                <MdMenu size={24} />
            </button>

            <h1 className="text-base md:text-xl font-bold truncate">
                NPF Insurance Admin | Dashboard
            </h1>

            {/* Icons and Profile */}
            <div className="flex items-center space-x-2 md:space-x-4">
                {/* Language Selector - hidden on smaller screens */}
                <select className="hidden sm:block bg-transparent text-white rounded py-1 px-2">
                    <option value="en" className="text-black">Eng (US)</option>
                    <option value="fr" className="text-black">French</option>
                    <option value="es" className="text-black">Spanish</option>
                </select>

                {/* Notification Icon */}
                <button className="relative">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-700 rounded-full"></span>
                </button>

                {/* Settings Icon - hidden on very small screens */}
                <button className="relative hidden xs:block">
                    <Settings size={20} />
                </button>

                {/* Profile Section with Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        className="flex items-center focus:outline-none"
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    >
                        {user?.username && (
                            <span className="mr-2 hidden md:block text-sm">{user.username}</span>
                        )}
                        <img
                            src="/assets/images/unknown.png"
                            alt="Profile"
                            className="w-8 h-8 rounded-full cursor-pointer"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ml-1 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                            <button
                                onClick={handleViewProfile}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                My Profile
                            </button>

                            <button
                                onClick={handleChangePassword}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Change Password
                            </button>

                            {/* Using the API determined super admin status */}
                            {apiSuperAdmin && (
                                <button
                                    onClick={handleCreateAdmin}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Create new Admin
                                </button>


                            )}

                            {apiSuperAdmin && (
                                <button
                                    onClick={() => navigate("/admin/delete-admin")}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Delete Admin
                                </button>


                            )}

                            <hr className="my-1" />

                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const AdminDashboardLayout = ({ children }: { children: ReactNode }) => {
    // Initialize with localStorage value if available
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(() => {
        return localStorage.getItem('isSuperAdmin') === 'true' || false;
    });
    const navigate = useNavigate();

    // Emergency override for testing - uncomment if needed
    // useEffect(() => {
    //    setIsSuperAdmin(true);
    //    localStorage.setItem('isSuperAdmin', 'true');
    //    console.log("OVERRIDE: Super admin access enabled for testing");
    // }, []);

    // Protect packages route - redirect if not super admin
    useEffect(() => {
        const currentPath = window.location.pathname;
        if (currentPath === '/admin/dashboard/packages' && !isSuperAdmin) {
            toast.error("Access denied. Only super admins can access the Packages page.");
            navigate('/admin/dashboard/home');
        }
    }, [isSuperAdmin, navigate]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    // Close sidebar when screen is resized to desktop size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false); // No need to show overlay on large screens
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar
                isOpen={isOpen}
                toggleSidebar={toggleSidebar}
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
                isSuperAdmin={isSuperAdmin}
            />
            <main
                className={`flex-1 ${isCollapsed ? 'md:ml-24' : 'md:ml-64'} transition-all duration-300 ease-in-out`}
            >
                <Header
                    isOpen={isOpen}
                    toggleSidebar={toggleSidebar}
                    isCollapsed={isCollapsed}
                    setIsSuperAdmin={setIsSuperAdmin}
                />
                <div className="pt-20 md:pt-24 px-4 md:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardLayout;