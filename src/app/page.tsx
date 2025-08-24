import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { CTA } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';
import { AboutSection } from '@/components/landing/about';
import { Pricing } from '@/components/landing/pricing';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Pricing />
      <AboutSection />
      <Footer />
      
     
    </div>
  );
}
