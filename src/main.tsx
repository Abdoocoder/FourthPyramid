import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { convexClient, ConvexProvider } from "./lib/convex";
import "./index.css";
import App from "./App";

console.log(
  "%c🏭 Fourth Pyramid Plastic Industries%c\nPrecision engineering since 2016. Designed & built by Abdoo Coder — abdoocoder.dev",
  "color:#4A90E2;font-size:15px;font-weight:700;",
  "color:#4B5563;font-size:11px;"
);

const root = (
  <StrictMode>
    <App />
  </StrictMode>
);

const wrapped = convexClient ? (
  <ConvexProvider client={convexClient}>{root}</ConvexProvider>
) : root;

createRoot(document.getElementById("root")!).render(wrapped);
