import { FC, useCallback, useEffect, useState } from "react";
import { Input, Row, Typography, Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Container from "@/components/Container";
import { EventDto, eventService } from "@/services/eventService";
import EventCard from "@/components/EventCard";
import { useRouter } from "next/router";

const { Title, Text } = Typography;

const Home: FC = () => {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await eventService.getAllEvents(12, search);
        setEvents(response);
      } catch (error) {
        router.push("/500");
      }
    }
    fetchEvents();
  }, [search, router]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  return (
    <Container header={true}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
        <Card
          style={{
            textAlign: "center",
            marginBottom: "32px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            borderRadius: "12px",
          }}
        >
          <Title level={2} style={{ marginBottom: "16px" }}>
            Encontre ações voluntárias
          </Title>
          <Text
            type="secondary"
            style={{ display: "block", marginBottom: "24px" }}
          >
            Descubra e participe de ações sociais com ONGs
          </Text>
          <Input
            size="large"
            placeholder="Buscar ações voluntárias..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            style={{
              maxWidth: "600px",
              width: "100%",
              height: "45px",
              fontSize: "16px",
            }}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Card>

        <div style={{ margin: "0 -12px" }}>
          <Row gutter={[32, 32]}>
            {events.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default Home;
