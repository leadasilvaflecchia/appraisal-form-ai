'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
  ScanLine,
  Link2,
  Sparkles,
  X,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormContext } from '@/lib/form-context';
import { FALLBACK_EXTRACTION, EXTRACTION_SUMMARY } from '@/lib/fallback-data';
import type { AppraisalFormData } from '@/lib/types';

interface ExtractionResponse {
  data: AppraisalFormData;
  source: 'openai' | 'fallback';
  summary: typeof EXTRACTION_SUMMARY;
}

interface StepState {
  id: number;
  label: string;
  description: string;
  icon: React.ElementType;
  status: 'pending' | 'active' | 'complete';
}

const STEPS: Omit<StepState, 'status'>[] = [
  { id: 1, label: 'Document Uploaded', description: 'File received and validated', icon: UploadCloud },
  { id: 2, label: 'Reading Document', description: 'Parsing text and structure', icon: ScanLine },
  { id: 3, label: 'Extracting with AI', description: 'Identifying key appraisal fields', icon: Sparkles },
  { id: 4, label: 'Linking Form Details', description: 'Mapping data to form fields', icon: Link2 },
  { id: 5, label: 'Complete!', description: 'Review the auto-filled form', icon: CheckCircle2 },
];

interface UploadTabProps {
  onComplete: () => void;
}

export function UploadDocument({ onComplete }: UploadTabProps) {
  const { updateMultiple, clearExtracted } = useFormContext();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<StepState[]>(
    STEPS.map((s) => ({ ...s, status: 'pending' as const }))
  );
  const [extractionDone, setExtractionDone] = useState(false);
  const [extractionSource, setExtractionSource] = useState<'openai' | 'fallback' | null>(null);
  const [extractionSummary, setExtractionSummary] = useState(EXTRACTION_SUMMARY);
  const [extractionData, setExtractionData] = useState(FALLBACK_EXTRACTION);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const isValid = file.type === 'application/pdf' || file.type === 'text/plain' || file.name.endsWith('.pdf') || file.name.endsWith('.txt');
      if (!isValid) {
        toast.error('Invalid File Type', {
          description: 'Please upload a PDF or text file.',
        });
        return;
      }
      setUploadedFile(file);
      setExtractionDone(false);
      setSteps(STEPS.map((s) => ({ ...s, status: 'pending' as const })));
    },
    [toast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const runExtraction = useCallback(async () => {
    if (!uploadedFile) return;
    setIsProcessing(true);
    clearExtracted();

    // Steps 1-3: animate upload + reading + extracting
    for (let i = 0; i < 3; i++) {
      setSteps((prev) => prev.map((s, idx) => ({
        ...s,
        status: idx === i ? 'active' : idx < i ? 'complete' : 'pending',
      })));
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));
    }

    // Call backend API during "Extracting with AI" step
    const fd = new FormData();
    fd.append('file', uploadedFile);

    let result: ExtractionResponse;
    try {
      const res = await fetch('/api/extract', { method: 'POST', body: fd });
      result = (await res.json()) as ExtractionResponse;
    } catch {
      result = {
        data: FALLBACK_EXTRACTION,
        source: 'fallback',
        summary: EXTRACTION_SUMMARY,
      };
    }

    // Step 4: Linking form details
    setSteps((prev) => prev.map((s, idx) => ({
      ...s,
      status: idx < 3 ? 'complete' as const : idx === 3 ? 'active' as const : 'pending' as const,
    })));
    updateMultiple(result.data, true);
    setExtractionData(result.data);
    setExtractionSource(result.source);
    setExtractionSummary(result.summary);
    await new Promise((r) => setTimeout(r, 700));

    // Step 5: Complete
    setSteps((prev) => prev.map((s) => ({ ...s, status: 'complete' as const })));
    setIsProcessing(false);
    setExtractionDone(true);

    const fieldCount = Object.values(result.data).filter((v) => v).length;
    toast.success('Extraction Complete', {
      description: result.source === 'openai'
        ? `${fieldCount} fields extracted via OpenAI. Review the auto-filled form.`
        : `${fieldCount} fields extracted (demo data). Review the auto-filled form.`,
    });
  }, [uploadedFile, updateMultiple, clearExtracted]);

  const handleReset = () => {
    setUploadedFile(null);
    setExtractionDone(false);
    setExtractionSource(null);
    setExtractionSummary(EXTRACTION_SUMMARY);
    setExtractionData(FALLBACK_EXTRACTION);
    setSteps(STEPS.map((s) => ({ ...s, status: 'pending' as const })));
  };;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Upload Property Document</h2>
        <p className="text-sm text-slate-500 mt-1">Upload a PDF or text file to auto-extract appraisal data with AI.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          {!uploadedFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 px-6 text-center transition-all duration-200',
                isDragging
                  ? 'border-sky-500 bg-sky-50 scale-[1.01]'
                  : 'border-slate-300 bg-white hover:border-sky-400 hover:bg-slate-50/50'
              )}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 ring-1 ring-sky-100">
                <UploadCloud className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                {isDragging ? 'Drop your file here' : 'Drag & drop your document'}
              </h3>
              <p className="mt-1 text-sm text-slate-500">PDF or text files up to 10MB</p>
              <Button
                variant="outline"
                className="mt-5 border-slate-300 text-slate-700"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,application/pdf,text/plain"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>
          ) : (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-slate-800">Uploaded Document</CardTitle>
                  {!isProcessing && (
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-500">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-50 ring-1 ring-red-100">
                    <FileText className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{uploadedFile.name}</p>
                    <p className="text-xs text-slate-500">{(uploadedFile.size / 1024).toFixed(1)} KB · {uploadedFile.type || 'application/pdf'}</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                {!isProcessing && !extractionDone && (
                  <Button
                    className="mt-4 w-full bg-sky-600 text-white hover:bg-sky-700"
                    onClick={runExtraction}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start AI Extraction
                  </Button>
                )}
                {extractionDone && (
                  <Button
                    className="mt-4 w-full bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={onComplete}
                  >
                    Review Auto-Filled Form
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm h-full">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-base text-slate-800">Extraction Progress</CardTitle>
              <CardDescription className="text-xs">AI-powered document analysis workflow</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-1">
                {steps.map((step, idx) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300',
                          step.status === 'complete' && 'border-emerald-500 bg-emerald-500 text-white',
                          step.status === 'active' && 'border-sky-500 bg-sky-50 text-sky-600',
                          step.status === 'pending' && 'border-slate-200 bg-white text-slate-300'
                        )}
                      >
                        {step.status === 'active' ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : step.status === 'complete' ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <step.icon className="h-4 w-4" />
                        )}
                      </div>
                      {idx < steps.length - 1 && (
                        <div className={cn(
                          'w-0.5 h-8 transition-colors duration-300',
                          step.status === 'complete' ? 'bg-emerald-400' : 'bg-slate-200'
                        )} />
                      )}
                    </div>
                    <div className="pt-1 pb-6">
                      <p className={cn(
                        'text-sm font-medium transition-colors duration-300',
                        step.status === 'complete' && 'text-slate-800',
                        step.status === 'active' && 'text-sky-700',
                        step.status === 'pending' && 'text-slate-400'
                      )}>
                        {step.label}
                      </p>
                      <p className={cn(
                        'text-xs transition-colors duration-300',
                        step.status === 'pending' ? 'text-slate-300' : 'text-slate-500'
                      )}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {extractionDone && (
        <Card className="border-emerald-200 bg-emerald-50/40 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">
                      Extraction Complete — {Object.values(extractionData).filter((v) => v).length} Fields Populated
                    </p>
                    <span className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1',
                      extractionSource === 'openai'
                        ? 'bg-sky-50 text-sky-700 ring-sky-200'
                        : 'bg-amber-50 text-amber-700 ring-amber-200'
                    )}>
                      {extractionSource === 'openai' ? 'OpenAI gpt-4o-mini' : 'Demo Fallback'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Property: {extractionData.propertyAddress}, {extractionData.city}, {extractionData.state} {extractionData.zip}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Year Built', value: extractionSummary.yearBuilt },
                  { label: 'Style', value: extractionSummary.style },
                  { label: 'Beds', value: extractionSummary.beds },
                  { label: 'Baths', value: extractionSummary.baths },
                  { label: 'GLA', value: extractionSummary.gla },
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
      )}
    </div>
  );
}
