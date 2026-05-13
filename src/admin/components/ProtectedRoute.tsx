import { useUser, SignIn } from "@clerk/clerk-react";
import type { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
        <div className="animate-pulse text-on-surface-variant">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-low p-4">
        <SignIn
          routing="path"
          path="/admin"
          signUpUrl="/admin/sign-up"
          afterSignInUrl="/admin"
          afterSignUpUrl="/admin"
        />
      </div>
    );
  }

  return <>{children}</>;
}
