import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download, FileText, ArrowRight } from 'lucide-react';
import { parseCustomerExcel, ParsedImportRow, downloadCustomerTemplate } from '../../utils/excelService';
import { formatAED } from '../../utils/currency';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedRows: ParsedImportRow[], mode: 'merge' | 'replace') => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedImportRow[]>([]);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setParseError(null);
    setIsParsing(true);

    try {
      const result = await parseCustomerExcel(selectedFile);
      if (result.success && result.validRows.length > 0) {
        setParsedRows(result.validRows);
      } else {
        setParseError('No valid customer rows found in the file. Please verify column headers.');
        setParsedRows([]);
      }
    } catch (err: any) {
      setParseError(err.message || 'Error parsing Excel file');
      setParsedRows([]);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;
    onImportSuccess(parsedRows, importMode);
    onClose();
  };

  const resetUpload = () => {
    setFile(null);
    setParsedRows([]);
    setParseError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#16181d] border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#121419]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Import Customers from Excel / CSV</h3>
              <p className="text-xs text-slate-400">Upload .xlsx, .xls, or .csv spreadsheets directly into the mess database</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* If no file uploaded yet */}
          {!file && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-amber-400 bg-amber-400/5'
                  : 'border-slate-700 hover:border-slate-500 bg-slate-900/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mx-auto mb-3">
                <Upload className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">Click to browse or drag and drop spreadsheet</h4>
              <p className="text-xs text-slate-400 mb-4">Supports Microsoft Excel (.xlsx, .xls) and CSV (.csv)</p>

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadCustomerTemplate('xlsx');
                  }}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample Excel Template</span>
                </button>
              </div>
            </div>
          )}

          {/* Parsing State */}
          {isParsing && (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-slate-300">Reading and validating Excel spreadsheet...</p>
            </div>
          )}

          {/* Error Message */}
          {parseError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Import Error: </span>
                {parseError}
              </div>
              <button onClick={resetUpload} className="text-slate-400 hover:text-white underline">
                Try again
              </button>
            </div>
          )}

          {/* Preview of Parsed Data */}
          {parsedRows.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Successfully read {parsedRows.length} customer records from "{file?.name}"</span>
                </div>
                <button onClick={resetUpload} className="text-xs text-slate-400 hover:text-white underline">
                  Choose different file
                </button>
              </div>

              {/* Import Mode Selection */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div className="text-xs font-bold text-slate-300">Import Mode:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    onClick={() => setImportMode('merge')}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                      importMode === 'merge'
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="mt-0.5 text-amber-500"
                    />
                    <div>
                      <div className="font-semibold text-white">Merge &amp; Append (Recommended)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Adds new customers without deleting existing profiles</div>
                    </div>
                  </label>

                  <label
                    onClick={() => setImportMode('replace')}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                      importMode === 'replace'
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-0.5 text-rose-500"
                    />
                    <div>
                      <div className="font-semibold text-rose-300">Replace All Current Customers</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Overwrites customer list with this spreadsheet</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Data Preview Table */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium">Data Preview (First 8 Rows):</span>
                  <span>{parsedRows.length} total rows</span>
                </div>

                <div className="overflow-x-auto max-h-56 rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/90 sticky top-0 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">Name</th>
                        <th className="py-2 px-3">Building &amp; Flat</th>
                        <th className="py-2 px-2 text-center">Meals</th>
                        <th className="py-2 px-3 text-right">Monthly (AED)</th>
                        <th className="py-2 px-3 text-right">Overdue</th>
                        <th className="py-2 px-3">Dietary / Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                      {parsedRows.slice(0, 8).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="py-2 px-3 font-semibold text-white">{row.full_name}</td>
                          <td className="py-2 px-3 text-slate-400">
                            {row.building_name_cache} {row.apartment_cache ? `(${row.apartment_cache})` : ''}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <span className="inline-flex gap-1 text-[9px] font-bold">
                              {row.has_breakfast && <span className="text-amber-400">BF</span>}
                              {row.has_lunch && <span className="text-emerald-400">LN</span>}
                              {row.has_dinner && <span className="text-sky-400">DN</span>}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-slate-200">
                            {formatAED(row.monthly_rate)}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-rose-400">
                            {row.total_overdue > 0 ? formatAED(row.total_overdue) : '-'}
                          </td>
                          <td className="py-2 px-3 text-slate-400 truncate max-w-xs text-[11px]">
                            {row.dietary_preferences || row.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#121419]">
          <button
            type="button"
            onClick={() => downloadCustomerTemplate('xlsx')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Blank Template</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={parsedRows.length === 0}
              onClick={handleConfirmImport}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold shadow-lg transition-colors ${
                parsedRows.length > 0
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Confirm &amp; Import ({parsedRows.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
