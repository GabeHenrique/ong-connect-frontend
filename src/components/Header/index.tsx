import { FC, useEffect, useRef, useState, useContext } from "react";
import { Button, Layout, Space, Drawer, Switch } from "antd";
import Link from "next/link";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"ONG" | "VOLUNTEER" | null>(null);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole");
    setIsAuthenticated(!!token);
    setUserRole(role as "ONG" | "VOLUNTEER" | null);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUserRole(null);
    router.push("/");
    setMobileMenuOpen(false);
  };

  const NavItems = () => (
    <>
      {isAuthenticated ? (
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

          {userRole === "ONG" && (
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
              {userRole === "ONG" ? "Minhas Ações" : "Meus Voluntariados"}
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
