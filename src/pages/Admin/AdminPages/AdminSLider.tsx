import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import { FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import useInsurance from "@/hooks/UseInsurance";
// Simpler image interface
interface SliderImage {
    id: number;
    image: string; // Changed from image_url to image
    created_at: string;
    updated_at: string;
    is_active: number;
  }

const AdminSlider = () => {
    const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get API functions from useInsurance hook
    const { createSliderImage, getSlider, deleteSliderById } = useInsurance();

    // Fetch slider images on component mount
    useEffect(() => {
        fetchSliderImages();
    }, []);

    // Fetch all slider images
    const fetchSliderImages = async () => {
        try {
            setLoading(true);
            const images = await getSlider();
            console.log(images);

            setSliderImages(images);
        } catch (error) {
            console.error("Error fetching slider images:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle file change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // File validation
            if (!file.type.match('image.*')) {
                toast.error("Please select an image file");
                return;
            }

            // File size validation (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image must be less than 5MB");
                return;
            }

            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Clear selected image
    const clearSelectedImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Upload image
    const handleUploadImage = async () => {
        if (!imageFile) {
            toast.error("Please select an image first");
            return;
        }

        try {
            setUploading(true);
            await createSliderImage(imageFile);
            toast.success("Slider image uploaded successfully");
            clearSelectedImage();
            fetchSliderImages(); // Refresh the list after upload
        } catch (error: any) {
            toast.error(error || "Failed to upload image");
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    // Delete image
    const handleDeleteImage = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this slider image?")) {
            return;
        }

        try {
            setLoading(true);
            await deleteSliderById(id);
            toast.success("Image deleted successfully");
            fetchSliderImages(); // Refresh the list after deletion
        } catch (error) {
            toast.error("Failed to delete image");
            console.error("Delete error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminDashboardLayout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Homepage Slider Images</h1>

                    {/* Upload Section */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Upload New Slider Image</h2>

                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Image Preview */}
                            <div className="w-full md:w-1/2">
                                {imagePreview ? (
                                    <div className="relative border rounded-lg overflow-hidden h-64">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-contain"
                                        />
                                        <button
                                            onClick={clearSelectedImage}
                                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer h-64"
                                    >
                                        <FaUpload className="text-gray-400 text-3xl mb-4" />
                                        <p className="text-gray-500">Click to select an image</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            {/* Upload Button */}
                            <div className="w-full md:w-1/2 flex flex-col justify-center">
                                <p className="text-gray-600 mb-4">
                                    Upload a new image to the homepage slider. For best results, use images with
                                    dimensions around 1920x600 pixels.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 flex items-center justify-center"
                                    >
                                        <FaPlus className="mr-2" />
                                        Select Image
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleUploadImage}
                                        disabled={!imageFile || uploading}
                                        className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center ${(!imageFile || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {uploading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <FaUpload className="mr-2" />
                                                Upload Image
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image List */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="px-6 py-4 bg-green-600 text-white">
                            <h2 className="font-medium">Slider Images</h2>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center p-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                            </div>
                        ) : sliderImages.length === 0 ? (
                            <div className="text-center p-12">
                                <svg
                                    className="mx-auto h-16 w-16 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No slider images yet</h3>
                                <p className="mt-1 text-gray-500">Upload your first image using the form above.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                                {sliderImages.map((image) => (
                                    <div key={image.id} className="relative group">
                                        <div className="overflow-hidden h-48 rounded-lg bg-gray-100">
                                            <img
                                                src={`https://dash.npfinsurance.com/uploads/${image.image}`}
                                                alt="Slider image"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleDeleteImage(image.id)}
                                                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                                                title="Delete image"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default AdminSlider;