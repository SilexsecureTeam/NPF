import { useState, useEffect } from 'react';
import useInsurance from '@/hooks/UseInsurance';
import { Loader, Search, ChevronDown, ChevronRight, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Layout } from '../Layout/layout';
import DOMPurify from 'dompurify';

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
  created_at: string;
  updated_at: string;
  category?: Category;
}

const BlogPage = () => {
  // State for posts, categories, and UI control
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 6;
  // const baseUrl = import.meta.env.BASE_URL;
  const { getAllBlogPosts, getBlogCategories } = useInsurance();

  // Fetch posts and categories on component mount
  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  // Filter posts when filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeCategory, activeSubcategory, searchTerm]);

  // Function to sanitize and render HTML content safely
  const createMarkup = (html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  };

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

      // Initialize expanded state for all categories
      const expandedState: Record<number, boolean> = {};
      fetchedCategories.forEach((cat: Category) => {
        expandedState[cat.id] = false;
      });

      setCategories(fetchedCategories);
      setExpandedCategories(expandedState);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Handle filter changes
  const handleCategoryClick = (categoryId: number) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
      setActiveSubcategory(null);
    } else {
      setActiveCategory(categoryId);
      setActiveSubcategory(null);
      toggleCategory(categoryId);
    }
  };

  const handleSubcategoryClick = (subcategoryId: number) => {
    setActiveSubcategory(activeSubcategory === subcategoryId ? null : subcategoryId);
  };

  // Filter posts based on active filters
  const filteredPosts = [...featuredPosts, ...posts].filter(post => {
    const matchesCategory = activeCategory ? post.blog_category_id === activeCategory : true;
    const matchesSubcategory = activeSubcategory ? post.blog_sub_category_id === activeSubcategory : true;
    const matchesSearch = searchTerm
      ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  // Paginate posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Find category and subcategory names
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Uncategorized";
  };

  const getSubcategoryName = (categoryId: number, subcategoryId: number | null) => {
    if (!subcategoryId) return null;
    const category = categories.find(c => c.id === categoryId);
    const subcategory = category?.subcategories?.find(s => s.id === subcategoryId);
    return subcategory?.name || null;
  };

  // Truncate text for display
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Our Blog</h1>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Stay updated with the latest news, tips, and insights from our team
          </p>
        </div>

        {/* Featured Post Section */}
        {featuredPosts.length > 0 && !activeCategory && !activeSubcategory && searchTerm === '' && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Featured Post</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0 md:w-1/2">
                  <img
                    src={`https://dash.npfinsurance.com/`+featuredPosts[0].main_image || '/placeholder-image.jpg'}
                    alt={featuredPosts[0].title}
                          className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="p-8 md:w-1/2">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar size={16} className="mr-1" />
                    <span>{featuredPosts[0].created_at && formatDate(featuredPosts[0].created_at)}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {getCategoryName(featuredPosts[0].blog_category_id)}
                    </span>
                    {featuredPosts[0].blog_sub_category_id && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ml-2">
                        {getSubcategoryName(featuredPosts[0].blog_category_id, featuredPosts[0].blog_sub_category_id)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{featuredPosts[0].title}</h3>
                  {/* Use dangerouslySetInnerHTML to render HTML content */}
                  <div 
                    className="text-gray-600 mb-6" 
                    dangerouslySetInnerHTML={createMarkup(truncateText(featuredPosts[0].description, 250))}
                  />
                  
                  <Link
                    to={`/blog/${featuredPosts[0].id}`}
                    className="inline-block px-5 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - Categories & Search */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-5 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Search</h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Categories</h3>

              {isLoading && categories.length === 0 ? (
                <div className="flex justify-center py-6">
                  <Loader size={24} className="animate-spin text-green-600" />
                </div>
              ) : (
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.id} className="mb-2">
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => handleCategoryClick(category.id)}
                          className={`text-left flex-1 font-medium ${activeCategory === category.id ? 'text-green-600' : 'text-gray-700'
                            } hover:text-green-600`}
                        >
                          {category.name}
                        </button>
                        {category.subcategories && category.subcategories.length > 0 && (
                          <button
                            onClick={() => toggleCategory(category.id)}
                            className="p-1 text-gray-500 hover:text-gray-800"
                          >
                            {expandedCategories[category.id] ? (
                              <ChevronDown size={18} />
                            ) : (
                              <ChevronRight size={18} />
                            )}
                          </button>
                        )}
                      </div>

                      {category.subcategories && category.subcategories.length > 0 && expandedCategories[category.id] && (
                        <ul className="mt-2 pl-4 space-y-1 border-l-2 border-gray-200">
                          {category.subcategories.map((subcategory) => (
                            <li key={subcategory.id}>
                              <button
                                onClick={() => handleSubcategoryClick(subcategory.id)}
                                className={`text-left w-full ${activeSubcategory === subcategory.id ? 'text-green-600 font-medium' : 'text-gray-600'
                                  } hover:text-green-600 text-sm py-1`}
                              >
                                {subcategory.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {activeCategory || activeSubcategory || searchTerm ? (
                <button
                  onClick={() => {
                    setActiveCategory(null);
                    setActiveSubcategory(null);
                    setSearchTerm('');
                  }}
                  className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm"
                >
                  Clear Filters
                </button>
              ) : null}
            </div>
          </div>

          {/* Main Content - Blog Posts */}
          <div className="md:w-3/4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader size={40} className="animate-spin text-green-600 mb-4" />
                <p className="text-gray-500">Loading blog posts...</p>
              </div>
            ) : currentPosts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No posts found</h3>
                <p className="text-gray-500">
                  {searchTerm || activeCategory || activeSubcategory ?
                    "No posts match your current filters." :
                    "No blog posts have been published yet."
                  }
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      <Link to={`/blog/${post.id}`} className="block relative">
                        <div className="h-48 overflow-hidden">
                          <img
                            src={post.main_image ? `https://dash.npfinsurance.com/${post.main_image}` : '/placeholder-image.jpg'}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {post.feature_post === 1 && (
                          <div className="absolute top-4 right-4 bg-green-600 text-white text-xs px-2 py-1 rounded">
                            Featured
                          </div>
                        )}
                      </Link>
                      <div className="p-5">
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <Calendar size={14} className="mr-1" />
                          <span>{post.created_at && formatDate(post.created_at)}</span>
                        </div>
                        <div className="flex items-center mb-3 gap-2">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded flex items-center">
                            <Tag size={12} className="mr-1" />
                            {getCategoryName(post.blog_category_id)}
                          </span>
                          {post.blog_sub_category_id && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                              {getSubcategoryName(post.blog_category_id, post.blog_sub_category_id)}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">
                          {post.title}
                        </h3>
                        {/* Use dangerouslySetInnerHTML to render HTML content */}
                        <div 
                          className="text-gray-600 text-sm mb-4 line-clamp-3"
                          dangerouslySetInnerHTML={createMarkup(post.description)}
                        />
                        <Link
                          to={`/blog/${post.id}`}
                          className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-10">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded ${currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`px-4 py-2 rounded ${currentPage === index + 1
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded ${currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;