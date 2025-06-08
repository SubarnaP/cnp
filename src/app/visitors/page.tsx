
import { Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Visitors - ParkConnect',
  description: 'Manage and view visitor information.',
};

export default function VisitorsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] text-center p-8 bg-card rounded-lg shadow-lg">
      <Users className="h-24 w-24 text-primary mb-6 animate-pulse" />
      <h1 className="text-4xl font-headline font-semibold text-primary mb-4">
        Visitor Management
      </h1>
      <p className="text-xl text-muted-foreground max-w-md">
        This section is currently under development. Features for visitor management will be available here soon.
      </p>
       <p className="mt-8 text-sm text-accent">
        Thank you for your patience!
      </p>
    </div>
  );
}
