import React, { useEffect, useState } from "react";
import { FileDown, Loader2, Clock, Activity, Database } from "lucide-react";
import { exportService } from "../../services/export.service";
import ExportDialog from "./ExportDialog";
import PreviewTable from "./PreviewTable";
import "../../assets/styles/components/Export.css";

const Export = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState('items_status'); // Default preview

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

  const previewSections = [
    {
      id: 'items_status',
      title: 'Items Status Overview',
      icon: <Database className="w-6 h-6" />,
      description: 'Current status and scan history of all items'
    },
    {
      id: 'flight_sessions',
      title: 'Flight Sessions',
      icon: <Clock className="w-6 h-6" />,
      description: 'Drone flight sessions with performance metrics'
    },
    {
      id: 'scan_results',
      title: 'Scan Results',
      icon: <Activity className="w-6 h-6" />,
      description: 'Detailed scanning activity and outcomes'
    },
    {
      id: 'labels',
      title: 'Item Overview',
      icon: <FileDown className="w-6 h-6" />,
      description: 'General item information and status'
    }
  ];

  if (loading) {
    return (
      <div className="export-loading">
        <Loader2 className="export-loading-spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="export-container">
      {/* Header Section */}
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

      {/* Preview Section Tabs */}
      {previewData && (
        <div className="export-preview-tabs">
          <div className="export-preview-tab-list">
            {previewSections.map((section) => (
              <button
                key={section.id}
                className={`export-preview-tab ${selectedSheet === section.id ? 'active' : ''}`}
                onClick={() => setSelectedSheet(section.id)}
              >
                {section.icon}
                <div className="export-preview-tab-content">
                  <span className="export-preview-tab-title">{section.title}</span>
                  <span className="export-preview-tab-description">{section.description}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Preview Content */}
          <div className="export-preview-content">
            <div className="export-preview-section">
              <h3>{previewSections.find(s => s.id === selectedSheet)?.title}</h3>
              <PreviewTable 
                data={previewData[selectedSheet]} 
                type={selectedSheet}
              />
              <div className="export-preview-footer">
                <span>
                  Showing {previewData[selectedSheet]?.length || 0} records
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Dialog */}
      <ExportDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default Export;