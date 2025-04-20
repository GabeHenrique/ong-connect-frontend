import { FC, useState, useContext } from "react";
import { Button, Form, Input, Typography, Alert } from "antd";
import { useRouter } from "next/router";
import Container from "@/components/Container";
import Link from "next/link";
import { LockOutlined } from "@ant-design/icons";
import { ThemeContext } from "../_app";

const { Title, Text } = Typography;

const ResetPasswordPage: FC = () => {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const onFinish = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password: values.password,
          }),
        }
      );

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.message || "Token inválido ou expirado");
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
            Redefinir Senha
          </Title>
          <Text type="secondary">Digite sua nova senha</Text>
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

        {success ? (
          <Alert
            message="Senha alterada!"
            description="Sua senha foi alterada com sucesso. Redirecionando para o login..."
            type="success"
            showIcon
          />
        ) : (
          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Por favor, insira sua senha" },
                { min: 8, message: "A senha deve ter pelo menos 8 caracteres" },
                {
                  pattern: /[a-zA-Z]/,
                  message: "A senha deve conter pelo menos uma letra",
                },
                {
                  pattern: /\d/,
                  message: "A senha deve conter pelo menos um número",
                },
                {
                  pattern: /[!@#$%^&*(),.?":{}|<>]/,
                  message:
                    "A senha deve conter pelo menos um caractere especial",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="Nova senha"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: "Por favor, confirme sua senha" },
                { min: 8, message: "A senha deve ter pelo menos 8 caracteres" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="Confirme a nova senha"
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
                Redefinir senha
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

export default ResetPasswordPage;
