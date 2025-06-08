
import { PRICING_TIERS } from '@/lib/helpers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Tag, Calculator, Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Information - ParkConnect Admin',
  description: 'View ticket pricing tiers for Chitwan National Park.',
};

const pricingData = [
  { type: 'Nepali Citizen', price: PRICING_TIERS.Nepal, icon: <UserFlagNepal className="h-6 w-6 text-primary" /> },
  { type: 'SAARC Country Citizen', price: PRICING_TIERS.SAARC, icon: <UserFlagSaarc className="h-6 w-6 text-primary" /> },
  { type: 'Other Foreign Citizen', price: PRICING_TIERS.Other, icon: <UserFlagOther className="h-6 w-6 text-primary" /> },
];

const sampleCalculations = [
  { scenario: '3 Nepali Visitors', calculation: `3 x Rs. ${PRICING_TIERS.Nepal}`, total: 3 * PRICING_TIERS.Nepal },
  { scenario: '2 SAARC + 1 Other', calculation: `(2 x Rs. ${PRICING_TIERS.SAARC}) + (1 x Rs. ${PRICING_TIERS.Other})`, total: (2 * PRICING_TIERS.SAARC) + PRICING_TIERS.Other },
  { scenario: '5 Other Country Visitors', calculation: `5 x Rs. ${PRICING_TIERS.Other}`, total: 5 * PRICING_TIERS.Other },
];

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Tag className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Ticket Pricing Tiers</CardTitle>
          </div>
          <CardDescription>Official entry fees for Chitwan National Park.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]"></TableHead>
                <TableHead>Visitor Type</TableHead>
                <TableHead className="text-right">Price (NPR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricingData.map((item) => (
                <TableRow key={item.type} className="hover:bg-secondary/30 transition-colors">
                  <TableCell className="flex justify-center items-center h-full">{item.icon}</TableCell>
                  <TableCell className="font-medium">{item.type}</TableCell>
                  <TableCell className="text-right font-semibold text-lg text-primary">Rs. {item.price.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="h-8 w-8 text-accent" />
            <CardTitle className="text-3xl font-headline">Sample Calculations</CardTitle>
          </div>
          <CardDescription>Illustrative examples of total ticket costs for groups.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleCalculations.map((calc, index) => (
              <Card key={index} className="bg-muted/50 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2 text-accent" />
                    {calc.scenario}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{calc.calculation}</p>
                  <p className="text-xl font-bold text-accent mt-1">Total: Rs. {calc.total.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


// Custom SVG Icons for flags (simplified representations)
const UserFlagNepal = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M0 0H32V24H0V0Z" fill="#DC143C"/>
    <path d="M0 0L16 12L0 24V0Z" fill="#003893"/>
    <path d="M7 15C8.10457 15 9 14.1046 9 13C9 11.8954 8.10457 11 7 11C5.89543 11 5 11.8954 5 13C5 14.1046 5.89543 15 7 15Z" fill="white"/>
    <path d="M7 9C7.82843 9 8.5 8.32843 8.5 7.5C8.5 6.67157 7.82843 6 7 6C6.17157 6 5.5 6.67157 5.5 7.5C5.5 8.32843 6.17157 9 7 9Z" fill="white"/>
  </svg>
);

const UserFlagSaarc = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="32" height="24" rx="3" fill="#4CAF50"/>
    <circle cx="16" cy="12" r="5" fill="white"/>
    <circle cx="16" cy="12" r="3" fill="#FF9800"/>
  </svg>
);

const UserFlagOther = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="32" height="24" rx="3" fill="#2196F3"/>
    <path d="M16 4L19.09 9.26L25 10.17L20.5 14.14L21.82 20L16 17.27L10.18 20L11.5 14.14L7 10.17L12.91 9.26L16 4Z" fill="#FFEB3B"/>
  </svg>
);
