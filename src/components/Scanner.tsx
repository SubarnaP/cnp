
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, CheckCircle2, XCircle, Info, Loader2, Search } from 'lucide-react';
import type { Booking } from '@/types/booking';
import { getBookingById } from '@/lib/firestore'; // Assuming this is your Firestore helper
import { format } from 'date-fns';

interface ScannerProps {
  onScanSuccess: (booking: Booking) => void;
  onScanError: (message: string) => void;
}

export default function Scanner({ onScanSuccess, onScanError }: ScannerProps) {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [manualId, setManualId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false); // Mock scanning state

  // This useEffect simulates fetching booking details after a scan or manual input
  useEffect(() => {
    if (scannedData) {
      fetchBooking(scannedData);
    }
  }, [scannedData]);

  const fetchBooking = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setBookingDetails(null);
    try {
      const booking = await getBookingById(id); // Use your actual Firestore function
      if (booking) {
        setBookingDetails(booking);
        onScanSuccess(booking);
      } else {
        setError(`Booking ID "${id}" not found.`);
        onScanError(`Booking ID "${id}" not found.`);
      }
    } catch (err) {
      console.error('Error fetching booking:', err);
      setError('Failed to fetch booking details. Please try again.');
      onScanError('Failed to fetch booking details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSearch = () => {
    if (manualId.trim()) {
      setScannedData(manualId.trim()); // Trigger useEffect by setting scannedData
    }
  };

  // Mock QR Scanner behavior
  const startMockScan = () => {
    setIsScanning(true);
    setError(null);
    setBookingDetails(null);
    // Simulate a scan after a delay
    setTimeout(() => {
      const mockBookingId = 'CNP-MOCK1-SCAN'; // Simulate a scanned ID
      setScannedData(mockBookingId);
      setIsScanning(false);
      // You might want to call fetchBooking directly here as well if setScannedData doesn't trigger it fast enough
      // fetchBooking(mockBookingId); 
    }, 2000);
  };


  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <QrCode className="h-7 w-7 mr-2 text-primary" /> Ticket Scanner
          </CardTitle>
          <CardDescription>Scan QR code on ticket or enter Booking ID manually.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mock Scanner Area */}
          <div className="w-full h-64 bg-muted rounded-lg flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-primary/30">
            {isScanning ? (
              <>
                <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
                <p className="text-primary font-semibold">Scanning for QR Code...</p>
                <p className="text-sm text-muted-foreground">Point camera at the QR code.</p>
              </>
            ) : bookingDetails ? (
                <div className="text-center">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-green-600">Booking Verified!</h3>
                </div>
            ) : error ? (
                 <div className="text-center">
                    <XCircle className="h-16 w-16 text-destructive mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-destructive">Verification Failed</h3>
                 </div>
            ) : (
              <>
                <QrCode className="h-16 w-16 text-primary/50 mb-4" />
                <p className="text-muted-foreground">QR Scanner Area</p>
                <Button onClick={startMockScan} className="mt-4">
                  Start Scan
                </Button>
              </>
            )}
          </div>
          
          <div className="text-center text-muted-foreground">OR</div>

          <div>
            <Label htmlFor="manualId">Manual Booking ID Entry</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="manualId"
                placeholder="Enter Booking ID (e.g., CNP-XXXX-YYYY)"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                disabled={isLoading || isScanning}
              />
              <Button onClick={handleManualSearch} disabled={isLoading || isScanning || !manualId.trim()}>
                <Search className="h-4 w-4 mr-0 md:mr-2" /> <span className="hidden md:inline">Search</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Verifying booking...</p>
        </div>
      )}

      {bookingDetails && !isLoading && (
        <Card className="mt-6 bg-green-50 border-green-500 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-green-700">
              <CheckCircle2 className="h-6 w-6 mr-2" /> Booking Valid
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><strong>Booking ID:</strong> {bookingDetails.id}</p>
            <p><strong>Name:</strong> {bookingDetails.fullName}</p>
            <p><strong>Visit Date:</strong> {format(new Date(bookingDetails.dateOfVisit), 'PPP')}</p>
            <p><strong>Total Paid:</strong> Rs. {bookingDetails.totalPrice.toLocaleString()}</p>
            <p><strong>Visitors ({bookingDetails.numberOfVisitors}):</strong></p>
            <ul className="list-disc list-inside pl-4">
              {bookingDetails.visitors.map((v, i) => <li key={i}>{v.name} ({v.country})</li>)}
            </ul>
          </CardContent>
        </Card>
      )}

      {error && !isLoading && (
         <Card className="mt-6 bg-red-50 border-destructive shadow-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-destructive">
              <XCircle className="h-6 w-6 mr-2" /> Booking Invalid or Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}
       <div className="mt-4 p-3 bg-blue-50 border border-blue-300 rounded-md text-sm text-blue-700 flex items-start">
        <Info className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
        <div>
            <strong>Note:</strong> This is a mock scanner. In a real application, this would use the device camera to scan QR codes. The "Start Scan" button simulates a successful scan with a test ID.
        </div>
      </div>
    </div>
  );
}
