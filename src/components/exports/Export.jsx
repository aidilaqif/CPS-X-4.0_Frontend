import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { exportService } from '../../services/export.service';
import ExportDialog from './ExportDialog';

const Export = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      await exportService.exportToExcel();
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <FileDown className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Export Data</h1>
      </div>

      <button
        onClick={() => setDialogOpen(true)}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        <FileDown className="w-4 h-4" /> Export to Excel
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <ExportDialog 
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default Export;