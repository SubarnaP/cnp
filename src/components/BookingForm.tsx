
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import VisitorFields from './VisitorFields';
import { addBooking, getPricingConfig, type PricingConfig } from '@/lib/firestore';
import type { Visitor, CountryOption } from '@/types/booking';
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, UserPlus, Users, DollarSign, Leaf, Mail, Phone, Info, Loader2 } from 'lucide-react';
import { format } from "date-fns";
import Image from 'next/image';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { PRICING_TIERS as DEFAULT_PRICING_TIERS } from '@/lib/helpers';


const visitorSchema = z.object({
  id: z.string(), // For client-side keying
  name: z.string().min(1, 'Visitor name is required'),
  country: z.enum(['Nepal', 'SAARC', 'Other'], { required_error: 'Country is required' }),
});

const bookingFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  dateOfVisit: z.date({ required_error: "Date of visit is required." }),
  numberOfVisitors: z.number().min(1, 'At least one visitor is required').max(50, 'Maximum 50 visitors allowed'),
  visitors: z.array(visitorSchema).min(1, 'Visitor details are required'),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function BookingForm() {
  const { toast } = useToast();
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pricingTiers, setPricingTiers] = useState<PricingConfig>(DEFAULT_PRICING_TIERS);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);

  // Helper function to calculate total price using current pricingTiers
  const calculateDynamicTotalPrice = useCallback((visitors: Array<{ country: string }>) => {
    if (!pricingTiers) return 0; // Or handle loading state appropriately
    return visitors.reduce((total, visitor) => {
      const price = pricingTiers[visitor.country as keyof PricingConfig] || 0;
      return total + price;
    }, 0);
  }, [pricingTiers]);


  useEffect(() => {
    async function fetchPrices() {
      setIsLoadingPrices(true);
      try {
        const fetchedPrices = await getPricingConfig();
        setPricingTiers(fetchedPrices);
      } catch (error) {
        console.error("Failed to fetch pricing for booking form:", error);
        toast({
          title: 'Could Not Load Latest Prices',
          description: 'Using default prices. Please check your connection or try again.',
          variant: 'destructive',
          duration: 7000,
        });
        // Fallback to default prices already set in useState initial value
      } finally {
        setIsLoadingPrices(false);
      }
    }
    fetchPrices();
  }, [toast]);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      dateOfVisit: undefined,
      numberOfVisitors: 1,
      visitors: [{ id: crypto.randomUUID(), name: '', country: 'Nepal' as CountryOption }],
    },
  });

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'visitors',
  });

  const watchedVisitors = watch('visitors');
  const numberOfVisitors = watch('numberOfVisitors');

  // Update total price when visitors change (including country changes) or when pricingTiers are loaded/updated
  useEffect(() => {
    if (watchedVisitors && watchedVisitors.length > 0 && pricingTiers) {
      const newTotal = calculateDynamicTotalPrice(watchedVisitors);
      setTotalPrice(newTotal);
    } else {
      setTotalPrice(0);
    }
  }, [JSON.stringify(watchedVisitors), pricingTiers, calculateDynamicTotalPrice]);


  // Sync visitor fields with numberOfVisitors input
  useEffect(() => {
    const currentVisitorCount = fields.length;
    if (numberOfVisitors > 0 && numberOfVisitors <= 50) { // Ensure valid number before adjusting
        if (numberOfVisitors > currentVisitorCount) {
        for (let i = 0; i < numberOfVisitors - currentVisitorCount; i++) {
            append({ id: crypto.randomUUID(), name: '', country: 'Nepal' as CountryOption });
        }
        } else if (numberOfVisitors < currentVisitorCount) {
        for (let i = 0; i < currentVisitorCount - numberOfVisitors; i++) {
            remove(currentVisitorCount - 1 - i);
        }
        }
    } else if (numberOfVisitors === 0 && currentVisitorCount > 0) { // If number of visitors is set to 0, remove all fields
        for (let i = currentVisitorCount - 1; i >= 0; i--) {
            remove(i);
        }
    }
  }, [numberOfVisitors, fields.length, append, remove]);

  const onSubmit: SubmitHandler<BookingFormData> = async (data) => {
    setIsSubmitting(true);
    if (isLoadingPrices) {
        toast({
            title: "Prices still loading",
            description: "Please wait for the latest prices to load before booking.",
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }
    try {
      const finalTotalPrice = calculateDynamicTotalPrice(data.visitors);
      const bookingDataToSave = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        dateOfVisit: format(data.dateOfVisit, "yyyy-MM-dd"),
        numberOfVisitors: data.numberOfVisitors,
        visitors: data.visitors.map(v => ({ name: v.name, country: v.country })), // Store without client-side id
        totalPrice: finalTotalPrice,
      };

      const bookingId = await addBooking(bookingDataToSave);
      toast({
        title: "Booking Successful!",
        description: (
          <div>
            <p>Your booking ID is {bookingId}.</p>
            <p>Visit Date: {format(data.dateOfVisit, "PPP")}</p>
            <p>Total Amount: Rs. {finalTotalPrice.toLocaleString()}</p>
          </div>
        ),
        variant: "default",
        duration: 7000,
      });
      form.reset();
      setTotalPrice(0); // Reset total price display after successful booking
    } catch (error) {
      console.error("Booking failed:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-headline">Book Your Park Visit</CardTitle>
        </div>
        <CardDescription>Fill in the details below to secure your tickets for Chitwan National Park.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="fullName">Full Name</Label>
                    <FormControl>
                      <Input id="fullName" placeholder="e.g. John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email"><Mail className="inline h-4 w-4 mr-1" />Email</Label>
                    <FormControl>
                      <Input id="email" type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="phone"><Phone className="inline h-4 w-4 mr-1" />Phone</Label>
                    <FormControl>
                      <Input id="phone" type="tel" placeholder="9800000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
             <FormField
                control={control}
                name="dateOfVisit"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Label htmlFor="dateOfVisit"><CalendarIcon className="inline h-4 w-4 mr-1" />Date of Visit</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) } // Disable past dates
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="numberOfVisitors"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="numberOfVisitors"><Users className="inline h-4 w-4 mr-1" />Number of Visitors</Label>
                  <FormControl>
                    <Input
                      id="numberOfVisitors"
                      type="number"
                      min="1"
                      max="50"
                      placeholder="Enter number of visitors"
                      {...field}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground mt-1">
                    Maximum 50 visitors allowed per booking
                  </p>
                </FormItem>
              )}
            />

            {fields.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold font-headline text-primary">Visitor Details</h3>
                {fields.map((field, index) => (
                  <VisitorFields key={field.id} index={index} register={register} control={control} errors={errors} />
                ))}
              </div>
            )}

            <Card className="bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <DollarSign className="h-6 w-6 mr-2 text-primary" />Total Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingPrices ? (
                    <div className="flex items-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                        <p className="text-lg text-muted-foreground">Loading prices...</p>
                    </div>
                ) : (
                    <p className="text-3xl font-bold text-primary">Rs. {totalPrice.toLocaleString()}</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-accent/10 border-accent">
                <CardHeader className="flex flex-row items-start space-x-3 pb-3">
                    <Image src="https://placehold.co/100x40.png" alt="eSewa Logo" width={80} height={32} data-ai-hint="logo payment" className="rounded"/>
                    <div>
                        <CardTitle className="text-lg text-accent-foreground/90">Pay securely with eSewa</CardTitle>
                         <CardDescription className="text-accent-foreground/70">
                            Currently, we only support payment via eSewa. Please proceed with the booking and follow instructions for payment.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-accent-foreground/80">
                        <Info className="inline h-4 w-4 mr-1 text-accent"/>
                        This is a demo. No actual payment will be processed.
                    </p>
                    <Button
                        type="button"
                        onClick={() => window.alert('✅ eSewa payment successful!')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                        Pay with eSewa (Demo)
                    </Button>
                    <p className="text-xs text-center text-accent-foreground/70 mt-2">
                        Note: This is a demo payment button for testing purposes only. No real transaction will occur.
                    </p>
                </CardContent>
            </Card>

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting || isLoadingPrices}>
              {isSubmitting ? 'Processing...' : 'Book Tickets Now'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

    