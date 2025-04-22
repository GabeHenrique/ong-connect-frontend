import React, { FC, ReactNode, useContext } from "react";
import { Layout } from "antd";
import Header from "../Header";
import styles from "./styles.module.css";
import { ThemeContext } from "@/pages/_app";

const { Content } = Layout;

interface ContainerProps {
  children: ReactNode;
  header?: boolean;
  fluid?: boolean;
  background?: string;
}

const Container: FC<ContainerProps> = ({
  children,
  header = true,
  fluid = false,
}) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <Layout
      style={{
        background: darkMode ? "#1f1f1f" : "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {header && <Header />}
      <Content
        className={`${styles.content} ${fluid ? styles.fluid : ""}`}
        style={{
          minHeight: header ? "calc(100vh - 64px)" : "100vh",
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default Container;
