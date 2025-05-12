import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import useInsurance from "@/hooks/UseInsurance";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Define the page type to match API response
interface Page {
  id: number;
  title: string;
  description: string;
  features: string;
  image: string;
  created_at: string;
  updated_at: string;
}

// Define valid sort fields
type SortField = "title" | "created_at" | "updated_at";
type SortDirection = "asc" | "desc";

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<number | null>(null);
  
  const {getAllservicesPage, deleteServicePage} = useInsurance();

  // Fetch pages from API
  useEffect(() => {
    const fetchPages = async () => {
      try {
        setIsLoading(true);
        const response = await getAllservicesPage();
        console.log(response);
        
        if (Array.isArray(response)) {
          setPages(response);
        } else if (response && typeof response === 'object') {
          // If response is an object with numeric keys, convert to array
          const pagesArray = Object.keys(response)
            .filter(key => !isNaN(Number(key)))
            .map(key => response[key]);
          setPages(pagesArray);
        }
        setError(null);
      } catch (error) {
        console.error("Error fetching pages:", error);
        setError("Failed to load pages. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPages();
  }, []);

  // Show delete confirmation modal
  const showDeleteConfirmation = (id: number) => {
    setPageToDelete(id);
    setShowDeleteModal(true);
  };

  // Handle Delete page with proper state update
  const deletePage = async () => {
    if (pageToDelete === null) return;
    
    try {
      setIsLoading(true);
      const response = await deleteServicePage(pageToDelete);
      console.log("Delete response:", response);
      
      toast.success("Page deleted successfully!");
      
      // Update local state after successful deletion
      setPages(currentPages => currentPages.filter(page => page.id !== pageToDelete));
    } catch (error) {
      console.error("Error deleting page:", error);
      toast.error("Failed to delete the page. Please try again.");
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setPageToDelete(null);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPageToDelete(null);
  };
     
  // Filter and sort pages based on search term and sort settings
  const filteredAndSortedPages = useMemo(() => {
    let filtered = [...pages];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(page => {
        // Strip HTML tags for better search results
        const titleText = page.title.replace(/<[^>]*>/g, '');
        const descriptionText = page.description.replace(/<[^>]*>/g, '');
        
        return titleText.toLowerCase().includes(searchTerm.toLowerCase()) ||
               descriptionText.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    // Sort pages
    return filtered.sort((a, b) => {
      let fieldA, fieldB;
      
      if (sortField === "title") {
        // Remove HTML tags for comparison
        fieldA = a.title.replace(/<[^>]*>/g, '').toLowerCase();
        fieldB = b.title.replace(/<[^>]*>/g, '').toLowerCase();
      } else {
        fieldA = a[sortField].toLowerCase();
        fieldB = b[sortField].toLowerCase();
      }
      
      if (sortDirection === "asc") {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });
  }, [pages, searchTerm, sortField, sortDirection]);
  
  // Handle sort click
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <AdminDashboardLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Services Management</h1>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            <Link to="/admin/dashboard/add-page" className="flex items-center gap-2">
              <span>
                Add new Service Page
              </span>
            </Link>
          </button>
        </div>
        
        {/* Search and Filter Section */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search services by title or description..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading services...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
            <button 
              className="mt-2 text-green-600 hover:underline"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        )}
        
        {/* Table - only show when not loading and no errors */}
        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center">
                      Title
                      {sortField === "title" && (
                        sortDirection === "asc" ? 
                          <ChevronUp size={16} className="ml-1" /> : 
                          <ChevronDown size={16} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="flex items-center">
                      Created Date
                      {sortField === "created_at" && (
                        sortDirection === "asc" ? 
                          <ChevronUp size={16} className="ml-1" /> : 
                          <ChevronDown size={16} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedPages.map((page: Page) => (
                  <tr 
                    key={page.id} 
                    className="bg-white border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div dangerouslySetInnerHTML={{ __html: page.title }} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      <div dangerouslySetInnerHTML={{ 
                        __html: page.description.length > 100 
                          ? page.description.substring(0, 100) + '...' 
                          : page.description 
                      }} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(page.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="View Page">
                          <Link to={`/services/view/${page.id}`}>
                            View
                          </Link>
                        </button>
                        <button className="text-green-600 hover:text-green-900" title="Edit Page">
                          <Link to={`/admin/dashboard/edit-page/${page.id}`}>Edit</Link>
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900" 
                          title="Delete Page" 
                          onClick={() => showDeleteConfirmation(page.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* No results message */}
        {!isLoading && !error && filteredAndSortedPages.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No services found matching your search criteria
          </div>
        )}
        
        {/* Pagination - Can be implemented if needed */}
        {!isLoading && !error && filteredAndSortedPages.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {filteredAndSortedPages.length} services
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center text-red-600 mb-4">
                <AlertTriangle className="mr-2" />
                <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              </div>
              <p className="mb-6 text-gray-600">
                Are you sure you want to delete this page? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={deletePage}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}