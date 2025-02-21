import { FC, useEffect, useRef, useState, useContext } from "react";
import { Button, Layout, Space, Drawer, Switch } from "antd";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import {
  CalendarOutlined,
  LogoutOutlined,
  PlusOutlined,
  UserOutlined,
  MenuOutlined,
  BulbOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import styles from "./styles.module.css";
import { ThemeContext } from "@/pages/_app";

const { Header: AntHeader } = Layout;

const Header: FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOng = useRef<boolean>(null);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    isOng.current = session?.user?.role === "ONG";
  }, [session]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    await router.push("/");
    setMobileMenuOpen(false);
  };

  const NavItems = () => (
    <>
      {status === "authenticated" ? (
        <Space
          direction={mobileMenuOpen ? "vertical" : "horizontal"}
          size="middle"
          style={{ width: "100%" }}
        >
          <Switch
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            checked={darkMode}
            onChange={toggleTheme}
          />

          {session?.user?.role === "ONG" && (
            <Link href="/event/create">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  height: "40px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Nova Ação
              </Button>
            </Link>
          )}
          <Link href="/my-events">
            <Button
              type="text"
              icon={<UserOutlined />}
              style={{
                height: "40px",
                width: mobileMenuOpen ? "100%" : "auto",
                justifyContent: "center",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {isOng && isOng.current ? "Minhas Ações" : "Meus Voluntariados"}
            </Button>{" "}
          </Link>

          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleSignOut}
            style={{
              height: "40px",
              width: mobileMenuOpen ? "100%" : "auto",
              justifyContent: "center",
            }}
          >
            Sair
          </Button>
        </Space>
      ) : (
        <Space>
          <Switch
            checkedChildren={<BulbOutlined />}
            unCheckedChildren={<BulbOutlined />}
            checked={darkMode}
            onChange={toggleTheme}
          />
          <Link href="/login">
            <Button
              type="primary"
              style={{
                height: "40px",
                borderRadius: "6px",
                width: mobileMenuOpen ? "100%" : "auto",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Entrar
            </Button>
          </Link>
        </Space>
      )}
    </>
  );

  return (
    <AntHeader
      style={{
        background: darkMode ? "#141414" : "#fff",
        height: "64px",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Link href="/">
        <div
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "#1890ff",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CalendarOutlined />
          ONGConnect
        </div>
      </Link>

      <nav>
        <div className={styles.desktopMenu}>
          <NavItems />
        </div>

        <div className={styles.mobileMenu}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(true)}
            style={{ fontSize: "20px" }}
          />

          <Drawer
            title="Menu"
            placement="right"
            onClose={() => setMobileMenuOpen(false)}
            open={mobileMenuOpen}
            styles={{ body: { padding: 0 } }}
          >
            <div style={{ padding: "16px" }}>
              <NavItems />
            </div>
          </Drawer>
        </div>
      </nav>
    </AntHeader>
  );
};

export default Header;
