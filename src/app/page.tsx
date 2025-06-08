
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Leaf, Ticket, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-12">
      <header className="text-center space-y-4">
        <div className="inline-block p-4 bg-primary/10 rounded-full">
          <Leaf className="h-20 w-20 text-primary" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold font-headline text-primary">
          Welcome to ParkConnect
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Your seamless gateway to booking and managing visits for Chitwan National Park.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        <FeatureCard
          icon={<Ticket className="h-10 w-10 text-accent" />}
          title="Easy Ticket Booking"
          description="Quickly book your park entry tickets online. Hassle-free and efficient."
          link="/booking"
          linkLabel="Book Now"
        />
        <FeatureCard
          icon={<Users className="h-10 w-10 text-accent" />}
          title="For Park Staff"
          description="Admin and Operator tools for managing bookings and verifying tickets."
          link="/dashboard"
          linkLabel="Access Dashboard"
        />
        <FeatureCard
          icon={<BarChart3 className="h-10 w-10 text-accent" />}
          title="Transparent Pricing"
          description="Clear and straightforward pricing information for all visitor types."
          link="/pricing"
          linkLabel="View Pricing"
        />
      </section>
      
      <section className="w-full max-w-4xl text-center">
          <h2 className="text-3xl font-headline text-primary mb-6">Experience Chitwan National Park</h2>
          <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-xl">
            <Image 
                src="https://placehold.co/1200x675.png" 
                alt="Chitwan National Park scenery" 
                layout="fill"
                objectFit="cover"
                data-ai-hint="national park wildlife"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <p className="text-white text-2xl md:text-4xl font-headline p-4 bg-black/50 rounded">
                    Discover the Wilderness
                </p>
            </div>
          </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkLabel: string;
}

function FeatureCard({ icon, title, description, link, linkLabel }: FeatureCardProps) {
  return (
    <Card className="text-center hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
      <CardHeader className="items-center">
        <div className="p-3 bg-accent/10 rounded-full mb-3">
            {icon}
        </div>
        <CardTitle className="text-2xl font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="justify-center">
        <Link href={link} passHref>
          <Button variant="default" size="lg" className="font-semibold">{linkLabel}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

