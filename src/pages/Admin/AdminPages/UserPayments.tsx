import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import { FaSearch, FaFileDownload, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import useInsurance from "@/hooks/UseInsurance";

// Define interfaces based on API response structure
interface User {
  id: number;
  title: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  phone_number: string;
  use_type: string;
  email_verified_at: string;
  created_at: string;
}

interface Payment {
  id: number;
  user_id: number;
  vehicle_id: number;
  reference: string;
  amount: string;
  currency: string;
  status: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface Vehicle {
  id: number;
  user_id: number;
  driver_license: string;
  maker: string;
  model: string;
  year: string;
  car_type: string;
  vehicle_registration_number: string;
  created_at: string;
  payment: Payment;
  user: User;
}

interface TransformedPayment {
  id: number;
  user_id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  product_id?: number;
  product_name?: string;
  reference: string;
  amount: number;
  status: string;
  payment_method: string;
  transaction_date: string;
  created_at: string;
  vehicle_details?: string;
}

export const AllUserPayments = () => {
  const [payments, setPayments] = useState<TransformedPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<TransformedPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<string>("transaction_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const itemsPerPage = 10;
  const { getAllUserPayments, loading: apiLoading } = useInsurance();

  // Fetch payments data
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const vehicleData = await getAllUserPayments();
      console.log("Fetched vehicle data:", vehicleData);
      
      if (!vehicleData || !Array.isArray(vehicleData)) {
        toast.error("Failed to load payment data: Invalid response format");
        return;
      }
      
      // Transform vehicle data to match our payment interface
      const transformedPayments: TransformedPayment[] = vehicleData.map((vehicle: Vehicle) => {
        const { payment, user } = vehicle;
        return {
          id: payment.id,
          user_id: user.id,
          user: {
            id: user.id,
            name: `${user.title} ${user.first_name} ${user.last_name}`,
            email: user.email
          },
          product_id: vehicle.id,
          product_name: `${vehicle.maker} ${vehicle.model} (${vehicle.year})`,
          reference: payment.reference,
          amount: parseFloat(payment.amount),
          status: payment.status,
          payment_method: payment.currency === 'NGN' ? 'Payment Gateway' : 'Other',
          transaction_date: payment.updated_at || payment.created_at,
          created_at: payment.created_at,
          vehicle_details: `${vehicle.car_type} - ${vehicle.vehicle_registration_number}`
        };
      });
      
      setPayments(transformedPayments);
      setFilteredPayments(transformedPayments);
      setTotalPages(Math.ceil(transformedPayments.length / itemsPerPage));
      
    } catch (error) {
      console.error("Error fetching payments:", error);
      // toast.error("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  // Handle search and filter
  useEffect(() => {
    const results = payments.filter(payment => {
      const matchesSearch = 
        payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.product_name && payment.product_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (payment.vehicle_details && payment.vehicle_details.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    setFilteredPayments(results);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, payments]);

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }

    // Apply sorting
    const sortedData = [...filteredPayments].sort((a, b) => {
      let valA, valB;

      if (field === 'user.name') {
        valA = a.user?.name || '';
        valB = b.user?.name || '';
      } else if (field === 'amount') {
        valA = a.amount;
        valB = b.amount;
      } else {
        valA = a[field as keyof TransformedPayment] || '';
        valB = b[field as keyof TransformedPayment] || '';
      }

      if (sortDirection === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

    setFilteredPayments(sortedData);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(startIndex, startIndex + itemsPerPage);
  };

  // Export payments to CSV
  const exportPayments = () => {
    // Create CSV headers
    let csv = "ID,User,Email,Vehicle,Reference,Amount,Status,Payment Method,Date\n";
    
    // Add data rows
    filteredPayments.forEach(payment => {
      csv += `${payment.id},`;
      csv += `"${payment.user?.name || 'N/A'}",`;
      csv += `"${payment.user?.email || 'N/A'}",`;
      csv += `"${payment.vehicle_details || 'N/A'}",`;
      csv += `"${payment.reference}",`;
      csv += `${payment.amount},`;
      csv += `"${payment.status}",`;
      csv += `"${payment.payment_method}",`;
      csv += `"${formatDate(payment.transaction_date)}"\n`;
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'payments_export.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AdminDashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">User Payments</h1>
          
          {/* Filters and Search Section */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div>
                  <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="success">Successful</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                
                <button
                  onClick={exportPayments}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 ml-3 h-10 mt-5"
                >
                  <FaFileDownload className="mr-2" /> Export
                </button>
              </div>
            </div>
          </div>
          
          {/* Payments Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Payment Transactions</h2>
            </div>
            
            {loading || apiLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : filteredPayments.length === 0 ? (
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
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No payments found</h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? "Try adjusting your search or filter settings" 
                    : "No payment transactions have been recorded yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('id')}
                      >
                        ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('user.name')}
                      >
                        User {sortField === 'user.name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('product_name')}
                      >
                        Vehicle {sortField === 'product_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('reference')}
                      >
                        Reference {sortField === 'reference' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('amount')}
                      >
                        Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('status')}
                      >
                        Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('transaction_date')}
                      >
                        Date {sortField === 'transaction_date' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getPaginatedData().map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.user?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{payment.user?.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{payment.product_name || 'N/A'}</div>
                          <div className="text-xs text-gray-400">{payment.vehicle_details}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.reference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              payment.status === 'success'
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1) || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.transaction_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/admin/dashboard/user-payment/${payment.id}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FaEye className="inline mr-1" /> View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {!loading && filteredPayments.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, filteredPayments.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredPayments.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Previous
                      </button>
                      
                      {/* Page numbers - show up to 5 pages */}
                      {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                        // Calculate the page number to display
                        const pageNum = currentPage > 3 
                          ? currentPage - 2 + i 
                          : i + 1;
                          
                        // Don't show page numbers beyond total pages
                        if (pageNum > totalPages) return null;
                        
                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNum
                                ? 'z-10 bg-green-50 border-green-500 text-green-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AllUserPayments;