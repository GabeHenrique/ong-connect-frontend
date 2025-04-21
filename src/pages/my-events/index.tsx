import React, { FC, useEffect, useState } from "react";
import Container from "@/components/Container";
import { Card, Empty, Row, Space, Typography } from "antd";
import EventCard from "@/components/EventCard";
import { EventDto, eventService } from "@/services/eventService";
import { User } from "@/types/user";

const { Title, Text } = Typography;

const MyEvents: FC = () => {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [isOng, setIsOng] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
   const [user, setUser] = useState<User>();
 
   useEffect(() => {
     const userStorage = localStorage.getItem("user");
     setUser(userStorage ? JSON.parse(userStorage) : null);

  }, []);

  useEffect(() => {

    if (!user) return;
    setIsOng(user?.role === "ONG");

    async function fetchEvents() {
      if (user?.accessToken && user?.email) {
        const response = await eventService.getEventsByUser(user.accessToken, user.email);
        setEvents(response);
      }
    }

    fetchEvents();
    setIsLoading(false);
  }, [user]);

  return !isLoading && (
    <Container header={true}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "24px",
        }}
      >
        <Card
          style={{
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            borderRadius: "12px",
            marginBottom: "24px",
          }}
        >
          <Space align="center" style={{ width: "100%" }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                {isOng && isOng
                  ? "Ações da minha ONG"
                  : "Meus Voluntariados"}
              </Title>
              <Text type="secondary">
                {isOng && isOng
                  ? "Veja as ações que sua ONG está promovendo"
                  : "Veja as ações que você está participando"}
              </Text>
            </div>
          </Space>
        </Card>

        {events.length === 0 ? (
          <Card
            style={{
              textAlign: "center",
              padding: "48px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              borderRadius: "12px",
            }}
          >
            <Empty
              description={
                <Text type="secondary" style={{ fontSize: "16px" }}>
                  {isOng && isOng
                    ? "Você ainda não criou nenhuma ação voluntária"
                    : "Você ainda não participa de nenhuma ação voluntária"}
                </Text>
              }
            />
          </Card>
        ) : (
          <Row gutter={[32, 32]}>
            {events.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </Row>
        )}
      </div>
    </Container>
  );
};

export default MyEvents;
