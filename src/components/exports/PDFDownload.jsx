import React, { useState } from 'react';
import { DownloadIcon, Loader2 } from 'lucide-react';

const PDFDownload = ({ targetRef, filename = 'analysis_report.pdf' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    if (!targetRef.current) {
      console.error('No target element found');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Dynamically import the required libraries
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = targetRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, imgWidth, imgHeight);

      // If the content is longer than one page
      let heightLeft = imgHeight - pageHeight;
      let position = -pageHeight;

      while (heightLeft > 0) {
        position = position - pageHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
      setIsGenerating(false);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md transition-colors ${
          isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
        }`}
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <DownloadIcon className="w-4 h-4" />
        )}
        <span>{isGenerating ? 'Generating PDF...' : 'Download Report'}</span>
      </button>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default PDFDownload;