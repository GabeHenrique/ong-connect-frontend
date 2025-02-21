import { FC, useContext, useEffect, useState } from "react";
import { Form, Input, Button, message, Typography, Divider, Alert } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Container from "@/components/Container";
import Link from "next/link";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { ThemeContext } from "../_app";

const { Title, Text } = Typography;

const LoginPage: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result.status === 401) {
        setUnauthorized(true);
      }

      if (result?.error) {
        message.error("Credenciais inválidas");
      } else {
        message.success("Login realizado com sucesso");
        await router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (unauthorized) {
      const timer = setTimeout(() => {
        setUnauthorized(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [unauthorized]);

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
            Bem-vindo de volta!
          </Title>
          <Text type="secondary">Faça login para acessar sua conta</Text>
        </div>

        {unauthorized && (
          <Alert
            message="Email ou senha inválidos"
            description="Confira os dados e tente novamente."
            type="error"
            showIcon
            banner
            style={{ marginBottom: "24px", borderRadius: "8px" }}
          />
        )}

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Por favor, insira seu email" },
              { type: "email", message: "Email inválido" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Seu email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Por favor, insira sua senha" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Sua senha"
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
              Entrar
            </Button>
          </Form.Item>

          <Divider>ou</Divider>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Ainda não tem uma conta?{" "}
              <Link
                href="/signup"
                style={{ color: "#1890ff", fontWeight: 500 }}
              >
                Cadastre-se agora
              </Link>
            </Text>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default LoginPage;
