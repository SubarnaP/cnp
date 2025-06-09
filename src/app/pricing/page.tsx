
"use client";

import { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getPricingConfig, updatePricingConfig, type PricingConfig } from '@/lib/firestore';
import { DollarSign, Tag, Loader2 } from 'lucide-react';
import type { Metadata } from 'next';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

// Metadata can still be defined for static parts of the page
// export const metadata: Metadata = { // Cannot be used in client component this way
//   title: 'Manage Pricing - ParkConnect Admin',
//   description: 'Update ticket pricing tiers for Chitwan National Park.',
// };

const pricingFormSchema = z.object({
  Nepal: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  SAARC: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  Other: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
});

type PricingFormData = z.infer<typeof pricingFormSchema>;

export default function PricingPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PricingFormData>({
    resolver: zodResolver(pricingFormSchema),
    defaultValues: {
      Nepal: 0,
      SAARC: 0,
      Other: 0,
    },
  });

  useEffect(() => {
    async function fetchPrices() {
      setIsLoading(true);
      try {
        const currentPrices = await getPricingConfig();
        form.reset(currentPrices); // Populate form with fetched prices
      } catch (error) {
        console.error("Failed to fetch pricing configuration:", error);
        toast({
          title: 'Error Fetching Prices',
          description: 'Could not load current prices. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchPrices();
  }, [form, toast]);

  const onSubmit: SubmitHandler<PricingFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await updatePricingConfig(data);
      toast({
        title: 'Prices Updated Successfully',
        description: 'The new ticket prices have been saved.',
        variant: 'default',
      });
    } catch (error) {
      console.error("Failed to update pricing:", error);
      toast({
        title: 'Error Updating Prices',
        description: 'Could not save the new prices. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading pricing information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Tag className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Manage Ticket Prices</CardTitle>
          </div>
          <CardDescription>Update the entry fees for different visitor categories. Changes will apply to new bookings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="Nepal"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="nepalPrice" className="text-lg">Nepali Citizen Price (NPR)</Label>
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <FormControl>
                            <Input id="nepalPrice" type="number" placeholder="e.g., 100" {...field} className="text-lg"/>
                        </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="SAARC"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="saarcPrice" className="text-lg">SAARC Country Citizen Price (NPR)</Label>
                     <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <FormControl>
                            <Input id="saarcPrice" type="number" placeholder="e.g., 200" {...field} className="text-lg"/>
                        </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Other"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="otherPrice" className="text-lg">Other Foreign Citizen Price (NPR)</Label>
                     <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <FormControl>
                            <Input id="otherPrice" type="number" placeholder="e.g., 1000" {...field} className="text-lg"/>
                        </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting || isLoading}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Updating...
                  </>
                ) : (
                  'Update Prices'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
       <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
        Note: Access to this page should be restricted to administrators in a production environment.
      </p>
    </div>
  );
}
