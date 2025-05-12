import React from 'react';
import { usePageVisibility } from './PageContext';

interface ProtectedRouteProps {
  path: string;
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ path, element }) => {
  const { isPageVisible } = usePageVisibility();
  
  // Force a direct check, bypassing any caching
  const isVisible = isPageVisible(path);
  
  console.log(`ProtectedRoute for ${path}: visible=${isVisible}`);
  
  // You have two options:
  
  // OPTION 1: Turn off emergency override (normal behavior)
  // This will check visibility and redirect to maintenance page if needed
  const emergencyOverride = false; // Set to false for normal behavior
  
  // OPTION 2: Keep emergency override on (all pages visible)
  // const emergencyOverride = true; // Set to true to make all pages visible
  
  if (emergencyOverride) {
    console.log(`Emergency override active: showing ${path} regardless of visibility`);
    return <>{element}</>;
  }
  
  // Normal visibility check logic
  if (!isVisible) {
    console.log(`Page ${path} is not visible, redirecting to maintenance page`);
    // Use setTimeout to avoid immediate redirects that can cause loops
    setTimeout(() => {
      window.location.href = '/site-maintenance';
    }, 100);
    
    return null;
  }
  
  console.log(`Page ${path} is visible, showing content`);
  return <>{element}</>;
};

export default ProtectedRoute;