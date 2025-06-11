import { useMutation } from "@tanstack/react-query";
import { mailApi } from "../api/mailApi";
import { useAuth } from "../hooks/useAuth";

export function LogoutButton() {
    const auth = useAuth();

    const submitMutation = useMutation({
        mutationFn: () => mailApi.post("/logout"),
        onSettled: () => auth.changeUser(null),
    });

    return (
        <button type="button" onClick={() => submitMutation.mutate()}>
            Logout
        </button>
    );
}
