"use client";

import * as React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme"; // si tienes uno

const cache = createCache({
  key: "css",
  prepend: true,
});

export default function ThemeRegistry({ children }) {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}