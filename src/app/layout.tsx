import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { GridBackground } from '@/components/ui/gridBackground';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ConvoX - Discord-like Video Calling App',
  description: 'Connect with friends through voice and video calls while gaming or working',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <GridBackground />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
