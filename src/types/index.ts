export interface UserFormValues {
  insurance_type: "premium" | "third_party";
  category: string;
  sub_category: string;
  title: "MR" | "MRS" | "MISS" | "MS" | "DR" | "PROF" | "ENGR" | "ARCH" | "BARR" | "CAPT" | "LT" | "MAJ" | "GEN" | "COL" | "REV" | "PASTOR" | "EVANG" | "CHIEF" | "PRINCE" | "PRINCESS" | "HON" | "SEN";
  use_type: "individual" | "corporate";
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  driver_license?: string;
  license_expire_year: number;
  year_of_driving: number;
}

export interface VehicleFormValues {
  user_id?: number;
  vehicle_registration_number: string;
  value_amount: string;
  maker: string;
  motor_type: string;
  model: string;
  body_color: string;
  year: string | number;
  car_type: string;
  chassis_number: string;
  engine_number: string;
  with_effect_from: string;

  //New additions from personal details
  insurance_package: "premium" | "third_party";
  category: string;
  sub_category: string;
  driver_license?: string;
  license_expire_year: Date; // Now a Date object
  year_of_driving: number | string;
}

export interface DocumentFormValues {
  user_id: number;
  nin: File;
  vehicleLicense: File;
  utilityBill: File;
}

export interface DocumentUploadProps {
  user_id: number;
  type: string;
  document_type?: string;
  file: File & { type: "image/jpeg" | "image/png" | "application/pdf" };
}

export interface ClaimFormProps {
  policy_number: string;
  reg_number: string;
  name: string;
  email: string;
  description: string;
  document?: File & { type: "image/jpeg" | "image/png" | "application/pdf" };
}

export interface ServicePage {
  title: string;
  description: string;
  image: File & { type: "image/jpeg" | "image/png" | "image/jpg" | "image/webp" };
  features: string;
}

export interface BlogPostData {
  title: string;
  description: string;
  blog_category_id: number;
  blog_sub_category_id: number;
  main_image: File & { type: "image/jpeg" | "image/png" | "image/jpg" | "image/webp" };
  secondary_image: File & { type: "image/jpeg" | "image/png" | "image/jpg" | "image/webp" };
  feature_post: number;
}

export interface ContactPageData {
  title: string;
  description: string;
  image: File
  detail: string;
  address: string;
}

export interface BoardData {
  id?: number;
  title: string;
  name: string;
  descriptio: string;
  image: File;
}

export interface AdminRegistrationData {
  use_type: "admin" | "superadmin";
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
}

export interface LoginFormInputs {
  email: string;
  password: string;
};

export interface PasswordResetValues {
  email: string;
  password: string;
  password_confirmation: string;
  otp: string;
}

export interface AdminChangePasswordValues {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface FeedBackForm{
  full_name : string;
  email : string;
  phone_number : string;
  message : string; 
  subject : string;
}

export interface PackageSubCategoryValues{
    name:string,
    category_id: number,
    tppd_limit_price: number,
    premium_price: number
}