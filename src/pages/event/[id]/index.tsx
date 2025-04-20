import React, { FC, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  Col,
  Modal,
  notification,
  Row,
  Space,
  Typography,
  Form,
  Input,
} from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Container from "@/components/Container";
import {
  EventDto,
  eventService,
  VolunteerApplication,
} from "@/services/eventService";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { NotificationPlacement } from "antd/es/notification/interface";

const { Title, Text, Paragraph } = Typography;
const Context = React.createContext({ name: "Default" });

const formatPhone = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  if (phoneNumber.length <= 10) {
    return phoneNumber.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

const EventPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [event, setEvent] = useState<EventDto>();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [belongsToUser, setBelongsToUser] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    placement: NotificationPlacement,
    isSuccess: boolean
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isSuccess
      ? api.warning({
          message: "Presença cancelada",
          description:
            "Se você mudar de ideia, pode confirmar novamente a qualquer momento",
          placement,
        })
      : api.success({
          message: "Presença confirmada",
          description:
            "Contamos com a sua participação mais do que especial nesse evento",
          placement,
        });
  };

  useEffect(() => {
    if (event && session && session.user) {
      setIsConfirmed(
        event.volunteers?.some(
          (attendee) => attendee.email === session.user?.email
        )
      );
      setBelongsToUser(event.creator?.email === session.user.email);
    }
  }, [event, session]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        return;
      }

      const event = await eventService.getEvent(+id);
      setEvent(event);
    };
    fetchEvent();
  }, [id, session]);

  const handleAttendance = async () => {
    if (session && session.user && event) {
      try {
        const updatedEvent = await eventService.toggleAttendance(
          event.id,
          session.user.email!,
          session.accessToken
        );
        openNotification("bottomRight", isConfirmed);
        form.resetFields();
        setEvent(updatedEvent);
      } catch (error) {
        console.error("Error toggling attendance", error);
        notification.error({
          message: "Erro",
          description: "Não foi possível atualizar sua inscrição",
        });
      }
    }
  };

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = () => {
    if (!event) return;
    router.push(`/event/${event.id}/edit`);
  };

  const handleConfirmDelete = async () => {
    if (session && session.user && event) {
      await eventService.deleteEvent(event.id, session.accessToken);
      await router.push("/");
    }
  };

  const handleApplyClick = () => {
    if (session && session.user) {
      form.setFieldsValue({
        name: session.user.name,
        email: session.user.email,
      });
      setIsApplicationModalOpen(true);
    }
  };

  const handleApplicationSubmit = async (values: VolunteerApplication) => {
    if (session && session.user && event) {
      try {
        const updatedEvent = await eventService.applyForEvent(
          event.id,
          values,
          session.accessToken
        );
        setEvent(updatedEvent);
        openNotification("bottomRight", false);
        setIsApplicationModalOpen(false);
      } catch (error) {
        console.error("Error applying for event", error);
        notification.error({
          message: "Erro",
          description: "Não foi possível realizar sua inscrição",
        });
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const formatted = formatPhone(value);
    form.setFieldValue("phone", formatted);
  };

  const onClickToSubscriptions = () => {
    router.push(`/event/${event?.id}/subscriptions`);
  };

  const contextValue = useMemo(() => ({ name: "Ant Design" }), []);

  if (!event) return null;

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <Container header>
        {belongsToUser && (
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              paddingRight: "24px",
              textAlign: "right",
            }}
          >
            <Button
              color="primary"
              size="large"
              variant="solid"
              onClick={onClickToSubscriptions}
            >
              Visualizar Inscritos
            </Button>
          </div>
        )}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
          <Card
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
            styles={{ body: { padding: 0 } }}
          >
            <Row>
              <Col xs={24} md={12} style={{ position: "relative" }}>
                <div style={{ height: "100%", minHeight: "500px" }}>
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div style={{ padding: "32px", height: "100%" }}>
                  {belongsToUser && (
                    <div style={{ textAlign: "right", marginBottom: "16px" }}>
                      <Space.Compact>
                        <Button
                          color="primary"
                          variant="filled"
                          onClick={handleUpdate}
                        >
                          Editar
                        </Button>
                        <Button
                          color="danger"
                          variant="filled"
                          onClick={handleDelete}
                        >
                          Excluir
                        </Button>
                      </Space.Compact>
                    </div>
                  )}

                  <Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Title level={2} style={{ marginBottom: "8px" }}>
                        {event.name}
                      </Title>
                      <Text type="secondary" style={{ fontSize: "16px" }}>
                        Organizado por {event?.creator?.name}
                      </Text>
                    </div>

                    <Space direction="vertical" size="middle">
                      <Space>
                        <CalendarOutlined
                          style={{ fontSize: "18px", color: "#1890ff" }}
                        />
                        <Text>
                          {new Date(event.date).toLocaleString("pt-BR")}
                        </Text>
                      </Space>
                      <Space>
                        <EnvironmentOutlined
                          style={{ fontSize: "18px", color: "#1890ff" }}
                        />
                        <Text>{event.location}</Text>
                      </Space>
                      <Space>
                        <TeamOutlined
                          style={{ fontSize: "18px", color: "#1890ff" }}
                        />
                        <Text>{event.volunteers?.length || 0} confirmados</Text>
                      </Space>
                    </Space>

                    <div>
                      <Title level={4} style={{ marginBottom: "16px" }}>
                        Sobre o evento
                      </Title>
                      <Paragraph
                        style={{ fontSize: "16px", lineHeight: "1.6" }}
                      >
                        {event.description}
                      </Paragraph>
                    </div>

                    {session && session.user.role !== "ONG" && (
                      <Button
                        type={isConfirmed ? "default" : "primary"}
                        size="large"
                        onClick={
                          isConfirmed ? handleAttendance : handleApplyClick
                        }
                        style={{
                          width: "200px",
                          height: "45px",
                          fontSize: "16px",
                        }}
                      >
                        {!isConfirmed ? "Voluntariar-se" : "Cancelar Inscrição"}
                      </Button>
                    )}
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>

          <Modal
            title="Confirmar Exclusão"
            open={isModalOpen}
            onOk={handleConfirmDelete}
            onCancel={handleCancelDelete}
            okText="Excluir"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Paragraph>
              Tem certeza que deseja excluir? Esta ação não poderá ser desfeita.
            </Paragraph>
          </Modal>

          <Modal
            title="Inscrição para Voluntariado"
            open={isApplicationModalOpen}
            onCancel={() => setIsApplicationModalOpen(false)}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleApplicationSubmit}
            >
              <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="email"
                label="E-mail"
                rules={[{ required: true, type: "email" }]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Telefone"
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira um telefone",
                  },
                ]}
              >
                <Input
                  onChange={handlePhoneChange}
                  maxLength={15}
                  placeholder="(00) 00000-0000"
                />
              </Form.Item>

              <Form.Item
                name="qualifications"
                label="Qualificações"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item name="observations" label="Observações">
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Enviar Inscrição
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Container>
    </Context.Provider>
  );
};

export default EventPage;
