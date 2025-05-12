import { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa";
import useInsurance from "@/hooks/UseInsurance";
import { NavigationContext } from "@/components/Ui/NavigationContext";

// Helper function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

// Define base navigation links (without dynamic services)
const baseLinks = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "About",
    url: "/about",
    submenu: [{ title: "Board Members", url: "/about/superboard" }],
  },
  {
    title: 'Blog',
    url: "/blog"
  },
  {
    title: "Services",
    url: "#", // Changed to # to prevent navigation
    submenu: [], // Will be populated from API
  },
  {
    title: "Contact",
    url: "/contact",
  },
];

interface NavLinksProps {
  onLinkClick?: () => void;
  isServicesDropdownOpen?: boolean;
  toggleServicesDropdown?: (force?: boolean) => void;
}

export default function NavLinks({ onLinkClick, isServicesDropdownOpen, toggleServicesDropdown }: NavLinksProps) {
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [links, setLinks] = useState(baseLinks);
  const [servicesLoading, setServicesLoading] = useState(true);
  const { getAllservicesPage } = useInsurance();
  const location = useLocation();
  
  // Use the context values if props aren't provided
  const navContext = useContext(NavigationContext);
  const contextServicesDropdownOpen = navContext.isServicesDropdownOpen;
  const contextToggleServices = navContext.toggleServicesDropdown;
  
  // Choose between props and context values
  const isDropdownOpen = isServicesDropdownOpen !== undefined ? isServicesDropdownOpen : contextServicesDropdownOpen;
  const toggleDropdown = toggleServicesDropdown || contextToggleServices;
  
  // Track whether mouse is over dropdown to prevent flickering
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const [isMouseOverDropdown, setIsMouseOverDropdown] = useState(false);
  
  // Find the index of the Services entry in the links array
  const servicesIndex = links.findIndex(link => link.title === "Services");
  
  // Handler to close dropdown when a link is clicked
  const handleLinkClick = () => {
    setDropdownOpen(null);
    // Call parent's onLinkClick if provided
    if (onLinkClick) {
      onLinkClick();
    }
  };
  
  // Handle mouse events for dropdowns
  const handleMouseEnter = (index: number) => {
    if (links[index].submenu) {
      // For Services menu, use the context state
      if (index === servicesIndex) {
        toggleDropdown(true); // Force open the dropdown
        setIsMouseOverDropdown(true);
      } else {
        setDropdownOpen(index);
      }
    }
  };
  
  const handleMouseLeave = (index: number) => {
    if (links[index].submenu) {
      // For Services menu, don't close immediately to allow moving to dropdown
      if (index === servicesIndex) {
        setTimeout(() => {
          if (!isMouseOverDropdown) {
            toggleDropdown(false);
          }
        }, 100);
      } else {
        setDropdownOpen(null);
      }
    }
  };
  
  // Handle mouse events for services dropdown
  const handleDropdownMouseEnter = () => {
    setIsMouseOverDropdown(true);
  };
  
  const handleDropdownMouseLeave = () => {
    setIsMouseOverDropdown(false);
    toggleDropdown(false);
  };
  
  // Close dropdowns when location changes
  useEffect(() => {
    setDropdownOpen(null);
    // Don't reset the services dropdown if it was toggled from the homepage
  }, [location.pathname]);
  
  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      setServicesLoading(true);
      try {
        const response = await getAllservicesPage();
        
        // Process the API response
        let services = [];
        if (Array.isArray(response)) {
          services = response;
        } else if (response && typeof response === 'object') {
          services = Object.keys(response)
            .filter(key => !isNaN(Number(key)))
            .map(key => response[key]);
        }
        
        // Map service data to submenu items and decode HTML entities
        const serviceSubmenu = services.map(service => ({
          title: decodeHtmlEntities(service.title.replace(/<[^>]*>/g, '').trim()),
          url: `/services/view/${service.id}`
        }));
        
        // Update the services submenu in the links array
        setLinks(prevLinks => 
          prevLinks.map(link => 
            link.title === "Services" 
              ? { ...link, submenu: serviceSubmenu } 
              : link
          )
        );
      } catch (error) {
        console.error("Error fetching services for navigation:", error);
        // Add a default item in case of error
        setLinks(prevLinks => 
          prevLinks.map(link => 
            link.title === "Services" 
              ? { ...link, submenu: [{ title: "View All Services", url: "/services" }] } 
              : link
          )
        );
      } finally {
        setServicesLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  return (
    <>
      {/* Desktop Links */}
      <div className="hidden md:flex xl:space-x-4 items-center">
        {links.map((link, index) => (
          <div
            key={index}
            className="relative min-w-fit flex items-center"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            {index === servicesIndex ? (
              // Special handling for Services - use button instead of NavLink
              <button 
                onClick={() => toggleDropdown()}
                className="px-3 xl:px-4 py-2 font-bold text-black text-xs xl:text-base bg-transparent flex items-center"
              >
                {link.title}
                <FaCaretDown className="ml-1" />
                {servicesLoading && (
                  <span className="ml-1 inline-block h-3 w-3 rounded-full border-2 border-t-transparent border-green-600 animate-spin"></span>
                )}
              </button>
            ) : (
              // All other menu items use NavLink
              <NavLink
                to={link.url}
                className={({ isActive }) =>
                  `px-3 xl:px-4 py-2 font-bold text-black text-xs xl:text-base flex items-center ${isActive && link.url !== "#" ? "text-green-500" : ""}`
                }
                onClick={() => {
                  if (link.submenu?.length) {
                    setDropdownOpen(dropdownOpen === index ? null : index);
                  } else {
                    handleLinkClick();
                  }
                }}
                end={link.url === "/"}
              >
                {link.title}
                {(link.submenu && link.submenu.length > 0) && (
                  <FaCaretDown className="ml-1" />
                )}
              </NavLink>
            )}

            {/* Dropdown with enhanced scrollbar for Services */}
            {((index === servicesIndex && isDropdownOpen) || 
             (index !== servicesIndex && dropdownOpen === index)) && (
              <div 
                ref={index === servicesIndex ? servicesDropdownRef : null}
                className="absolute left-0 top-full mt-0.5 w-64 bg-white shadow-md rounded-md z-30 max-h-[300px] overflow-y-scroll custom-scrollbar"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#888888 #f1f1f1' }}
                onMouseEnter={index === servicesIndex ? handleDropdownMouseEnter : undefined}
                onMouseLeave={index === servicesIndex ? handleDropdownMouseLeave : undefined}
              >
                {/* Show loading indicator if services are still loading */}
                {index === servicesIndex && servicesLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent"></div>
                    <span className="ml-2 text-gray-600">Loading services...</span>
                  </div>
                ) : (
                  // Show regular submenu items
                  link.submenu && link.submenu.length > 0 ? (
                    link.submenu.map((sub, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={sub.url}
                        className={({ isActive }) => 
                          `block px-4 py-2 hover:bg-gray-100 text-black ${isActive ? "text-green-600 font-medium" : ""}`
                        }
                        onClick={handleLinkClick}
                      >
                        {sub.title}
                      </NavLink>
                    ))
                  ) : (
                    // Show fallback message if there are no items
                    <div className="px-4 py-2 text-gray-600">No services available</div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Links */}
      <div className="md:hidden space-y-2">
        {links.map((link, index) => (
          <div key={index} className="relative">
            {link.submenu || index === servicesIndex ? (
              <div>
                <button
                  onClick={() => {
                    if (index === servicesIndex) {
                      toggleDropdown();
                    } else {
                      setDropdownOpen(dropdownOpen === index ? null : index);
                    }
                  }}
                  className=" font-bold px-4 py-2 text-xl text-gray-700 w-full text-left flex items-center"
                >
                  {link.title}
                  <FaCaretDown className="ml-2" />
                  {/* Show loading indicator next to Services if loading */}
                  {index === servicesIndex && servicesLoading && (
                    <span className="ml-1 inline-block h-3 w-3 rounded-full border-2 border-t-transparent border-green-600 animate-spin"></span>
                  )}
                </button>
                {((index === servicesIndex && isDropdownOpen) || 
                  (index !== servicesIndex && dropdownOpen === index)) && (
                  <>
                    <div className="mt-1 space-y-1 bg-white shadow-md rounded-md relative z-20 max-h-[200px] overflow-y-scroll custom-scrollbar">
                      {/* Show loading indicator if services are still loading */}
                      {index === servicesIndex && servicesLoading ? (
                        <div className="flex justify-center items-center py-4">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-600 border-t-transparent"></div>
                          <span className="ml-2 text-gray-600 text-sm">Loading...</span>
                        </div>
                      ) : (
                        // Show submenu items
                        link.submenu && link.submenu.map((sub, subIndex) => (
                          <NavLink
                            key={subIndex}
                            to={sub.url}
                            className={({ isActive }) => 
                              `block px-4 py-2 text-gray-700 hover:bg-gray-100 ${isActive ? "font-medium text-green-600" : ""}`
                            }
                            onClick={handleLinkClick}
                          >
                            {sub.title}
                          </NavLink>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <NavLink
                to={link.url}
                className={({ isActive }) =>
                  `block font-bold px-4 py-2 text-xl ${
                    isActive && link.url !== "#"
                      ? "bg-green-600 text-white rounded-lg w-full"
                      : "text-gray-700"
                  } flex items-center`
                }
                onClick={handleLinkClick}
                end={link.url === "/"}
              >
                {link.title}
              </NavLink>
            )}
          </div>
        ))}
      </div>
    </>
  );
}