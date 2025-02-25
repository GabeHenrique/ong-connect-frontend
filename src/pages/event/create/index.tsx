import React, { FC, useState, useEffect, useContext } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Typography,
  InputNumber,
  Alert,
  Upload,
} from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Container from "@/components/Container";
import { eventService } from "@/services/eventService";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  FormOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { ThemeContext } from "@/pages/_app";
import dayjs from "dayjs";
import type { RcFile, UploadFile } from "antd/es/upload/interface";

const { TextArea } = Input;
const { Title, Text } = Typography;

const CreateEventPage: FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const DATE_FORMAT = "DD/MM/YYYY HH:mm";
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setIsError(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isError]);

  useEffect(() => {
    if (!session) return;

    if (session?.user?.role !== "ONG") {
      router.push("/");
    }
  }, [session, router]);

  if (session?.user?.role !== "ONG") {
    return null;
  }

  const onFinish = async (values: any) => {
    if (!session) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("location", values.location);
      formData.append("date", values.date.toISOString());
      formData.append("vagas", String(values.vagas));

      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      const result = await eventService.createEvent(
        formData,
        session.accessToken
      );

      if (result.id) {
        await router.push("/my-events");
        return;
      }
      setIsError(true);
    } catch (error) {
      console.error("Error creating event:", error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Você só pode fazer upload de imagens!");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("A imagem deve ser menor que 5MB!");
      return false;
    }
    return false;
  };

  return (
    <Container header>
      <div
        style={{
          maxWidth: 600,
          margin: "40px auto",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: "8px",
          background: darkMode ? "#1f1f1f" : "#fff",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={2} style={{ marginBottom: "8px" }}>
            Criar Nova Ação Voluntária
          </Title>
          <Text type="secondary">Preencha os detalhes da sua ação social</Text>
        </div>

        {isError && (
          <Alert
            message="Erro ao criar ação"
            description="Ocorreu um erro ao criar a ação voluntária, por favor, tente novamente."
            type="error"
            showIcon
            banner
            style={{ marginBottom: "24px", borderRadius: "8px" }}
          />
        )}

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            label="Nome da Ação"
            name="name"
            rules={[
              { required: true, message: "Por favor, insira o nome da ação" },
            ]}
          >
            <Input
              prefix={<FormOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Digite o nome do evento"
            />
          </Form.Item>

          <Form.Item
            label="Descrição"
            name="description"
            rules={[
              {
                required: true,
                message: "Por favor, insira a descrição do evento",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Descreva os detalhes do evento"
              style={{ fontSize: "16px" }}
            />
          </Form.Item>

          <Form.Item
            label="Local"
            name="location"
            rules={[
              {
                required: true,
                message: "Por favor, insira o local do evento",
              },
            ]}
          >
            <Input
              prefix={<EnvironmentOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Digite o local do evento"
            />
          </Form.Item>

          <Form.Item
            label="Data"
            name="date"
            rules={[
              {
                required: true,
                message: "Por favor, selecione a data do evento",
              },
            ]}
          >
            <DatePicker
              showTime
              format={DATE_FORMAT}
              style={{ width: "100%" }}
              minDate={dayjs()}
              placeholder="Selecione a data e hora"
              prefix={<CalendarOutlined style={{ color: "#bfbfbf" }} />}
            />
          </Form.Item>

          <Form.Item
            label="Número de Vagas"
            name="vagas"
            rules={[
              {
                required: true,
                message: "Por favor, insira o número de vagas",
              },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Imagem"
            name="image"
            rules={[
              {
                required: true,
                message: "Por favor, insira a imagem do evento",
              },
            ]}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={({ fileList }) => setFileList(fileList)}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Selecionar Imagem</Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginTop: "32px" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ height: "45px", fontSize: "16px" }}
            >
              Criar Evento
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Container>
  );
};

export default CreateEventPage;
