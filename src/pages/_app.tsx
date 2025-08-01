import { AppProps } from "next/app";
import { ConfigProvider, theme } from "antd";
import ptBR from "antd/locale/pt_BR";
import "../styles/globals.css";
import React, { createContext, useEffect, useState } from "react";
import Head from "next/head";

export const ThemeContext = createContext({
  darkMode: false,
  toggleTheme: () => {},
});

function MyApp({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode) {
      setDarkMode(JSON.parse(darkMode));
      document.body.style.background = "#141414";
    }
  }, []);

  const toggleTheme = () => {
    localStorage.setItem("darkMode", JSON.stringify(!darkMode));
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.style.background = "#141414";
    } else {
      document.body.style.background = "#f5f5f5";
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <Head>
        <title>ONG Connect</title>
        <meta
          name="description"
          content="Conectando pessoas a ações voluntárias"
        />
      </Head>
      <ConfigProvider
        locale={ptBR}
        theme={{
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <Component {...pageProps} />
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export default MyApp;
