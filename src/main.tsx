import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { convexClient, ConvexProvider } from "./lib/convex";
import "./index.css";
import App from "./App";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function Providers({ children }: { children: React.ReactNode }) {
  let content = children;

  if (clerkKey) {
    content = <ClerkProvider publishableKey={clerkKey}>{content}</ClerkProvider>;
  }

  if (convexClient) {
    content = <ConvexProvider client={convexClient}>{content}</ConvexProvider>;
  }

  return content;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
