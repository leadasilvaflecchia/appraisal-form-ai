'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Building2, Scale } from 'lucide-react';
import { FormField, FormTextArea } from './form-field';
import { useFormContext } from '@/lib/form-context';

export function FormPage2() {
  const { formData } = useFormContext();

  const formatCurrency = (v: string) => {
    if (!v) return '—';
    const num = parseInt(v.replace(/,/g, ''), 10);
    return isNaN(num) ? v : `$${num.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Sales & Valuation Details</h2>
        <p className="text-sm text-slate-500 mt-1">Enter the sales comparison, cost approach, and reconciliation data.</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-base text-slate-800">
            <TrendingUp className="h-4 w-4 text-sky-600" />
            Sales Comparison Approach
          </CardTitle>
          <CardDescription className="text-xs">Comparable sales analysis and adjustments</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField name="numberOfComps" label="No. of Comparable Sales" />
            <FormField name="priceRangeLow" label="Price Range — Low ($)" />
            <FormField name="priceRangeHigh" label="Price Range — High ($)" />
            <FormField name="dateOfSale" label="Date of Sale" type="date" />
            <FormField name="adjustments" label="Adjustments" className="sm:col-span-2 lg:col-span-3" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-base text-slate-800">
            <Building2 className="h-4 w-4 text-sky-600" />
            Cost Approach
          </CardTitle>
          <CardDescription className="text-xs">Land and improvement valuation</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField name="landValue" label="Land Value ($)" />
            <FormField name="improvementValue" label="Improvement Value ($)" />
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Total Valuation ($)</label>
              <div className="flex h-10 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700">
                {formatCurrency(formData.landValue && formData.improvementValue
                  ? String(parseInt(formData.landValue.replace(/,/g, '')) + parseInt(formData.improvementValue.replace(/,/g, '')))
                  : formData.totalValuation)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-base text-slate-800">
            <Scale className="h-4 w-4 text-sky-600" />
            Reconciliation & Final Opinion
          </CardTitle>
          <CardDescription className="text-xs">Final value conclusion and supporting analysis</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField name="finalOpinionOfValue" label="Final Opinion of Value ($)" />
            <FormField name="exposureTime" label="Exposure Time" />
            <FormField name="marketingDays" label="Marketing Days" />
            <FormTextArea name="additionalComments" label="Additional Comments" className="sm:col-span-2 lg:col-span-3" />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <span className="text-xs text-slate-500">
          Final Opinion of Value: <span className="font-semibold text-slate-700">{formatCurrency(formData.finalOpinionOfValue)}</span>
        </span>
        <span className="text-xs font-medium text-slate-600">Page 2 of 2</span>
      </div>
    </div>
  );
}
