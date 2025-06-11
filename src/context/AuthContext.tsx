import { createContext } from "react";

import type { UserSession } from "../types/UserSession";

type AuthContextProps = {
    user: UserSession | null;
    changeUser: (token: string | null) => void;
};

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    changeUser: () => {},
});
