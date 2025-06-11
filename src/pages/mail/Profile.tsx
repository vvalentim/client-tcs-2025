import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { mailApi } from "../../api/mailApi";
import { userProfileQuery } from "../../api/queries/userProfileQuery";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import { UserCircleIcon } from "@heroicons/react/24/outline";

type UserRegistration = {
    nome: string;
    email: string;
    senha: string;
};

type UserMutableFields = {
    nome: string;
    senha: string;
};

export function Profile() {
    const auth = useAuth();
    const navigate = useNavigate();

    const { data: queryResponse } = useQuery(userProfileQuery());

    const { email, senha, nome } = queryResponse?.data.usuario || {};

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<UserRegistration>({
        defaultValues: { nome, email, senha },
    });

    const handleMutationError = (error: Error, defaultMessage: string) => {
        let errorMessage = defaultMessage || "Ocorreu um erro inesperado.";

        if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
                alert("Seu usuário não está autorizado, faça login novamente.");

                auth.changeUser(null);

                return;
            }

            if (error.response?.data?.mensagem) {
                errorMessage =
                    error.response.data?.erro || error.response.data?.mensagem;
            }
        }

        setError("root", { message: errorMessage });
    };

    const updateUserMutation = useMutation({
        mutationFn: async (user: UserMutableFields) => {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Make the API call to login and retrive the token
            return mailApi.put("/usuarios", user);
        },
        onSuccess: () => {
            alert("Cadastro atualizado com sucesso!");
        },
        onError: (error) =>
            handleMutationError(
                error,
                "Erro ao atualizar o cadastro, tente novamente mais tarde",
            ),
    });

    const deleteUserMutation = useMutation({
        mutationFn: async () => {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Make the API call to login and retrive the token
            return mailApi.delete("/usuarios");
        },
        onSuccess: () => {
            alert("Cadastro excluído com sucesso!");
            auth.changeUser(null);
        },
        onError: (error) =>
            handleMutationError(
                error,
                "Erro ao excluir o cadastro, tente novamente mais tarde",
            ),
    });

    const update: SubmitHandler<UserRegistration> = (formData) => {
        const updatedUser: UserMutableFields = {
            nome: formData.nome,
            senha: formData.senha,
        };

        updateUserMutation.mutate(updatedUser);
    };

    const deleteUser = () => {
        if (window.confirm("Tem certeza que deseja excluir sua conta?")) {
            deleteUserMutation.mutate();
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-12 lg:px-8 bg-white">
            <form onSubmit={handleSubmit(update)}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Conta
                        </h2>
                        <p className="mt-1 text-sm/6 font-medium text-gray-500">
                            Aqui você pode atualizar as preferências de sua
                            conta
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="col-span-full">
                                <label
                                    htmlFor="email"
                                    className="block text-sm/6 font-semibold text-gray-900"
                                >
                                    Email
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white">
                                        <div className="block min-w-0 grow py-1.5 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6">
                                            {email || ""}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label
                                    htmlFor="name"
                                    className="block text-sm/6 font-semibold text-gray-900"
                                >
                                    Nome
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            id="name"
                                            type="text"
                                            {...register("nome", {
                                                required:
                                                    "O campo nome é obrigatório",
                                                maxLength: {
                                                    value: 255,
                                                    message:
                                                        "O nome deve ter no máximo 255 caracteres",
                                                },
                                            })}
                                            placeholder="Seu nome completo"
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        />
                                    </div>
                                    {errors.nome && (
                                        <div className="text-sm text-red-500 mb-2">
                                            {errors.nome.message}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm/6 font-semibold text-gray-900"
                                >
                                    Senha
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            id="password"
                                            type="password"
                                            {...register("senha", {
                                                required:
                                                    "O campo senha é obrigatório",
                                                minLength: {
                                                    value: 8,
                                                    message:
                                                        "A senha deve ter no mínimo 6 caracteres",
                                                },
                                                maxLength: {
                                                    value: 20,
                                                    message:
                                                        "A senha deve ter no máximo 20 caracteres",
                                                },
                                            })}
                                            placeholder="Sua senha"
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        />
                                    </div>
                                    {errors.senha && (
                                        <div className="text-sm text-red-500 mb-2">
                                            {errors.senha.message}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label
                                    htmlFor="assinatura"
                                    className="block text-sm/6 font-semibold text-gray-900"
                                >
                                    Assinatura
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="about"
                                        name="about"
                                        rows={3}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        placeholder="Customize a assinatura utilizada no rodapé de seus emails"
                                    />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label
                                    htmlFor="photo"
                                    className="block text-sm/6 font-semibold text-gray-900"
                                >
                                    Foto
                                </label>

                                <div className="mt-2 flex items-center gap-x-3">
                                    <UserCircleIcon
                                        aria-hidden="true"
                                        className="size-12 text-gray-300"
                                    />
                                    <button
                                        type="button"
                                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 cursor-pointer"
                                    >
                                        Alterar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {errors.root && (
                    <div className="text-sm text-red-500 mb-2">
                        {errors.root.message}
                    </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                    <div>
                        <button
                            type="submit"
                            onClick={deleteUser}
                            disabled={
                                updateUserMutation.isPending ||
                                deleteUserMutation.isPending
                            }
                            className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                        >
                            {deleteUserMutation.isPending
                                ? "Carregando..."
                                : "Excluir conta"}
                        </button>
                    </div>
                    <div className="flex gap-x-6">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="text-sm/6 font-semibold text-gray-900 cursor-pointer"
                        >
                            Voltar
                        </button>
                        <button
                            type="submit"
                            disabled={updateUserMutation.isPending}
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                        >
                            {updateUserMutation.isPending
                                ? "Carregando..."
                                : "Salvar"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
