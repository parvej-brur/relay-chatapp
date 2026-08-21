import { AuthGate } from "@/components/layout/AuthGate";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate requires="unauthenticated" redirectTo="/chat">
      {children}
    </AuthGate>
  );
}
