import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaTrashAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import AdminDashboardLayout from '@/components/Layout/AdminLayout/AdminLayout';
import useInsurance from '@/hooks/UseInsurance';
import { CarouselDataValues } from '@/types';

interface CarouselItem {
  id: number;
  image: string;
  title: string;
  description: string;
  status: boolean;
  created_at: string;
}

// Define image size constraints
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB maximum

const AdminSlider: React.FC = () => {
  const { createCarousel, getCarousel, deleteCarousel } = useInsurance();
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CarouselDataValues>({
    image: null as unknown as File,
    title: '',
    description: '',
    status: true
  });

  // Fetch carousel items
  const fetchCarouselItems = async () => {
    try {
      setLoading(true);
      const response = await getCarousel();
      if (response && response.data) {
        setCarouselItems(response.data);
      }
    } catch (error) {
      console.error('Error fetching carousel items:', error);
      toast.error('Failed to load carousel items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarouselItems();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Image size exceeds 2MB. Please choose a smaller file.`);
        e.target.value = '';
        return;
      }
      
      setFormData({
        ...formData,
        image: file
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      toast.error('Please select an image');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create a modified version with status as 1 or 0
      const modifiedData = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        status: formData.status ? 1 : 0  // Convert boolean to 1 or 0
      };
      
      console.log("Submitting with status:", modifiedData.status);
      
      // Submit form data using the createCarousel function
      await toast.promise(
        createCarousel(modifiedData as any),
        {
          pending: 'Creating carousel item...',
          success: {
            render() {
              fetchCarouselItems(); // Refresh the list
              // Reset form
              setFormData({
                image: null as unknown as File,
                title: '',
                description: '',
                status: true
              });
              setPreviewImage(null);
              return 'Carousel item created successfully!';
            }
          },
          error: {
            render({ data }) {
              console.error("API Error:", data);
              return typeof data === 'string' ? data : 'Failed to create carousel item';
            }
          }
        }
      );
    } catch (error) {
      console.error('Error creating carousel item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (id: number) => {
    setDeleteConfirmation(id);
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const confirmDelete = (id: number) => {
    setDeleteConfirmation(null);
    
    toast.promise(
      deleteCarousel(id),
      {
        pending: 'Deleting carousel item...',
        success: {
          render() {
            fetchCarouselItems(); // Refresh the list after deletion
            return 'Carousel item deleted successfully!';
          }
        },
        error: {
          render({ data }) {
            return typeof data === 'string' ? data : 'Failed to delete carousel item';
          }
        }
      }
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminDashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Add Carousel Item Form */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-green-600 p-4">
            <h2 className="text-xl font-bold text-white">Add New Carousel Item</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter carousel title"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter carousel description"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="status"
                        checked={formData.status}
                        onChange={handleInputChange as any}
                        className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Image</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      accept="image/jpeg,image/png,image/webp"
                      required
                    />
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Required image specs:</span>
                      </p>
                      <ul className="list-disc ml-5 text-sm text-gray-500">
                        <li>Size: Maximum 2MB</li>
                        <li>Format: JPG, PNG, or WebP</li>
                      </ul>
                    </div>
                  </div>
                  {previewImage && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                      <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 text-right">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Carousel Item'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Carousel Items List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-600 p-4">
            <h2 className="text-xl font-bold text-white">Carousel Items</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : carouselItems.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No carousel items found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                  {carouselItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-16 w-28 relative">
                          <img 
                            src={`https://dash.npfinsurance.com/uploads/${item.image}`} 
                            alt={item.title}
                            className="h-full w-full object-cover rounded-md"
                            onError={(e) => {
                              // Handle image loading error
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/280x160?text=Image+Not+Found';
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.status ? (
                          <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <FaEye className="mr-1" /> Active
                          </span>
                        ) : (
                          <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            <FaEyeSlash className="mr-1" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(item.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          className="text-red-600 hover:text-red-900 focus:outline-none"
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
                Are you sure you want to delete this carousel item? This action cannot be undone.
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

export default AdminSlider;