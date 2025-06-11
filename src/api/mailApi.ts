import axios from "axios";

export const mailApi = axios.create({
    baseURL: import.meta.env.VITE_MAIL_API_BASE_URL,
    timeout: 1000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});
