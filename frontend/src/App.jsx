import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AgriOfficeLayout from "./components/agriculture_office/AgriOfficeLayout";
import AgriOfficeDashboard from "./pages/agriculture_office/AgriOfficeDashboard";
import FarmerLayout from "./components/farmer/FarmerLayout";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import "./index.css";
import "./App.css";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />

                <Route
                    path="/agriculture_office"
                    element={<AgriOfficeLayout />}
                >
                    <Route path="dashboard" element={<AgriOfficeDashboard />} />
                </Route>

                <Route path="/farmer" element={<FarmerLayout />}>
                    <Route path="dashboard" element={<FarmerDashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
