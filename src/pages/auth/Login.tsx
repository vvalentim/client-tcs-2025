import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { mailApi } from "../../api/mailApi";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

type UserCredentials = {
    email: string;
    senha: string;
};

export function Login() {
    const auth = useAuth();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<UserCredentials>({
        defaultValues: {
            email: "",
            senha: "",
        },
    });

    const authMutation = useMutation({
        mutationFn: async (credentials: UserCredentials) => {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Make the API call to login and retrive the token
            return mailApi.post("/login", credentials);
        },
        onSuccess: (response) => {
            if (response?.data?.token) {
                auth.changeUser(response.data.token);
            }
        },
        onError: (error) => {
            let errorMessage =
                "Erro ao efetuar o login, tente novamente mais tarde";

            if (error instanceof AxiosError) {
                if (error.response?.data) {
                    errorMessage =
                        error.response.data?.erro ||
                        error.response.data?.mensagem;
                }
            }

            setError("root", { message: errorMessage });
        },
    });

    const login: SubmitHandler<UserCredentials> = (formData) => {
        authMutation.mutate(formData);
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
                    Acesse sua conta
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit(login)}>
                    <div>
                        <div className="mt-2">
                            <input
                                type="email"
                                placeholder="Email"
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
                            <input
                                type="password"
                                placeholder="Senha"
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
                        <button
                            type="submit"
                            disabled={authMutation.isPending}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {authMutation.isPending
                                ? "Carregando..."
                                : "Entrar"}
                        </button>

                        {errors.root && (
                            <div className="text-sm text-red-500 mb-2">
                                {errors.root.message}
                            </div>
                        )}
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Não possui uma conta?{" "}
                    <Link
                        to={"/auth/signup"}
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
}
