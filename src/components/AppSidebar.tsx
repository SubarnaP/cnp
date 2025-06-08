
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, LayoutDashboard, Users, Ticket, ScanLine, CircleDollarSign, ShieldAlert } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';

const mainNavLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/visitors', label: 'Visitors', icon: Users },
  { href: '/booking', label: 'Ticketing', icon: Ticket },
  { href: '/scan-tickets', label: 'Scan Tickets', icon: ScanLine },
  { href: '/pricing', label: 'Pricing', icon: CircleDollarSign },
  { href: '/verifier', label: 'Verifier', icon: ShieldAlert },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col fixed h-screen_remove_fixed_if_collapsible_later">
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
      <nav className="flex-grow p-4 space-y-1">
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

      {/* User Profile Section */}
      <div className="p-4 mt-auto border-t border-sidebar-border">
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
    </aside>
  );
}
