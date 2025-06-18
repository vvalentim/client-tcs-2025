import { mailApi } from "../mailApi";

export const inboxQuery = () => ({
    queryKey: ["inbox"],
    queryFn: () => mailApi.get("/emails"),
});
