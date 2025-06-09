
"use client"; // Required for usePathname

import { usePathname } from 'next/navigation'; // Import usePathname
// import type { Metadata } from 'next'; // Removed as metadata export is removed
import './globals.css';
import AppSidebar from '@/components/AppSidebar';
import { Toaster } from "@/components/ui/toaster";

// Metadata cannot be directly exported from a Client Component.
// Individual pages or a parent Server Component should handle metadata.
// export const metadata: Metadata = {
// title: 'ParkConnect - Chitwan National Park Booking',
// description: 'Book your tickets for Chitwan National Park easily with ParkConnect.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased"> {/* Removed min-h-screen flex from body */}
        {isLoginPage ? (
          <div className="min-h-screen bg-background"> {/* Apply min-h-screen and bg here for login */}
            {children}
          </div>
        ) : (
          <div className="flex min-h-screen bg-background"> {/* Apply min-h-screen and bg here for app layout */}
            <AppSidebar />
            <div className="flex flex-col flex-grow ml-64"> {/* Wrapper for main content + footer. ml-64 matches sidebar width */}
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              <footer className="py-6 text-center text-muted-foreground border-t border-border"> {/* Removed bg-background as parent has it */}
                <p>&copy; {new Date().getFullYear()} ParkConnect. All rights reserved.</p>
              </footer>
            </div>
          </div>
        )}
        <Toaster /> {/* Single Toaster instance outside conditional layout */}
      </body>
    </html>
  );
}
