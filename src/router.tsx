import { createBrowserRouter } from "react-router";

import { GuestRoute } from "./components/GuestRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { Login, Signup } from "./pages/auth";
import { Inbox, Account, Drafts, Sent, Compose, Read } from "./pages/mail";

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
                path: "drafts",
                Component: Drafts,
            },
            {
                path: "sent",
                Component: Sent,
            },
            {
                path: "account",
                Component: Account,
            },
            {
                path: "compose/:draftId?",
                Component: Compose,
            },
            {
                path: "read/:mailId?",
                Component: Read,
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
