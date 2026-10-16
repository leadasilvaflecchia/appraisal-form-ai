'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Users } from 'lucide-react';
import { FormField } from './form-field';
import { useFormContext } from '@/lib/form-context';

export function FormPage1() {
  const { formData } = useFormContext();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Property & Client Details</h2>
        <p className="text-sm text-slate-500 mt-1">Enter the subject property and assignment information for the appraisal.</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-base text-slate-800">
            <MapPin className="h-4 w-4 text-sky-600" />
            Subject Property Information
          </CardTitle>
          <CardDescription className="text-xs">Property identification and legal details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField name="propertyAddress" label="Property Address" className="lg:col-span-2" />
            <FormField name="city" label="City" />
            <FormField name="state" label="State" />
            <FormField name="zip" label="Zip Code" />
            <FormField name="county" label="County" />
            <FormField name="legalDescription" label="Legal Description" className="lg:col-span-2" />
            <FormField name="apnTaxId" label="APN / Tax ID" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-base text-slate-800">
            <Users className="h-4 w-4 text-sky-600" />
            Client & Appraiser Information
          </CardTitle>
          <CardDescription className="text-xs">Assignment details and intended use</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField name="clientName" label="Client Name" />
            <FormField name="clientAddress" label="Client Address" className="lg:col-span-2" />
            <FormField name="appraiserName" label="Appraiser Name" />
            <FormField name="licenseNumber" label="License Number" />
            <FormField name="effectiveDate" label="Effective Date of Appraisal" type="date" />
            <FormField name="intendedUse" label="Intended Use" className="sm:col-span-2 lg:col-span-3" />
            <FormField name="intendedUser" label="Intended User" className="sm:col-span-2 lg:col-span-3" />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <span className="text-xs text-slate-500">
          {Object.values(formData).filter((v) => v).length} of {Object.keys(formData).length} fields completed
        </span>
        <span className="text-xs font-medium text-slate-600">Page 1 of 2</span>
      </div>
    </div>
  );
}
