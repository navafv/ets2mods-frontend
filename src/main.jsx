// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { queryClient } from "./config/queryClient";
import "./styles/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
      <ReactQueryDevtools 
        initialIsOpen={false} 
        position="bottom-right"
        toggleButtonProps={{
          style: {
            margin: '1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '9999px',
            padding: '0.5rem',
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
);