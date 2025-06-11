import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components/AuthProvider";
import { router } from "./router";

import "./index.css";

const root = document.getElementById("root");
const queryClient = new QueryClient();

// Shouldn't store credentials/tokens on storage on a real project
const storageToken = sessionStorage.getItem("auth_token") || "";

createRoot(root!).render(
    <QueryClientProvider client={queryClient}>
        <AuthProvider storageToken={storageToken}>
            <RouterProvider router={router} />
        </AuthProvider>
    </QueryClientProvider>,
);
