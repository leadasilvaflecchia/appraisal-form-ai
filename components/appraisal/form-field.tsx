'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { FormFieldKey } from '@/lib/types';
import { useFormContext } from '@/lib/form-context';
import { AIBadge } from './ai-badge';

interface FieldProps {
  name: FormFieldKey;
  label: string;
  placeholder?: string;
  className?: string;
  type?: string;
}

export function FormField({ name, label, placeholder, className, type = 'text' }: FieldProps) {
  const { formData, updateField, isFieldExtracted } = useFormContext();
  const extracted = isFieldExtracted(name);
  const value = formData[name];

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-slate-600">{label}</Label>
        {extracted && <AIBadge />}
      </div>
      <Input
        type={type}
        value={value}
        onChange={(e) => updateField(name, e.target.value)}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        className={cn(
          'h-10 border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-sky-200',
          extracted && 'border-emerald-300 bg-emerald-50/30'
        )}
      />
    </div>
  );
}

export function FormTextArea({ name, label, placeholder, className }: FieldProps) {
  const { formData, updateField, isFieldExtracted } = useFormContext();
  const extracted = isFieldExtracted(name);
  const value = formData[name];

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-slate-600">{label}</Label>
        {extracted && <AIBadge />}
      </div>
      <Textarea
        value={value}
        onChange={(e) => updateField(name, e.target.value)}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        className={cn(
          'border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-sky-200',
          extracted && 'border-emerald-300 bg-emerald-50/30'
        )}
        rows={3}
      />
    </div>
  );
}
