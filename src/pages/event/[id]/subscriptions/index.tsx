import { FC, useContext, useEffect, useRef, useState } from "react";
import { eventService, VolunteerApplicationDto } from "@/services/eventService";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Container from "@/components/Container";
import { ThemeContext } from "@/pages/_app";
import { Table, TableProps } from "antd";
import Title from "antd/lib/typography/Title";
import Link from "next/link";

const Volunteers: FC = () => {
  const [volunteers, setVolunteers] = useState<VolunteerApplicationDto[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const { darkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const eventName = useRef("");

  useEffect(() => {
    if (!session || session.user?.role !== "ONG") {
      router.push("/");
    }
  }, [session, router]);

  useEffect(() => {
    if (!session || !id) return;
    const fetchVolunteers = async () => {
      const result = await eventService.getVolunteers(
        +id,
        session?.accessToken
      );
      if (result.length > 0) {
        eventName.current = result[0].eventName;
      }
      setLoading(false);
      setVolunteers(result);
    };
    fetchVolunteers();
  }, [id, session]);

  const columns: TableProps<VolunteerApplicationDto>["columns"] = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Telefone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Qualificações",
      dataIndex: "qualifications",
      key: "qualifications",
    },
    {
      title: "Observações",
      dataIndex: "observations",
      key: "observations",
    },
  ];

  return (
    <Container header>
      <div
        style={{
          maxWidth: 1200,
          margin: "40px auto",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: "8px",
          background: darkMode ? "#1f1f1f" : "#fff",
        }}
      >
        <Title level={3} style={{ padding: "16px" }}>
          Voluntários do evento{" "}
          <Link href={`/event/${id}`}>
            <i>{eventName.current}</i>
          </Link>
        </Title>
        <Table<VolunteerApplicationDto>
          footer={() => (
            <p style={{ textAlign: "right", paddingRight: "16px" }}>
              <strong>{"Total de inscritos: " + volunteers.length}</strong>
            </p>
          )}
          loading={loading}
          rowKey="id"
          columns={columns}
          dataSource={volunteers}
        />
      </div>
    </Container>
  );
};

export default Volunteers;
