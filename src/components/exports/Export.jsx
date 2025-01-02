import React, { useEffect, useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { exportService } from "../../services/export.service";
import ExportDialog from "./ExportDialog";
import PreviewTable from "./PreviewTable";
import "../../assets/styles/components/Export.css";

const Export = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        setLoading(true);
        const data = await exportService.getPreviewData();
        setPreviewData(data);
      } catch (err) {
        console.error("Preview error:", err);
        setError("Failed to load preview data");
      } finally {
        setLoading(false);
      }
    };
    fetchPreviewData();
  }, []);

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      await exportService.exportToExcel();
    } catch (err) {
      console.error("Export error:", err);
      setError("Failed to export data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="export-loading">
        <Loader2 className="export-loading-spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="export-container">
      <div className="export-header">
        <div className="export-title">
          <FileDown className="w-6 h-6" />
          <h1>Export Data</h1>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="export-button export-button-primary"
        >
          <FileDown className="w-4 h-4" /> Export to Excel
        </button>
      </div>

      {error && <div className="export-error">{error}</div>}
      {previewData && (
        <div className="export-preview-wrapper">
          {["labels", "rolls", "pallets"].map((type) => (
            <div key={type} className="export-preview-section">
              <h3>
                {type === "labels"
                  ? "Items"
                  : type === "rolls"
                  ? "Rolls"
                  : "FG Pallets"}
              </h3>
              <PreviewTable data={previewData[type]} type={type} />
            </div>
          ))}
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
