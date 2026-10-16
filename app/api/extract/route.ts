import { NextRequest, NextResponse } from 'next/server';
import { FALLBACK_EXTRACTION, EXTRACTION_SUMMARY } from '@/lib/fallback-data';
import type { AppraisalFormData } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are an expert real estate appraisal data extractor. You analyze appraisal documents and extract structured data for a Uniform Residential Appraisal Report (UAD / Fannie Mae Form 1004).

You MUST respond with a JSON object containing exactly these keys (use empty string "" if a field is not found in the document):

{
  "propertyAddress": "",
  "city": "",
  "state": "",
  "zip": "",
  "county": "",
  "legalDescription": "",
  "apnTaxId": "",
  "clientName": "",
  "clientAddress": "",
  "appraiserName": "",
  "licenseNumber": "",
  "effectiveDate": "YYYY-MM-DD",
  "intendedUse": "",
  "intendedUser": "",
  "numberOfComps": "",
  "priceRangeLow": "numeric string only",
  "priceRangeHigh": "numeric string only",
  "dateOfSale": "YYYY-MM-DD",
  "adjustments": "",
  "landValue": "numeric string only",
  "improvementValue": "numeric string only",
  "totalValuation": "numeric string only",
  "finalOpinionOfValue": "numeric string only",
  "exposureTime": "",
  "marketingDays": "",
  "additionalComments": ""
}

Rules:
- All monetary values must be numeric strings without dollar signs or commas (e.g. "1850000").
- All dates must be in YYYY-MM-DD format.
- Be concise and factual. Only include information present in the document.
- Do NOT include any text outside the JSON object.`;

interface ExtractedData {
  data: AppraisalFormData;
  source: 'openai' | 'fallback';
  summary: typeof EXTRACTION_SUMMARY;
}

function getFallbackResponse(): ExtractedData {
  return {
    data: FALLBACK_EXTRACTION,
    source: 'fallback',
    summary: EXTRACTION_SUMMARY,
  };
}

async function callOpenAI(documentText: string): Promise<AppraisalFormData | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Extract appraisal data from this document:\n\n${documentText}` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.warn(`[extract] OpenAI API returned ${response.status}: ${errorBody}`);
      return null;
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      console.warn('[extract] OpenAI response missing content');
      return null;
    }

    const parsed = JSON.parse(content) as Partial<AppraisalFormData>;

    const knownKeys: (keyof AppraisalFormData)[] = [
      'propertyAddress', 'city', 'state', 'zip', 'county', 'legalDescription',
      'apnTaxId', 'clientName', 'clientAddress', 'appraiserName', 'licenseNumber',
      'effectiveDate', 'intendedUse', 'intendedUser', 'numberOfComps',
      'priceRangeLow', 'priceRangeHigh', 'dateOfSale', 'adjustments',
      'landValue', 'improvementValue', 'totalValuation', 'finalOpinionOfValue',
      'exposureTime', 'marketingDays', 'additionalComments',
    ];

    const result: Record<string, string> = {};
    for (const key of knownKeys) {
      const value = parsed[key];
      result[key] = typeof value === 'string' ? value : '';
    }

    return result as unknown as AppraisalFormData;
  } catch (err) {
    console.warn('[extract] OpenAI call failed:', err instanceof Error ? err.message : String(err));
    return null;
  }
}

function extractTextFromBuffer(buf: ArrayBuffer, mimeType: string): string {
  if (mimeType === 'text/plain' || mimeType === 'application/text') {
    return new TextDecoder().decode(buf);
  }
  const raw = new TextDecoder('utf-8', { fatal: false }).decode(buf);
  return raw
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    .replace(/\s{3,}/g, '\n')
    .trim()
    .slice(0, 12000);
}

function buildSummaryFromData(data: AppraisalFormData): typeof EXTRACTION_SUMMARY {
  const comments = data.additionalComments || '';
  const yearMatch = comments.match(/year built[:\s]+(\d{4})/i);
  const styleMatch = comments.match(/style[:\s]+([a-z\/\s]+)/i);
  const bedMatch = comments.match(/(\d+)\s*bed/i);
  const bathMatch = comments.match(/(\d+)\s*bath/i);
  const glaMatch = comments.match(/gla[:\s]+([\d,]+)\s*sqft/i);
  const orderMatch = comments.match(/order id[:\s]+(\d+)/i);

  return {
    yearBuilt: yearMatch?.[1] || '—',
    style: styleMatch?.[1]?.trim() || '—',
    beds: bedMatch?.[1] || '—',
    baths: bathMatch?.[1] || '—',
    gla: glaMatch ? `${glaMatch[1]} sqft` : '—',
    orderId: orderMatch?.[1] || '—',
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File exceeds 10MB limit' },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const documentText = extractTextFromBuffer(arrayBuffer, file.type);

    if (!documentText || documentText.length < 10) {
      console.warn('[extract] Document text too short, using fallback');
      return NextResponse.json(getFallbackResponse());
    }

    if (!process.env.OPENAI_API_KEY) {
      console.info('[extract] OPENAI_API_KEY not configured — returning fallback data');
      return NextResponse.json(getFallbackResponse());
    }

    console.info('[extract] OPENAI_API_KEY detected — calling gpt-4o-mini');
    const aiResult = await callOpenAI(documentText);

    if (!aiResult) {
      console.warn('[extract] OpenAI extraction failed — falling back to demo data');
      return NextResponse.json(getFallbackResponse());
    }

    const summary = buildSummaryFromData(aiResult);
    console.info('[extract] OpenAI extraction successful');
    return NextResponse.json({
      data: aiResult,
      source: 'openai' as const,
      summary,
    });
  } catch (err) {
    console.error('[extract] Unexpected error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json(getFallbackResponse());
  }
}
