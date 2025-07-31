import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import ButtonT from "@/pages/Ui/button";
import ExampleForm from "./pages/Ui/textinput";
import Home_page from "./pages/home/home_page";
import Motor_insurance_quote from "./pages/Motor_insurance_quote/Motor_insurance_quote";
import Motor_insurance_quote_landing from "./pages/Motor_insurance_quote/Motor_insurance_quote_landing";
import About_page from "./pages/about/about_page";
import SuperBoard_page from "./pages/about/superboard_page";
import Contact_page from "./pages/contact/contactus_page";
import Fire_Specials_Service_Landing from "./pages/services/Fire_Specials_Service_Landing/Fire_Specials_Service_Landing";
import Motor_Insurance_Service_Landing from "./pages/services/Motor_Insurance_Service_Landing/Motor_Insurance_Service_Landing";
import Burglary_Theft_Service_Landing from "./pages/services/Burglary_Theft_Service_Landing/Burglary_Theft_Service_Landing";
import Plant_Service_Landing from "./pages/services/Plant_Service_Landing/Plant_Service_Landing";
import Public_Liability_Service_Landing from "./pages/services/Public_Liability_Service_Landing/Public_Liability_Service_Landing";
import Money_Service_Landing from "./pages/services/Money_Service_Landing/Money_Service_Landing";
import Claims_Management_Service_Landing from "./pages/services/Claims_Management_Service_Landing/Claims_Management_Service_Landing ";
import Group_Personal_Insurance_Service_Landing from "./pages/services/Group_Personal_Insurance_Service_Landing/Group_Personal_Insurance_Service_Landing";
import Occupiers_Liability_Service_Landing from "./pages/services/Occupiers_Liability_Service_Landing/Occupiers_Liability_Service_Landing";
import Privacy_policy from "./pages/privacy_policy/privacy_policy";
import Claims_page from "./pages/claims/claims_page";
import Machinery_Insurance_Service_Landing from "./pages/services/Machinery_Insurance_Service_Landing/Machinery_Insurance_Service_Landing ";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import OtpVerification from "./pages/auth/OtpVerification";
import ForgotPassword from "./pages/auth/forgotPassword";
import ResetPassword from "./pages/auth/resetPassword";
import DashboardHomePage from "./pages/Dashboard/DashboardHome/DashboardHome";
import DashboardCertificatesPage from "./pages/Dashboard/DashboardCertificates/DashboardCertificates";
import DashboardClaimsPage from "./pages/Dashboard/DashboardClaims/DashboardClaims";
import ClaimForm from "./components/claimsPage/MakeClaim";
import AdminHome from "./pages/Admin/AdminHome/AdminHome";
import AdminPages from "./pages/Admin/AdminPages/AdminPages";
import AdminAddPage from "./pages/Admin/AdminPages/AdminAddPage";
import ServiceDetailPage from "./components/services/ServiceDetailPage";
import AdminEditPage from "./pages/Admin/AdminPages/AdminEditPage";
import BlogCategories from "./pages/Admin/Blog/BlogCategory";
import BlogPosts from "./pages/Admin/Blog/BlogPost";
import BlogPage from "./components/BlogPage/Blog";
import BlogDetail from "./components/BlogPage/BLogDetail";
import AdminContactPage from "./pages/Admin/AdminPages/AdminContactPage/AdminContactPage";
import AdminBoard from "./pages/Admin/AdminBoard/Board";
import TeamMembers from "./pages/Admin/Team/Team";
import { NavigationProvider } from "./components/Ui/NavigationContext";
import AdminSignupPage from "./components/AdminAuth/AdminSignup";
import AdminOtpVerificationPage from "./components/AdminAuth/AdminOTP";
import AdminLoginPage from "./components/AdminAuth/AdminLogin";
import { AdminForgotPasswordEmail } from "./components/AdminAuth/AdminForgetPwdMail";
import AdminResetPassword from "./components/AdminAuth/AdminResetPwd";
import AdminChangePassword from "./components/AdminAuth/AdminChangepwd";
import AdminUserDetails from "./pages/Admin/AdminHome/AdminProfile";
import { AllUserPayments } from "./pages/Admin/AdminPages/UserPayments";
import PaymentDetail from "./pages/Admin/AdminPages/UserPaymentDetail";
import { PageVisibilityProvider } from "./components/Ui/PageContext";
import SiteMaintenancePage from "./components/Ui/MaintenancePage";
import ProtectedRoute from "./components/Ui/PageMaintenance";
import AdminPackageCategories from "./pages/Admin/AdminPackages/AdminPackages";
import AdminVehicleManagement from "./pages/Admin/AdminVehicles/AdminVehicles";
import DashboardPaymentPage from "./pages/Dashboard/DashboardPayment/DashboardPayment";
import AdminFeedback from "./pages/Admin/AdminFeedback/AdminFeedback";
import AdminManagement from "./pages/Admin/AdminHome/AdminDeletePage";
import AdminSlider from "./pages/Admin/AdminPages/AdminSLider";
import PageAnalytics from "./pages/Admin/PageAnalytics/PageAnalytics";

function App() {
  return (
    <PageVisibilityProvider>
      <NavigationProvider>
        <main>
          <>
            <Routes>
              {/* Maintenance Page */}
              <Route
                path="/site-maintenance"
                element={<SiteMaintenancePage />}
              />

              {/* Protected Public Pages */}
              <Route
                path="/"
                element={<ProtectedRoute path="/" element={<Home_page />} />}
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute path="/about" element={<About_page />} />
                }
              />
              <Route
                path="/about/superboard"
                element={
                  <ProtectedRoute
                    path="/about/superboard"
                    element={<SuperBoard_page />}
                  />
                }
              />
              <Route
                path="/contact"
                element={
                  <ProtectedRoute path="/contact" element={<Contact_page />} />
                }
              />
              <Route
                path="/blog"
                element={<ProtectedRoute path="/blog" element={<BlogPage />} />}
              />
              <Route
                path="/blog/:id"
                element={
                  <ProtectedRoute path="/blog/:id" element={<BlogDetail />} />
                }
              />
              <Route
                path="/privacy-policy"
                element={
                  <ProtectedRoute
                    path="/privacy-policy"
                    element={<Privacy_policy />}
                  />
                }
              />
              <Route
                path="/claims"
                element={
                  <ProtectedRoute path="/claims" element={<Claims_page />} />
                }
              />
              <Route
                path="/make-a-claim"
                element={
                  <ProtectedRoute
                    path="/make-a-claim"
                    element={<ClaimForm />}
                  />
                }
              />
              <Route
                path="/motor-insurance-quote"
                element={
                  <ProtectedRoute
                    path="/motor-insurance-quote"
                    element={<Motor_insurance_quote_landing />}
                  />
                }
              />
              <Route
                path="/motor-insurance-quote-form"
                element={
                  <ProtectedRoute
                    path="/motor-insurance-quote-form"
                    element={<Motor_insurance_quote />}
                  />
                }
              />

              {/* Protected Services Pages */}
              <Route
                path="/services"
                element={
                  <ProtectedRoute
                    path="/services"
                    element={<Motor_Insurance_Service_Landing />}
                  />
                }
              />
              <Route
                path="/services/fire-specials-insurance"
                element={
                  <ProtectedRoute
                    path="/services/fire-specials-insurance"
                    element={<Fire_Specials_Service_Landing />}
                  />
                }
              />
              <Route
                path="/services/motor-insurance"
                element={
                  <ProtectedRoute
                    path="/services/motor-insurance"
                    element={<Motor_Insurance_Service_Landing />}
                  />
                }
              />
              <Route
                path="/services/burglary-theft-insurance"
                element={
                  <ProtectedRoute
                    path="/services/burglary-theft-insurance"
                    element={<Burglary_Theft_Service_Landing />}
                  />
                }
              />
              <Route
                path="/services/plant-insurance"
                element={
                  <ProtectedRoute
                    path="/services/plant-insurance"
                    element={<Plant_Service_Landing />}
                  />
                }
              />
              <Route
                path="/services/public-liability-insurance"
                element={
                  <ProtectedRoute
                    path="/services/public-liability-insurance"
                    element={<Public_Liability_Service_Landing />}
                  />
                }
              />
              <Route
                path="/services/money-insurance"
                element={
                  <ProtectedRoute
                    path="/services/money-insurance"
                    element={<Money_Service_Landing />}
                  />
                }
              />
              <Route
                path="/services/machinery-insurance"
                element={
                  <ProtectedRoute
                    path="/services/machinery-insurance"
                    element={<Machinery_Insurance_Service_Landing />}
                  />
                }
              />
              <Route
                path="/services/claims-management"
                element={
                  <ProtectedRoute
                    path="/services/claims-management"
                    element={<Claims_Management_Service_Landing />}
                  />
                }
              />
              <Route
                path="/services/group-personal-insurance"
                element={
                  <ProtectedRoute
                    path="/services/group-personal-insurance"
                    element={<Group_Personal_Insurance_Service_Landing />}
                  />
                }
              />
              <Route
                path="/services/occupiers-liability-insurance"
                element={
                  <ProtectedRoute
                    path="/services/occupiers-liability-insurance"
                    element={<Occupiers_Liability_Service_Landing />}
                  />
                }
              />
              <Route
                path="/services/view/:serviceId"
                element={
                  <ProtectedRoute
                    path="/services/view/:serviceId"
                    element={<ServiceDetailPage />}
                  />
                }
              />

              {/* UI Testing Routes - Not Protected */}
              <Route path="/ui/button" element={<ButtonT />} />
              <Route path="/ui/textinput" element={<ExampleForm />} />

              {/* Auth Routes - Not Protected */}
              <Route path="/auth/signin" element={<Signin />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/otp" element={<OtpVerification />} />
              <Route
                path="/auth/forgot-password"
                element={<ForgotPassword />}
              />
              <Route path="/auth/reset-password" element={<ResetPassword />} />

              {/* User Dashboard Routes - Not Protected */}
              <Route path="/dashboard/home" element={<DashboardHomePage />} />
              <Route
                path="/dashboard/certificates"
                element={<DashboardCertificatesPage />}
              />
              <Route
                path="/dashboard/claims"
                element={<DashboardClaimsPage />}
              />
              <Route
                path="/dashboard/payment"
                element={<DashboardPaymentPage />}
              />

              {/* Admin Routes - Not Protected */}
              <Route path="/admin/dashboard/home" element={<AdminHome />} />
              <Route
                path="/admin/dashboard/profile"
                element={<AdminUserDetails />}
              />
              <Route path="/admin/dashboard/pages" element={<AdminPages />} />
              <Route
                path="/admin/dashboard/add-page"
                element={<AdminAddPage />}
              />
              <Route
                path="/admin/dashboard/edit-page/:serviceId"
                element={<AdminEditPage />}
              />
              <Route
                path="/admin/dashboard/contact-page"
                element={<AdminContactPage />}
              />
              <Route
                path="/admin/dashboard/home-slider"
                element={<AdminSlider />}
              />
              <Route
                path="/admin/dashboard/user-payments"
                element={<AllUserPayments />}
              />
              <Route
                path="/admin/dashboard/user-payment/:id"
                element={<PaymentDetail />}
              />
              <Route
                path="/admin/dashboard/packages"
                element={<AdminPackageCategories />}
              />
              <Route
                path="/admin/dashboard/vehicle"
                element={<AdminVehicleManagement />}
              />
              <Route
                path="/admin/dashboard/feedback"
                element={<AdminFeedback />}
              />
              <Route path="/admin/delete-admin" element={<AdminManagement />} />

              {/* Admin Auth Routes */}
              <Route
                path="/admin/dashboard/auth/signup"
                element={<AdminSignupPage />}
              />
              <Route
                path="/admin/dashboard/auth/signin"
                element={<AdminLoginPage />}
              />
              <Route
                path="/admin/dashboard/auth/reset-pwd"
                element={<AdminForgotPasswordEmail />}
              />
              <Route
                path="/admin/dashboard/auth/reset-pwd-verification"
                element={<AdminResetPassword />}
              />
              <Route
                path="/admin/dashboard/auth/change-pwd"
                element={<AdminChangePassword />}
              />
              <Route
                path="/admin/dashboard/auth/otp-verification"
                element={<AdminOtpVerificationPage />}
              />
              <Route
                path="/admin/dashboard/auth/admin-signin-verification"
                element={<AdminOtpVerificationPage />}
              />

              {/* Admin Blog Routes */}
              <Route
                path="/admin/dashboard/blog"
                element={<BlogCategories />}
              />
              <Route
                path="/admin/dashboard/blog-post"
                element={<BlogPosts />}
              />
              <Route path="/admin/dashboard/board" element={<AdminBoard />} />
              <Route path="/admin/dashboard/team" element={<TeamMembers />} />

              <Route
                path="/admin/dashboard/page-analytics"
                element={<PageAnalytics />}
              />

              {/* Fallback Redirects */}
              <Route
                path="/dashboard/*"
                element={<Navigate to="/dashboard/home" replace />}
              />
              <Route
                path="/admin/*"
                element={<Navigate to="/admin/home/dashboard" replace />}
              />
              <Route
                path="/auth/*"
                element={<Navigate to="/auth/signin" replace />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </>
        </main>
      </NavigationProvider>
    </PageVisibilityProvider>
  );
}

export default App;
