import { useQuery } from "@tanstack/react-query";
import { inboxQuery, userProfileQuery } from "../../api/queries";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { LayoutInner } from "../../components/LayoutInner";
import { MailRow } from "../../components/MailRow";
import type { Mail } from "../../types/Mail";

export function Inbox() {
    const { data: user } = useQuery(userProfileQuery());
    const userEmail = user?.data?.usuario?.email;

    const { data: inbox } = useQuery({
        ...inboxQuery(),
        enabled: !!userEmail,
    });

    // const mails =
    //     inbox?.data?.emails.filter(
    //         (mail: Mail) => mail.emailRemetente !== userEmail,
    //     ) || [];

    const mails = inbox?.data?.emails || [];

    return (
        <LayoutInner>
            <div className="flex flex-col h-full bg-neutral-700 rounded-xl overflow-hidden">
                <div className="flex items-center h-12 px-4">
                    {/* Actions */}
                    <div className="flex items-center gap-2 cursor-pointer select-none">
                        <ArrowPathIcon className="text-neutral-400 size-5" />
                        <span className="text-sm text-white">Atualizar</span>
                    </div>
                </div>

                <div className="flex flex-col border-t-1 border-neutral-500">
                    <ul className="divide-y divide-neutral-500">
                        {mails.map((mail: Mail, index: number) => (
                            <MailRow mail={mail} key={`mail-row-${index}`} />
                        ))}
                    </ul>
                </div>
            </div>
        </LayoutInner>
    );
}
