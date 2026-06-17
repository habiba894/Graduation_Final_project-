import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
    return (
        <>
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
                <Navbar />
            </div>

            <main className="pt-14">
                <Outlet />
            </main>
        </>
    );
}