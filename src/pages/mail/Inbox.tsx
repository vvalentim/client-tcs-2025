import { useQuery } from "@tanstack/react-query";
import { userProfileQuery } from "../../api/queries/userProfileQuery";

export function Inbox() {
    const { data: queryResponse, isSuccess } = useQuery(userProfileQuery());

    return (
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-12 lg:px-8 bg-white">
            <h1>Inbox</h1>
        </div>
    );
}
