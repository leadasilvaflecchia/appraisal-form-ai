'use client';

import { toast } from 'sonner';
import { Save, Download, User, ChevronDown, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useFormContext } from '@/lib/form-context';
import { saveToLocalStorage, exportAsJSON, exportAsPDF } from '@/lib/export-utils';

export function TopNav() {
  const { formData } = useFormContext();

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

  const handleExport = (format: 'pdf' | 'json') => {
    if (format === 'pdf') exportAsPDF(formData);
    else exportAsJSON(formData);
    toast.success(`Exported as ${format.toUpperCase()}`, {
      description: format === 'pdf' ? 'Print dialog opened — save as PDF.' : 'JSON file downloaded.',
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-600 to-blue-700 text-white shadow-sm">
            <FileText className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-semibold text-slate-900 leading-tight">Appraisal Form AI</h1>
            <p className="text-xs text-slate-500 leading-tight">Uniform Residential Appraisal Report</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Badge variant="outline" className="hidden md:inline-flex border-slate-200 text-slate-600">
            <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-600" />
            UAD Compliant
          </Badge>
          <Button variant="outline" size="sm" onClick={handleSave} className="border-slate-200 text-slate-700 hover:bg-slate-50">
            <Save className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="bg-sky-600 text-white hover:bg-sky-700">
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileText className="mr-2 h-4 w-4 text-red-500" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                <FileText className="mr-2 h-4 w-4 text-amber-500" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full border border-slate-200 p-1 pr-2 transition-colors hover:bg-slate-50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                  <User className="h-4 w-4" />
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Appraiser</span>
                  <span className="text-xs text-slate-500">Mickaelle Petit</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>License #: 1234567</DropdownMenuItem>
              <DropdownMenuItem>Order ID: 22947052</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
