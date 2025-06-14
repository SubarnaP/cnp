
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, LayoutDashboard, Users, Ticket, ScanLine, CircleDollarSign, LogOut } from 'lucide-react'; // Added LogOut
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';

const mainNavLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/visitors', label: 'Visitors', icon: Users },
  { href: '/booking', label: 'Ticketing', icon: Ticket },
  { href: '/scan-tickets', label: 'Scan Tickets', icon: ScanLine },
  { href: '/pricing', label: 'Pricing', icon: CircleDollarSign },
];

export default function AppSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    // In a real app, implement actual logout logic (e.g., clearing session, tokens)
    alert('Logged out (Demo)! You would be redirected to the login page.');
    // router.push('/login'); // Would need useRouter from 'next/navigation'
  };

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col fixed h-screen">
      {/* Logo Section */}
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-sidebar-logoSquare p-2 rounded-md">
            <Leaf className="h-7 w-7 text-sidebar-logoIcon" />
          </div>
          <span className="text-xl font-semibold text-sidebar-foreground">Chitwan National Park</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        {mainNavLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href) && link.href.split('/').length > 1 && pathname.split('/').length > 1 );
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium transition-colors",
                isActive
                  ? "bg-sidebar-active text-sidebar-active-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-hover-foreground"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      
      {/* Logout and User Profile stick to bottom */}
      <div className="mt-auto"> {/* This div will be pushed to the bottom */}
        <div className="p-4 border-t border-sidebar-border">
          <Link
            href="/login" // Navigates to login page for demo
            onClick={handleLogout} // Added onClick for demo alert
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium transition-colors w-full",
              "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-hover-foreground"
            )}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://placehold.co/40x40.png" alt="Park Admin" data-ai-hint="person portrait" />
              <AvatarFallback>PA</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-sidebar-foreground">Park Admin</p>
              <p className="text-xs text-sidebar-foreground opacity-80">admin@chitwanpark.gov</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
