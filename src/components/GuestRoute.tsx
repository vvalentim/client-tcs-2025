import { Navigate, Outlet } from "react-router";

import { useAuth } from "../hooks/useAuth";

export function GuestRoute() {
    const auth = useAuth();

    return auth.user !== null ? <Navigate to="/" /> : <Outlet />;
}
