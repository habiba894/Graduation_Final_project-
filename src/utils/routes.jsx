import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../layouts/MainLayout";
import RoutesList from "./routesList";


const Home = lazy(() => import("../pages/home/Home"));
const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const CountryPage = lazy(() => import("../pages/country/Country"));
const ProfilePage = lazy(() => import("../pages/profile/Profile"));
const TripPlan = lazy(() => import("../pages/trip-plan/TripPlan"));
const Subscription = lazy(() => import("../pages/subscription/Subscriptionpage"));
const PremiumPage = lazy(() => import("../pages/premium/Premium"));

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
                <Route path={RoutesList.TripPlanRoute} element={<TripPlan />} />
                <Route path={RoutesList.CountryRoute} element={<CountryPage />} />
                <Route path={RoutesList.Subscription} element={<Subscription />} />
                <Route path={RoutesList.TripPlannedRoute} element={<TripPlan />} />
            </Route>

            <Route path="*" element={<Navigate to={RoutesList.Home} replace />} />
        </Routes>)
}