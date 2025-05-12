import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import { useState, useRef, useEffect } from "react";
import useInsurance from "@/hooks/UseInsurance";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { ContactPageData } from "@/types";

// Define validation schema with proper types
const schema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  detail: yup.string().required("Detail is required"),
  address: yup.string().required("Address is required"),
  image: yup.mixed<FileList>()
    .test("required", "Image is required", function(value) {
      // Only require image for new creation, not for edit
      if (this.parent.isEditMode && this.parent.imagePreviewExists) return true;
      return !!this.parent.imagePreviewExists || (value && value.length > 0);
    })
    .test("fileType", "Only image files are allowed", function(value) {
      if (!value || !value.length) return true;
      return ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(value[0]?.type);
    })
});

// Make sure form values match the schema
type FormValues = {
  title: string;
  description: string;
  detail: string;
  address: string;
  image: FileList;
  imagePreviewExists?: boolean;
  isEditMode?: boolean;
};

export default function AdminContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [existingData, setExistingData] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const { createContactPage, getContactPage, updateContactPage } = useInsurance(); 

  // Fix the resolver typing
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormValues>({
    resolver: yupResolver(schema) as any, 
    defaultValues: {
      title: "",
      description: "",
      detail: "",
      address: "",
      isEditMode: false
    }
  });

  // Fixed file input registration
  const { ref: imageRef, ...imageFieldProps } = register("image");

  useEffect(() => {
    const fetchContactPage = async () => {
      try {
        const response = await getContactPage();
        console.log("Contact page data:", response);
        
        // Access the nested data object properly
        if (response && response.data) {
          const data = response.data;
          
          // If data exists, set edit mode
          setExistingData(data);
          setIsEditMode(true);
          setValue("isEditMode", true);
          
          // Pre-fill form with existing data
          setValue("title", data.title || "");
          setValue("description", data.description || "");
          setValue("detail", data.detail || "");
          setValue("address", data.address || "");
          
          // If image exists, set image preview
          if (data.image) {
            // Construct the image URL
            const imageUrl = `https://dash.npfinsurance.com/uploads/${data.image}`;
            setImagePreview(imageUrl);
            setValue("imagePreviewExists", true);
          }
        }
      } catch (error) {
        console.error("Error fetching contact page:", error);
      }
    };
    
    fetchContactPage();
  }, []);

  // Function to handle file change directly
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setValue("imagePreviewExists", true);
    }
  };

  // Function to trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to remove selected image
  const removeImage = () => {
    setImagePreview(null);
    setValue("imagePreviewExists", false);
    setValue("image", undefined as any);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Improved form submission with proper error handling
  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      
      if (!isEditMode && (!data.image || data.image.length === 0)) {
        toast.error("Please select an image");
        return;
      }
      
      if (isEditMode) {
        // Update existing contact page
        const updateData: any = {
          id: existingData.id, // Include ID for update
          title: data.title,
          description: data.description,
          detail: data.detail,
          address: data.address,
        };
        
        // Only include image if a new one was selected
        if (data.image && data.image.length > 0) {
          updateData.image = data.image[0];
        }
        
        await updateContactPage(updateData);
        toast.success("Contact page updated successfully");
      } else {
        // Create new contact page
        const contactPageData: ContactPageData = {
          title: data.title,
          description: data.description,
          detail: data.detail,
          address: data.address,
          image: data.image[0]
        };
        
        await createContactPage(contactPageData);
        toast.success("Contact page created successfully");
        
        // Reset form after successful creation
        reset();
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      // Error handling
      console.error(`Error ${isEditMode ? "updating" : "creating"} contact page:`, error);
      toast.error(error instanceof Error ? error.message : `Failed to ${isEditMode ? "update" : "create"} contact page`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          {isEditMode ? "Edit Contact Page" : "Create Contact Page"}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              {...register("title")}
              className={`w-full px-4 py-2 border ${errors.title ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={3}
              className={`w-full px-4 py-2 border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Detail */}
          <div className="mb-4">
            <label htmlFor="detail" className="block text-sm font-medium text-gray-700 mb-1">
              Detail
            </label>
            <textarea
              id="detail"
              {...register("detail")}
              rows={5}
              className={`w-full px-4 py-2 border ${errors.detail ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.detail && (
              <p className="mt-1 text-sm text-red-500">{errors.detail.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              id="address"
              {...register("address")}
              rows={3}
              className={`w-full px-4 py-2 border ${errors.address ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          {/* Enhanced Image Upload - Fixed */}
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Image {isEditMode && <span className="text-sm text-gray-500">(Upload new to replace current)</span>}
            </label>

            {/* Hidden actual file input - Fixed registration */}
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>

                    {/* Remove image button */}
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-white text-red-500 p-2 rounded-full shadow hover:bg-red-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
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
              <p className="mt-1 text-sm text-red-500">{errors.image.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 ${isEditMode ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"} text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isEditMode ? "focus:ring-blue-500" : "focus:ring-green-500"}`}
            >
              {isLoading ? "Processing..." : isEditMode ? "Update Contact Page" : "Create Contact Page"}
            </button>
          </div>
        </form>
      </div>
    </AdminDashboardLayout>
  );
}