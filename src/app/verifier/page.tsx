
import { Lock, Construction } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verifier Dashboard - ParkConnect Admin',
  description: 'Verifier dashboard for Chitwan National Park bookings.',
};

export default function VerifierPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-8 bg-card rounded-lg shadow-xl">
      <Construction className="h-24 w-24 text-primary mb-6 animate-pulse" />
      <h1 className="text-4xl font-headline font-semibold text-primary mb-4">
        <Lock className="inline-block h-10 w-10 mr-3" />
        Verifier Dashboard
      </h1>
      <p className="text-xl text-muted-foreground max-w-md">
        This section is currently under development and will be available soon for manual ticket verification.
      </p>
      <p className="mt-8 text-sm text-accent">
        Stay tuned for updates!
      </p>
    </div>
  );
}
