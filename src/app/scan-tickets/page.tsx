
"use client";
import Scanner from '@/components/Scanner';
import type { Booking } from '@/types/booking';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, ScanSearch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export default function ScanTicketsPage() {
  const [scannedBooking, setScannedBooking] = useState<Booking | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleScanSuccess = (booking: Booking) => {
    setScannedBooking(booking);
    setScanError(null);
  };

  const handleScanError = (message: string) => {
    setScanError(message);
    setScannedBooking(null);
  };

  return (
    <div className="flex flex-col items-center justify-start py-8 min-h-screen">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
            <ScanSearch className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-headline font-bold text-primary">Scan & Verify Tickets</h1>
            <p className="text-muted-foreground mt-2">Use the scanner below to validate park entry tickets.</p>
        </div>
        
        <Scanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />

        {/* Results are now shown inside the Scanner component itself */}
        {/* The Scanner component handles displaying success/error/loading states */}

      </div>
    </div>
  );
}
