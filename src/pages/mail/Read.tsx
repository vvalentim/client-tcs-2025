import { useNavigate, useParams } from "react-router";
import { mailApi } from "../../api/mailApi";
import { useQuery } from "@tanstack/react-query";
import { LayoutInner } from "../../components/LayoutInner";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export function Read() {
    const navigate = useNavigate();
    const { mailId } = useParams();

    const { data: mailData } = useQuery({
        queryKey: ["mails", mailId],
        queryFn: async () => mailApi.put(`/emails/${mailId}`),
        enabled: !!mailId,
    });

    return (
        <LayoutInner>
            <div className="flex flex-col h-full bg-neutral-700 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between h-12 px-4">
                    {/* Actions */}
                    <div>
                        <div
                            className="flex items-center gap-2 cursor-pointer select-none"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeftIcon className="text-neutral-400 size-5" />
                            <span className="text-sm text-white">Voltar</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-1 bg-white p-4">
                    <div>{JSON.stringify(mailData?.data.email)}</div>
                </div>
            </div>
        </LayoutInner>
    );
}
