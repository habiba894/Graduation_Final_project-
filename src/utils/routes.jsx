import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../layouts/MainLayout";
import RoutesList from "./routesList";


const Home = lazy(() => import("../pages/home/Home"));
const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const CountryPage = lazy(() => import("../pages/country/Country"));
const ProfilePage = lazy(() => import("../pages/profile/Profile"));
const TripPlan = lazy(() => import("../pages/trip-plan/TripPlan"));
const Subscription = lazy(() => import("../pages/subscription/Subscriptionpage"));

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
                <Route path={RoutesList.TripPlan} element={<TripPlan />} />
                <Route path={RoutesList.Profile} element={<ProfilePage />} />
                <Route path={RoutesList.Country} element={<CountryPage />} />
                <Route path={RoutesList.Subscription} element={<Subscription />} />
            </Route>

            <Route path="*" element={<Navigate to={RoutesList.Home} replace />} />
        </Routes>)
}