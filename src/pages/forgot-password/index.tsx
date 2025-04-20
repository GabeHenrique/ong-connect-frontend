import { FC, useState, useContext } from "react";
import { Button, Form, Input, Typography, Alert } from "antd";
import Container from "@/components/Container";
import Link from "next/link";
import { MailOutlined } from "@ant-design/icons";
import { ThemeContext } from "../_app";

const { Title, Text } = Typography;

const ForgotPasswordPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const { darkMode } = useContext(ThemeContext);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    setError("");
    
    try {
      const API_URL = `${process.env.BACKEND_API_URL}`;
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setEmailSent(true);
      } else {
        const data = await response.json();
        setError(data.message || "Ocorreu um erro ao processar sua solicitação");
      }
    } catch (error) {
      setError(`Erro ao conectar com o servidor: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container header={true}>
      <div
        style={{
          maxWidth: 400,
          margin: "40px auto",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: "8px",
          background: darkMode ? "#1f1f1f" : "#fff",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={2} style={{ marginBottom: "8px" }}>
            Esqueceu sua senha?
          </Title>
          <Text type="secondary">
            Digite seu email para receber instruções de recuperação
          </Text>
        </div>

        {error && (
          <Alert
            message="Erro"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "24px" }}
          />
        )}

        {emailSent ? (
          <div style={{ textAlign: "center" }}>
            <Alert
              message="Email enviado!"
              description="Verifique sua caixa de entrada para instruções de recuperação de senha"
              type="success"
              showIcon
              style={{ marginBottom: "24px" }}
            />
            <Link href="/login" style={{ color: "#1890ff" }}>
              Voltar para o login
            </Link>
          </div>
        ) : (
          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Por favor, insira seu email" },
                { type: "email", message: "Email inválido" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="Seu email"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ height: "40px" }}
              >
                Enviar instruções
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              <Link href="/login" style={{ color: "#1890ff" }}>
                Voltar para o login
              </Link>
            </div>
          </Form>
        )}
      </div>
    </Container>
  );
};

export default ForgotPasswordPage;
