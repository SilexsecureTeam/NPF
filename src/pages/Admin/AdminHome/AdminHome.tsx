import { useState } from "react";
import { usePageVisibility } from "@/components/Ui/PageContext";
import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import {  FaToggleOn, FaToggleOff } from "react-icons/fa";

export default function AdminHome() {
  const { pageVisibility, togglePageVisibility } = usePageVisibility();
  const [filter, setFilter] = useState("all"); // all, enabled, disabled
  
  // List of pages to manage visibility
  const managedPages = [
    { path: "/", name: "Home Page", description: "Main landing page" },
    { path: "/about", name: "About", description: "Company information" },
    { path: "/about/superboard", name: "Superboard", description: "Board member profiles" },
    { path: "/contact", name: "Contact", description: "Contact information page" },
    { path: "/blog", name: "Blog", description: "Company blog" },
    { path: "/blog/:id", name: "Blog Detail", description: "Individual blog posts" },
    { path: "/privacy-policy", name: "Privacy Policy", description: "Legal information" },
    { path: "/claims", name: "Claims Page", description: "Claims information" },
    { path: "/make-a-claim", name: "Make a Claim", description: "Claim submission form" },
    { path: "/motor-insurance-quote", name: "Insurance Quote Landing", description: "Insurance quote landing" },
    { path: "/motor-insurance-quote-form", name: "Insurance Quote Form", description: "Quote request form" },
    { path: "/services/view/:serviceId", name: "Service Detail", description: "Individual service details" },
  ];

  // Filter pages based on selected filter
  const filteredPages = managedPages.filter(page => {
    if (filter === "all") return true;
    if (filter === "enabled") return pageVisibility[page.path] !== false;
    if (filter === "disabled") return pageVisibility[page.path] === false;
    return true;
  });

  return (
    <AdminDashboardLayout>
      <div className="py-8 px-4 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Page Visibility Management</h1>
        </div>
        
     
        
        {/* Filters */}
        <div className="flex items-center mb-6 gap-2">
          <span className="text-gray-700 mr-2">Filter:</span>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            All Pages
          </button>
          <button
            onClick={() => setFilter("enabled")}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === "enabled" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Visible Pages
          </button>
          <button
            onClick={() => setFilter("disabled")}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === "disabled" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Hidden Pages
          </button>
        </div>
        
        {/* Page Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPages.map(page => (
            <div 
              key={page.path} 
              className={`border rounded-lg shadow-sm overflow-hidden ${
                pageVisibility[page.path] === false ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{page.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">{page.description}</p>
                    <p className="text-xs text-gray-400 font-mono">{page.path}</p>
                  </div>
                  <div className="ml-4">
                    <button 
                      onClick={() => togglePageVisibility(page.path)} 
                      className="text-2xl focus:outline-none"
                      aria-label={pageVisibility[page.path] === false ? "Enable page" : "Disable page"}
                    >
                      {pageVisibility[page.path] === false ? (
                        <FaToggleOff className="text-red-500 hover:text-red-600" />
                      ) : (
                        <FaToggleOn className="text-green-500 hover:text-green-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div 
                className={`py-2 px-4 text-sm ${
                  pageVisibility[page.path] === false 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {pageVisibility[page.path] === false ? "Hidden from public" : "Visible to public"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}