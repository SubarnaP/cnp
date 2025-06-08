
"use client";
import Link from 'next/link';
import { Leaf, Ticket, LayoutDashboard, ScanLine, CircleDollarSign, Menu, X, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/booking', label: 'Book Tickets', icon: Ticket },
  { href: '/dashboard', label: 'Dashboard (Admin)', icon: LayoutDashboard },
  { href: '/pricing', label: 'Pricing (Admin)', icon: CircleDollarSign },
  { href: '/verifier', label: 'Verifier (Admin)', icon: ShieldAlert },
  { href: '/scan-tickets', label: 'Scan Tickets (Operator)', icon: ScanLine },
];


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const NavLinkItem = ({ href, label, icon: Icon, onClick }: { href: string; label: string; icon: React.ElementType; onClick?: () => void }) => (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-left text-base md:text-sm",
          pathname === href ? "bg-primary/10 text-primary" : "hover:bg-primary/5"
        )}
        onClick={onClick}
      >
        <Icon className="mr-2 h-5 w-5" />
        {label}
      </Button>
    </Link>
  );
  
  return (
    <header className="bg-background/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Leaf className="h-8 w-8" />
          <span className="text-2xl font-headline font-semibold">ParkConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link href={link.href} key={link.href} passHref>
               <Button 
                variant={pathname === link.href ? "secondary" : "ghost"} 
                size="sm"
                className={cn(pathname === link.href ? "font-semibold" : "")}
               >
                <link.icon className="mr-1.5 h-4 w-4" />
                {link.label.split('(')[0].trim()} {/* Shorten label for desktop */}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0">
                <div className="p-4 border-b">
                    <Link href="/" className="flex items-center gap-2 text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                        <Leaf className="h-7 w-7" />
                        <span className="text-xl font-headline font-semibold">ParkConnect</span>
                    </Link>
                </div>
                <nav className="flex flex-col space-y-2 p-4">
                    {navLinks.map((link) => (
                       <NavLinkItem
                        key={link.href}
                        href={link.href}
                        label={link.label}
                        icon={link.icon}
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                    ))}
                </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
