import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Textinput from "@/components/Ui/Textinput"; // Adjust the import path as needed
import Textarea from "@/components/Ui/Textarea"; // Adjust the import path as needed
import Checkbox from "@/components/Ui/CheckBox";

// Define the validation schema using yup
const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  address: yup.string().required("Address is required"),
  bio: yup.string().required("Bio is required"),
 
});

// Define the form values interface
interface FormValues {
  username: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  bio: string;

}

const ExampleForm: React.FC = () => {
  const [checked5, setChecked5] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "all",
  });

  // Handler for form submission
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  return (
    <div className="h-full w-[100%] bg-gray-100 flex items-center justify-center  py-10">
      <div className="bg-white shadow-lg rounded-lg p-2 max-w-4xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Form Component Examples
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Username Field */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-semibold">Username</h2>
            <Textinput
              type="text"
              label="Username"
              className="h-10"
              placeholder="Enter your username"
              register={register}
              name="username"
              error={errors.username}
              validate={
                !errors.username && touchedFields.username
                  ? "Username looks good"
                  : undefined
              }
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-semibold">Password</h2>
            <Textinput
              type="password"
              label="Password"
              className="h-20"
              placeholder="Enter your password"
              register={register}
              name="password"
              error={errors.password}
              validate={
                !errors.password && touchedFields.password
                  ? "Password looks good"
                  : undefined
              }
              hasIcon
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-semibold">Email</h2>
            <Textinput
              type="email"
              label="Email"
              className="h-20 border border-b"
              placeholder="Enter your email"
              register={register}
              name="email"
              msgTooltip
              error={errors.email}
              validate={
                !errors.email && touchedFields.email
                  ? "Email looks good"
                  : undefined
              }
            />
          </div>

          {/* Phone Number Field */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-semibold">Phone Number</h2>
            <Textinput
              type="text"
              label="Phone Number"
              className="h-20"
              placeholder="Enter your phone number"
              register={register}
              name="phone"
              error={errors.phone}
              validate={
                !errors.phone && touchedFields.phone
                  ? "Phone number looks good"
                  : undefined
              }
              msgTooltip
              options={{ phone: true, phoneRegionCode: "US" }} // Masking options.
            />
          </div>

          {/* Address Field */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-semibold">Address</h2>
            <Textarea
              label="Address"
              className="h-20"
              placeholder="Enter your address"
              register={register}
              name="address"
              error={errors.address}
              validate={
                !errors.address && touchedFields.address
                  ? "Address looks good"
                  : undefined
              }
            />
          </div>

          {/* Bio Field */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-semibold">Bio</h2>
            <Textarea
              label="Bio"
              className="h-20"
              placeholder="Tell us about yourself"
              register={register}
              name="bio"
              error={errors.bio}
              validate={
                !errors.bio && touchedFields.bio ? "Bio looks good" : undefined
              }
            />
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex flex-col space-y-2 col-span-full">
          <Checkbox
            label="Primary"
            value={checked5}
            activeClass="ring-primary bg-primary"
            onChange={() => setChecked5(!checked5)}
          />
          </div>

          {/* Submit Button */}
          <div className="col-span-full">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExampleForm;


