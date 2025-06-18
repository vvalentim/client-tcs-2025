import { useQuery } from "@tanstack/react-query";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { draftsQuery } from "../../api/queries/draftsQuery";
import { LayoutInner } from "../../components/LayoutInner";
import { MailRow } from "../../components/MailRow";
import type { Mail } from "../../types/Mail";

export function Drafts() {
    const { data: draftsResponse } = useQuery(draftsQuery());

    const drafts = draftsResponse?.data?.rascunhos || [];

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
                        {drafts.map((draft: Mail, index: number) => (
                            <MailRow
                                mail={draft}
                                mode="draft"
                                key={`mail-row-${index}`}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </LayoutInner>
    );
}
