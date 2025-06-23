import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { mailApi } from "../../api/mailApi";
import { LayoutInner } from "../../components/LayoutInner";

type DraftForm = {
    assunto?: string;
    emailDestinatario?: string;
    corpo?: string;
};

export function Compose() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { draftId } = useParams();

    const { data: draftData } = useQuery({
        queryKey: ["draft", draftId],
        queryFn: async () => mailApi.get(`/rascunhos/${draftId}`),
        enabled: !!draftId,
    });

    const { emailDestinatario, assunto, corpo } =
        draftData?.data?.rascunho || {};

    const { register, watch, handleSubmit } = useForm<DraftForm>({
        defaultValues: { emailDestinatario: "", assunto: "", corpo: "" },
        values: { emailDestinatario, assunto, corpo },
    });

    const saveDraftMutation = useMutation({
        mutationFn: async (mail: DraftForm) => {
            if (draftId) {
                return mailApi.put(`/rascunhos/${draftId}`, mail);
            }

            return mailApi.post("/rascunhos", mail);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: ["draft", draftId],
                exact: true,
            });

            alert("Rascunho salvo com sucesso!");
            navigate(`/compose/${response?.data.rascunho.rascunhoId}`, {
                replace: true,
            });
        },
        onError: (error) => {
            let errorMessage =
                "Erro ao salvar o rascunho, tente novamente mais tarde";

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

    const sendMailMutation = useMutation({
        mutationFn: async (mail: DraftForm) => {
            if (draftId) {
                const { data } = await mailApi.put(
                    `/rascunhos/${draftId}`,
                    mail,
                );

                if (!data?.rascunho) {
                    throw new Error("Falha ao salvar rascunho.");
                }

                return mailApi.post(`/emails/${draftId}`);
            }

            return mailApi.post("/emails", mail);
        },
        onSuccess: () => {
            alert("Email enviado com sucesso!");
            navigate("/drafts", { replace: true });
        },
        onError: (error) => {
            let errorMessage =
                "Erro ao enviar o email, tente novamente mais tarde";

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

    const destroyDraftMutation = useMutation({
        mutationFn: async () => {
            return mailApi.delete(`/rascunhos/${draftId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["drafts"],
                exact: true,
            });

            alert("Rascunho excluído com sucesso!");
            navigate("/drafts");
        },
        onError: (error) => {
            let errorMessage =
                "Erro ao excluir o rascunho, tente novamente mais tarde";

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

    const onSave: SubmitHandler<DraftForm> = (formData) => {
        if (!saveDraftMutation.isPending) {
            saveDraftMutation.mutate(formData);
        }
    };

    const onSend: SubmitHandler<DraftForm> = (formData) => {
        if (!sendMailMutation.isPending) {
            sendMailMutation.mutate(formData);
        }
    };

    const onDestroy = () => {
        if (window.confirm("Tem certeza que deseja excluir o rascunho?")) {
            destroyDraftMutation.mutate();
        }
    };

    const isSendEnabled = () => {
        const { emailDestinatario, assunto, corpo } = watch();

        if (emailDestinatario && assunto && corpo) {
            if (emailDestinatario.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
                return true;
            }
        }

        return false;
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
                    <form className="flex flex-col flex-1 gap-4">
                        <div className="w-full flex items-center gap-2 border-neutral-400 border-b-1">
                            <label
                                htmlFor="recipient"
                                className="text-neutral-500"
                            >
                                Destinatário:
                            </label>
                            <input
                                className="w-full outline-none h-10"
                                type="email"
                                id="recipient"
                                {...register("emailDestinatario")}
                            ></input>
                        </div>
                        <div className="w-full flex items-center gap-2 border-neutral-400 border-b-1">
                            <label
                                htmlFor="subject"
                                className="text-neutral-500"
                            >
                                Assunto:
                            </label>
                            <input
                                className="w-full outline-none h-10"
                                id="subject"
                                {...register("assunto")}
                            ></input>
                        </div>

                        <textarea
                            className="flex-1 resize-none rounded-md outline-none"
                            id="body"
                            placeholder="Sua mensagem"
                            {...register("corpo")}
                            maxLength={10000}
                        ></textarea>

                        <div className="flex justify-between">
                            <button
                                type="button"
                                className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer disabled:opacity-70 disabled:hover:bg-red-500"
                                onClick={onDestroy}
                                disabled={draftId === undefined}
                            >
                                Excluir
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSubmit(onSave)}
                                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer disabled:opacity-70 disabled:hover:bg-blue-600"
                                >
                                    Salvar
                                </button>

                                <button
                                    onClick={handleSubmit(onSend)}
                                    className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer disabled:opacity-70 disabled:hover:bg-green-600"
                                    disabled={!isSendEnabled()}
                                >
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </LayoutInner>
    );
}
