import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useInsurance from '@/hooks/UseInsurance';
import { Loader, Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Layout } from '../Layout/layout';

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
  feature_post: number | string;
  created_at: string;
  updated_at: string;
  category?: Category;
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const { getBlogPostById, getAllBlogPosts, getBlogCategories } = useInsurance();
  const API_BASE_URL = "https://dash.npfinsurance.com/";

  useEffect(() => {
    // Reset scroll position when navigating to a blog post
    window.scrollTo(0, 0);
    
    fetchBlogPost();
    fetchCategories();
  }, [id]);

  const fetchBlogPost = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const response = await getBlogPostById(parseInt(id));
      
      let fetchedPost = null;
      if (response && response.data) {
        fetchedPost = response.data;
      }
      
      if (!fetchedPost) {
        toast.error("Blog post not found");
        navigate('/blog');
        return;
      }
      
      setPost(fetchedPost);
      fetchRelatedPosts(fetchedPost);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      toast.error("Failed to load blog post");
      navigate('/blog');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedPosts = async (currentPost: BlogPost) => {
    try {
      const response = await getAllBlogPosts();
      
      let fetchedPosts = [];
      if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        fetchedPosts = response.data.data;
      } else if (response && response.data && Array.isArray(response.data)) {
        fetchedPosts = response.data;
      } else if (Array.isArray(response)) {
        fetchedPosts = response;
      }
      
      // Filter out the current post and get posts from the same category
      const related = fetchedPosts
        .filter((p: BlogPost) => 
          p.id !== currentPost.id && 
          p.blog_category_id === currentPost.blog_category_id
        )
        .slice(0, 3); // Get maximum 3 related posts
      
      setRelatedPosts(related);
    } catch (error) {
      console.error("Error fetching related posts:", error);
    }
  };

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

  // Get category and subcategory names
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

  // Helper for image URLs
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return '/placeholder-image.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  // Share blog post
  const shareBlogPost = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || "NPF Insurance Blog",
        text: post?.title || "Check out this blog post from NPF Insurance",
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center h-64">
            <Loader size={40} className="animate-spin text-green-600 mb-4" />
            <p className="text-gray-500">Loading blog post...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Blog post not found</h3>
            <p className="text-gray-500 mb-6">The blog post you're looking for may have been removed or doesn't exist.</p>
            <Link
              to="/blog"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-8"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to all posts
        </Link>

        {/* Post Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {post.blog_category_id && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {getCategoryName(post.blog_category_id)}
              </span>
            )}
            {post.blog_sub_category_id && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {getSubcategoryName(post.blog_category_id, post.blog_sub_category_id)}
              </span>
            )}
            {(post.feature_post === 1 || post.feature_post === "1") && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500">
              <Calendar size={18} className="mr-2" />
              <span>{post.created_at && formatDate(post.created_at)}</span>
            </div>
            <button 
              onClick={shareBlogPost}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <Share2 size={18} className="mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Main Image */}
        {post.main_image && (
          <div className="mb-10">
            <img
              src={getImageUrl(post.main_image)}
              alt={post.title}
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: post.description }} />
        </div>

        {/* Secondary Image (if available) */}
        {post.secondary_image && (
          <div className="mb-12">
            <img
              src={getImageUrl(post.secondary_image)}
              alt={`${post.title} - additional image`}
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div
                  key={relatedPost.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <Link to={`/blog/${relatedPost.id}`}>
                    <img
                      src={getImageUrl(relatedPost.main_image)}
                      alt={relatedPost.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        <span>{relatedPost.created_at && formatDate(relatedPost.created_at)}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share and Navigation */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200">
          <Link
            to="/blog"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Link>
          <button
            onClick={shareBlogPost}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Share2 size={16} className="mr-2" />
            Share this post
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default BlogDetail;