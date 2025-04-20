import React, { FC, useContext } from "react";
import { Button, Result, Typography } from "antd";
import { useRouter } from "next/router";
import Container from "@/components/Container";
import { ThemeContext } from "@/pages/_app";

const { Text } = Typography;

interface ErrorPageProps {
  code?: number;
  message?: string;
  description?: string;
}

const ErrorPage: FC<ErrorPageProps> = ({
  code = 500,
  message = "Ops! Algo deu errado",
  description = "Desculpe, ocorreu um erro inesperado.",
}) => {
  const router = useRouter();
  const { darkMode } = useContext(ThemeContext);

  return (
    <Container header>
      <div
        style={{
          maxWidth: 1200,
          margin: "40px auto",
          padding: "24px",
          borderRadius: "8px",
          background: darkMode ? "#1f1f1f" : "#fff",
        }}
      >
        <Result
          status={code === 404 ? "404" : "error"}
          title={message}
          subTitle={
            <Text type="secondary" style={{ fontSize: 16 }}>
              {description}
            </Text>
          }
          extra={
            <Button
              type="primary"
              size="large"
              onClick={() => router.push("/")}
              style={{ minWidth: 120 }}
            >
              Voltar ao início
            </Button>
          }
        />
      </div>
    </Container>
  );
};

export default ErrorPage;
