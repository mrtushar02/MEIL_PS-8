/**
 * Universal CSV & Excel Export Utility for MEIL ESG Portal
 * Generates standards-compliant CSV files and triggers instant client download.
 */

export function exportToCsv(filename, rows, customHeaders = null) {
  if (!rows || !rows.length) {
    console.warn('No data available to export');
    return false;
  }

  const keys = customHeaders ? Object.keys(customHeaders) : Object.keys(rows[0]);
  const headerLabels = customHeaders ? Object.values(customHeaders) : keys;

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvRows = [];
  csvRows.push(headerLabels.map(escapeCsv).join(','));

  for (const row of rows) {
    const values = keys.map((k) => escapeCsv(row[k]));
    csvRows.push(values.join(','));
  }

  const csvContent = '\uFEFF' + csvRows.join('\r\n'); // Add BOM for Excel UTF-8 support
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

export function triggerFileInput(onFileSelect, accept = '.csv,.xlsx,.xls,.json') {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.style.display = 'none';
  input.onchange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    document.body.removeChild(input);
  };
  document.body.appendChild(input);
  input.click();
}
