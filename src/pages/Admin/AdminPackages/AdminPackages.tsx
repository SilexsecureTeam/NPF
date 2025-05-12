import React, { useState, useEffect } from "react";
import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import { Pencil, Trash2, Plus, Loader, X, Save, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import useInsurance from "@/hooks/UseInsurance";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PackageSubCategoryValues } from "@/types"; // Import the interface from types

// Define types
interface Subcategory {
  id: number;
  name: string;
  category_id: number;
  tppd_limit_price: number | string;
  premium_price: number | string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  id: number;
  name: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
  subcategories?: Subcategory[];
  sub_categories?: Subcategory[]; // Added to match API response format
}

interface CategoryFormValues {
  name: string;
}

// Form input values - all strings from form inputs
interface SubcategoryFormValues {
  name: string;
  category_id: number;
  tppd_limit_price: string;
  premium_price: string;
}

// Form validation schemas
const categoryValidationSchema = yup.object({
  name: yup.string().required("Category name is required"),
});

const subcategoryValidationSchema = yup.object({
  name: yup.string().required("Subcategory name is required"),
  category_id: yup.number().required("Parent category is required").positive("Category ID must be positive"),
  // Use yup's transform to convert string to number during validation
  tppd_limit_price: yup.string()
    .required("TPPD limit price is required")
    .test('is-number', 'TPPD limit price must be a number', value => !isNaN(Number(value)))
    .test('is-positive', 'TPPD limit price must be positive', value => Number(value) >= 0),
  premium_price: yup.string()
    .required("Premium price is required")
    .test('is-number', 'Premium price must be a number', value => !isNaN(Number(value)))
    .test('is-positive', 'Premium price must be positive', value => Number(value) >= 0)
});

export default function PackageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'update'>('create');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState<boolean>(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [subcategoryModalType, setSubcategoryModalType] = useState<'create' | 'update'>('create');
  const [formErrors, setFormErrors] = useState<any>(null);

  const {
    getPackages,
    createPackageCategory,
    deletePackageCategory,
    createPackageSubCategory,
    deletePackageSubCategory,
    updatePackageSubCategory
  } = useInsurance();

  // Category form setup
  const {
    register: registerCategory,
    handleSubmit: handleCategorySubmit,
    formState: { errors: categoryErrors },
    reset: resetCategory,
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(categoryValidationSchema),
    defaultValues: {
      name: "",
    }
  });

  // Subcategory form setup - Using string types for price fields in the form
  const {
    register: registerSubcategory,
    handleSubmit: handleSubcategorySubmit,
    formState: { errors: subcategoryErrors },
    reset: resetSubcategory,
    // setValue: setSubcategoryValue,
    watch: watchSubcategory
  } = useForm<SubcategoryFormValues>({
    resolver: yupResolver(subcategoryValidationSchema),
    defaultValues: {
      name: "",
      category_id: 0,
      tppd_limit_price: "",  
      premium_price: ""     
    },
    mode: "onChange" // Validate on field change
  });

  // Watch category_id for debugging
  const watchCategoryId = watchSubcategory("category_id");

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories and subcategories
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const categoriesResponse = await getPackages();
      
      let processedCategories: Category[] = [];
      
      if (categoriesResponse) {
        if (Array.isArray(categoriesResponse)) {
          processedCategories = categoriesResponse;
        } else if (typeof categoriesResponse === 'object') {
          if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
            processedCategories = categoriesResponse.data;
          }
        }
      }

      const normalizedCategories = processedCategories.map((category: Category) => {
        const subcategories = category.sub_categories || category.subcategories || [];
        
        return {
          ...category,
          subcategories: subcategories
        };
      });
      
      setCategories(normalizedCategories);
      
      const categoriesToExpand = normalizedCategories
        .filter(cat => cat.subcategories && cat.subcategories.length > 0)
        .map(cat => cat.id);
      
      if (categoriesToExpand.length > 0) {
        setExpandedCategories(categoriesToExpand);
      }
      
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle expand/collapse category
  const toggleExpand = (categoryId: number) => {
    setExpandedCategories(prevState =>
      prevState.includes(categoryId)
        ? prevState.filter(id => id !== categoryId)
        : [...prevState, categoryId]
    );
  };

  // CATEGORY OPERATIONS
  const openCreateCategoryModal = () => {
    resetCategory({ name: "" });
    setModalType('create');
    setShowCategoryModal(true);
  };

  const onCategorySubmit = async (data: CategoryFormValues) => {
    try {
      setIsLoading(true);

      if (modalType === 'create') {
        await createPackageCategory(data.name);
        toast.success("Category created successfully");
      } else {
        toast.error("Category update not supported");
      }

      setShowCategoryModal(false);
      resetCategory();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      setDeleteLoading(true);
      await deletePackageCategory(selectedCategory.id);
      toast.success("Category deleted successfully");
      setShowDeleteModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setDeleteLoading(false);
    }
  };

  // SUBCATEGORY OPERATIONS
  const openCreateSubcategoryModal = (category: Category) => {
    resetSubcategory({
      name: "",
      category_id: category.id, 
      tppd_limit_price: "", 
      premium_price: ""     
    });
    
    setSelectedCategory(category);
    setSubcategoryModalType('create');
    setFormErrors(null);
    setShowSubcategoryModal(true);
    
    console.log("Opening create modal with category ID:", category.id);
  };

  const openUpdateSubcategoryModal = (category: Category, subcategory: Subcategory) => {
    // Convert any number values to strings for form fields
    resetSubcategory({
      name: subcategory.name,
      category_id: category.id,
      tppd_limit_price: String(subcategory.tppd_limit_price || ""),
      premium_price: String(subcategory.premium_price || "")
    });
    
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setSubcategoryModalType('update');
    setFormErrors(null);
    setShowSubcategoryModal(true);
    
    console.log("Opening update modal with category ID:", category.id, "and subcategory:", subcategory.id);
  };

  const openDeleteCategoryModal = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setShowDeleteModal(true);
  };

  const openDeleteSubcategoryModal = (category: Category, subcategory: Subcategory) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setShowDeleteModal(true);
  };

  const onSubcategorySubmit = async (data: SubcategoryFormValues) => {
    try {
      setIsLoading(true);
      setFormErrors(null);
      
      // Convert string values to numbers for the API
      const formattedData: PackageSubCategoryValues = {
        name: data.name,
        category_id: Number(data.category_id),
        tppd_limit_price: Number(data.tppd_limit_price), // Convert to number for API
        premium_price: Number(data.premium_price)         // Convert to number for API
      };
      
      console.log("Submitting subcategory data:", formattedData);

      if (subcategoryModalType === 'create') {
        try {
          await createPackageSubCategory(formattedData);
          toast.success("Subcategory created successfully");
          setShowSubcategoryModal(false);
          resetSubcategory();
          fetchCategories();
        } catch (error: any) {
          console.error("Error creating subcategory:", error);
          if (error.response && error.response.data) {
            setFormErrors(error.response.data.errors || error.response.data);
            toast.error("Failed to create subcategory. Please check form errors.");
          } else {
            toast.error("Failed to create subcategory");
          }
        }
      } else if (selectedSubcategory) {
        try {
          await updatePackageSubCategory(selectedSubcategory.id, formattedData);
          toast.success("Subcategory updated successfully");
          setShowSubcategoryModal(false);
          resetSubcategory();
          fetchCategories();
        } catch (error: any) {
          console.error("Error updating subcategory:", error);
          if (error.response && error.response.data) {
            setFormErrors(error.response.data.errors || error.response.data);
            toast.error("Failed to update subcategory. Please check form errors.");
          } else {
            toast.error("Failed to update subcategory");
          }
        }
      }
    } catch (error) {
      console.error("Error in subcategory submit:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubcategory = async () => {
    if (!selectedSubcategory) return;

    try {
      setDeleteLoading(true);
      await deletePackageSubCategory(selectedSubcategory.id);
      toast.success("Subcategory deleted successfully");
      setShowDeleteModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error("Failed to delete subcategory");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Package Categories</h1>
          <button
            onClick={openCreateCategoryModal}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center"
          >
            <Plus size={18} className="mr-1" /> Add Category
          </button>
        </div>

        {/* Categories Table */}
        {isLoading && categories.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader size={40} className="mx-auto animate-spin text-green-600" />
              <p className="mt-2 text-gray-600">Loading categories...</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-md">
            <p className="text-gray-500">No categories found</p>
            <button
              onClick={openCreateCategoryModal}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create your first category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <React.Fragment key={`cat-${category.id}`}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                        {(category.subcategories && category.subcategories.length > 0) ? (
                          <button
                            onClick={() => toggleExpand(category.id)}
                            className="mr-2 p-1 hover:bg-gray-200 rounded-full"
                          >
                            {expandedCategories.includes(category.id) ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </button>
                        ) : (
                          <span className="mr-2 p-1 w-[16px] inline-block"></span>
                        )}
                        {category.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category.name}
                        {category.subcategories && category.subcategories.length > 0 && (
                         <span className="ml-2 text-xs text-gray-500">
                           ({category.subcategories.length} subcategories)
                         </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => openCreateSubcategoryModal(category)}
                            className="text-green-600 hover:text-green-900 p-1 bg-green-50 rounded"
                            title="Add Subcategory"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteCategoryModal(category)}
                            className="text-red-600 hover:text-red-900 p-1 bg-red-50 rounded"
                            title="Delete Category"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Subcategories */}
                    {expandedCategories.includes(category.id) && category.subcategories && category.subcategories.map(subcategory => (
                      <tr key={`sub-${subcategory.id}`} className="bg-gray-50">
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 pl-10">
                          {subcategory.id}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-700">
                          {subcategory.name} 
                          <span className="ml-2 text-xs text-gray-500">
                            (TPPD: ₦{subcategory.tppd_limit_price}, 
                            Premium: ₦{subcategory.premium_price})
                          </span>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => openUpdateSubcategoryModal(category, subcategory)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 bg-indigo-50 rounded"
                              title="Edit Subcategory"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => openDeleteSubcategoryModal(category, subcategory)}
                              className="text-red-600 hover:text-red-900 p-1 bg-red-50 rounded"
                              title="Delete Subcategory"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Create/Update Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-xl font-semibold">
                {modalType === 'create' ? 'Create New Category' : 'Edit Category'}
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCategorySubmit(onCategorySubmit)} className="px-6 py-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name*
                </label>
                <input
                  id="name"
                  type="text"
                  {...registerCategory("name")}
                  className={`w-full px-3 py-2 border rounded-md ${categoryErrors.name ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter category name"
                />
                {categoryErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{categoryErrors.name.message}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
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
                      {modalType === 'create' ? 'Create' : 'Update'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategory Create/Update Modal */}
      {showSubcategoryModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-xl font-semibold">
                {subcategoryModalType === 'create' ? 'Create New Subcategory' : 'Edit Subcategory'}
              </h3>
              <button onClick={() => setShowSubcategoryModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            {/* Display API errors if any */}
            {formErrors && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-300 rounded-md">
                <div className="flex items-center text-red-600 mb-2">
                  <AlertCircle size={16} className="mr-2" />
                  <p className="font-medium text-sm">Please correct the following errors:</p>
                </div>
                <ul className="list-disc pl-5 text-sm text-red-600">
                  {typeof formErrors === 'string' ? (
                    <li>{formErrors}</li>
                  ) : (
                    Object.entries(formErrors).map(([key, value]: [string, any]) => (
                      <li key={key}>
                        {key}: {Array.isArray(value) ? value[0] : value}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
            
            <form onSubmit={handleSubcategorySubmit(onSubcategorySubmit)} className="px-6 py-4">
              {/* Debug info */}
              <div className="mb-4 p-2 bg-gray-50 rounded-md text-xs">
                <p>Current category ID: {selectedCategory?.id}</p>
                <p>Form category ID value: {watchCategoryId}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category
                </label>
                <input
                  type="text"
                  value={selectedCategory?.name || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  disabled
                />
                {/* Hidden field for category_id */}
                <input
                  type="hidden"
                  {...registerSubcategory("category_id")}
                />
                {subcategoryErrors.category_id && (
                  <p className="mt-1 text-sm text-red-600">{subcategoryErrors.category_id.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="subcategoryName" className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory Name*
                </label>
                <input
                  id="subcategoryName"
                  type="text"
                  {...registerSubcategory("name")}
                  className={`w-full px-3 py-2 border rounded-md ${subcategoryErrors.name ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter subcategory name"
                />
                {subcategoryErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{subcategoryErrors.name.message}</p>
                )}
              </div>
              
              {/* TPPD Limit Price field - using text input */}
              <div className="mb-4">
                <label htmlFor="tppd_limit_price" className="block text-sm font-medium text-gray-700 mb-1">
                  TPPD Limit Price (₦)*
                </label>
                <input
                  id="tppd_limit_price"
                  type="text"
                  {...registerSubcategory("tppd_limit_price")}
                  className={`w-full px-3 py-2 border rounded-md ${subcategoryErrors.tppd_limit_price ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter TPPD limit price"
                />
                {subcategoryErrors.tppd_limit_price && (
                  <p className="mt-1 text-sm text-red-600">{subcategoryErrors.tppd_limit_price.message}</p>
                )}
              </div>
              
              {/* Premium Price field - using text input */}
              <div className="mb-4">
                <label htmlFor="premium_price" className="block text-sm font-medium text-gray-700 mb-1">
                  Premium Price (₦)*
                </label>
                <input
                  id="premium_price"
                  type="text"
                  {...registerSubcategory("premium_price")}
                  className={`w-full px-3 py-2 border rounded-md ${subcategoryErrors.premium_price ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter premium price"
                />
                {subcategoryErrors.premium_price && (
                  <p className="mt-1 text-sm text-red-600">{subcategoryErrors.premium_price.message}</p>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSubcategoryModal(false)}
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
                      {subcategoryModalType === 'create' ? 'Create' : 'Update'}
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
                Delete {selectedSubcategory ? 'Subcategory' : 'Category'}
              </h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center text-red-600 mb-4">
                <AlertCircle size={24} className="mr-2" />
                <p className="font-medium">
                  Are you sure you want to delete this {selectedSubcategory ? 'subcategory' : 'category'}?
                </p>
              </div>
              <p className="text-gray-500 mb-4">
                {selectedSubcategory
                  ? `This will permanently delete the "${selectedSubcategory.name}" subcategory. This action cannot be undone.`
                  : `This will permanently delete the "${selectedCategory?.name}" category${selectedCategory?.subcategories?.length
                    ? ` and all its ${selectedCategory.subcategories.length} subcategories`
                    : ''}. This action cannot be undone.`
                }
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
                  onClick={selectedSubcategory ? handleDeleteSubcategory : handleDeleteCategory}
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
                      Delete {selectedSubcategory ? 'Subcategory' : 'Category'}
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