import axiosClient from "@/services/axios-client";
import { getFirstErrorMessage } from "@/services/utils";
import { BlogPostData, BoardData, ClaimFormProps, ContactPageData, DocumentFormValues, DocumentUploadProps, FeedBackForm, PackageSubCategoryValues, ServicePage, UserFormValues, VehicleFormValues } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function useInsurance() {
    const client = axiosClient();
    const [loading, setLoading] = useState(false);
    const router = useNavigate()
    const submitUserDetails = async (data: UserFormValues) => {
        try {
            //data.driver_license;
            const response = await client.post('/users', data);
            sessionStorage.setItem('userData', JSON.stringify(response.data));
            return response.data;
            //console.log("This is the response", response.data);

        } catch (error: any) {
            console.log('user error')
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const getUserDetails = async (id: string) => {
        try {
            const response = await client.get('/users/' + id);
            console.log("This is the response", response.data);
            return response.data;
        } catch (error: any) {
            const resError = error.response?.data;
            console.log(resError);
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const submitVehicleDetails = async (data: VehicleFormValues,) => {
        try {
            //const response = await client.post('/vehicles', data);
            const token = sessionStorage.getItem("authToken");
            const response = await client.post('/vehicles', data, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            console.log("This is the response", response.data);
            sessionStorage.setItem('vehicleData', JSON.stringify(response.data.vehicle));
            return response.data.vehicle;
        } catch (error: any) {
            console.log(error);
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            //toast.error(errorMessage);
            //console.log(errorMessage);
            if (resError.message === 'validation error') {
                const firstError = getFirstErrorMessage(resError.errors);
                toast.error(firstError || "Validation error occurred."); // Display first error or generic message
            } else {
                toast.error(resError.message || "Vehicle details not submitted successfully");
            }
            throw new Error(errorMessage);
        }
    };

    const submitDocuments = async (data: DocumentUploadProps) => {
        try {
            const formData = new FormData();
            formData.append('user_id', data.user_id.toString());
            formData.append('type', data.type);
            if (data.document_type) {
                formData.append('document_type', data.document_type);
            }

            if (data.file) {
                formData.append('file', data.file);
            }

            const token = sessionStorage.getItem("authToken");
            const response = await client.post('/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add token only if it exists
                },
            });
            console.log("This is the response", response.data);
            sessionStorage.setItem('documentData', JSON.stringify(response.data.data));
            return response.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const submitInsuranceDetails = async (/* userData: UserFormValues, */ vehicleData: VehicleFormValues, uploadData: DocumentFormValues) => {
        try {
            setLoading(true);
            /* //console.log('I am in insurance')
            const userResponse = await submitUserDetails(userData);
            //console.log('I am in insurance')
            console.log(userResponse);
            
            if (!userResponse.message.includes("successfully")) {
                console.log('didnt work')
                throw new Error("User details not submitted successfully");
            } */
            const userData = JSON.parse(sessionStorage.getItem("userData") ?? '');
            vehicleData.user_id = userData.id;


            /* const vehicleResponse = await submitVehicleDetails(vehicleData);
            console.log(vehicleResponse); */

            let vehicleResponse;

            // Check if vehicle data already exists in sessionStorage
            const storedVehicleData = sessionStorage.getItem("vehicleData");
            if (storedVehicleData) {
                console.log("Skipping vehicle submission, using stored data...");
                vehicleResponse = JSON.parse(storedVehicleData);
            } else {
                // Submit vehicle details if not found in sessionStorage
                vehicleResponse = await submitVehicleDetails(vehicleData);
                console.log(vehicleResponse);

                // Store vehicle data in sessionStorage for future use
                //sessionStorage.setItem("vehicleData", JSON.stringify(vehicleResponse));
            }

            let document: DocumentUploadProps | undefined = undefined;
            const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
            const maxSize = 2048 * 1024; // 2MB

            const validateFile = (file: File) => {
                if (!validTypes.includes(file.type)) {
                    throw new Error("Invalid file type. Only PDF, JPEG, PNG, and JPG are allowed.");
                }
                if (file.size > maxSize) {
                    throw new Error("File size exceeds the maximum limit of 2MB.");
                }
            };

            switch (true) {
                case !!uploadData.utilityBill?.name:
                    validateFile(uploadData.utilityBill);
                    document = {
                        user_id: vehicleResponse.user_id,
                        type: "utility_bill",
                        file: uploadData.utilityBill as File & { type: "application/pdf" | "image/jpeg" | "image/png" }
                    };
                    break;
                case !!uploadData.nin?.name:
                    validateFile(uploadData.nin);
                    document = {
                        user_id: vehicleResponse.user_id,
                        type: "government_id",
                        document_type: "international_passport",
                        file: uploadData.nin as File & { type: "image/jpeg" | "image/png" | "application/pdf" }
                    };
                    break;
                case !!uploadData.vehicleLicense?.name:
                    validateFile(uploadData.vehicleLicense);
                    document = {
                        user_id: vehicleResponse.user_id,
                        type: "vehicle_license",
                        document_type: "driver_license",
                        file: uploadData.vehicleLicense as File & { type: "application/pdf" | "image/jpeg" | "image/png" }
                    };
                    break;
            }
            console.log(document);

            if (document) {
                const documentResponse = await submitDocuments(document);
                console.log(documentResponse);
                setLoading(false);
                return { message: "Insurance details submitted successfully", userId: documentResponse.data.user_id };
            } else {
                throw new Error("No valid document found to submit");
            }
        } catch (error: any) {
            const resError = error.response?.data;
            console.log(resError);

            const errorMessage = resError?.message || resError?.data || error.message;
            console.log(errorMessage);
            toast.error(errorMessage);

            setLoading(false);
            return null;
            //return { message: errorMessage };
        }
    };

    const initializePayment = async (userId: number | string, vehicleId: number | string) => {
        try {
            setLoading(true);

            console.log(userId)
            console.log(`${window.location.origin}/payments/callback`);
            const token = sessionStorage.getItem("authToken");
            const response = await client.post('/payments/initialize', {
                user_id: userId,
                //callbackurl: `${window.location.origin}/payments/callback`
                callbackurl: `${window.location.origin}/motor-insurance-quote-form`,
                vehicle_id: vehicleId,
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            setLoading(false);
            return response.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || error.message;
            console.log(errorMessage);
            setLoading(false);
            return { message: errorMessage };
        }
    };

    const getCarType = async () => {
        try {
            setLoading(true);
            const res = await client.get('/cars');
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            setLoading(false);
        }
    };

    const getCarMakers = async () => {
        try {
            setLoading(true);
            const res = await client.get('/car/maker');
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            setLoading(false);
        }
    };

    const getCarModels = async () => {
        try {
            setLoading(true);
            const res = await client.get('/car/model');
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            setLoading(false);
        }
    };

    const getCategories = async () => {
        try {
            setLoading(true);
            const res = await client.get('/categories');
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            setLoading(false);
        }
    };

    const submitClaim = async (data: ClaimFormProps) => {
        try {
            setLoading(true);

            // Create FormData for handling file upload
            const formData = new FormData();
            formData.append('policy_number', data.policy_number);
            formData.append('reg_number', data.reg_number);
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('description', data.description);

            // Append document file
            if (data.document) {
                formData.append('document', data.document);
            }

            const response = await client.post('/claims', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response.data);
            router('/');
            return Promise.resolve("Claim submitted successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            console.error(errorMessage);
            return Promise.reject(`${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };


    const getAllservicesPage = async () => {
        try {
            setLoading(true);
            const res = await client.get('/services');
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            setLoading(false);
        }
    }


    const createServicePage = async (data: ServicePage) => {
        try {
            setLoading(true);

            // Create FormData object to handle file upload
            const formData = new FormData();

            // Add all text fields to FormData
            Object.keys(data).forEach(key => {
                if (key === 'image' && data.image instanceof File) {
                    formData.append('image', data.image);
                } else if (key !== 'image') {
                    formData.append(key, String(data[key as keyof ServicePage]));
                }
            });

            const res = await client.post('/services', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(res);
            router('/admin/dashboard/pages');
            return Promise.resolve("Page created successfully");
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Page not created");
        }
        finally {
            setLoading(false);
        }
    }

    const getServicePageById = async (id: number) => {
        try {
            setLoading(true);
            const res = await client.get(`/services/${id}`);
            return res?.data?.data;
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            setLoading(false);
        }
        finally {
            setLoading(false)
        }
    }

    const updateServicePage = async (data: ServicePage) => {
        try {
            setLoading(true);

            // Create FormData object to handle file upload
            const formData = new FormData();

            // Add all text fields to FormData
            Object.keys(data).forEach(key => {
                if (key === 'image' && data.image instanceof File) {
                    formData.append('image', data.image);
                } else if (key !== 'image') {
                    formData.append(key, String(data[key as keyof ServicePage]));
                }
            });

            const res = await client.post(`/services`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(res);
            router('/admin/dashboard/pages');
            return Promise.resolve("Page updated successfully");
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Page not updated");
        }
        finally {
            setLoading(false);
        }
    }

    const deleteServicePage = async (id: number) => {
        try {
            setLoading(true);
            const res = await client.delete(`/services/${id}`);
            return res?.data?.data;
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            setLoading(false);
        }
        finally {
            setLoading(false)
        }
    }

    const getBlogCategories = async () => {
        try {
            setLoading(true);
            const res = await client.get('/blog/categories');
            return res.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch blog categories");
        } finally {
            setLoading(false);
        }
    };

    const getBlogCategoriesById = async (id: number) => {
        try {
            setLoading(true);
            const res = await client.get(`/blog/categories${id}`);
            return res.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch blog categories");
        } finally {
            setLoading(false);
        }
    };


    const createBlogCategory = async (data: { name: string }) => {
        try {
            setLoading(true);
            await client.post('/blog/categories', data);
            return Promise.resolve("Blog category created successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to create blog category");
        } finally {
            setLoading(false);
        }
    };

    const updateBlogCategory = async (id: number, data: { name: string }) => {
        try {
            setLoading(true);
            await client.put(`/blog/categories/${id}`, data);
            return Promise.resolve("Blog category updated successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to update blog category");
        } finally {
            setLoading(false);
        }
    };

    const deleteBlogCategory = async (id: number) => {
        try {
            setLoading(true);
            await client.delete(`/blog/categories/${id}`);
            return Promise.resolve("Blog category deleted successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to delete blog category");
        } finally {
            setLoading(false);
        }
    };


    const createBlogSubCategory = async (data: { name: string, blog_category_id: number }) => {
        try {
            setLoading(true);
            await client.post('/blog/subcategories', data);
            return Promise.resolve("Blog category created successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to create blog category");
        } finally {
            setLoading(false);
        }
    };

    const updateBlogSubCategory = async (id: number, data: { name: string, blog_category_id: number }) => {
        try {
            setLoading(true);
            await client.put(`/blog/subcategories/${id}`, data);
            return Promise.resolve("Blog category updated successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to update blog category");
        } finally {
            setLoading(false);
        }
    };

    const deleteBlogSubCategory = async (id: number) => {
        try {
            setLoading(true);
            await client.delete(`/blog/subcategories/${id}`);
            return Promise.resolve("Blog category deleted successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to delete blog category");
        } finally {
            setLoading(false);
        }
    };



    const getBlogSubCategories = async () => {
        try {
            setLoading(true);
            const res = await client.get(`/blog/subcategories`);
            return res.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch blog category");
        } finally {
            setLoading(false);
        }
    };
    const getBlogSubCategoriesById = async (id: number) => {
        try {
            setLoading(true);
            const res = await client.get(`/blog/subcategories/${id}`);
            return res.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch blog category");
        } finally {
            setLoading(false);
        }
    };



    // Blog Post Functions
    const getAllBlogPosts = async () => {
        try {
            setLoading(true);
            const res = await client.get('/blog/posts');
            return res.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch blog posts");
        } finally {
            setLoading(false);
        }
    };

    const getBlogPostById = async (id: number) => {
        try {
            setLoading(true);
            const res = await client.get(`/blog/posts/${id}`);
            return res.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch blog post");
        } finally {
            setLoading(false);
        }
    };
    const createBlogPost = async (data: FormData | BlogPostData) => {
        try {
            setLoading(true);

            // Check if data is already FormData, if not convert it
            const formData = data instanceof FormData ? data : new FormData();

            // If data contains main_image or secondary_image as File objects, append them to FormData
            if (!(data instanceof FormData) && 'main_image' in data && data.main_image) {
                if (data.main_image instanceof File) {
                    formData.append('main_image', data.main_image);
                } else if (typeof data.main_image === 'string') {
                    formData.append('main_image', data.main_image);
                }
            }

            if (!(data instanceof FormData) && 'secondary_image' in data && data.secondary_image) {
                if (data.secondary_image instanceof File) {
                    formData.append('secondary_image', data.secondary_image);
                } else if (typeof data.secondary_image === 'string') {
                    formData.append('secondary_image', data.secondary_image);
                }
            }

            // Add other fields if not already in FormData
            if (!(data instanceof FormData)) {
                Object.keys(data).forEach(key => {
                    if (key !== 'main_image' && key !== 'secondary_image') {
                        formData.append(key, String(data[key as keyof typeof data]));
                    }
                });
            }

            const res = await client.post('/blog/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res);

            return Promise.resolve("Blog post created successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to create blog post");
        } finally {
            setLoading(false);
        }
    };

    const updateBlogPost = async (id: number, data: BlogPostData) => {
        try {
            setLoading(true);
            await client.put(`/blog/posts/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return Promise.resolve("Blog post updated successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to update blog post");
        } finally {
            setLoading(false);
        }
    };

    const deleteBlogPost = async (id: number) => {
        try {
            setLoading(true);
            await client.delete(`/blog/posts/${id}`);
            return Promise.resolve("Blog post deleted successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to delete blog post");
        } finally {
            setLoading(false);
        }
    };


    const createContactPage = async (data: ContactPageData) => {
        try {
            setLoading(true);
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'image' && data.image instanceof File) {
                    formData.append('image', data.image);
                } else if (key !== 'image') {
                    formData.append(key, String(data[key as keyof ContactPageData]));
                }
            });
            const res = await client.post('/contact', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res);
            router('/admin/dashboard/pages');
            return Promise.resolve("Page created successfully");
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Page not created");
        }
        finally {
            setLoading(false);
        }
    }


    const updateContactPage = async (data: ContactPageData) => {
        try {
            setLoading(true);
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'image' && data.image instanceof File) {
                    formData.append('image', data.image);
                } else if (key !== 'image') {
                    formData.append(key, String(data[key as keyof ContactPageData]));
                }
            });
            const res = await client.post('/contact', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res);
            router('/admin/dashboard/contact-page');
            return Promise.resolve("Page created successfully");
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Page not created");
        }
        finally {
            setLoading(false);
        }
    }

    const deleteContactPage = async (id: number) => {
        try {
            setLoading(true);
            await client.delete(`/contact/${id}`);
            return Promise.resolve("Contact page deleted successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to delete contact page");
        } finally {
            setLoading(false);
        }
    }

    const getContactPage = async () => {
        try {
            setLoading(true);
            const res = await client.get(`/contact`);
            return res.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch contact page");
        } finally {
            setLoading(false);
        }
    }

    const createBoard = async (data: BoardData) => {
        try {
            setLoading(true);
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'image' && data.image instanceof File) {
                    formData.append('image', data.image);
                } else if (key !== 'image') {
                    formData.append(key, String(data[key as keyof BoardData]));
                }
            });
            const res = await client.post('/board', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res);
            router('/admin/dashboard/board');
            return Promise.resolve("Page created successfully");
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Page not created");
        }
        finally {
            setLoading(false);
        }
    }

    const updateBoard = async (data: BoardData) => {
        try {
            setLoading(true);
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'image' && data.image instanceof File) {
                    formData.append('image', data.image);
                } else if (key !== 'image') {
                    formData.append(key, String(data[key as keyof BoardData]));
                }
            });
            const res = await client.post('/board', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res);
            router('/admin/dashboard/board');
            return Promise.resolve("Page created successfully");
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Page not created");
        }
        finally {
            setLoading(false);
        }
    }

    const getBoard = async () => {
        try {
            setLoading(true);
            const res = await client.get(`/board`);
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch board page");
        } finally {
            setLoading(false);
        }
    }

    const getBoardById = async (id: number) => {
        try {
            setLoading(true);
            const res = await client.get(`/board/${id}`);
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch board page");
        } finally {
            setLoading(false);
        }
    }

    const deleteBoardById = async (id: number) => {
        try {
            setLoading(true);
            const res = await client.delete(`/board/${id}`);
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch board page");
        } finally {
            setLoading(false);
        }
    }

    const createSliderImage = async (image: File) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('image', image);

            const res = await client.post('/slider', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res);
            router('/admin/dashboard/home-slider');
            return Promise.resolve("Slider image uploaded successfully");
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to upload slider image");
        }
        finally {
            setLoading(false);
        }
    }

    const getSlider = async () => {
        try {
            setLoading(true);
            const res = await client.get('/slider');
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch slider images");
        } finally {
            setLoading(false);
        }
    }

    const deleteSliderById = async (id: number) => {
        try {
            setLoading(true);
            const res = await client.delete(`/slider/${id}`);
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch slider page");
        } finally {
            setLoading(false);
        }
    }

    const getAllUserPaymentsForClient = async (user_id: number) => {
        try {
            setLoading(true);

            const token = sessionStorage.getItem("authToken");
            const res = await client.get(`/payments?user_id=${user_id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            return res?.data?.vehicles;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch user payments");
        } finally {
            setLoading(false);
        }
    }

    const getAllUserPayments = async () => {
        try {
            setLoading(true);

            const token = sessionStorage.getItem("authToken");
            const res = await client.get('/payments', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            return res?.data?.vehicles;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch user payments");
        } finally {
            setLoading(false);
        }
    }

    const getAllUserPaymentsById = async (id: number) => {
        try {
            setLoading(true);

            const token = sessionStorage.getItem("authToken");
            const res = await client.get(`/payments/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            return res?.data?.vehicle;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch user payments");
        } finally {
            setLoading(false);
        }
    }

    const sendFeedBackForm = async (data: FeedBackForm) => {
        try {
            setLoading(true);
            const res = await client.post('/feedback', data);
            console.log(res.data);
            return Promise.resolve("Feedback submitted successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to submit feedback");
        } finally {
            setLoading(false);
        }
    }

    const getPackages = async () => {
        try {
            setLoading(true);
            const res = await client.get('/package');
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch packages");
        } finally {
            setLoading(false);
        }
    }

    const createPackageCategory = async (name: string) => {
        try {
            setLoading(true);
            await client.post('/package/category', { name });
            return Promise.resolve("Package category created successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch packages");
        } finally {
            setLoading(false);
        }
    }

    const getPackageCategoryById = async (id: number) => {
        try {
            setLoading(true);
            const res = await client.get(`/package/category${id}`);
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch packages");
        } finally {
            setLoading(false);
        }
    }

    const deletePackageCategory = async (id: number) => {
        try {
            setLoading(true);
            const res = await client.delete(`/package/category/${id}`);
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch packages");
        } finally {
            setLoading(false);
        }
    }

    const createPackageSubCategory = async (data: PackageSubCategoryValues) => {
        try {
            setLoading(true);
            await client.post('/package/sub_categories', data);
            return Promise.resolve("Package subcategory created successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch packages");
        } finally {
            setLoading(false);
        }
    }

    const getPackageSubCategories = async () => {

        try {
            setLoading(true);
            const res = await client.get('/package/sub_categories');
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch packages");
        } finally {
            setLoading(false);
        }
    }

    const getPackageSubCategoryById = async (id: number) => {
        try {
            setLoading(true);
            const res = await client.get(`/package/sub_categories/${id}`);
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch packages");
        } finally {
            setLoading(false);
        }
    }

    const deletePackageSubCategory = async (id: number) => {
        try {
            setLoading(true);
            const res = await client.delete(`/package/sub_categories/${id}`);
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch packages");
        } finally {
            setLoading(false);
        }
    }

    const updatePackageSubCategory = async (id: number, data: PackageSubCategoryValues) => {
        try {
            setLoading(true);
            await client.put(`/package/sub_categories/${id}`, data);
            return Promise.resolve("Package subcategory updated successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to fetch packages");
        } finally {
            setLoading(false);
        }
    }

    const CreateCarName = async (name: string) => {
        try {
            setLoading(true);
            await client.post('/car', { name });
            return Promise.resolve("Car name solved successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to create car name");
        } finally {
            setLoading(false);
        }
    }

    const updateCarName = async (id: number, name: string) => {
        try {
            setLoading(true);
            await client.put(`/car/${id}`, { name });
            return Promise.resolve("Car name updated successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to update car name");
        } finally {
            setLoading(false);
        }
    }

    const deleteCarName = async (id: number) => {
        try {
            setLoading(true);
            await client.delete(`/car/${id}`);
            return Promise.resolve("Car name deleted successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to delete car name");
        } finally {
            setLoading(false);
        }
    }

    const createCarModel = async (name: string, year: string) => {
        try {
            setLoading(true);
            await client.post('/car/model', { name, year });
            return Promise.resolve("Car model created successfully");
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to create car model");
        }
    }

    const updateCarModel = async (id: number, name: string, year: string) => {
        try {
            setLoading(true);
            await client.put(`/car/model/${id}`, { name, year });
            return Promise.resolve("Car model updated successfully");
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to update car model");
        }
    }

    const deleteCarModel = async (id: number) => {
        try {
            setLoading(true);
            await client.delete(`/car/model/${id}`);
            return Promise.resolve("Car model deleted successfully");
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to delete car model");
        }
    }

const createCarMaker = async (name: string) => {
    try {
        setLoading(true);
        await client.post('/car/maker', { name });
        return Promise.resolve("Car maker created successfully");
    }
    catch (error: any) {
        const resError = error.response?.data;
        const errorMessage = resError?.message || resError?.data;
        console.log(errorMessage);
        return Promise.reject(errorMessage || "Failed to create car maker");
    }
}

const updateCarMaker = async (id: number, name: string) => {
    try {
        setLoading(true);
        await client.put(`/car/maker/${id}`, { name });
        return Promise.resolve("Car maker updated successfully");
    }
    catch (error: any) {
        const resError = error.response?.data;
        const errorMessage = resError?.message || resError?.data;
        console.log(errorMessage);
        return Promise.reject(errorMessage || "Failed to update car maker");
    }
}

const deleteCarMaker = async (id: number) => {
    try {
        setLoading(true);
        await client.delete(`/car/maker/${id}`);
        return Promise.resolve("Car maker deleted successfully");
    }
    catch (error: any) {
        const resError = error.response?.data;
        const errorMessage = resError?.message || resError?.data;
        console.log(errorMessage);
        return Promise.reject(errorMessage || "Failed to delete car maker");
    }
}

const SubsribeToNewsLetter = async (email: string) => {
    try {
        setLoading(true);
        await client.post('/newsletter-subscriptions', { email });
        return Promise.resolve("Subscribed to newsletter successfully");
    }
    catch (error: any) {
        const resError = error.response?.data;
        const errorMessage = resError?.message || resError?.data;
        console.log(errorMessage);
        return Promise.reject(errorMessage || "Failed to subscribe to newsletter");
    }

    finally {
        setLoading(false);
    }
}

const getNewsLetters = async () => {
    try {
        setLoading(true);
        const res = await client.get('/newsletter-subscriptions');
        return res?.data;
    } catch (error: any) {
        const resError = error.response?.data;
        const errorMessage = resError?.message || resError?.data;
        console.log(errorMessage);
        return Promise.reject(errorMessage || "Failed to fetch newsletter subscriptions");
    } finally {
        setLoading(false);
    }
}

const getNewsLettersById = async (id: number) => {
    try {
        setLoading(true);
        const res = await client.get(`/newsletter-subscriptions/${id}`);
        return res?.data?.data;
    } catch (error: any) {
        const resError = error.response?.data;
        const errorMessage = resError?.message || resError?.data;
        console.log(errorMessage);
        return Promise.reject(errorMessage || "Failed to fetch newsletter subscription");
    } finally {
        setLoading(false);
    }
}

const deleteNewsLetterById = async (id: number) => {
    try {
        setLoading(true);
        const res = await client.delete(`/newsletter-subscriptions/${id}`);
        return res?.data?.data;
    } catch (error: any) {
        const resError = error.response?.data;
        const errorMessage = resError?.message || resError?.data;
        console.log(errorMessage);
        return Promise.reject(errorMessage || "Failed to fetch newsletter subscription");
    } finally {
        setLoading(false);
    }
}

const getFeedBackFrom = async () => {
    try {
        setLoading(true);
        const res = await client.get("/feedback");  
        return res?.data;
    } catch (error: any) {
        const resError = error.response?.data;
        const errorMessage = resError?.message || resError?.data;
        console.log(errorMessage);
        return Promise.reject(errorMessage || "Failed to fetch feedback");
    } finally {
        setLoading(false);
    }
}

const SubmitToNewsLetter = async (email: string) => {
    try {
        setLoading(true);
        await client.post('/newsletter-subscriptions', { email });
        return Promise.resolve("Subscribed to newsletter successfully");
    }
    catch (error: any) {
        const resError = error.response?.data;
        const errorMessage = resError?.message || resError?.data;
        console.log(errorMessage);
        return Promise.reject(errorMessage || "Failed to subscribe to newsletter");
    }

    finally {
        setLoading(false);
    }
}

    return {
        loading,
        submitUserDetails,
        submitVehicleDetails,
        getUserDetails,
        submitDocuments,
        submitInsuranceDetails,
        initializePayment,
        getCarType,
        getCarMakers,
        getCarModels,
        getCategories,
        submitClaim,
        createServicePage,
        getAllservicesPage,
        getServicePageById,
        updateServicePage,
        deleteServicePage,
        getBlogCategories,
        getBlogCategoriesById,
        createBlogCategory,
        updateBlogCategory,
        deleteBlogCategory,
        createBlogSubCategory,
        updateBlogSubCategory,
        deleteBlogSubCategory,
        getBlogSubCategories,
        getBlogSubCategoriesById,
        getAllBlogPosts,
        getBlogPostById,
        createBlogPost,
        updateBlogPost,
        deleteBlogPost,
        createContactPage,
        getContactPage,
        updateContactPage,
        deleteContactPage,
        createBoard,
        updateBoard,
        getBoard,
        getBoardById,
        deleteBoardById,
        createSliderImage,
        getSlider,
        deleteSliderById,
        getAllUserPayments,
        getAllUserPaymentsById,
        sendFeedBackForm,
        getPackages,
        createPackageCategory,
        getPackageCategoryById,
        deletePackageCategory,
        createPackageSubCategory,
        getPackageSubCategories,
        getPackageSubCategoryById,
        deletePackageSubCategory,
        updatePackageSubCategory,
        CreateCarName,
        updateCarName,
        deleteCarName,
        createCarModel,
        updateCarModel,
        deleteCarModel,
        createCarMaker,
        updateCarMaker,
        deleteCarMaker,
        getAllUserPaymentsForClient,
        SubsribeToNewsLetter,
        getNewsLetters,
        getNewsLettersById,
        deleteNewsLetterById,
        getFeedBackFrom,
        SubmitToNewsLetter,
    };
}