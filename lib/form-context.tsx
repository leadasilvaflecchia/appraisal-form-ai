'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AppraisalFormData, FormFieldKey } from './types';
import { initialFormData } from './types';

interface FormContextValue {
  formData: AppraisalFormData;
  extractedFields: Set<FormFieldKey>;
  updateField: (key: FormFieldKey, value: string) => void;
  updateMultiple: (data: Partial<AppraisalFormData>, markAsExtracted?: boolean) => void;
  resetForm: () => void;
  isFieldExtracted: (key: FormFieldKey) => boolean;
  clearExtracted: () => void;
}

const FormContext = createContext<FormContextValue | null>(null);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<AppraisalFormData>(initialFormData);
  const [extractedFields, setExtractedFields] = useState<Set<FormFieldKey>>(new Set());

  const updateField = useCallback((key: FormFieldKey, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateMultiple = useCallback(
    (data: Partial<AppraisalFormData>, markAsExtracted = true) => {
      setFormData((prev) => ({ ...prev, ...data }));
      if (markAsExtracted) {
        setExtractedFields(new Set(Object.keys(data) as FormFieldKey[]));
      }
    },
    []
  );

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setExtractedFields(new Set());
  }, []);

  const isFieldExtracted = useCallback(
    (key: FormFieldKey) => extractedFields.has(key),
    [extractedFields]
  );

  const clearExtracted = useCallback(() => setExtractedFields(new Set()), []);

  return (
    <FormContext.Provider
      value={{ formData, extractedFields, updateField, updateMultiple, resetForm, isFieldExtracted, clearExtracted }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useFormContext must be used within FormProvider');
  return ctx;
}
