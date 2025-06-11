import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";

import { mailApi } from "../api/mailApi";
import { AuthContext } from "../context/AuthContext";
import { parseJwt } from "../helpers/parseJwt";
import type { UserSession } from "../types/UserSession";

type AuthProviderProps = PropsWithChildren & {
    storageToken: string;
};

export function AuthProvider({ children, storageToken }: AuthProviderProps) {
    const [user, setUser] = useState<UserSession | null>(null);

    const changeUser = useCallback((token: string | null) => {
        let currentUserSession: UserSession | null = null;

        if (token) {
            const payload = parseJwt(token) as
                | (UserSession & { sub: string })
                | null;

            sessionStorage.setItem("auth_token", token);

            mailApi.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`;

            currentUserSession = {
                token,
                id: payload?.id || payload?.sub || "",
                email: payload?.email || "",
            };
        } else {
            sessionStorage.removeItem("auth_token");
            delete mailApi.defaults.headers.common["Authorization"];
        }

        setUser(currentUserSession);
    }, []);

    const contextValue = useMemo(
        () => ({ user, changeUser }),
        [user, changeUser],
    );

    useEffect(() => {
        changeUser(storageToken);
    }, [storageToken, changeUser]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}
