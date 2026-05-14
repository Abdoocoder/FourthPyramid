import { useUser, SignIn } from "@clerk/clerk-react";
import type { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-low" role="status" aria-label="Loading">
        <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading admin panel…</span>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-low p-4">
        <SignIn
          routing="path"
          path="/admin"
          afterSignInUrl="/admin"
        />
      </div>
    );
  }

  return <>{children}</>;
}
