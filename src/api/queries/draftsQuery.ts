import { mailApi } from "../mailApi";

export const draftsQuery = () => ({
    queryKey: ["drafts"],
    queryFn: () => mailApi.get("/rascunhos"),
});
