import { FC, useContext, useEffect, useState } from "react";
import { Button, Divider, Form, Input, Typography, Alert, Radio } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Container from "@/components/Container";
import Link from "next/link";
import { IdcardOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { ThemeContext } from "../_app";
import {AUTH_PROVIDER} from "@/pages/api/auth/[...nextauth]";

const { Title, Text } = Typography;

const SignupPage: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    letter: false,
    number: false,
    special: false,
  });
  const [userRegistred, setUserRegistred] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const onFinish = async (values: {
    email: string;
    password: string;
    name: string;
    role: "ONG" | "VOLUNTEER";
  }) => {
    setLoading(true);
    try {
      const API_URL = `${process.env.API_URL}`;
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        credentials: "include",
        body: JSON.stringify({
          ...values,
          role: values.role || "VOLUNTEER",
        }),
      });

      if (response.status === 409) {
        return setUserRegistred(true);
      }
      setUserRegistred(false);

      if (response.ok) {
        const result = await signIn(AUTH_PROVIDER, {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (result?.error) {
        } else {
          router.push("/");
        }
      } else {
        const data = await response.json();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRegistred) {
      const timer = setTimeout(() => {
        setUserRegistred(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [userRegistred]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordRules({
      length: value.length >= 8,
      letter: /[a-zA-Z]/.test(value),
      number: /\d/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
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
            Criar Conta
          </Title>
          <Text type="secondary">
            Escolha seu tipo de conta e comece a fazer a diferença
          </Text>
        </div>

        {userRegistred && (
          <Alert
            message="Erro"
            description="Este email já está cadastrado."
            type="error"
            showIcon
            banner
            style={{ marginBottom: "24px", borderRadius: "8px" }}
          />
        )}

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="role"
            label="Tipo de Conta"
            rules={[
              {
                required: true,
                message: "Por favor, selecione o tipo de conta",
              },
            ]}
          >
            <Radio.Group style={{ width: "100%" }}>
              <Radio.Button
                value="VOLUNTEER"
                style={{ width: "50%", textAlign: "center" }}
              >
                Voluntário
              </Radio.Button>
              <Radio.Button
                value="ONG"
                style={{ width: "50%", textAlign: "center" }}
              >
                ONG
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="name"
            rules={[{ required: true, message: "Por favor, insira seu nome" }]}
          >
            <Input
              prefix={<IdcardOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Nome completo / Nome da ONG"
            />
          </Form.Item>

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
                message: "A senha deve conter pelo menos um caractere especial",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Sua senha"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Por favor, confirme sua senha" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("As senhas não coincidem"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Confirme sua senha"
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
              Criar conta
            </Button>
          </Form.Item>

          <Divider>ou</Divider>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Já tem uma conta?{" "}
              <Link href="/login" style={{ color: "#1890ff", fontWeight: 500 }}>
                Faça login
              </Link>
            </Text>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default SignupPage;
