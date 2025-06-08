
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
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
      <body className="font-body antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster />
        <footer className="py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ParkConnect. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
