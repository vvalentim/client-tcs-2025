import { Checkbox } from "@headlessui/react";
import { useState } from "react";

import type { Mail } from "../types/Mail";
import { useNavigate } from "react-router";

type RowMode = "mail" | "draft";

const listItemClassName =
    "flex items-center h-12 px-4 py-2 gap-2 text-sm font-semibold text-white shadow-grey-500/50 hover:shadow-md cursor-pointer";

export function MailRow({
    mail,
    mode = "mail",
}: {
    mail: Mail;
    mode?: RowMode;
}) {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(false);

    const open = () => {
        if (mode === "mail") {
            return navigate(`/read/${mail.emailId}`);
        }

        return navigate(`/compose/${mail.rascunhoId}`);
    };

    return (
        <li
            className={
                mode === "mail" && mail.status === "lido"
                    ? `${listItemClassName} bg-neutral-500`
                    : listItemClassName
            }
            onClick={open}
        >
            <div>
                <Checkbox
                    checked={selected}
                    onChange={setSelected}
                    className="group block size-3 rounded-xs box-content border-2 border-neutral-400 bg-transparent"
                >
                    <svg
                        className="stroke-neutral-400 opacity-0 group-data-checked:opacity-100"
                        viewBox="0 0 14 14"
                        fill="none"
                    >
                        <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Checkbox>
            </div>

            <div className="w-full max-w-32">
                {mode === "mail" ? mail.emailRemetente : mail.emailDestinatario}
            </div>

            <div className="w-full max-w-1/3 truncate">{mail.assunto}</div>

            <div className="w-full truncate text-zinc-400 font-medium">
                {mail.corpo}
            </div>

            {mode === "mail" && (
                <div className="text-zinc-400 text-xs font-medium">
                    {mail.dataEnvio}
                </div>
            )}
        </li>
    );
}
