import { mailApi } from "../mailApi";

export const userProfileQuery = () => ({
    queryKey: ["userProfile"],
    queryFn: () => mailApi.get("/usuarios"),
});
