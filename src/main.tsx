import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import theme from "./theme";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoogleOAuthProvider clientId="719024491428-tbr6embr99rrrfvml3vdqpjdo35o9ghe.apps.googleusercontent.com">
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
