import ErrorPage from "./error";

export default function Custom404() {
  return (
    <ErrorPage
      code={404}
      message="Página não encontrada"
      description="Desculpe, a página que você está procurando não existe."
    />
  );
}
