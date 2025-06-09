
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, LogIn, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle authentication here
    console.log("Login attempt with:", { email, password });
    toast({
      title: "Login Attempt (Demo)",
      description: `Email: ${email}. In a real app, this would verify credentials. Redirecting to dashboard.`,
      duration: 5000,
    });
    // For demo purposes, redirect to dashboard after "login"
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl rounded-xl">
        <CardHeader className="text-center pt-8">
          <Link href="/" className="inline-block mx-auto mb-6">
            <div className="p-4 bg-primary/10 rounded-full shadow-md">
              <Leaf className="h-14 w-14 text-primary" />
            </div>
          </Link>
          <CardTitle className="text-4xl font-headline text-primary">Welcome Back</CardTitle>
          <CardDescription className="text-md text-muted-foreground pt-1">
            Sign in to manage Chitwan National Park services.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center text-sm font-medium">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-base py-3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center text-sm font-medium">
                <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-base py-3"
              />
            </div>
            <Button type="submit" className="w-full text-lg py-6 rounded-md">
              <LogIn className="mr-2 h-5 w-5" />
              Sign In
            </Button>
          </form>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/booking" className="font-semibold text-primary hover:underline">
              Book Tickets
            </Link>
            {/* In a real app, this might be a link to a signup page */}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
