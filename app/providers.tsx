"use client";

import { CacheProvider } from "@emotion/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import createCache from "@emotion/cache";

const cache = createCache({ key: "css", prepend: true });

const theme = createTheme({
  palette: { mode: "light" },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}