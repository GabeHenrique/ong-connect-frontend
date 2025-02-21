import ErrorPage from "./error";

export default function Custom500() {
  return (
    <ErrorPage
      code={500}
      message="Erro interno do servidor"
      description="Desculpe, algo deu errado no servidor."
    />
  );
}
