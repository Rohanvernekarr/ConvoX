import { AuthGuard } from '@/components/auth/auth-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('Rendering dashboard layout');
  
  return (
    <AuthGuard requireOnboarding={false}>
      <div className="min-h-screen w-full flex bg-gray-100">
        {children}
      </div>
    </AuthGuard>
  );
}
