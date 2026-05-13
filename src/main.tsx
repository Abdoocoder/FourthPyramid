import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { convexClient, ConvexProvider } from "./lib/convex";
import "./index.css";
import App from "./App";

const root = (
  <StrictMode>
    <App />
  </StrictMode>
);

const wrapped = convexClient ? (
  <ConvexProvider client={convexClient}>{root}</ConvexProvider>
) : root;

createRoot(document.getElementById("root")!).render(wrapped);
