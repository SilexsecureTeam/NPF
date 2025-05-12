import { useState, useEffect, useContext, useRef } from 'react';
import { MdMenu, MdClose } from 'react-icons/md';
import NavLinks from './Tools/NavLink';
import { Link, useLocation } from 'react-router-dom';
import { NavigationContext } from '@/components/Ui/NavigationContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const { isServicesDropdownOpen, toggleServicesDropdown, closeServicesDropdown } = useContext(NavigationContext);
  
  // Track the previous location to help with dropdown management
  const prevLocationRef = useRef(location.pathname);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  // Close sidebar when navigation occurs
  const handleNavLinkClick = () => {
    setIsOpen(false);
    // Also close dropdown when a link is clicked
    closeServicesDropdown();
  };

  // Close sidebar and dropdown when location changes
  useEffect(() => {
    // Only trigger actions if the path actually changed
    if (prevLocationRef.current !== location.pathname) {
      setIsOpen(false);
      closeServicesDropdown();
      prevLocationRef.current = location.pathname;
    }
  }, [location.pathname, closeServicesDropdown]);

  // Add click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Only process if dropdown is open and click is outside nav
      if (isServicesDropdownOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
        // Check if the click is on the "View All Services" button
        const target = event.target as HTMLElement;
        const isViewServicesButton = 
          target.textContent?.includes('View All Services') || 
          target.parentElement?.textContent?.includes('View All Services');
        
        // Don't close if it's the "View All Services" button
        if (!isViewServicesButton) {
          closeServicesDropdown();
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isServicesDropdownOpen, closeServicesDropdown]);

  // Check if user is logged in
  useEffect(() => {
    const checkLoggedIn = () => {
      const token = sessionStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };

    checkLoggedIn();
    window.addEventListener('storage', checkLoggedIn);
    return () => {
      window.removeEventListener('storage', checkLoggedIn);
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white text-black-500 px-6 lg:px-16 md:py-3 lg:py-0 flex justify-between gap-2 items-center z-10">
        {/* Logo */}
        <div className="md:max-w-[20%] lg:max-w-none">
          <Link to="/">
            <img src={'/assets/logo/logo.svg'} alt="logo" className='md:max-w-[100%] lg:max-w-none' />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div ref={navRef} className="hidden md:flex justify-center flex-1 px-3 lg:px-1">
          <NavLinks 
            onLinkClick={handleNavLinkClick} 
            isServicesDropdownOpen={isServicesDropdownOpen}
            toggleServicesDropdown={toggleServicesDropdown}
          />
        </div>
        
        {/* Desktop Action Buttons */}
        <div className="hidden md:flex md:flex-col lg:flex-row gap-1">
          {/* Existing buttons */}
          <Link to={'/make-a-claim'}>
            <button className="bg-green-900 text-white px-2 py-1 xl:px-4 xl:py-2 rounded-lg md:rounded-full text-sm xl:text-base w-fit">
              Make a claim
            </button>
          </Link>

          <a href="/motor-insurance-quote-form">
            <button className="bg-green-900 text-white px-2 py-1 xl:px-4 xl:py-2 rounded-lg md:rounded-full text-sm xl:text-base w-fit">
              Get a Quote
            </button>
          </a>

          {isLoggedIn ? (
            <Link to={'/dashboard/home'}>
              <button className="bg-inherit text-green-900 border border-[#000000] px-2 py-1 xl:px-4 xl:py-2 rounded-lg md:rounded-full text-sm xl:text-base w-fit">
                Dashboard
              </button>
            </Link>
          ) : (
            <Link to={'/auth/signup'}>
              <button className="bg-inherit text-green-900 border border-[#000000] px-2 py-1 xl:px-4 xl:py-2 rounded-lg md:rounded-full text-sm xl:text-base w-fit">
                Login/Register
              </button>
            </Link>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button className="md:hidden" onClick={toggleSidebar}>
          {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      </header>
      
      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 w-64 h-full bg-white text-black-500 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden z-20`}>
        <div className="p-4">
          <div className="text-2xl font-bold mb-4">
            <img src="/assets/logo/NPF logo 5.svg" alt="" />
            <button 
              onClick={toggleSidebar} 
              className="absolute top-4 right-4"
            >
              <MdClose size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-2">
            <NavLinks 
              onLinkClick={handleNavLinkClick}
              isServicesDropdownOpen={isServicesDropdownOpen}
              toggleServicesDropdown={toggleServicesDropdown}
            />
          </nav>
        </div>
        <div className="absolute bottom-2 left-0 w-full px-4">
          <a href='/motor-insurance-quote-form' >
            <button className="bg-green-900 text-white w-full px-2 py-2 rounded mb-3">
              Get a Quote
            </button>
          </a>

          {isLoggedIn ? (
            <Link to={'/dashboard/home'} onClick={handleNavLinkClick}>
              <button className="bg-green-900 text-white w-full px-2 py-2 rounded">
                Dashboard
              </button>
            </Link>
          ) : (
            <Link to={'/auth/signup'} onClick={handleNavLinkClick}>
              <button className="bg-green-900 text-white w-full px-2 py-2 rounded">
                Login/Register
              </button>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}