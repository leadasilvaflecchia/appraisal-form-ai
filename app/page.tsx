'use client';

import { useState } from 'react';
import { FileText, ClipboardList, UploadCloud, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormProvider } from '@/lib/form-context';
import { TopNav } from '@/components/appraisal/top-nav';
import { FormPage1 } from '@/components/appraisal/form-page-1';
import { FormPage2 } from '@/components/appraisal/form-page-2';
import { UploadDocument } from '@/components/appraisal/upload-document';
import { AutoFilledForm } from '@/components/appraisal/auto-filled-form';
import { Toaster } from '@/components/ui/sonner';

type TabId = 'form1' | 'form2' | 'upload' | 'review';

interface TabConfig {
  id: TabId;
  label: string;
  subLabel: string;
  icon: React.ElementType;
}

const TABS: TabConfig[] = [
  { id: 'form1', label: 'Form 1 (Page 1)', subLabel: 'Property & Client', icon: FileText },
  { id: 'form2', label: 'Form 2 (Page 2)', subLabel: 'Sales & Valuation', icon: ClipboardList },
  { id: 'upload', label: 'Upload Document', subLabel: 'AI Extraction', icon: UploadCloud },
  { id: 'review', label: 'Auto-Filled Form', subLabel: 'Review & Export', icon: Sparkles },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('form1');

  return (
    <FormProvider>
      <div className="min-h-screen bg-slate-50">
        <TopNav />

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Step Navigation */}
          <div className="mb-6">
            <div className="flex items-center justify-between overflow-x-auto">
              {TABS.map((tab, idx) => {
                const isActive = activeTab === tab.id;
                const isCompleted = TABS.findIndex((t) => t.id === activeTab) > idx;
                return (
                  <div key={tab.id} className="flex flex-1 items-center">
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'group flex flex-1 items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all duration-200',
                        isActive
                          ? 'border-sky-300 bg-white shadow-sm ring-1 ring-sky-100'
                          : 'border-transparent hover:border-slate-200 hover:bg-white/60'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
                          isActive && 'border-sky-500 bg-sky-500 text-white',
                          isCompleted && 'border-emerald-500 bg-emerald-500 text-white',
                          !isActive && !isCompleted && 'border-slate-200 bg-white text-slate-400'
                        )}
                      >
                        <tab.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 hidden sm:block">
                        <p className={cn(
                          'text-xs font-semibold truncate transition-colors',
                          isActive ? 'text-sky-700' : isCompleted ? 'text-emerald-600' : 'text-slate-500'
                        )}>
                          {tab.label}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{tab.subLabel}</p>
                      </div>
                      <div className="min-w-0 sm:hidden">
                        <p className={cn(
                          'text-xs font-semibold truncate',
                          isActive ? 'text-sky-700' : isCompleted ? 'text-emerald-600' : 'text-slate-500'
                        )}>
                          {tab.label.split(' ')[0]}
                        </p>
                      </div>
                    </button>
                    {idx < TABS.length - 1 && (
                      <div className={cn(
                        'mx-1 h-0.5 w-4 shrink-0 rounded-full transition-colors duration-300',
                        isCompleted ? 'bg-emerald-400' : 'bg-slate-200'
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tab Content with transition */}
          <div key={activeTab} className="animate-in fade-in-50 duration-300">
            {activeTab === 'form1' && <FormPage1 />}
            {activeTab === 'form2' && <FormPage2 />}
            {activeTab === 'upload' && <UploadDocument onComplete={() => setActiveTab('review')} />}
            {activeTab === 'review' && <AutoFilledForm />}
          </div>

          {/* Bottom navigation buttons */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-4">
            <button
              onClick={() => {
                const idx = TABS.findIndex((t) => t.id === activeTab);
                if (idx > 0) setActiveTab(TABS[idx - 1].id);
              }}
              disabled={activeTab === 'form1'}
              className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>
            <span className="text-xs text-slate-400">
              Step {TABS.findIndex((t) => t.id === activeTab) + 1} of {TABS.length}
            </span>
            <button
              onClick={() => {
                const idx = TABS.findIndex((t) => t.id === activeTab);
                if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].id);
              }}
              disabled={activeTab === 'review'}
              className="text-sm font-medium text-sky-600 transition-colors hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
      <Toaster />
    </FormProvider>
  );
}
