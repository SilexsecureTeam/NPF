import React, { useState } from 'react';
import { MdCloudUpload, MdCheckCircle } from "react-icons/md";
import { Layout } from '../Layout/layout';
import useInsurance from '@/hooks/UseInsurance';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { ClaimFormProps } from '@/types';

const ClaimForm = () => {
  const { submitClaim } = useInsurance();
  const [file, setFile] = useState<File | null>(null);
  const [fileUploaded, setFileUploaded] = useState(false);

  // Validation schema using Yup
  const validationSchema = yup.object({
    policy_number: yup.string().required('Policy number is required'),
    reg_number: yup.string().required('Registration number is required'),
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Enter a valid email')
      .required('Email is required'),
    description: yup.string().required('Comment is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ClaimFormProps>({
    resolver: yupResolver(validationSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Type checking for file
      if (
        selectedFile.type === "image/jpeg" ||
        selectedFile.type === "image/png" ||
        selectedFile.type === "application/pdf"
      ) {
        // Set the file in state and form data
        setFile(selectedFile);
        setFileUploaded(true);
        setValue('document', selectedFile as File & { type: "image/jpeg" | "image/png" | "application/pdf" });
      } else {
        // Only show error if file type is invalid
        toast.error("Please upload a JPEG, PNG, or PDF file.");
        setFile(null);
        setFileUploaded(false);
      }
    }
  };

  const onSubmit: SubmitHandler<ClaimFormProps> = async (data) => {
    if (!file) {
      toast.error("Please upload a document");
      return;
    }

    // Use toast.promise to handle submission feedback
    toast.promise(
      submitClaim(data), 
      {
        pending: "Submitting your claim...",
        success: {
          render() {
            reset();
            setFile(null);
            setFileUploaded(false);
            return "Claim submitted successfully!";
          },
        },
        error: {
          render({ data }: { data: any }) {
            // Handle error message
            const errorMessage = data?.response?.data?.message || "Failed to submit claim. Please try again.";
            return errorMessage;
          },
        },
      }
    );
  };

  return (
    <Layout>
      <div className="px-16 bg-white p-6 rounded-lg shadow-md py-20">
        <h2 className="text-2xl font-bold bg-yellow-300 mb-6 py-2 w-60 border-l-4 border-green-800 pl-3">Claim Process</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="policy_number" className="block text-gray-700 font-medium mb-2">
              Policy Number
            </label>
            <input
              type="text"
              id="policy_number"
              className={`w-full px-4 py-2 border ${
                errors.policy_number ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 bg-[#D9D9D9]`}
              {...register('policy_number')}
            />
            {errors.policy_number && (
              <div className="text-red-500 text-sm mt-1">{errors.policy_number.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="reg_number" className="block text-gray-700 font-medium mb-2">
              Reg Number
            </label>
            <input
              type="text"
              id="reg_number"
              className={`w-full px-4 py-2 border ${
                errors.reg_number ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 bg-[#D9D9D9]`}
              {...register('reg_number')}
            />
            {errors.reg_number && (
              <div className="text-red-500 text-sm mt-1">{errors.reg_number.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className={`w-full px-4 py-2 border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 bg-[#D9D9D9]`}
              {...register('name')}
            />
            {errors.name && (
              <div className="text-red-500 text-sm mt-1">{errors.name.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-4 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 bg-[#D9D9D9]`}
              {...register('email')}
            />
            {errors.email && (
              <div className="text-red-500 text-sm mt-1">{errors.email.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className={`w-full px-4 py-2 border ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 bg-[#D9D9D9]`}
              {...register('description')}
            />
            {errors.description && (
              <div className="text-red-500 text-sm mt-1">{errors.description.message}</div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Upload Document
            </label>
            <div 
              className={`relative border-2 border-dashed ${
                !fileUploaded ? 'border-red-500' : 'border-green-500'
              } rounded-md p-6 text-center cursor-pointer hover:bg-gray-50`}
            >
              <input
                type="file"
                id="document"
                accept="image/jpeg,image/png,application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              {fileUploaded ? (
                <div className="flex items-center justify-center text-green-800">
                  <MdCheckCircle className="text-2xl mr-2" />
                  <span>{file?.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <MdCloudUpload className="text-4xl mb-2 text-green-800" />
                  <p>Click to upload or drag and drop</p>
                  <p className="text-sm">PDF, JPEG, or PNG files accepted</p>
                </div>
              )}
            </div>
            {!fileUploaded && (
              <div className="text-red-500 text-sm mt-1">Document is required</div>
            )}
          </div>

          <div className="flex flex-col">
            <button
              type="submit"
              className="w-full bg-green-800 text-white py-2 px-4 rounded-full hover:bg-green-700 transition duration-300"
            >
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ClaimForm;