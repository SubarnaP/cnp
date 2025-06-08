
"use client";
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import type { BookingFormData } from './BookingForm'; // Assuming BookingForm defines this
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryCategories, type CountryOption } from '@/types/booking';
import {FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'; // Re-importing from form.tsx

interface VisitorFieldsProps {
  index: number;
  register: UseFormRegister<BookingFormData>;
  control: Control<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
  removeVisitor?: (index: number) => void; // Optional: if you want a remove button per visitor
}

export default function VisitorFields({ index, register, control, errors }: VisitorFieldsProps) {
  const visitorError = errors.visitors?.[index];

  return (
    <div className="p-4 border border-muted rounded-lg space-y-4 bg-card shadow-sm">
      <h4 className="text-md font-semibold text-primary">Visitor {index + 1}</h4>
      <div>
        <Label htmlFor={`visitors.${index}.name`} className="mb-1 block">Name</Label>
        <Input
          id={`visitors.${index}.name`}
          {...register(`visitors.${index}.name`, { required: 'Visitor name is required' })}
          placeholder="Full Name"
          className={visitorError?.name ? 'border-destructive' : ''}
        />
        {visitorError?.name && <p className="text-xs text-destructive mt-1">{visitorError.name.message}</p>}
      </div>

      <div>
        <Label htmlFor={`visitors.${index}.country`} className="mb-1 block">Country</Label>
         <FormField
          control={control}
          name={`visitors.${index}.country`}
          rules={{ required: "Country is required" }}
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={visitorError?.country ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select country category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countryCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage>{visitorError?.country?.message}</FormMessage>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
