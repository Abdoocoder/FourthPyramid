import { useUser, SignIn } from "@clerk/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useState, type ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const adminRecord = useQuery(
    api.admins.getByClerkId,
    isSignedIn && user ? { clerkId: user.id } : "skip",
  );
  const bootstrapSelf = useMutation(api.admins.bootstrapSelf);
  const [bootstrapping, setBootstrapping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded || (isSignedIn && adminRecord === undefined)) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-surface-container-low">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-surface-container-low p-4">
        <SignIn routing="path" path="/admin" fallbackRedirectUrl="/admin" />
      </div>
    );
  }

  if (!adminRecord) {
    const handleBootstrap = async () => {
      setBootstrapping(true);
      setError(null);
      try {
        await bootstrapSelf();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Bootstrap failed");
        setBootstrapping(false);
      }
    };

    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-surface-container-low p-4">
        <div className="bg-surface border border-outline-variant rounded-2xl p-8 max-w-sm w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm text-on-surface">Admin Setup</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              No admin account found. Initialize your access to continue.
            </p>
          </div>
          {error && (
            <p className="font-body-sm text-body-sm text-error bg-error-container rounded-lg px-3 py-2">{error}</p>
          )}
          <button
            onClick={handleBootstrap}
            disabled={bootstrapping}
            className="w-full bg-primary text-on-primary font-label-lg text-label-lg rounded-xl px-4 py-3 hover:opacity-90 transition-opacity disabled:opacity-50 min-h-11"
          >
            {bootstrapping ? "Initializing…" : "Initialize Admin Access"}
          </button>
          <p className="font-body-xs text-body-xs text-on-surface-variant">
            Signed in as {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
