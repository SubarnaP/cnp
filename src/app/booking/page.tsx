import BookingForm from '@/components/BookingForm';
import type { Metadata } from 'next';
import { Leaf, MapPin, Clock, Shield, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const metadata: Metadata = {
  title: 'Book Tickets - ParkConnect',
  description: 'Book your entry tickets for Chitwan National Park. Secure your visit with our easy online booking system.',
};

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Book Your Park Visit</h1>
          </div>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Experience the wildlife wonders of Chitwan National Park. Book your tickets online for a seamless entry experience.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-2">
            <BookingForm />
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Important Notice */}
            <Alert className="border-amber-200 bg-amber-50">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Important:</strong> Please carry a valid ID proof during your visit. Tickets are non-refundable once booked.
              </AlertDescription>
            </Alert>

            {/* Park Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <MapPin className="h-5 w-5" />
                  Park Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Opening Hours</h4>
                    <p className="text-sm text-muted-foreground">
                      6:00 AM - 6:00 PM (Daily)<br />
                      Last entry: 5:00 PM
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Location</h4>
                    <p className="text-sm text-muted-foreground">
                      Chitwan National Park<br />
                      Bharatpur, Nepal
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">What to Bring</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Valid ID proof</li>
                      <li>• Comfortable walking shoes</li>
                      <li>• Water bottle</li>
                      <li>• Camera (photography allowed)</li>
                      <li>• Sun protection</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card className="shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-green-700">Ticket Pricing</CardTitle>
                <CardDescription>
                  All prices are per person entry fees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <div>
                      <span className="font-semibold">Nepali Citizens</span>
                      <p className="text-xs text-muted-foreground">Valid citizenship required</p>
                    </div>
                    <span className="text-lg font-bold text-green-600">Rs. 100</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <div>
                      <span className="font-semibold">SAARC Countries</span>
                      <p className="text-xs text-muted-foreground">India, Pakistan, Bangladesh, etc.</p>
                    </div>
                    <span className="text-lg font-bold text-green-600">Rs. 200</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <div>
                      <span className="font-semibold">International</span>
                      <p className="text-xs text-muted-foreground">All other countries</p>
                    </div>
                    <span className="text-lg font-bold text-green-600">Rs. 1,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-700">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold">Customer Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Phone: +977-1-234-5678<br />
                    Email: support@parkconnect.com
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Office Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Monday - Friday: 9:00 AM - 5:00 PM<br />
                    Saturday: 9:00 AM - 1:00 PM
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-green-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-6 w-6" />
            <h3 className="text-xl font-semibold">ParkConnect</h3>
          </div>
          <p className="text-green-200 max-w-2xl mx-auto">
            Your gateway to Nepal's natural heritage. Book with confidence and explore responsibly.
          </p>
          <div className="mt-4 text-sm text-green-300">
            <p>© 2024 ParkConnect. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </div>
    </div>
  );
}