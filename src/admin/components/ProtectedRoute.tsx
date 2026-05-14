import { useUser, SignIn } from "@clerk/clerk-react";
import type { ReactNode } from "react";
import { AuthSkeleton } from "../../components/ui/Skeleton";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <AuthSkeleton />;
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-surface-container-low p-4">
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
