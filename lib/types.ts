export interface AppraisalFormData {
  // Page 1 - Property & Client Details
  propertyAddress: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  legalDescription: string;
  apnTaxId: string;
  clientName: string;
  clientAddress: string;
  appraiserName: string;
  licenseNumber: string;
  effectiveDate: string;
  intendedUse: string;
  intendedUser: string;

  // Page 2 - Sales & Valuation
  numberOfComps: string;
  priceRangeLow: string;
  priceRangeHigh: string;
  dateOfSale: string;
  adjustments: string;
  landValue: string;
  improvementValue: string;
  totalValuation: string;
  finalOpinionOfValue: string;
  exposureTime: string;
  marketingDays: string;
  additionalComments: string;
}

export const initialFormData: AppraisalFormData = {
  propertyAddress: '',
  city: '',
  state: '',
  zip: '',
  county: '',
  legalDescription: '',
  apnTaxId: '',
  clientName: '',
  clientAddress: '',
  appraiserName: '',
  licenseNumber: '',
  effectiveDate: '',
  intendedUse: '',
  intendedUser: '',

  numberOfComps: '',
  priceRangeLow: '',
  priceRangeHigh: '',
  dateOfSale: '',
  adjustments: '',
  landValue: '',
  improvementValue: '',
  totalValuation: '',
  finalOpinionOfValue: '',
  exposureTime: '',
  marketingDays: '',
  additionalComments: '',
};

export type FormFieldKey = keyof AppraisalFormData;

export interface ExtractionStep {
  id: number;
  label: string;
  description: string;
  status: 'pending' | 'active' | 'complete';
}

export interface SavedFormRecord {
  id: string;
  data: AppraisalFormData;
  savedAt: string;
}
