import type { AppraisalFormData, FormFieldKey } from './types';

export const FALLBACK_EXTRACTION: AppraisalFormData = {
  propertyAddress: '9 FRIENDS LN',
  city: 'WESTBURY',
  state: 'NY',
  zip: '11590',
  county: 'Nassau',
  legalDescription: 'Sec 20 Block 54 Lot 12',
  apnTaxId: '45403 00120',
  clientName: 'Citizens Bank',
  clientAddress: '1 Citizens Plaza, Providence, RI 02903',
  appraiserName: 'Mickaelle Petit',
  licenseNumber: '1234567',
  effectiveDate: '2026-10-06',
  intendedUse: 'To assist the lender/client in evaluating the property for a mortgage finance transaction.',
  intendedUser: 'Citizens Bank and its approved mortgage finance investors',

  numberOfComps: '3',
  priceRangeLow: '1800000',
  priceRangeHigh: '1900000',
  dateOfSale: '2025-09-15',
  adjustments: 'Site adjustments applied for lot size, GLA, and bathroom count',
  landValue: '650000',
  improvementValue: '1200000',
  totalValuation: '1850000',
  finalOpinionOfValue: '1850000',
  exposureTime: '60-90 days',
  marketingDays: '75',
  additionalComments: 'Subject property is a new construction Colonial/Cape style home, Year Built 2025, 5 bedrooms, 6 bathrooms, GLA 5,500 sqft. Located in desirable Westbury, NY neighborhood. Order ID: 22947052.',
};

export const FALLBACK_EXTRACTION_META: Record<string, { yearBuilt?: string; style?: string; beds?: string; baths?: string; gla?: string; orderId?: string }> = {
  propertyAddress: {},
};

export const EXTRACTION_SUMMARY = {
  yearBuilt: '2025',
  style: 'Colonial/Cape',
  beds: '5',
  baths: '6',
  gla: '5,500 sqft',
  orderId: '22947052',
};

export const ALL_FIELD_KEYS: FormFieldKey[] = [
  'propertyAddress',
  'city',
  'state',
  'zip',
  'county',
  'legalDescription',
  'apnTaxId',
  'clientName',
  'clientAddress',
  'appraiserName',
  'licenseNumber',
  'effectiveDate',
  'intendedUse',
  'intendedUser',
  'numberOfComps',
  'priceRangeLow',
  'priceRangeHigh',
  'dateOfSale',
  'adjustments',
  'landValue',
  'improvementValue',
  'totalValuation',
  'finalOpinionOfValue',
  'exposureTime',
  'marketingDays',
  'additionalComments',
];
