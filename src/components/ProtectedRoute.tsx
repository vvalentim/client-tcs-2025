import { Navigate, Outlet } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { Navbar } from "./Navbar";

export function ProtectedRoute() {
    const auth = useAuth();

    return auth.user === null ? (
        <Navigate to="/auth/login" />
    ) : (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}
