import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Login from '@/pages/Login';
import { Loader2 } from 'lucide-react';

export function AuthGate({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return <>{children}</>;
}
