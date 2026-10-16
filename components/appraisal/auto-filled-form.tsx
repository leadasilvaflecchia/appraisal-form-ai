'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Save,
  CheckCircle2,
  MapPin,
  Users,
  TrendingUp,
  Building2,
  Scale,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useFormContext } from '@/lib/form-context';
import { saveToLocalStorage } from '@/lib/export-utils';
import { FormField, FormTextArea } from './form-field';
import { EXTRACTION_SUMMARY } from '@/lib/fallback-data';

export function AutoFilledForm() {
  const { formData, isFieldExtracted, extractedFields } = useFormContext();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleSave = () => {
    const ok = saveToLocalStorage(formData);
    if (ok) {
      toast.success('Form Saved Successfully', {
        description: 'Your appraisal form has been saved to local storage.',
      });
    } else {
      toast.error('Save Failed', {
        description: 'Could not save the form. Please try again.',
      });
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const extractedCount = extractedFields.size;
  const filledCount = Object.values(formData).filter((v) => v).length;

  const sections = [
    { id: 'property', title: 'Subject Property Information', icon: MapPin, fields: ['propertyAddress', 'city', 'state', 'zip', 'county', 'legalDescription', 'apnTaxId', 'effectiveDate'] as const },
    { id: 'client', title: 'Client & Appraiser Information', icon: Users, fields: ['clientName', 'clientAddress', 'appraiserName', 'licenseNumber', 'intendedUse', 'intendedUser'] as const },
    { id: 'sales', title: 'Sales Comparison Approach', icon: TrendingUp, fields: ['numberOfComps', 'priceRangeLow', 'priceRangeHigh', 'dateOfSale', 'adjustments'] as const },
    { id: 'cost', title: 'Cost Approach', icon: Building2, fields: ['landValue', 'improvementValue', 'totalValuation'] as const },
    { id: 'reconciliation', title: 'Reconciliation & Final Opinion', icon: Scale, fields: ['finalOpinionOfValue', 'exposureTime', 'marketingDays', 'additionalComments'] as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Auto-Filled Form Review</h2>
          <p className="text-sm text-slate-500 mt-1">Review the AI-extracted data. All fields are editable.</p>
        </div>

      </div>

      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-sky-50/40 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 ring-1 ring-emerald-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">AI Extraction Summary</p>
                <p className="text-xs text-slate-500">
                  {extractedCount} fields extracted · {filledCount} total fields populated
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Year Built', value: EXTRACTION_SUMMARY.yearBuilt },
                { label: 'Style', value: EXTRACTION_SUMMARY.style },
                { label: 'Beds', value: EXTRACTION_SUMMARY.beds },
                { label: 'Baths', value: EXTRACTION_SUMMARY.baths },
                { label: 'GLA', value: EXTRACTION_SUMMARY.gla },
                { label: 'Order ID', value: EXTRACTION_SUMMARY.orderId },
              ].map((item) => (
                <div key={item.label} className="rounded-md border border-slate-200 bg-white px-2.5 py-1">
                  <span className="text-[10px] uppercase tracking-wide text-slate-400">{item.label}</span>
                  <span className="ml-1.5 text-xs font-semibold text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {sections.map((section) => {
        const isExpanded = expandedSection === section.id || expandedSection === null;
        const sectionExtractedCount = section.fields.filter((f) => isFieldExtracted(f)).length;
        return (
          <Card key={section.id} className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader
              className="cursor-pointer bg-slate-50/50 border-b border-slate-100 transition-colors hover:bg-slate-50"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-800">
                    <section.icon className="h-4 w-4 text-sky-600" />
                    {section.title}
                  </CardTitle>
                  {sectionExtractedCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-200">
                      {sectionExtractedCount} AI
                    </span>
                  )}
                </div>
                {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </div>
            </CardHeader>
            {isExpanded && (
              <CardContent className="pt-6 animate-in fade-in-50 duration-200">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.fields.map((field) => {
                    if (field === 'intendedUse' || field === 'intendedUser' || field === 'adjustments' || field === 'additionalComments') {
                      return <FormTextArea key={field} name={field} label={getFieldLabel(field)} className="sm:col-span-2 lg:col-span-3" />;
                    }
                    return <FormField key={field} name={field} label={getFieldLabel(field)} type={field === 'dateOfSale' || field === 'effectiveDate' ? 'date' : 'text'} />;
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Form
        </Button>
      </div>
    </div>
  );
}

function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    propertyAddress: 'Property Address',
    city: 'City',
    state: 'State',
    zip: 'Zip Code',
    county: 'County',
    legalDescription: 'Legal Description',
    apnTaxId: 'APN / Tax ID',
    effectiveDate: 'Effective Date of Appraisal',
    clientName: 'Client Name',
    clientAddress: 'Client Address',
    appraiserName: 'Appraiser Name',
    licenseNumber: 'License Number',
    intendedUse: 'Intended Use',
    intendedUser: 'Intended User',
    numberOfComps: 'No. of Comparable Sales',
    priceRangeLow: 'Price Range — Low ($)',
    priceRangeHigh: 'Price Range — High ($)',
    dateOfSale: 'Date of Sale',
    adjustments: 'Adjustments',
    landValue: 'Land Value ($)',
    improvementValue: 'Improvement Value ($)',
    totalValuation: 'Total Valuation ($)',
    finalOpinionOfValue: 'Final Opinion of Value ($)',
    exposureTime: 'Exposure Time',
    marketingDays: 'Marketing Days',
    additionalComments: 'Additional Comments',
  };
  return labels[field] || field;
}
