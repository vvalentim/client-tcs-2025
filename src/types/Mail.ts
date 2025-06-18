export type Mail = {
    rascunhoId?: string | number;
    emailId?: string | number;
    assunto: string;
    emailRemetente: string;
    emailDestinatario: string;
    corpo: string;
    dataEnvio: string;
    status: string;
};
