import ProgressBar from "./ProgressBar";
//import { BackButton } from "./NextButton";
import downArrow from "../../../assets/insurance/down-arrow.svg";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { VehicleFormValues } from "@/types";
import useInsurance from "@/hooks/UseInsurance";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const schema = yup.object().shape({
  // user_id: yup.number(),  
  vehicle_registration_number: yup
    .string()
    .required("Vehicle Registration Number is required"),
  value_amount: yup.string().required("Value Amount is required"),
  maker: yup.string().required("Make is required"),
  motor_type: yup.string().required("Motor Type is required"),
  model: yup.string().required("Model is required"),
  body_color: yup.string().required("Body Color is required"),
  /* year: yup
    .number()
    .min(1980, "The car year field must be at least 1980.")
    .required("Car Year is required"), */
  year: yup
    .string() // Now a string
    .required("Car Year is required"),
  car_type: yup.string().required("Car Type is required"),
  chassis_number: yup.string().required("Chassis Number is required"),
  engine_number: yup.string().required("Engine Number is required"),
  with_effect_from: yup.string().required("Effect From date is required"),

  //New additions from personal details
  insurance_package: yup
    .string()
    .oneOf(["premium", "third_party"], "The selected insurance type is invalid.")
    .required("Field is required"),
  category: yup.string().required("Category is required"),
  sub_category: yup.string().required("Subcategory is required"),
  driver_license: yup.string().required("Driver licence number is required"),
  license_expire_year: yup
      .date()
      .min(new Date(), "License expiry date must be in the future.") // Min date is now
      .required("Driver license expiry date is required"),
  year_of_driving: yup
    .number()
    .required("Years of driving is required")
    .min(1, "Years of driving must be at least 1."),
});

const VehicleDetails = ({
  currentStep,
  setCurrentStep,
  setVehicleData,
  initialValues,
  setSelectedIdType, // Add setSelectedIdType prop
}: {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setVehicleData: React.Dispatch<React.SetStateAction<any>>;
  initialValues: any;
  setSelectedIdType: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: yupResolver(schema) as Resolver<VehicleFormValues>,
    defaultValues: initialValues,
  });

  const onSubmit: SubmitHandler<VehicleFormValues> = (data) => {
    // Extract only year out of the license_expire_year
    const yearToSend = data.license_expire_year.getFullYear().toString(); // Extract year
    const dataToSend = {
        ...data,
        license_expire_year: yearToSend, // Send only the year string
    };

    setVehicleData(dataToSend);
    setCurrentStep((prev) => prev + 1)
    //sessionStorage.setItem('vehicleData', JSON.stringify(data));
  };

  const { getCarType, getCarMakers, getCarModels } = useInsurance();
  const [carType, setCarType] = useState<any>([]);
  const [carMakers, setCarMakers] = useState([]);
  const [carModels, setCarModels] = useState([]);

  useEffect(() => {
    const fetchCarTypes = async () => {
      try {
        const response = await getCarType();
        //console.log('car types');
        console.log(response);
        //setCarType(response); //Backend has removed this route for now, so stop setting it atm
      } catch (error) {
        console.error("Error fetching car types:", error);
      }
    };

    fetchCarTypes();
  }, []);

  useEffect(() => {
    setCarType([
    { id: 1, name: "COUPE" },
    { id: 2, name: "SEDAN" },
    { id: 3, name: "SPORTS CAR" },
    { id: 4, name: "STATION WAGON" },
    { id: 5, name: "HATCHBACK" },
    { id: 6, name: "CONVERTIBLE" },
    { id: 7, name: "SPORT-UTILITY VEHICLE (SUV)" },
    { id: 8, name: "MINIVAN" },
    {id: 9, name: "PICKUP TRUCK"},
  ])
  },[])


  useEffect(() => {
    const fetchCarMakers = async () => {
      try {
        const makers = await getCarMakers();
        //console.log('car makers');
        //console.log(makers);

        setCarMakers(makers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCarMakers();
  }, []);

  useEffect(() => {
    const fetchCarModels = async () => {
      try {
        const models = await getCarModels();
        //console.log(models);
        setCarModels(models);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCarModels();
  }, []);

  const [carYears, setCarYears] = useState<any>([]);

  useEffect(() => {
    const years = [];
    for (let i = 2001; i <= 2040; i++) {
      years.push({ id: i, name: i.toString() }); // Store as strings
    }
    setCarYears(years);
  }, []);


  //New additions
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
        //console.log(categories);
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



  return (
    <section className="">
      <div className="mx-auto text-center space-y-3 md:space-y-5">
        <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl text-black ">
          Third Party Motor Insurance
        </h2>
        <p className="text-[#00000080] font-medium text-sm md:text-base w-full md:w-[50%] lg:w-[40%] mx-auto text-center">
          Fill in your vehicle details beginning with year, below. Or enter your
          VIN and we can pre-fill some of the required information.
        </p>
      </div>

      <ProgressBar currentStep={currentStep} totalSteps={4} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        id="vehicle-details"
        className="mt-8 lg:mt-14 py-5 space-y-6 md:space-y-12 text-[#00000080] font-medium text-sm md:text-base"
      >
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
          <div className="flex flex-col gap-3 md:gap-4 w-full">
            <label htmlFor="insurance_package">INSURANCE TYPE *</label>
            <div className="relative">
              <select
                {...register("insurance_package")}
                className="bg-[#F4F4F4] border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full appearance-none text-[#7A7575]"
              >
                <option value="">Select Insurance Type</option>
                <option value="premium">Premium</option>
                <option value="third_party">Third Party</option>
              </select>
              <img src={downArrow} alt="down-arrow" className="w-10 h-10 absolute transform right-2 top-1/2 -translate-y-1/2" />
              {errors.insurance_package && <p className="text-red-500 text-xs mt-1">{errors.insurance_package.message}</p>}
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          <div className="flex flex-col gap-3 md:gap-4 w-full">
            <label htmlFor="id_type">Select an ID type *</label>
            <div className="relative">
              <select
                id="id_type"
                className="bg-[#F4F4F4] border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full appearance-none text-[#7A7575]"
                onChange={handleIdTypeChange}
                value={selectedIdType}
                required
              >
                <option value="">Select ID type</option>
                <option value="nin">NIN</option>
                <option value="vehicleLicense">Vehicle License</option>
                <option value="utilityBill">Utility Bill</option>
              </select>
              <img src={downArrow} alt="down-arrow" className="w-10 h-10 absolute transform right-2 top-1/2 -translate-y-1/2" />
            </div>
          </div>
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
                  type="date" // Input type is now "date"
                  min={new Date().toISOString().split('T')[0]} // Set min attribute
                  className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full text-black"
              />
              {errors.license_expire_year && <p className="text-red-500 text-xs mt-1">{errors.license_expire_year.message}</p>}
          </div>
        </div>

        

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {/* <div className="flex flex-col gap-3 md:gap-4 w-full">
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
          </div> */}

          <div className="flex flex-col gap-3 md:gap-4 w-full">
            <label htmlFor="year_of_driving">Years of Driving*</label>
            <div className="relative">
              <select
                id="year_of_driving"
                {...register("year_of_driving")}
                className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full appearance-none text-black"
              >
                <option value="">Years of Driving*</option>
                <option value={1}>1 year</option>
                <option value={2}>2 years</option>
                <option value={3}>3+ years</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              {errors.year_of_driving && <p className="text-red-500 text-xs mt-1">{errors.year_of_driving.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 w-full">
            <label htmlFor="vehicle_registration_number">
              Vehicle Registration Number *
            </label>
            <input
              id="vehicle_registration_number"
              {...register("vehicle_registration_number")}
              className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full text-black"
            />
            {errors.vehicle_registration_number && (
              <p className="text-red-500">
                {errors.vehicle_registration_number.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 md:gap-4 w/full">
            <label htmlFor="value_amount">Value Amount *</label>
            <input
              id="value_amount"
              placeholder="Between ₦1,000,000-₦10,000,000"
              {...register("value_amount")}
              type="number"
              min={1000000}
              max={10000000}
              className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w/full text-black"
            />
            {errors.value_amount && (
              <p className="text-red-500">{errors.value_amount.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="maker">Maker *</label>
            <div className="relative">
              <select
                id="maker"
                {...register("maker")}
                className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full appearance-none text-black"
              >
                <option value="">Select Make</option>
                {carMakers.map((maker: any,index:number) => (
                  <option key={maker.id || index} value={maker.name}>
                    {maker.name}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.maker && <p className="text-red-500">{errors.maker.message}</p>}
          </div>

          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="model">Model *</label>
            <div className="relative">
              <select
                id="model"
                {...register("model")}
                className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full appearance-none text-black"
              >
                <option value="">Select Model</option>
                {carModels.map((model: any, index:number) => (
                  <option key={model.id || index } value={model.name}>
                    {model.name}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.model && <p className="text-red-500">{errors.model.message}</p>}
          </div>

          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="body_color">Body Color *</label>
            <div className="relative">
              <select
                id="body_color"
                {...register("body_color")}
                className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full appearance-none text-black"
              >
                <option value="">Select Color</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Black">Black</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.body_color && <p className="text-red-500">{errors.body_color.message}</p>}
          </div>

          {/* <div className="flex flex-col gap-4 w-full">
            <label htmlFor="year">Select Year *</label>
            <input
              id="year"
              type="number"
              {...register("year")}
              className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full text-black"
            />
            {errors.year && <p className="text-red-500">{errors.year.message}</p>}
          </div>  */}
          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="year">Select Year *</label>
            <div className="relative">
              <select
                id="year"
                {...register("year")}
                className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full appearance-none text-black"
              >
                <option value="">Select Year</option>
                {carYears.map((year: any, index:number) => (
                  <option key={year.id || index } value={year.name}>
                    {year.name}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.year && <p className="text-red-500">{errors.year.message}</p>}
          </div>

          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="car_type">Car Type *</label>
            <div className="relative">
              <select
                id="car_type"
                {...register("car_type")}
                className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full appearance-none text-black"
              >
                <option value="">Select Type</option>
                {carType.map((car: any, index: number) => (
                  <option key={car.id || index} value={car.name}>
                    {car.name}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.car_type && <p className="text-red-500">{errors.car_type.message}</p>}
          </div>

          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="chassis_number">Chassis Number</label>
            <input
              id="chassis_number"
              placeholder="Chassis Number"
              {...register("chassis_number")}
              className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full text-black"
            />
            {errors.chassis_number && <p className="text-red-500">{errors.chassis_number.message}</p>}
          </div>

          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="motor_type">Motor Type *</label>
            <select
              id="motor_type"
              {...register("motor_type")}
              className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full appearance-none text-black"
            >
              <option value="">Select Type</option>
              <option value="private">Private</option>
              <option value="commercial">Commercial</option>
            </select>
            {errors.motor_type && <p className="text-red-500">{errors.motor_type.message}</p>}
          </div>

          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="engine_number">Engine Number</label>
            <input
              id="engine_number"
              placeholder="Engine Number"
              {...register("engine_number")}
              className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full text-black"
            />
            {errors.engine_number && <p className="text-red-500">{errors.engine_number.message}</p>}
        </div>

          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="with_effect_from">With Effect From *</label>
            <input
              id="with_effect_from"
              type="date"
              {...register("with_effect_from")}
              className="bg-inherit border border-[#BBBFBD] py-2.5 px-3.5 outline-none w-full text-black"
            />
            {errors.with_effect_from && <p className="text-red-500">{errors.with_effect_from.message}</p>}
          </div>
        </div>


        <div className="flex justify-between items-center mt-5">
          {/* <BackButton
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          /> */}
          <button
            type="submit"
            className="bg-[#1F8340] text-sm font-semibold text-white py-2.5 px-[52px] ml-auto block"
          >
            Next
          </button>
        </div>
      </form>
    </section>
  );
};

export default VehicleDetails;
