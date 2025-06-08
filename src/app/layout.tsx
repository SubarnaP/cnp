
import type { Metadata } from 'next';
import './globals.css';
import AppSidebar from '@/components/AppSidebar'; // Add AppSidebar
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'ParkConnect - Chitwan National Park Booking',
  description: 'Book your tickets for Chitwan National Park easily with ParkConnect.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-grow ml-64"> {/* Wrapper for main content + footer */}
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="py-6 text-center text-muted-foreground border-t border-border bg-background">
            <p>&copy; {new Date().getFullYear()} ParkConnect. All rights reserved.</p>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
