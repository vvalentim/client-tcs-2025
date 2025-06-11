import { createBrowserRouter } from "react-router";

import { GuestRoute } from "./components/GuestRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { Login, Signup } from "./pages/auth";
import { Inbox, Account } from "./pages/mail";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: ProtectedRoute,
        children: [
            {
                index: true,
                Component: Inbox,
            },
            {
                path: "account",
                Component: Account,
            },
        ],
    },
    {
        path: "/auth",
        Component: GuestRoute,
        children: [
            {
                index: true,
                Component: Login,
            },
            {
                path: "login",
                Component: Login,
            },
            {
                path: "signup",
                Component: Signup,
            },
        ],
    },
]);
