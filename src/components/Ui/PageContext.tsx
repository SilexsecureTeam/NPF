import React, { createContext, useState, useEffect, useContext } from 'react';

interface PageVisibilityContextType {
  pageVisibility: Record<string, boolean>;
  togglePageVisibility: (pagePath: string) => void;
  isPageVisible: (pagePath: string) => boolean;
  disableAllPages: () => void;
  enableAllPages: () => void;
  isSiteEnabled: boolean;
}

const PageVisibilityContext = createContext<PageVisibilityContextType>({
  pageVisibility: {},
  togglePageVisibility: () => {},
  isPageVisible: () => true,
  disableAllPages: () => {},
  enableAllPages: () => {},
  isSiteEnabled: true
});

export const usePageVisibility = () => useContext(PageVisibilityContext);

export const PageVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always initialize with values from localStorage
  const [pageVisibility, setPageVisibility] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('pageVisibility');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Failed to load page visibility:', e);
      return {};
    }
  });
  
  const [isSiteEnabled, setIsSiteEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('siteEnabled');
      return saved !== null ? saved === 'true' : true;
    } catch (e) {
      console.error('Failed to load site enabled status:', e);
      return true;
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('pageVisibility', JSON.stringify(pageVisibility));
    console.log('Saved page visibility:', pageVisibility);
  }, [pageVisibility]);

  useEffect(() => {
    localStorage.setItem('siteEnabled', String(isSiteEnabled));
    console.log('Saved site enabled:', isSiteEnabled);
  }, [isSiteEnabled]);

  // Toggle a specific page's visibility - directly set true or false
  const togglePageVisibility = (pagePath: string) => {
    setPageVisibility(prev => {
      // Always explicitly set to true or false (not undefined)
      const newValue = prev[pagePath] === false ? true : false;
      console.log(`Toggling ${pagePath} to ${newValue}`);
      return { ...prev, [pagePath]: newValue };
    });
  };

  // Check if a page is visible - explicit boolean check
  const isPageVisible = (pagePath: string): boolean => {
    // If site is globally disabled, no pages are visible
    if (!isSiteEnabled) {
      return false;
    }
    
    // Check the specific page visibility
    const visible = pageVisibility[pagePath] !== false;
    console.log(`Checking visibility for ${pagePath}: ${visible}`);
    return visible;
  };
  
  const disableAllPages = () => {
    console.log('Disabling all pages');
    setIsSiteEnabled(false);
  };
  
  const enableAllPages = () => {
    console.log('Enabling all pages');
    setIsSiteEnabled(true);
  };

  return (
    <PageVisibilityContext.Provider value={{
      pageVisibility,
      togglePageVisibility,
      isPageVisible,
      disableAllPages,
      enableAllPages,
      isSiteEnabled
    }}>
      {children}
    </PageVisibilityContext.Provider>
  );
};