import { useNavigate, useParams } from "react-router";
import { mailApi } from "../../api/mailApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutInner } from "../../components/LayoutInner";
import { ArrowLeftIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AxiosError } from "axios";

type ReplyForm = {
    assunto: string;
    emailDestinatario: string;
    corpo: string;
};

export function Read() {
    const [isReplying, setIsReplying] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mailId } = useParams();

    const { data: mailData } = useQuery({
        queryKey: ["mails", mailId],
        queryFn: async () => mailApi.get(`/emails/${mailId}`),
        enabled: !!mailId,
    });

    const sendReplyMutation = useMutation({
        mutationFn: async (mail: ReplyForm) => {
            return mailApi.post("/emails", mail);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["mails"],
                exact: true,
            });

            alert("Resposta enviada com sucesso!");
            navigate("/", { replace: true });
        },
        onError: (error) => {
            let errorMessage =
                "Erro ao responder o email, tente novamente mais tarde";

            if (error instanceof AxiosError) {
                if (error.response?.data?.mensagem) {
                    errorMessage =
                        error.response.data?.erro ||
                        error.response.data?.mensagem;
                }
            }

            alert(errorMessage);
        },
    });

    const { emailDestinatario, emailRemetente, dataEnvio, assunto, corpo } =
        mailData?.data?.email || {};

    const { register, handleSubmit } = useForm<ReplyForm>({
        defaultValues: { emailDestinatario: "", assunto: "", corpo: "" },
        values: { emailDestinatario: emailRemetente, assunto, corpo: "" },
    });

    const onReply = (data: ReplyForm) => {
        if (!sendReplyMutation.isPending) {
            const reply = {
                ...data,
                assunto: assunto.startsWith("RE: ")
                    ? assunto
                    : `RE: ${assunto}`,
                corpo: `${data.corpo}\n\n${"-".repeat(
                    20,
                )}\nDE: ${emailRemetente}\nPARA: ${emailDestinatario}\nASSUNTO: ${assunto}\nDATA: ${dataEnvio}\n\n${corpo}`,
            };

            sendReplyMutation.mutate(reply);
        }
    };

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
                    <div className="flex flex-col flex-1 gap-4">
                        <div className="w-full flex items-center gap-2 border-neutral-400 border-b-1 h-10">
                            <span className="text-neutral-500">Remetente:</span>
                            <span className="w-full outline-none">
                                {emailRemetente}
                            </span>
                        </div>
                        <div className="w-full flex items-center gap-2 border-neutral-400 border-b-1 h-10">
                            <span className="text-neutral-500">Assunto:</span>
                            <span className="w-full outline-none">
                                {assunto}
                            </span>
                        </div>

                        <div className="flex-1 resize-none rounded-md outline-none whitespace-pre-wrap">
                            {corpo}
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(onReply)}
                        className="flex flex-col gap-4 mt-2"
                    >
                        <input
                            type="hidden"
                            disabled
                            {...register("emailDestinatario")}
                        ></input>
                        <input
                            type="hidden"
                            disabled
                            {...register("assunto")}
                        ></input>
                        {isReplying && (
                            <div className="rounded-xl shadow-2xl overflow-hidden">
                                <div className="flex items-center justify-between h-12 px-4 bg-neutral-700">
                                    <div className="flex items-center gap-2 select-none">
                                        <EnvelopeIcon className="text-neutral-400 size-5" />
                                        <span className="text-sm text-white">
                                            Resposta
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1 bg-white p-4 max-h-80 overflow-y-auto scrollbar-hidden">
                                    <textarea
                                        className="flex-1 resize-none rounded-md outline-none min-h-40"
                                        id="body"
                                        placeholder="Sua resposta"
                                        {...register("corpo")}
                                        maxLength={10000}
                                    ></textarea>

                                    <div className="flex-1 resize-none rounded-md outline-none whitespace-pre-wrap">
                                        <p>{"-".repeat(20)}</p>
                                        <p>DE: {emailRemetente}</p>
                                        <p>PARA: {emailDestinatario}</p>
                                        <p>ASSUNTO: {assunto}</p>
                                        <p>DATA: {dataEnvio}</p>
                                        <p className="mt-3">{corpo}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between">
                            {isReplying ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsReplying(false)}
                                        className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer disabled:opacity-70 disabled:hover:bg-red-500"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        // onClick={}
                                        className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer disabled:opacity-70 disabled:hover:bg-green-600"
                                        disabled={sendReplyMutation.isPending}
                                    >
                                        Enviar
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsReplying(true)}
                                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer disabled:opacity-70 disabled:hover:bg-blue-600"
                                >
                                    Responder
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </LayoutInner>
    );
}
