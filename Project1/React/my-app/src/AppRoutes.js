import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import VendorManagement from './pages/VendorManagement/VendorManagement';
import SignUp from './components/Contents/VendorManagement/SignUp';
import LogIn from './pages/Auth/LogIn';
import VisitorManagement from './pages/VisitorManagement/VisitorManagement';
import VehicleRegister from "./components/Contents/EntryManagement/VehicleRegister";
import Search from "./components/Contents/VendorManagement/Search";
import VisitorRegister from "./components/Contents/EntryManagement/VisitorRegister";
import SideNavBar from "./components/SideNavBar/SideNavBar";
import PurchaseStatus from "./components/Contents/PurchaseStatus/PurchaseStatus";
import EntryStatus from "./components/Contents/EntryManagement/EntryStatus";
import PurchaseRateRegistration from "./components/Contents/PurchaseStatus/PurchaseRateRegistration";
import PurchaseForm from "./components/Contents/PurchaseStatus/PurchaseForm";
import Vendor from "./pages/Vendor/Vendor";
import ErrorPage from "./pages/Auth/ErrorPage";

function Layout() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" && <SideNavBar />}
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />

        {/* admin 전용 라우트 */}
        <Route
          path="/VendorManagement"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <VendorManagement />
            </ProtectedRoute>
          }
        >
          <Route path="signup" element={<SignUp />} />
          <Route path="Search" element={<Search />} />
        </Route>

        <Route
          path="/visitormanagement"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <VisitorManagement />
            </ProtectedRoute>
          }
        >
          <Route path="entry-status" element={<EntryStatus />} />
          <Route path="sales-overview" element={<PurchaseStatus />} />
          <Route path="visitor-register" element={<VisitorRegister />} />
          <Route path="vehicle-register" element={<VehicleRegister />} />
          <Route path="scrap-buying-rate" element={<PurchaseRateRegistration />} />
          <Route path="PurchaseForm" element={<PurchaseForm />} />
        </Route>

        {/* vendor 전용 라우트 */}
        <Route
          path="/Vendor"
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <Vendor />
            </ProtectedRoute>
          }
        >
          <Route path="vehicle-register" element={<VehicleRegister />} />
        </Route>

        <Route path="/error" element={<ErrorPage />} />

      </Routes>
    </>
  );
}

const AppRoutes = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default AppRoutes;
