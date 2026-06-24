import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../layouts/MainLayout";
import RoutesList from "./routesList";


const Home = lazy(() => import("../Pages/Home/Home"));
const Login = lazy(() => import("../Pages/auth/Login"));
const Signup = lazy(() => import("../Pages/auth/Signup"));
const CountryPage = lazy(() => import("../Pages/Country/Country"));
const ProfilePage = lazy(() => import("../Pages/Profile/Profile"));
const TripPlan = lazy(() => import("../Pages/trip-plan/TripPlan"));
const Subscription = lazy(() => import("../Pages/subscription/Subscriptionpage"));
const PremiumPage = lazy(() => import("../Pages/premium/Premium"));

export default function AppRoutes() {
    return (
        <Routes>
            {/* Home أول صفحة */}
            <Route path="/" element={<Navigate to={RoutesList.Home} replace />} />

            {/* Authentication */}
            <Route path={RoutesList.Login} element={<Login />} />
            <Route path={RoutesList.Signup} element={<Signup />} />

            <Route element={<Layout />}>
                <Route path={RoutesList.Home} element={<Home />} />
                <Route path={RoutesList.Profile} element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                } />
                <Route path={RoutesList.Premium} element={
                    <ProtectedRoute>
                        <PremiumPage />
                    </ProtectedRoute>
                } />
                                 
  <Route path={RoutesList.TripPlanRoute} element={
     <ProtectedRoute>
    <TripPlan />
               </ProtectedRoute>
    } />       

                <Route path={RoutesList.CountryRoute} element={<CountryPage />} />
                <Route path={RoutesList.Subscription} element={<Subscription />} />
                <Route path={RoutesList.TripPlannedRoute} element={<TripPlan />} />
            </Route>

            <Route path="*" element={<Navigate to={RoutesList.Home} replace />} />
        </Routes>)
}