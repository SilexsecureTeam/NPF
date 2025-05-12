import { useState, useEffect, useRef } from "react";
import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import { 
  Pencil, Trash2, Plus, Loader, X, Save, AlertCircle, 
  Image as ImageIcon, Search
} from "lucide-react";
import { toast } from "react-toastify";
import useInsurance from "@/hooks/UseInsurance";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// Import React Quill and styles
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Define types
interface Subcategory {
  id: number;
  name: string;
  slug?: string;
}

interface Category {
  id: number;
  name: string;
  slug?: string;
  subcategories?: Subcategory[];
}

interface BlogPost {
  id: number;
  title: string;
  description: string;
  blog_category_id: number;
  blog_sub_category_id: number | null;
  main_image: string | null;
  secondary_image: string | null;
  feature_post: number;
  category?: Category;
}

interface BlogPostData extends BlogPost {}

interface PostFormValues {
  title: string;
  description: string;
  blog_category_id: number;
  blog_sub_category_id: number | null;
  main_image: FileList | null;
  secondary_image: FileList | null;
  feature_post: boolean;
  keep_main_image: boolean;
  keep_secondary_image: boolean;
}

// Form validation schema
const postValidationSchema = yup.object({
  title: yup.string().required("Post title is required"),
  description: yup.string().required("Post description is required"),
  blog_category_id: yup.number().required("Category is required").min(1, "Please select a category"),
  blog_sub_category_id: yup.number().nullable().transform((value) => (value === 0 ? null : value)),
  main_image: yup.mixed().nullable(),
  secondary_image: yup.mixed().nullable(),
  feature_post: yup.boolean().required(),
  keep_main_image: yup.boolean().required(),
  keep_secondary_image: yup.boolean().required()
});

export default function BlogPosts() {
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'update'>('create');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [secondaryImagePreview, setSecondaryImagePreview] = useState<string | null>(null);
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [quillContent, setQuillContent] = useState<string>("");
  const postsPerPage = 10;
  const mainImageRef = useRef<HTMLInputElement | null>(null);
  const secondaryImageRef = useRef<HTMLInputElement | null>(null);

  const { 
    getBlogCategories,
    getAllBlogPosts,
    updateBlogPost,
    deleteBlogPost,
    createBlogPost,
  } = useInsurance();

  // Quill editor modules configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  // Quill editor formats
  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image',
    'align'
  ];

  // Post form setup - fixed with explicit generic type
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PostFormValues>({
    resolver: yupResolver(postValidationSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      blog_category_id: 0,
      blog_sub_category_id: null,
      feature_post: false,
      keep_main_image: true,
      keep_secondary_image: true,
      main_image: null,
      secondary_image: null
    }
  });

  // Watch category ID to update subcategories
  const watchCategoryId = watch("blog_category_id");

  // Load posts and categories on component mount
  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  // Update available subcategories when category changes
  useEffect(() => {
    if (watchCategoryId) {
      const selectedCategory = categories.find(cat => cat.id === Number(watchCategoryId));
      if (selectedCategory && selectedCategory.subcategories) {
        setAvailableSubcategories(selectedCategory.subcategories);
      } else {
        setAvailableSubcategories([]);
      }
      
      // Reset subcategory selection when category changes
      if (modalType === 'create' || (selectedPost && selectedPost.blog_category_id !== Number(watchCategoryId))) {
        setValue("blog_sub_category_id", null);
      }
    }
  }, [watchCategoryId, categories, modalType, selectedPost, setValue]);

  // Fetch all blog posts
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await getAllBlogPosts();
      console.log(response);

      let fetchedPosts = [];
      
      // Handle nested data.data structure (Laravel pagination format)
      if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        fetchedPosts = response.data.data;
      } 
      // Handle direct data array
      else if (response && response.data && Array.isArray(response.data)) {
        fetchedPosts = response.data;
      } 
      // Handle response as array
      else if (Array.isArray(response)) {
        fetchedPosts = response;
      }
      
      console.log("Fetched posts:", fetchedPosts);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await getBlogCategories();
      
      let fetchedCategories = [];
      if (response && response.data && Array.isArray(response.data)) {
        fetchedCategories = response.data;
      } else if (Array.isArray(response)) {
        fetchedCategories = response;
      } else if (response && typeof response === 'object') {
        if (response.data && Array.isArray(response.data)) {
          fetchedCategories = response.data;
        }
      }
      
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // Handle quill content change
  const handleQuillChange = (content: string) => {
    setQuillContent(content);
    setValue("description", content);
  };

  // Open modal for creating new post
  const openCreatePostModal = () => {
    reset({
      title: "",
      description: "",
      blog_category_id: 0,
      blog_sub_category_id: null,
      feature_post: false,
      keep_main_image: true,
      keep_secondary_image: true,
      main_image: null,
      secondary_image: null
    });
    setQuillContent(""); // Reset Quill content
    setMainImagePreview(null);
    setSecondaryImagePreview(null);
    setModalType('create');
    setShowPostModal(true);
  };

  // Open modal for updating a post
  const openUpdatePostModal = (post: BlogPost) => {
    setSelectedPost(post);
    reset({
      title: post.title,
      description: post.description,
      blog_category_id: post.blog_category_id,
      blog_sub_category_id: post.blog_sub_category_id,
      feature_post: post.feature_post === 1,
      keep_main_image: true,
      keep_secondary_image: true,
      main_image: null,
      secondary_image: null
    });
    
    // Set quill content
    setQuillContent(post.description || "");
    
    // Set image previews if available
    if (post.main_image) {
      setMainImagePreview(
        post.main_image.startsWith('http') 
          ? post.main_image 
          : `https://dash.npfinsurance.com/${post.main_image}`
      );
    } else {
      setMainImagePreview(null);
    }
    
    if (post.secondary_image) {
      setSecondaryImagePreview(
        post.secondary_image.startsWith('http') 
          ? post.secondary_image 
          : `https://dash.npfinsurance.com/${post.secondary_image}`
      );
    } else {
      setSecondaryImagePreview(null);
    }
    
    setModalType('update');
    setShowPostModal(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (post: BlogPost) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  // Handle main image change
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMainImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
      setValue('keep_main_image', false); // We're uploading a new image
    }
  };

  // Handle secondary image change
  const handleSecondaryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSecondaryImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
      setValue('keep_secondary_image', false); // We're uploading a new image
    }
  };

  // Clear image selections
  const clearMainImage = () => {
    if (mainImageRef.current) mainImageRef.current.value = "";
    setMainImagePreview(null);
    setValue('keep_main_image', false);
    setValue('main_image', null);
  };

  const clearSecondaryImage = () => {
    if (secondaryImageRef.current) secondaryImageRef.current.value = "";
    setSecondaryImagePreview(null);
    setValue('keep_secondary_image', false);
    setValue('secondary_image', null);
  };

  // Handle form submission (create or update)
  const onSubmit = async (data: PostFormValues) => {
    try {
      setIsLoading(true);
      
      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', quillContent); // Use quill content instead of form data
      formData.append('blog_category_id', data.blog_category_id.toString());
      
      // Always include blog_sub_category_id, even if it's null/empty
      formData.append('blog_sub_category_id', data.blog_sub_category_id ? 
        data.blog_sub_category_id.toString() : "");
      
      // Convert boolean to 1/0 as expected by the API
      formData.append('feature_post', data.feature_post ? '1' : '0');
      
      // Handle main image - always send something (file or empty string)
      if (data.main_image && data.main_image.length > 0) {
        formData.append('main_image', data.main_image[0]);
      } else {
        formData.append('main_image', "");
      }
      
      // Handle secondary image - always send something (file or empty string)
      if (data.secondary_image && data.secondary_image.length > 0) {
        formData.append('secondary_image', data.secondary_image[0]);
      } else {
        formData.append('secondary_image', "");
      }

      if (modalType === 'create') {
        // Cast FormData to any since the API expects FormData
        await createBlogPost(formData as any);
        toast.success("Blog post created successfully");
      } else {
        if (selectedPost) {
          // Cast FormData to any since the API expects FormData
          await updateBlogPost(selectedPost.id, formData as any);
          toast.success("Blog post updated successfully");
        }
      }
      
      setShowPostModal(false);
      fetchPosts();
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast.error("Failed to save blog post");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle post deletion
  const handleDeletePost = async () => {
    if (!selectedPost) return;
    
    try {
      setDeleteLoading(true);
      await deleteBlogPost(selectedPost.id);
      toast.success("Blog post deleted successfully");
      setShowDeleteModal(false);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error("Failed to delete blog post");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter posts by search term
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.category?.name && post.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginate posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Find category and subcategory names for display
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "-";
  };

  const getSubcategoryName = (categoryId: number, subcategoryId: number | null) => {
    if (!subcategoryId) return "-";
    const category = categories.find(c => c.id === categoryId);
    const subcategory = category?.subcategories?.find(s => s.id === subcategoryId);
    return subcategory ? subcategory.name : "-";
  };

  // Truncate text for display
  const truncateText = (text: string, maxLength: number) => {
    // Strip HTML tags for display
    const strippedText = text ? text.replace(/<[^>]*>?/gm, '') : '';
    if (strippedText.length <= maxLength) return strippedText;
    return strippedText.substr(0, maxLength) + "...";
  };

  // Get props for file inputs without duplication issues
  const getMainImageProps = () => {
    const { ref, onChange, ...rest } = register("main_image");
    return {
      ...rest,
      ref: (e: HTMLInputElement) => {
        ref(e);
        mainImageRef.current = e;
      },
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);  // Call the original onChange from register
        handleMainImageChange(e);  // Call our custom handler
      }
    };
  };

  const getSecondaryImageProps = () => {
    const { ref, onChange, ...rest } = register("secondary_image");
    return {
      ...rest,
      ref: (e: HTMLInputElement) => {
        ref(e);
        secondaryImageRef.current = e;
      },
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);  // Call the original onChange from register
        handleSecondaryImageChange(e);  // Call our custom handler
      }
    };
  };

  return (
    <AdminDashboardLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Blog Posts</h1>
          <button 
            onClick={openCreatePostModal}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center"
          >
            <Plus size={18} className="mr-1" /> Add Post
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Posts Table */}
        {isLoading && posts.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader size={40} className="mx-auto animate-spin text-green-600" />
              <p className="mt-2 text-gray-600">Loading blog posts...</p>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-md">
            <p className="text-gray-500">
              {posts.length === 0 ? "No blog posts found" : "No posts match your search criteria"}
            </p>
            {posts.length === 0 && (
              <button
                onClick={openCreatePostModal}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Create your first post
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subcategory
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Featured
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {truncateText(post.title, 40)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getCategoryName(post.blog_category_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getSubcategoryName(post.blog_category_id, post.blog_sub_category_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.feature_post === 1 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Featured
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Standard
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => openUpdatePostModal(post)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Edit Post"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(post)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete Post"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-500">
                  Showing {indexOfFirstPost + 1} to {Math.min(indexOfLastPost, filteredPosts.length)} of {filteredPosts.length} posts
                </p>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Post Create/Update Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 my-8">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-xl font-semibold">
                {modalType === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
              </h3>
              <button onClick={() => setShowPostModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  {/* Title */}
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Post Title*
                    </label>
                    <input
                      id="title"
                      type="text"
                      {...register("title")}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-green-500`}
                      placeholder="Enter post title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="mb-4">
                    <label htmlFor="blog_category_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Category*
                    </label>
                    <select
                      id="blog_category_id"
                      {...register("blog_category_id")}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.blog_category_id ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-green-500`}
                    >
                      <option value={0}>Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.blog_category_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.blog_category_id.message}</p>
                    )}
                  </div>

                  {/* Subcategory */}
                  <div className="mb-4">
                    <label htmlFor="blog_sub_category_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory 
                    </label>
                    <select
                      id="blog_sub_category_id"
                      {...register("blog_sub_category_id")}
                      disabled={availableSubcategories.length === 0}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.blog_sub_category_id ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        availableSubcategories.length === 0 ? "bg-gray-100" : ""
                      }`}
                    >
                      <option value="">Select a subcategory</option>
                      {availableSubcategories.map(subcategory => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                    {availableSubcategories.length === 0 && watchCategoryId > 0 && (
                      <p className="mt-1 text-sm text-gray-500">
                        No subcategories available for this category
                      </p>
                    )}
                  </div>

                  {/* Feature Post */}
                  <div className="mb-4 flex items-center">
                    <input
                      id="feature_post"
                      type="checkbox"
                      {...register("feature_post")}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="feature_post" className="ml-2 block text-sm font-medium text-gray-700">
                      Featured Post
                    </label>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  {/* Main Image */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Main Image 
                    </label>
                    <div className="mt-1 flex flex-col space-y-2">
                      {mainImagePreview && (
                        <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={mainImagePreview} 
                            alt="Main image preview" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={clearMainImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      <input
                        id="main_image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...getMainImageProps()}
                      />
                      {!mainImagePreview && (
                        <label
                          htmlFor="main_image"
                          className="cursor-pointer flex items-center justify-center space-x-2 w-full h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          <ImageIcon size={24} className="text-gray-400" />
                          <span className="text-gray-500">Click to upload main image</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Secondary Image */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Image 
                    </label>
                    <div className="mt-1 flex flex-col space-y-2">
                      {secondaryImagePreview && (
                        <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={secondaryImagePreview} 
                            alt="Secondary image preview" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={clearSecondaryImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      <input
                        id="secondary_image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...getSecondaryImageProps()}
                      />
                      {!secondaryImagePreview && (
                        <label
                          htmlFor="secondary_image"
                          className="cursor-pointer flex items-center justify-center space-x-2 w-full h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          <ImageIcon size={24} className="text-gray-400" />
                          <span className="text-gray-500">Click to upload secondary image</span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description - Full Width - Replace textarea with ReactQuill */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Post Description*
                </label>
                <div className={`${errors.description ? "border border-red-500 rounded" : ""}`}>
                  <ReactQuill
                    value={quillContent}
                    onChange={handleQuillChange}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter post description"
                    className="bg-white"
                    style={{ height: '300px', marginBottom: '50px' }}
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Submit buttons */}
              <div className="flex justify-end space-x-2 mt-6 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader size={16} className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      {modalType === 'create' ? 'Create Post' : 'Update Post'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-xl font-semibold text-red-600">
                Delete Blog Post
              </h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center text-red-600 mb-4">
                <AlertCircle size={24} className="mr-2" />
                <p className="font-medium">
                  Are you sure you want to delete this blog post?
                </p>
              </div>
              <p className="text-gray-500 mb-4">
                This will permanently delete the post "{selectedPost?.title}". This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <Loader size={16} className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} className="mr-2" />
                      Delete Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}