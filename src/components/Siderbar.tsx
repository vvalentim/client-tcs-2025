import {
    InboxIcon,
    PaperAirplaneIcon,
    PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";

import { NavLink, useNavigate } from "react-router";

const navigation = [
    { name: "Caixa de entrada", to: "/", icon: InboxIcon },
    // { name: "Enviados", to: "/sent", icon: PaperAirplaneIcon },
    { name: "Rascunhos", to: "/drafts", icon: PencilSquareIcon },
];

export function Sidebar() {
    const navigate = useNavigate();

    return (
        <aside className="flex flex-col flex-1 w-full max-w-56 py-4 px-2">
            <div
                className="flex items-center p-3 mb-4 space-x-2 text-white bg-blue-600 rounded-lg cursor-pointer select-none"
                onClick={() => navigate("/compose")}
            >
                <PencilIcon className="size-6" />
                <span className="font-semibold">Escrever</span>
            </div>
            <nav className="flex flex-col gap-2">
                {navigation.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.to}
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center space-x-2 px-4 py-2 rounded-sm text-sm text-white bg-neutral-700"
                                    : "flex items-center space-x-2 px-4 py-2 rounded-sm text-sm text-white hover:bg-neutral-700"
                            }
                        >
                            <Icon className="size-5" />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}
