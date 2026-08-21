import { AuthGate } from "@/components/layout/AuthGate";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate requires="authenticated" redirectTo="/login">
      {children}
    </AuthGate>
  );
}
