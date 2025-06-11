import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { mailApi } from "../../api/mailApi";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

type UserRegistration = {
    nome: string;
    email: string;
    senha: string;
};

export function Signup() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<UserRegistration>({
        defaultValues: {
            nome: "",
            email: "",
            senha: "",
        },
    });

    const createUserMutation = useMutation({
        mutationFn: async (user: UserRegistration) => {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Make the API call to login and retrive the token
            return mailApi.post("/usuarios", user);
        },
        onSuccess: () => {
            alert("Usuário cadastrado com sucesso!");
            navigate("/auth/login");
        },
        onError: (error) => {
            let errorMessage =
                "Erro ao realizar cadastro, tente novamente mais tarde";

            if (error instanceof AxiosError) {
                if (error.response?.data?.mensagem) {
                    errorMessage =
                        error.response.data?.erro ||
                        error.response.data?.mensagem;
                }
            }

            setError("root", { message: errorMessage });
        },
    });

    const signup: SubmitHandler<UserRegistration> = (formData) => {
        createUserMutation.mutate(formData);
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                {/* <img
                    alt="Your Company"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    className="mx-auto h-10 w-auto"
                /> */}
                <EnvelopeIcon
                    aria-hidden="true"
                    className="mx-auto size-10 text-indigo-600"
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Cadastrar-se
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit(signup)}>
                    <div>
                        <label
                            htmlFor="nome"
                            className="block text-sm/6 font-semibold text-gray-900"
                        >
                            Nome
                        </label>
                        <div className="mt-2">
                            <input
                                id="nome"
                                type="text"
                                placeholder="Nome completo"
                                {...register("nome", {
                                    required: "O campo nome é obrigatório",
                                    maxLength: {
                                        value: 255,
                                        message:
                                            "O nome deve ter no máximo 255 caracteres",
                                    },
                                })}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                            {errors.nome && (
                                <div className="text-sm text-red-500">
                                    {errors.nome.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="mt-2">
                            <label
                                htmlFor="email"
                                className="block text-sm/6 font-semibold text-gray-900"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="email@exemplo.com"
                                {...register("email", {
                                    required: "O campo email é obrigatório",
                                })}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                            {errors.email && (
                                <div className="text-sm text-red-500">
                                    {errors.email.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="mt-2">
                            <label
                                htmlFor="senha"
                                className="block text-sm/6 font-semibold text-gray-900"
                            >
                                Senha
                            </label>
                            <input
                                id="senha"
                                type="password"
                                placeholder="Senha com mínimo 8 e máximo 20 caracteres"
                                {...register("senha", {
                                    required: "O campo senha é obrigatório",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "A senha deve ter no mínimo 8 caracteres",
                                    },
                                    maxLength: {
                                        value: 20,
                                        message:
                                            "A senha deve ter no máximo 20 caracteres",
                                    },
                                })}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                            {errors.senha && (
                                <div className="text-sm text-red-500">
                                    {errors.senha.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        {errors.root && (
                            <div className="text-sm text-red-500 mb-2">
                                {errors.root.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={createUserMutation.isPending}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                        >
                            {createUserMutation.isPending
                                ? "Carregando..."
                                : "Confirmar"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex w-full justify-center rounded-md bg-gray-200 mt-3 px-3 py-1.5 text-sm/6 font-semibold text-indigo-500 shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black cursor-pointer"
                        >
                            Voltar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

{
    // <form onSubmit={handleSubmit(signup)}>
    //     <div>
    //         <input
    //             type="nome"
    //             placeholder="Nome"
    //             {...register("nome", {
    //                 required: "O campo nome é obrigatório",
    //                 maxLength: {
    //                     value: 255,
    //                     message: "O nome deve ter no máximo 255 caracteres",
    //                 },
    //             })}
    //         />
    //         {errors.nome && <div>{errors.nome.message}</div>}
    //     </div>
    //     <div>
    //         <input
    //             type="email"
    //             placeholder="Email"
    //             {...register("email", {
    //                 required: "O campo email é obrigatório",
    //             })}
    //         />
    //         {errors.email && <div>{errors.email.message}</div>}
    //     </div>
    //     <div>
    //         <input
    //             type="password"
    //             placeholder="Senha"
    //             {...register("senha", {
    //                 required: "O campo senha é obrigatório",
    //                 minLength: {
    //                     value: 8,
    //                     message: "A senha deve ter no mínimo 6 caracteres",
    //                 },
    //                 maxLength: {
    //                     value: 20,
    //                     message: "A senha deve ter no máximo 20 caracteres",
    //                 },
    //             })}
    //         />
    //         {errors.senha && <div>{errors.senha.message}</div>}
    //     </div>
    //     {errors.root && <div>{errors.root.message}</div>}
    //     <button type="button" onClick={() => navigate("/auth/login")}>
    //         Voltar
    //     </button>
    //     <button type="submit" disabled={createUserMutation.isPending}>
    //         {createUserMutation.isPending ? "Carregando..." : "Cadastrar-se"}
    //     </button>
    // </form>;
}
