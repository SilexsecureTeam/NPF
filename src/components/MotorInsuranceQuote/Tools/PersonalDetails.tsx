import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ProgressBar from "./ProgressBar";
import downArrow from "../../../assets/insurance/down-arrow.svg";
import { UserFormValues } from "@/types";
import useInsurance from "@/hooks/UseInsurance";
import { useEffect, useState } from "react";

const schema = yup.object().shape({
  insurance_type: yup
    .string()
    .oneOf(["premium", "third_party"], "The selected insurance type is invalid.")
    .required("Field is required"),
  category: yup.string().required("Category is required"),
  sub_category: yup.string().required("Subcategory is required"),
  title: yup
    .string()
    .oneOf(["MR", "MRS", "MISS", "MS", "DR", "PROF", "ENGR", "ARCH", "BARR", "CAPT", "LT", "MAJ", "GEN", "COL", "REV", "PASTOR", "EVANG", "CHIEF", "PRINCE", "PRINCESS", "HON", "SEN"], "The selected title is invalid.")
    .required("Title is required"),
  use_type: yup.string().oneOf(["individual", "corporate"]).required("Use type is required"),
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone_number: yup.string().required("Phone number is required"),
  driver_license: yup.string().required("Driver licence number is required"),
  license_expire_year: yup
    .number()
    .min(2025, "The license expire year field must be at least 2025.")
    .required("Driver license expiry date is required"),
  year_of_driving: yup
    .number()
    .min(1, "Years of driving must be at least 1.")
    .required("Years of driving is required"),
});

const PersonalDetails = ({
  currentStep,
  setCurrentStep,
  setUserData,
  initialValues,
  setSelectedIdType, // Add setSelectedIdType prop
}: {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  initialValues: any;
  setSelectedIdType: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: yupResolver(schema) as Resolver<UserFormValues>,
    defaultValues: initialValues,
  });

  const { getCategories } = useInsurance();
  const [categories, setCategories] = useState<{ id: number; name: string; sub_categories: { id: number; name: string }[] }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subCategories, setSubCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedIdType, setSelectedIdTypeState] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const categories = await getCategories();
        setCategories(categories);
        console.log(categories);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    const category = categories.find(cat => cat.name === selectedCategory);
    setSubCategories(category ? category.sub_categories : []);
  }, [selectedCategory, categories]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleIdTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idType = e.target.value;
    setSelectedIdTypeState(idType);
    setSelectedIdType(idType); // Update parent state
  };

  const onSubmit: SubmitHandler<UserFormValues> = (data) => {
    setUserData({ ...data, selectedIdType });
    setCurrentStep(currentStep + 1);
    //localStorage.setItem('userData', JSON.stringify({...data, selectedIdType}));
  };




  return (
    <>
      <section className="">
        <div className="mx-auto text-center space-y-3 md:space-y-5">
          <div className="text-sm text-[#1F8340] font-semibold text-center flex gap-2 items-center w-fit mx-auto">
            <div className="w-2 h-2 rounded-full bg-[#1F8340]"></div>
            <span>OUR SERVICES</span>
          </div>
          <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl text-black">
            Let's get started on your car insurance quote
          </h2>
          <p className="text-[#00000080] font-medium text-sm md:text-base w-full md:w-[50%] lg:w-[40%] mx-auto text-center">
            Fill in your vehicle details beginning with year, below. Or enter your VIN and we can pre-fill some of the required information.
          </p>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={4} />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 lg:mt-14 py-5 space-y-6 md:space-y-12 text-[#00000080] font-medium text-sm md:text-base">
          <div className="flex flex-col gap-3 md:gap-4 w-full">
            <label htmlFor="insurance_type">INSURANCE TYPE *</label>
            <div className="relative">
              <select
                {...register("insurance_type")}
                className="bg-[#F4F4F4] border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full appearance-none text-[#7A7575]"
              >
                <option value="">Select Insurance Type</option>
                <option value="premium">Premium</option>
                <option value="third_party">Third Party</option>
              </select>
              <img src={downArrow} alt="down-arrow" className="w-10 h-10 absolute transform right-2 top-1/2 -translate-y-1/2" />
              {errors.insurance_type && <p className="text-red-500 text-xs mt-1">{errors.insurance_type.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 w-full">
            <label htmlFor="use_type">USE TYPE *</label>
            <div className="relative">
              <select
                {...register("use_type")}
                className="bg-[#F4F4F4] border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full appearance-none text-[#7A7575]"
              >
                <option value="">Select Use Type</option>
                <option value="individual">Individual</option>
                <option value="corporate">Corporate</option>
              </select>
              <img src={downArrow} alt="down-arrow" className="w-10 h-10 absolute transform right-2 top-1/2 -translate-y-1/2" />
              {errors.use_type && <p className="text-red-500 text-xs mt-1">{errors.use_type.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 w-full">
            <label htmlFor="category">CATEGORY *</label>
            <div className="relative">
              <select
                {...register("category")}
                className="bg-[#F4F4F4] border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full appearance-none text-[#7A7575]"
                onChange={handleCategoryChange}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
              <img src={downArrow} alt="down-arrow" className="w-10 h-10 absolute transform right-2 top-1/2 -translate-y-1/2" />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
          </div>

          {selectedCategory && (
            <div className="flex flex-col gap-3 md:gap-4 w-full">
              <label htmlFor="sub_category">SUBCATEGORY *</label>
              <div className="relative">
                <select
                  {...register("sub_category")}
                  className="bg-[#F4F4F4] border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full appearance-none text-[#7A7575]"
                >
                  <option value="">Select Subcategory</option>
                  {subCategories.map(subCategory => (
                    <option key={subCategory.id} value={subCategory.name}>{subCategory.name}</option>
                  ))}
                </select>
                <img src={downArrow} alt="down-arrow" className="w-10 h-10 absolute transform right-2 top-1/2 -translate-y-1/2" />
                {errors.sub_category && <p className="text-red-500 text-xs mt-1">{errors.sub_category.message}</p>}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 md:gap-4 w-full">
            <label htmlFor="id_type">Select an ID type *</label>
            <div className="relative">
              <select
                id="id_type"
                className="bg-[#F4F4F4] border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full appearance-none text-[#7A7575]"
                onChange={handleIdTypeChange}
                value={selectedIdType}
              >
                <option value="">Select ID type</option>
                <option value="validId">Valid ID</option>
                <option value="vehicleLicense">Vehicle License</option>
                <option value="utilityBill">Utility Bill</option>
              </select>
              <img src={downArrow} alt="down-arrow" className="w-10 h-10 absolute transform right-2 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 w-full">
            <label htmlFor="title">TITLE *</label>
            <div className="relative">
              <select
                {...register("title")}
                className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full appearance-none text-[#7A7575]"
              >
                <option value="">Select Title</option>
                <option value="MR">Mr</option>
                <option value="MRS">Mrs</option>
                <option value="MISS">Miss</option>
                <option value="MS">Ms</option>
                <option value="DR">Dr</option>
                <option value="PROF">Prof</option>
                <option value="ENGR">Engr</option>
                <option value="ARCH">Arch</option>
                <option value="BARR">Barr</option>
                <option value="CAPT">Capt</option>
                <option value="LT">Lt</option>
                <option value="MAJ">Maj</option>
                <option value="GEN">Gen</option>
                <option value="COL">Col</option>
                <option value="REV">Rev</option>
                <option value="PASTOR">Pastor</option>
                <option value="EVANG">Evang</option>
                <option value="CHIEF">Chief</option>
                <option value="PRINCE">Prince</option>
                <option value="PRINCESS">Princess</option>
                <option value="HON">Hon</option>
                <option value="SEN">Sen</option>
              </select>
              <img src={downArrow} alt="down-arrow" className="w-10 h-10 absolute transform right-2 top-1/2 -translate-y-1/2" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="flex flex-col gap-3 md:gap-4 w-full">
              <label htmlFor="first_name">FIRST NAME *</label>
              <input
                {...register("first_name")}
                placeholder="FIRST NAME"
                className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full text-black"
              />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
            </div>
            <div className="flex flex-col gap-3 md:gap-4 w-full">
              <label htmlFor="last_name">SURNAME *</label>
              <input
                {...register("last_name")}
                placeholder="SURNAME"
                className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full text-black"
              />
              {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="flex flex-col gap-3 md:gap-4 w-full">
              <label htmlFor="email">EMAIL *</label>
              <input
                {...register("email")}
                placeholder="EMAIL"
                type="email"
                className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full text-black"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-3 md:gap-4 w-full">
              <label htmlFor="phone_number">PHONE NO *</label>
              <input
                {...register("phone_number")}
                placeholder="PHONE NO"
                type="tel"
                className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full text-black"
              />
              {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number.message}</p>}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="flex flex-col gap-3 md:gap-4 w-full">
              <label htmlFor="driver_license">Driver licence Number*</label>
              <input
                {...register("driver_license")}
                placeholder="Driver licence Number"
                type="text"
                className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full text-black"
              />
              {errors.driver_license && <p className="text-red-500 text-xs mt-1">{errors.driver_license.message}</p>}
            </div>
            <div className="flex flex-col gap-3 md:gap-4 w-full">
              <label htmlFor="license_expire_year">Driver Licence Expiry Date *</label>
              <input
                {...register("license_expire_year")}
                placeholder=""
                type="number"
                min={new Date().getFullYear()}
                className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full text-black"
              />
              {errors.license_expire_year && <p className="text-red-500 text-xs mt-1">{errors.license_expire_year.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 w-full">
            <label htmlFor="year_of_driving">Years of Driving*</label>
            <div className="relative">
              <input
                {...register("year_of_driving")}
                placeholder=""
                type="number"
                className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full text-black"
              />
              <img src={downArrow} alt="down-arrow" className="w-10 h-10 absolute transform right-2 top-1/2 -translate-y-1/2" />
              {errors.year_of_driving && <p className="text-red-500 text-xs mt-1">{errors.year_of_driving.message}</p>}
            </div>
          </div>

          <button type="submit" className="bg-[#1F8340] text-sm font-semibold text-white py-2.5 px-[52px] ml-auto block">
            Next
          </button>
        </form>
      </section>
    </>
  );
};

export default PersonalDetails;