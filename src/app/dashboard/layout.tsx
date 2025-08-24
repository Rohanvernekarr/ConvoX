import { AuthGuard } from '@/components/auth/auth-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('Rendering dashboard layout');
  
  return (
    <AuthGuard requireOnboarding={false}>
      {children}
    </AuthGuard>
  );
}
