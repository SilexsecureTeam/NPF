import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaTrashAlt, FaSearch } from "react-icons/fa";
import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import useAdminAuth from "@/hooks/useAdminAuth";

interface Admin {
  id: number;
  name: string;
  email: string;
  use_type: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

const AdminManagement: React.FC = () => {
  const { getAllAdmins, deleteAdmin, loading: authLoading } = useAdminAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Function to fetch admins - defined outside useEffect so it can be reused
  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAdmins();
      if (response && response.data) {
        setAdmins(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch admins:", error);
      toast.error("Failed to load administrators");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDeleteClick = (adminId: number) => {
    setDeleteConfirmation(adminId);
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const confirmDelete = (adminId: number) => {
    // Find the admin to show better feedback
    const adminToDelete = admins.find(admin => admin.id === adminId);
    
    // Close the modal
    setDeleteConfirmation(null);
    
    // Execute delete with toast.promise using your existing deleteAdmin function
    toast.promise(
      deleteAdmin(adminId), {
        pending: `Deleting administrator ${adminToDelete?.name || ''}...`,
        success: {
          render({ data }) {
            // Refresh the admin list after successful deletion
            fetchAdmins();
            return <div>{data as string}</div>;
          }
        },
        error: {
          render({ data }) {
            return <div>{data as string}</div>;
          }
        }
      }
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter admins based on search term
  const filteredAdmins = admins.filter(admin => {
    const searchLower = searchTerm.toLowerCase();
    return (
      admin.name.toLowerCase().includes(searchLower) ||
      admin.email.toLowerCase().includes(searchLower) ||
      (admin.use_type && admin.use_type.toLowerCase().includes(searchLower))
    );
  });

  if (isLoading || authLoading) {
    return (
      <AdminDashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-600 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Administrator Management</h2>
          </div>
          
          {/* Search bar */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or type..."
                className="pl-10 pr-4 py-2 border rounded-md w-full md:w-1/2 lg:w-1/3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {filteredAdmins.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {searchTerm ? "No administrators match your search" : "No administrators found"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created On
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{admin.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {admin.use_type ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {admin.use_type}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Standard
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(admin.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteClick(admin.id)}
                          className="text-red-600 hover:text-red-900 focus:outline-none"
                          disabled={admin.use_type === "superadmin"}
                          title={admin.use_type === "superadmin" ? "Cannot delete superadmin" : "Delete admin"}
                          style={admin.use_type === "superadmin" ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                          <FaTrashAlt className="inline mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this administrator? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(deleteConfirmation)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
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
};

export default AdminManagement;