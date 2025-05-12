import React, { createContext, useState, useEffect } from 'react';
import useInsurance from '@/hooks/UseInsurance';

// Helper function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

interface NavigationContextType {
  isServicesDropdownOpen: boolean;
  toggleServicesDropdown: (forcedState?: boolean) => void;
  closeServicesDropdown: () => void;
  serviceItems: Array<{title: string, url: string}>;
  isServicesLoaded: boolean;
}

export const NavigationContext = createContext<NavigationContextType>({
  isServicesDropdownOpen: false,
  toggleServicesDropdown: () => {},
  closeServicesDropdown: () => {},
  serviceItems: [],
  isServicesLoaded: false,
});

export const NavigationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [serviceItems, setServiceItems] = useState<Array<{title: string, url: string}>>([]);
  const [isServicesLoaded, setIsServicesLoaded] = useState(false);
  
  const { getAllservicesPage } = useInsurance();
  
  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
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
        
        // Update the services items
        setServiceItems(serviceSubmenu);
        setIsServicesLoaded(true);
      } catch (error) {
        console.error("Error fetching services for navigation:", error);
        setIsServicesLoaded(true); // Still mark as loaded to prevent infinite loading state
      }
    };
    
    fetchServices();
  }, []);
  
  const toggleServicesDropdown = (forcedState?: boolean) => {
    if (typeof forcedState === 'boolean') {
      setIsServicesDropdownOpen(forcedState);
    } else {
      setIsServicesDropdownOpen(prev => !prev);
    }
  };
  
  const closeServicesDropdown = () => {
    setIsServicesDropdownOpen(false);
  };
  
  return (
    <NavigationContext.Provider 
      value={{ 
        isServicesDropdownOpen, 
        toggleServicesDropdown,
        closeServicesDropdown,
        serviceItems, 
        isServicesLoaded
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};