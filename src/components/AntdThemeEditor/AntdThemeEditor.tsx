import { useState } from "react";

import { ThemeConfig } from "antd";
import { enUS, ThemeEditor, zhCN } from "antd-token-previewer";

import { useLocale } from "./hooks/useLocale";

export function AntdThemeEditor() {
  const { lang } = useLocale();
  const [theme, setTheme] = useState<ThemeConfig>({});

  return (
    <div
      style={{
        padding: "10px",
        paddingTop: 0,
      }}
    >
      <ThemeEditor
        theme={{ name: "Custom Theme", key: "test", config: theme }}
        style={{ height: "calc(100vh)", background: "red" }}
        onThemeChange={(newTheme) => {
          setTheme(newTheme.config);
        }}
        locale={lang === "cn" ? zhCN : enUS}
      />
    </div>
  );
}
