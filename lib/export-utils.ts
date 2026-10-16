import type { AppraisalFormData } from './types';

export function exportAsJSON(data: AppraisalFormData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `appraisal-${data.apnTaxId || 'report'}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAsPDF(data: AppraisalFormData): void {
  const reportContent = buildReportHTML(data);
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.top = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(reportContent);
  doc.close();

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      // ignore
    }
    setTimeout(() => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    }, 1000);
  };

  // Fallback: if onload doesn't fire (some browsers), try after a short delay
  setTimeout(() => {
    try {
      if (iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      }
    } catch {
      // ignore
    }
  }, 500);
}

function fmt(value: string, prefix = ''): string {
  if (!value) return '—';
  if (prefix && /^\d+$/.test(value.replace(/,/g, ''))) {
    const num = parseInt(value.replace(/,/g, ''), 10);
    return `${prefix}${num.toLocaleString()}`;
  }
  return value;
}

function buildReportHTML(data: AppraisalFormData): string {
  return `<!DOCTYPE html>
<html>
<head>
<title>Uniform Residential Appraisal Report - ${data.propertyAddress}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', serif; color: #1a1a1a; padding: 40px; font-size: 12px; line-height: 1.5; }
  .header { text-align: center; border-bottom: 2px solid #1e3a5f; padding-bottom: 20px; margin-bottom: 30px; }
  .header h1 { font-size: 18px; color: #1e3a5f; }
  .header h2 { font-size: 14px; color: #555; margin-top: 5px; }
  .section { margin-bottom: 30px; page-break-inside: avoid; }
  .section-title { background: #e8eef5; color: #1e3a5f; font-weight: bold; font-size: 13px; padding: 8px 12px; border-left: 4px solid #1e3a5f; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  .field { border-bottom: 1px solid #ddd; border-right: 1px solid #ddd; padding: 6px 12px; min-height: 36px; }
  .field:nth-child(2n) { border-right: none; }
  .field-label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
  .field-value { font-size: 12px; font-weight: 500; margin-top: 2px; }
  .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 15px; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
  <div class="header">
    <h1>Uniform Residential Appraisal Report</h1>
    <h2>Fannie Mae Form 1004 / UAD Compliant</h2>
  </div>
  <div class="section">
    <div class="section-title">Property Information</div>
    <div class="grid">
      <div class="field"><div class="field-label">Property Address</div><div class="field-value">${data.propertyAddress}</div></div>
      <div class="field"><div class="field-label">City</div><div class="field-value">${data.city}</div></div>
      <div class="field"><div class="field-label">State</div><div class="field-value">${data.state}</div></div>
      <div class="field"><div class="field-label">Zip</div><div class="field-value">${data.zip}</div></div>
      <div class="field"><div class="field-label">County</div><div class="field-value">${data.county}</div></div>
      <div class="field"><div class="field-label">Legal Description</div><div class="field-value">${data.legalDescription}</div></div>
      <div class="field"><div class="field-label">APN / Tax ID</div><div class="field-value">${data.apnTaxId}</div></div>
      <div class="field"><div class="field-label">Effective Date of Appraisal</div><div class="field-value">${data.effectiveDate}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Client & Appraiser Information</div>
    <div class="grid">
      <div class="field"><div class="field-label">Client Name</div><div class="field-value">${data.clientName}</div></div>
      <div class="field"><div class="field-label">Client Address</div><div class="field-value">${data.clientAddress}</div></div>
      <div class="field"><div class="field-label">Appraiser Name</div><div class="field-value">${data.appraiserName}</div></div>
      <div class="field"><div class="field-label">License Number</div><div class="field-value">${data.licenseNumber}</div></div>
      <div class="field"><div class="field-label">Intended Use</div><div class="field-value">${data.intendedUse}</div></div>
      <div class="field"><div class="field-label">Intended User</div><div class="field-value">${data.intendedUser}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Sales Comparison Approach</div>
    <div class="grid">
      <div class="field"><div class="field-label">No. of Comparable Sales</div><div class="field-value">${data.numberOfComps}</div></div>
      <div class="field"><div class="field-label">Price Range Low</div><div class="field-value">${fmt(data.priceRangeLow, '$')}</div></div>
      <div class="field"><div class="field-label">Price Range High</div><div class="field-value">${fmt(data.priceRangeHigh, '$')}</div></div>
      <div class="field"><div class="field-label">Date of Sale</div><div class="field-value">${data.dateOfSale}</div></div>
      <div class="field" style="grid-column: 1 / -1;"><div class="field-label">Adjustments</div><div class="field-value">${data.adjustments}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Cost Approach</div>
    <div class="grid">
      <div class="field"><div class="field-label">Land Value</div><div class="field-value">${fmt(data.landValue, '$')}</div></div>
      <div class="field"><div class="field-label">Improvement Value</div><div class="field-value">${fmt(data.improvementValue, '$')}</div></div>
      <div class="field"><div class="field-label">Total Valuation</div><div class="field-value">${fmt(data.totalValuation, '$')}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Reconciliation</div>
    <div class="grid">
      <div class="field"><div class="field-label">Final Opinion of Value</div><div class="field-value">${fmt(data.finalOpinionOfValue, '$')}</div></div>
      <div class="field"><div class="field-label">Exposure Time</div><div class="field-value">${data.exposureTime}</div></div>
      <div class="field"><div class="field-label">Marketing Days</div><div class="field-value">${data.marketingDays}</div></div>
      <div class="field" style="grid-column: 1 / -1;"><div class="field-label">Additional Comments</div><div class="field-value">${data.additionalComments}</div></div>
    </div>
  </div>
  <div class="footer">Generated by Appraisal Form AI · ${new Date().toLocaleString()}</div>
</body>
</html>`;
}

export function saveToLocalStorage(data: AppraisalFormData): boolean {
  try {
    const records = JSON.parse(localStorage.getItem('appraisal-forms') || '[]');
    const record = {
      id: crypto.randomUUID(),
      data,
      savedAt: new Date().toISOString(),
    };
    records.unshift(record);
    localStorage.setItem('appraisal-forms', JSON.stringify(records.slice(0, 20)));
    return true;
  } catch {
    return false;
  }
}
