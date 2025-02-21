import React, { FC, useState, useEffect, useContext } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Typography,
  InputNumber,
  Alert,
  Spin,
} from "antd";
import Image from "next/image";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Container from "@/components/Container";
import { eventService } from "@/services/eventService";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { ThemeContext } from "@/pages/_app";
import dayjs from "dayjs";
import { EventDto } from "@/services/eventService";

const { TextArea } = Input;
const { Title, Text } = Typography;

const EditEventPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [event, setEvent] = useState<EventDto | null>(null);
  const [form] = Form.useForm();
  const { darkMode } = useContext(ThemeContext);
  const DATE_FORMAT = "DD/MM/YYYY HH:mm";

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const eventData = await eventService.getEvent(Number(id));
        setEvent(eventData);

        // Preencher o formulário com os dados existentes
        form.setFieldsValue({
          name: eventData.name,
          description: eventData.description,
          location: eventData.location,
          date: dayjs(eventData.date),
          vagas: eventData.vagas,
        });
      } catch (error) {
        console.error("Error fetching event:", error);
        setIsError(true);
      }
    };

    fetchEvent();
  }, [id, form]);

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
    if (!session || !id) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("location", values.location);
      formData.append("date", values.date.toISOString());
      formData.append("vagas", values.vagas.toString());

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (file) {
        formData.append("image", file);
      }

      const result = await eventService.updateEvent(
        Number(id),
        formData,
        session.accessToken,
      );

      if (result.id) {
        await router.push("/my-events");
        return;
      }
      setIsError(true);
    } catch (error) {
      console.error("Error updating event:", error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <Container header>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      </Container>
    );
  }

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
            Editar Ação Voluntária
          </Title>
          <Text type="secondary">Atualize os detalhes da sua ação social</Text>
        </div>

        {isError && (
          <Alert
            message="Erro ao atualizar ação"
            description="Ocorreu um erro ao atualizar a ação voluntária, por favor, tente novamente."
            type="error"
            showIcon
            banner
            style={{ marginBottom: "24px", borderRadius: "8px" }}
          />
        )}

        <Form form={form} layout="vertical" onFinish={onFinish} size="large">
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
              {
                type: "number",
                message: "O valor deve ser um número",
              },
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              parser={(value) => parseInt(value || "0")}
            />
          </Form.Item>

          <Form.Item label="Nova Imagem (opcional)" name="image">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.size > 5 * 1024 * 1024) {
                  e.target.value = "";
                }
              }}
            />
          </Form.Item>

          {event.image && (
            <div style={{ marginBottom: 24 }}>
              <Text type="secondary">Imagem atual:</Text>
              <Image
                src={event.image}
                alt="Imagem atual do evento"
                width={600}
                height={200}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginTop: 8,
                }}
              />
            </div>
          )}

          <Form.Item style={{ marginTop: "32px" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ height: "45px", fontSize: "16px" }}
            >
              Atualizar Evento
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Container>
  );
};

export default EditEventPage;
