import { Suspense, lazy, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./pages/BackOffice/scenes/global/Sidebar";
import Topbar from "./pages/BackOffice/scenes/global/Topbar";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from './components/AdminRoute';
import EmailVerifiedPage from './pages/FrontOffice/EmailVerifiedPage';
import { QueryClient, QueryClientProvider } from 'react-query';



// FrontOffice pages (Tailwind-based)
import Home from "./pages/FrontOffice/Home";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import CommunityGuidelines from "./pages/FrontOffice/CommunityGuidelines";
import LoggedIn from "./pages/FrontOffice/LoggedIn";
import Profile from "./pages/FrontOffice/Profile";
import ManageAnnouncements from "./pages/BackOffice/scenes/team/ManageAnnouncements";
import ManageReservation from "./pages/BackOffice/scenes/team/ManageReservation";
import AssociationAnnouncements from "./components/AssociationProfile/AssociationAnnouncements";
import RegistrationGuide from "./pages/help/RegistrationGuide";
import AccountTypes from "./pages/help/AccountTypes";
import BusinessGuide from "./pages/BusinessGuide";
import MarketplaceHelp from "./pages/MarketplaceHelp";


import SafetyGuidelines from "./pages/SafetyGuidelines";
import DonationChecklist from "./pages/DonationChecklist";
import ImpactMetrics from "./pages/ImpactMetrics";
import ApprovedFoods from "./pages/ApprovedFoods";

import { SocketProvider } from "./context/SocketContext";
;




// Create a client
const queryClient = new QueryClient();

import BusinessReviews from "./pages/FrontOffice/BusinessReviews";


// Lazy-loaded components
const SignUp = lazy(() => import("./components/SignUpForm"));
const Blog = lazy(() => import("./pages/FrontOffice/Blog"));
const Contact = lazy(() => import("./pages/FrontOffice/Contact"));
const FAQ = lazy(() => import("./pages/FrontOffice/FAQ"));
const About = lazy(() => import("./components/About"));
const Review = lazy(() => import("./components/Review"));
const Announcements = lazy(() => import("./pages/FrontOffice/Announcements"));
const AddAnnouncement = lazy(() => import("./pages/FrontOffice/AddAnnouncement"));
const Dashboard = lazy(() => import("./pages/BackOffice/scenes/dashboard"));
const Team = lazy(() => import("./pages/BackOffice/scenes/team"));
const Contacts = lazy(() => import("./pages/BackOffice/scenes/contacts"));
const Invoices = lazy(() => import("./pages/BackOffice/scenes/invoices"));
const Form = lazy(() => import("./pages/BackOffice/scenes/form"));
const Bar = lazy(() => import("./pages/BackOffice/scenes/bar"));
const Pie = lazy(() => import("./pages/BackOffice/scenes/pie"));
const Line = lazy(() => import("./pages/BackOffice/scenes/line"));
const FAQB = lazy(() => import("./pages/BackOffice/scenes/faq"));
const Calendar = lazy(() => import("./pages/BackOffice/scenes/calendar/calendar"));
const Geography = lazy(() => import("./pages/BackOffice/scenes/geography"));
const ReservationPage = lazy(() => import("./pages/FrontOffice/ReservationPage"));


//  Association 
  const AssociationProfile = lazy(() => import("./components/AssociationProfile/AssociationProfile"));
  const AssociationAccount = lazy(() => import("./components/AssociationProfile/AssociationAccount"));
  const OffersManagement = lazy(() => import("./components/AssociationProfile/OffersManagement"));
  const DonationPreferences = lazy(() => import("./components/AssociationProfile/DonationPreferences"));
  const AssociationSettings = lazy(() => import("./components/AssociationProfile/AssociationSettings"));
  const AddDonationNeed = lazy(() =>
  import("./pages/FrontOffice/AddDonationNeed")
);
  const DonationNeeds = lazy(() => import("./pages/FrontOffice/DonationNeeds"));
  const MyDonationNeeds = lazy(() =>
  import("./components/AssociationProfile/MyDonationNeeds")
);
const BusinessReviewPage = lazy(() => import("./pages/FrontOffice/BusinessReviewPage"));
const UserChatList = lazy(() =>
  import("./components/AssociationProfile/UserChatList")
);

const UserChatPage = lazy(() =>
  import("./components/AssociationProfile/UserChatPage")
);

// FrontOffice Layout (Tailwind-based)
const FrontOfficeLayout = () => {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white">
      <Navbar />
      <main className="flex-grow pt-16"> {/* Added pt-16 to account for fixed navbar */}
        <Routes>
          <Route path="/" element={<Home />} />



          
          <Route path="/create-account" element={<SignUp />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/help">
            <Route path="registration" element={<RegistrationGuide />} />
            <Route path="account-types" element={<AccountTypes />} />
          </Route>



          <Route path="/business-guide" element={<BusinessGuide />} />
          <Route path="/marketplace-help" element={<MarketplaceHelp />} />
          <Route path="/safety" element={<SafetyGuidelines />} />
          <Route path="/donation-checklist" element={<DonationChecklist />} />
          <Route path="/impact" element={<ImpactMetrics />} />
          <Route path="/approved-foods" element={<ApprovedFoods />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/review" element={<Review />} />
          <Route path="/community-guidelines" element={<CommunityGuidelines />} />

          
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/reservations" element={
            <PrivateRoute>
              <Profile initialTab="reservations" />
            </PrivateRoute>
          } />


          <Route path="/announcements" element={<Announcements />} />
          <Route path="/add-announcement" element={<AddAnnouncement />} />
          <Route path="/announcements/:id/reserve" element={<ReservationPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/email-verified" element={<EmailVerifiedPage />} />
          <Route path="/business-reviews" element={<BusinessReviews />} />
          <Route path="/business/:id" element={<BusinessReviewPage />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/logged-in" element={<LoggedIn />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/add-announcement" element={<AddAnnouncement />} />


            





      

            {/* Association Routes */}
            
            <Route path="/add-donation-need" element={<AddDonationNeed />} />
            <Route path="/my-donation-needs" element={<MyDonationNeeds />} />
            <Route path="/donation-needs" element={<DonationNeeds />} />
            <Route path="/association-profile" element={<AssociationProfile />} />
            <Route path="/association/account" element={<AssociationAccount />} />
            <Route path="/association/preferences" element={<DonationPreferences />} />
      
            <Route path="/association/offers" element={<OffersManagement />} />
            <Route path="/association/settings" element={<AssociationSettings />} />
            <Route path="/association/announcements" element={<AssociationAnnouncements />} />
            <Route path="/messages" element={<UserChatList />} />
            <Route path="/chat/:userId" element={<UserChatPage/>} />    
          
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// BackOffice Layout (Material-UI-based)
const BackOfficeLayout = ({ theme }) => {
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Sidebar isSidebar={isSidebar} />
        <main className="content">
          <Topbar setIsSidebar={setIsSidebar} />
          <Routes>
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } />
            <Route path="/admin/team" element={
              <AdminRoute>
                <Team />
              </AdminRoute>
            } />
            <Route path="/admin/announcements-backoffice" element={
              <AdminRoute>
                <ManageAnnouncements />   
              </AdminRoute>
            } />
            <Route path="/admin/reservationbackoffice" element={
              <AdminRoute>
                <ManageReservation />   
              </AdminRoute>
            } />
            <Route path="/admin/contacts" element={
              <AdminRoute>
                <Contacts />
              </AdminRoute>
            } />
            <Route path="/admin/invoices" element={
              <AdminRoute>
                <Invoices />
              </AdminRoute>
            } />
            <Route path="/admin/form" element={
              <AdminRoute>
                <Form />
              </AdminRoute>
            } />
            <Route path="/admin/bar" element={
              <AdminRoute>
                <Bar />
              </AdminRoute>
            } />
            <Route path="/admin/pie" element={
              <AdminRoute>
                <Pie />
              </AdminRoute>
            } />
            <Route path="/admin/line" element={
              <AdminRoute>
                <Line />
              </AdminRoute>
            } />
            <Route path="/admin/faq" element={
              <AdminRoute>
                <FAQB />
              </AdminRoute>
            } />
            <Route path="/admin/calendar" element={
              <AdminRoute>
                <Calendar />
              </AdminRoute>
            } />
            <Route path="/admin/geography" element={
              <AdminRoute>
                <Geography />
              </AdminRoute>
            } />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
};

const App = () => {
  const [theme, colorMode] = useMode();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
              <SocketProvider>

          <ColorModeContext.Provider value={colorMode}>
            <CssBaseline/>
            <Suspense fallback={<LoadingSpinner />}>
              {isAdminRoute ? (
                <BackOfficeLayout theme={theme} />
              ) : (
                <FrontOfficeLayout />
              )}
            </Suspense>
          </ColorModeContext.Provider>
                </SocketProvider>

      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;