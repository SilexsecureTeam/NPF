import { useState, useEffect } from 'react';
import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import useInsurance from "@/hooks/UseInsurance";

// Define interfaces
interface NewsletterSubscription {
  id: number;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Feedback {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminFeedback = () => {
  const { getNewsLetters, deleteNewsLetterById, getFeedBackFrom } = useInsurance();
  
  // State management
  const [activeTab, setActiveTab] = useState<'newsletters' | 'feedback'>('newsletters');
  const [newsletters, setNewsletters] = useState<NewsletterSubscription[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  
  // Format date to more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Fetch newsletter subscriptions
  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const data = await getNewsLetters();
      if (data && data.data) {
        setNewsletters(data.data);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load newsletter subscriptions');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch feedback submissions
  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const data = await getFeedBackFrom();
      if (data && data.data) {
        setFeedback(data.data);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load feedback submissions');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a newsletter subscription
  const handleDeleteNewsletter = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;
    
    try {
      setIsDeleting(id);
      await deleteNewsLetterById(id);
      setNewsletters(newsletters.filter(newsletter => newsletter.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete subscription');
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Load data when component mounts or tab changes
  useEffect(() => {
    if (activeTab === 'newsletters') {
      fetchNewsletters();
    } else {
      fetchFeedback();
    }
  }, [activeTab]);
  
  return (
    <AdminDashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Feedback & Newsletters</h1>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                activeTab === 'newsletters' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
              onClick={() => setActiveTab('newsletters')}
            >
              Newsletter Subscriptions
            </button>
            <button
              className={`${
                activeTab === 'feedback' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
              onClick={() => setActiveTab('feedback')}
            >
              User Feedback
            </button>
          </nav>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}
        
        {/* Newsletter Subscriptions Tab Content */}
        {activeTab === 'newsletters' && !loading && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed On
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {newsletters.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No newsletter subscriptions found
                      </td>
                    </tr>
                  ) : (
                    newsletters.map((newsletter, index) => (
                      <tr key={newsletter.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {newsletter.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${newsletter.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {newsletter.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(newsletter.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteNewsletter(newsletter.id)}
                            disabled={isDeleting === newsletter.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            {isDeleting === newsletter.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Feedback Tab Content */}
        {activeTab === 'feedback' && !loading && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted On
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {feedback.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No feedback submissions found
                      </td>
                    </tr>
                  ) : (
                    feedback.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.full_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              item.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedFeedback(item)}
                            className="text-blue-600 hover:text-blue-900 px-3 py-1 bg-blue-100 rounded-md"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Feedback Detail Modal */}
        {selectedFeedback && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setSelectedFeedback(null)}></div>
              </div>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Feedback Details
                      </h3>
                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">From</label>
                          <div className="mt-1 text-sm text-gray-900">{selectedFeedback.full_name}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <div className="mt-1 text-sm text-gray-900">{selectedFeedback.email}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          <div className="mt-1 text-sm text-gray-900">{selectedFeedback.phone_number}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Subject</label>
                          <div className="mt-1 text-sm text-gray-900">{selectedFeedback.subject}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Message</label>
                          <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded border border-gray-200 max-h-40 overflow-y-auto">
                            {selectedFeedback.message}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Submitted</label>
                          <div className="mt-1 text-sm text-gray-900">{formatDate(selectedFeedback.created_at)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button 
                    type="button" 
                    onClick={() => setSelectedFeedback(null)}
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminFeedback;