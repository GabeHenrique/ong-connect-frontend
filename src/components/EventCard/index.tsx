import { EventDto } from "@/services/eventService";
import { Card, Col, Space, Tag, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { EnvironmentOutlined, UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

const EventCard = ({ event }: { event: EventDto }) => {
  const router = useRouter();
  const date = new Date(event.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Col xs={24} sm={12} md={8} xl={6} key={event.id}>
      <Card
        hoverable
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
        cover={
          <div style={{ position: "relative", height: "200px" }}>
            <Image
              alt={event.name}
              src={event.image}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        }
        onClick={() => router.push(`/event/${event.id}`)}
      >
        <div style={{ flex: 1 }}>
          <Tag color="blue" style={{ marginBottom: "12px" }}>
            {date}
          </Tag>

          <Card.Meta title={event.name} style={{ marginBottom: "16px" }} />

          <Text
            type="secondary"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            {event.description}
          </Text>

          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Space>
              <EnvironmentOutlined style={{ color: "#1890ff" }} />
              <Text type="secondary">{event.location}</Text>
            </Space>
            <Space>
              <UserOutlined style={{ color: "#1890ff" }} />
              <Text type="secondary">{event.creator.name}</Text>
            </Space>
          </Space>
        </div>
      </Card>
    </Col>
  );
};

export default EventCard;
