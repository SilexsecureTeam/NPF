import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import useInsurance from "@/hooks/UseInsurance";

// Define the BoardMember type
interface BoardMember {
  id: number;
  name: string;
  title: string;
  description?: string;
  image: string;
}

// Form validation schema
const schema = yup.object({
  name: yup.string().required("Name is required"),
  title: yup.string().required("Title is required"),
  description: yup.string().optional(),
  image: yup.mixed<FileList>()
    .test("required", "Image is required", function(value) {
      if (this.parent.id) return true; // Not required for edit if not changed
      return value && value.length > 0;
    })
    .test("fileType", "Only image files are allowed", function(value) {
      if (!value || !value.length) return true;
      return ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(value[0]?.type);
    })
});

type FormValues = {
  id?: number;
  name: string;
  title: string;
  description: string;
  image: FileList | null;
};

export default function AdminBoard() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Use the insurance hook for API calls
  const { loading, createBoard, updateBoard, getBoard, deleteBoardById } = useInsurance();
  
  // Form setup
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: "",
      title: "",
      description: "",
      image: null
    }
  });

  // File input registration
  const { ref: imageRef, ...imageFieldProps } = register("image");
  
  // Fetch board members
  const fetchBoardMembers = async () => {
    try {
      const data = await getBoard();
      if (data) {
        setBoardMembers(data);
      }
    } catch (error) {
      console.error("Error fetching board members:", error);
      toast.error("Failed to load board members");
    }
  };

  useEffect(() => {
    fetchBoardMembers();
  }, []);

  // Handle file change for image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Reset form and close modal
  const closeModal = () => {
    reset();
    setImagePreview(null);
    setCurrentMemberId(null);
    setModalOpen(false);
  };

  // Open modal for adding new board member
  const openAddModal = () => {
    reset();
    setImagePreview(null);
    setCurrentMemberId(null);
    setModalOpen(true);
  };

  // Open modal for editing existing board member
  const openEditModal = async (member: BoardMember) => {
    setValue("id", member.id);
    setValue("name", member.name);
    setValue("title", member.title);
    setValue("description", member.description || "");
    
    // Set image preview if available
    if (member.image) {
      // Assuming the image URL structure
      setImagePreview(`https://dash.npfinsurance.com/uploads/${member.image}`);
    } else {
      setImagePreview(null);
    }
    
    setCurrentMemberId(member.id);
    setModalOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (id: number) => {
    setCurrentMemberId(id);
    setDeleteDialogOpen(true);
  };

  // Handle board member deletion
  const handleDelete = async () => {
    if (!currentMemberId) return;
    
    try {
      await deleteBoardById(currentMemberId);
      toast.success("Board member deleted successfully");
      fetchBoardMembers();
    } catch (error) {
      console.error("Error deleting board member:", error);
      toast.error("Failed to delete board member");
    } finally {
      setDeleteDialogOpen(false);
      setCurrentMemberId(null);
    }
  };

  // Submit form for create or update
  const onSubmit = async (data: FormValues) => {
    try {
      // Create BoardData object
      const boardData: any = {
        name: data.name,
        title: data.title,
        description: data.description,
      };
      
      // Add ID for updates
      if (currentMemberId) {
        boardData.id = currentMemberId;
      }
      
      // Add image if it exists
      if (data.image && data.image.length > 0) {
        boardData.image = data.image[0];
      }
      
      if (currentMemberId) {
        // Update existing member
        await updateBoard(boardData);
        toast.success("Board member updated successfully");
      } else {
        // Create new member
        await createBoard(boardData);
        toast.success("Board member created successfully");
      }
      
      closeModal();
      fetchBoardMembers();
    } catch (error) {
      console.error("Error saving board member:", error);
      toast.error("Failed to save board member");
    }
  };

  // Function to trigger the file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to remove selected image
  const removeImage = () => {
    setImagePreview(null);
    setValue("image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Truncate text for display in table
  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <AdminDashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Board Members</h1>
          <button
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Member
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : boardMembers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No board members found. Add your first board member!</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {boardMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {member.image ? (
                          <img
                            src={`https://dash.npfinsurance.com/uploads/${member.image}`}
                            alt={member.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            N/A
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{member.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{truncateText(member.description || '')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(member)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(member.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Board Member Modal */}
        <Transition appear show={modalOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => !loading && closeModal()}>
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span className="inline-block h-screen align-middle" aria-hidden="true">
                &#8203;
              </span>
              
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {currentMemberId ? "Edit Board Member" : "Add New Board Member"}
                  </Dialog.Title>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                    <div className="space-y-6">
                      {/* Title */}
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          id="title"
                          type="text"
                          {...register("title")}
                          className={`mt-1 block w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.title && (
                          <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
                        )}
                      </div>

                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          {...register("name")}
                          className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="description"
                          rows={4}
                          {...register("description")}
                          className={`mt-1 block w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.description && (
                          <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
                        )}
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                          Image {currentMemberId && <span className="text-sm text-gray-500">(Upload new to replace current)</span>}
                        </label>
                        
                        {/* Hidden actual file input */}
                        <input
                          id="image"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/webp"
                          ref={(e) => {
                            imageRef(e);
                            fileInputRef.current = e;
                          }}
                          {...imageFieldProps}
                          onChange={(e) => {
                            imageFieldProps.onChange(e);
                            handleFileChange(e);
                          }}
                          className="hidden"
                        />

                        {/* Image Preview or Upload Area */}
                        <div className={`${errors.image ? "border-red-500" : ""}`}>
                          {imagePreview ? (
                            <div className="mt-2 relative border border-gray-300 rounded-md p-1">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-w-full h-auto max-h-64 rounded mx-auto"
                              />
                              {/* Controls */}
                              <div className="absolute top-2 right-2 flex space-x-2">
                                {/* Change image button */}
                                <button
                                  type="button"
                                  onClick={triggerFileInput}
                                  className="bg-white text-gray-700 p-2 rounded-full shadow hover:bg-gray-100"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>

                                {/* Remove image button */}
                                <button
                                  type="button"
                                  onClick={removeImage}
                                  className="bg-white text-red-500 p-2 rounded-full shadow hover:bg-red-50"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={triggerFileInput}
                              className={`border-2 border-dashed ${errors.image ? "border-red-500" : "border-gray-300"} rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="mt-2 text-sm text-gray-600">Click to upload an image</p>
                              <p className="text-xs text-gray-500 mt-1">
                                JPG, PNG, WEBP up to 10MB
                              </p>
                            </div>
                          )}
                        </div>
                        {errors.image && (
                          <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                      >
                        {loading && (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        {currentMemberId ? "Update Member" : "Add Member"}
                      </button>
                    </div>
                  </form>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

        {/* Delete Confirmation Dialog */}
        <Transition appear show={deleteDialogOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => !loading && setDeleteDialogOpen(false)}>
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black opacity-30" />
              </Transition.Child>

              {/* Center modal content */}
              <span className="inline-block h-screen align-middle" aria-hidden="true">
                &#8203;
              </span>
              
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Confirm Deletion
                  </Dialog.Title>
                  
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this board member? This action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setDeleteDialogOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleDelete}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                    >
                      {loading && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </AdminDashboardLayout>
  );
}