import { useEffect, useState, useRef } from 'react';
import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, X, Image, FileText, List, Upload, Loader } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import useInsurance from "@/hooks/UseInsurance";
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import "../../../styles/CustomQuil.css"

// Quill editor modules and formats configuration
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link'
];

// Define form values type
interface FormValues {
  title: string;
  description: string;
  image?: FileList | undefined;
  features?: string;
}

export default function AdminEditPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const { updateServicePage, getServicePageById } = useInsurance();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [existingImagePath, setExistingImagePath] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form validation schema
  const validationSchema = yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    image: yup.mixed<FileList>()
      .optional()
      .test('fileType', 'Only JPEG, PNG, JPG and WEBP are allowed', function(value) {
        if (!value) return true; // Handle undefined/empty case
        if (value instanceof FileList && value.length > 0) {
          const file = value[0];
          return ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type);
        }
        return true;
      }),
    features: yup.string().optional()
  });

  // Form state with react-hook-form
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    register,
    reset
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: '',
      description: '',
      image: undefined,
      features: '',
    }
  });
  
  // Watch form values for preview
  const watchedValues = watch();

  // Cleanup preview URL when component unmounts or when image changes
  useEffect(() => {
    return () => {
      if (previewImage && !previewImage.startsWith('/uploads/')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);
  
  // Fetch service page data when component mounts
  useEffect(() => {
    const fetchPageData = async () => {
      if (!serviceId) {
        setFetchError('Service ID is missing');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const pageData = await getServicePageById(Number(serviceId));
        
        if (pageData) {
          // Populate form fields with fetched data
          reset({
            title: pageData.title || '',
            description: pageData.description || '',
            features: pageData.features || '',
          });
          
          // Set existing image if available
          if (pageData.image) {
            setExistingImagePath(pageData.image);
            setPreviewImage(`/uploads/${pageData.image}`);
          }
        } else {
          setFetchError('Service page not found');
        }
      } catch (error) {
        console.error('Error fetching page data:', error);
        setFetchError('Failed to load page data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPageData();
  }, []);

  // Register all fields (necessary for react-hook-form)
  useEffect(() => {
    register('title');
    register('description');
    register('features');
  }, [register]);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      setValue('image', files, { shouldValidate: true });
      // Create a new URL for the selected file preview
      const url = URL.createObjectURL(files[0]);
      // Clear the existing image path since we're using a new image
      setExistingImagePath(null);
      setPreviewImage(url);
    } else {
      setValue('image', undefined, { shouldValidate: true });
      // If no new file is selected, show the existing image if available
      if (existingImagePath) {
        setPreviewImage(`/uploads/${existingImagePath}`);
      } else {
        setPreviewImage(null);
      }
    }
  };

  // Submit handler with proper error handling
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!serviceId) {
      toast.error('Service ID is missing');
      return;
    }
    
    setIsSubmitting(true);
    try {
      let imageFile: File | null = null;
      
      if (data.image && data.image.length > 0) {
        imageFile = data.image[0];
        
        // Check file type only if a new image is provided
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(imageFile.type)) {
          throw new Error('Invalid file type. Only JPEG, PNG, JPG & WEBP files are allowed.');
        }
      }

      const updateData = {
        id: Number(serviceId),
        title: data.title,
        description: data.description,
        features: data.features || '',
        image: imageFile as File & { type: "image/jpeg" | "image/png" | "image/webp" | "image/jpg" },
        existingImage: !imageFile ? existingImagePath : null,
      };
      
      // Call API to update the service page
      await toast.promise(updateServicePage( updateData), {
        pending: "Updating...",
        success: {
          render({ data }) {
            navigate("/admin/dashboard/pages");
            return <div>{data as string}</div>;
          },
        },
        error: {
          render({ data }) {
            return <div>{data as string}</div>;
          },
        },
      });
    } catch (error) {
      console.error("Error updating page:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <AdminDashboardLayout>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader size={40} className="mx-auto animate-spin text-green-600" />
              <p className="mt-2 text-gray-600">Loading page data...</p>
            </div>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }
  
  // Show error state if fetch failed
  if (fetchError) {
    return (
      <AdminDashboardLayout>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-8">
            <div className="text-red-500 text-xl mb-2">Error</div>
            <p className="text-gray-600 mb-4">{fetchError}</p>
            <button
              onClick={() => navigate("/admin/dashboard/pages")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Return to Pages
            </button>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Edit Page</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => navigate("/admin/dashboard/pages")}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition flex items-center"
              type="button"
              disabled={isSubmitting}
            >
              <X size={16} className="mr-1" /> Cancel
            </button>
            <button 
              onClick={handleSubmit(onSubmit)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center"
              type="button"
              disabled={isSubmitting}
            >
              <Save size={16} className="mr-1" /> {isSubmitting ? 'Editing...' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Page Content Sections */}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Page Content</h2>
          
          {/* Title Section */}
          <div className="mb-6 border rounded-lg p-4 bg-white">
            <h3 className="text-md font-semibold mb-2 flex items-center">
              <FileText size={16} className="mr-2" /> Page Title Section
            </h3>
            <p className="text-sm text-gray-500 mb-3">Enter your page title</p>
            <ReactQuill
              value={watchedValues.title || ''}
              onChange={(content) => setValue('title', content, { shouldValidate: true })}
              modules={modules}
              formats={formats}
              placeholder="Enter page title..."
              theme="snow"
              className={`rounded border ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description Section */}
          <div className="mb-6 border rounded-lg p-4 bg-white">
            <h3 className="text-md font-semibold mb-2 flex items-center">
              <FileText size={16} className="mr-2" /> Page Description Section
            </h3>
            <p className="text-sm text-gray-500 mb-3">Provide a rich text description</p>
            <ReactQuill
              value={watchedValues.description || ''}
              onChange={(content) => setValue('description', content, { shouldValidate: true })}
              modules={modules}
              formats={formats}
              placeholder="Enter page description..."
              theme="snow"
              className={`rounded border ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Main Image Section */}
          <div className="mb-6 border rounded-lg p-4 bg-white">
            <h3 className="text-md font-semibold mb-2 flex items-center">
              <Image size={16} className="mr-2" /> Main Image
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              {"https://dash.npfinsurance.com/"+existingImagePath 
                ? 'Current image shown below. Upload a new image to replace it.' 
                : 'Upload an image file (JPEG, PNG)'}
            </p>
            
            <div className="mt-2">
              <label className="flex flex-col items-center px-4 py-6 bg-white text-green-600 rounded-lg border-2 border-dashed border-green-400 hover:bg-green-50 cursor-pointer">
                <Upload size={24} />
                <span className="mt-2 text-sm">
                  {existingImagePath 
                    ? 'Click to replace existing image' 
                    : 'Click to upload image'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </label>
            </div>
            
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image.message as string}</p>
            )}
            
            {previewImage && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {existingImagePath && !watchedValues.image ? 'Current Image:' : 'Image Preview:'}
                </p>
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="max-w-full h-auto max-h-80 rounded border border-gray-300" 
                />
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="mb-6 border rounded-lg p-4 bg-white">
            <h3 className="text-md font-semibold mb-2 flex items-center">
              <List size={16} className="mr-2" /> Features Section
            </h3>
            <p className="text-sm text-gray-500 mb-3">Add features with HTML support (including lists)</p>
            <ReactQuill
              value={watchedValues.features || ''}
              onChange={(content) => setValue('features', content, { shouldValidate: true })}
              modules={modules}
              formats={formats}
              theme="snow"
              placeholder="Enter features (optional)..."
              className={`rounded border ${errors.features ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.features && (
              <p className="text-red-500 text-sm mt-1">{errors.features.message}</p>
            )}
          </div>
        </form>

        {/* Preview Panel */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Preview</h2>
          <p className="text-sm text-gray-500">
            This is how your page will look when published.
          </p>
          <div className="mt-4 p-4 bg-white border rounded-lg">
            {watchedValues.title && (
              <div className="mb-4 prose max-w-none" dangerouslySetInnerHTML={{ __html: watchedValues.title }} />
            )}
            
            {previewImage && (
              <div className="mb-4">
                <img src={previewImage} alt="" className="max-w-full h-auto rounded" />
              </div>
            )}
            
            {watchedValues.description && (
              <div className="mb-6 prose max-w-none" dangerouslySetInnerHTML={{ __html: watchedValues.description }} />
            )}
            
            {watchedValues.features && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Features</h2>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: watchedValues.features }} />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <button 
            onClick={() => navigate("/admin/dashboard/pages")}
            className="text-gray-600 hover:text-gray-800"
            type="button"
            disabled={isSubmitting}
          >
            Cancel and return to pages
          </button>
          <div className="flex space-x-2">
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={handleSubmit(onSubmit)}
              type="button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Editing...' : 'Edit Page'}
            </button>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}