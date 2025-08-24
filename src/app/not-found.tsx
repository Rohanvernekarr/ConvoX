import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-6xl font-bold text-white mb-4">404</h2>
        <h3 className="text-2xl font-semibold text-white mb-2">Page Not Found</h3>
        <p className="text-zinc-400 mb-6">Could not find the requested resource</p>
        <Link href="/">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
