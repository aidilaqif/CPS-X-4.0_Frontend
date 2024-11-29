import React from 'react';
import { Package, RotateCw, LayoutList, X } from 'lucide-react';

const ExportDialog = ({ isOpen, onClose, onExport }) => {
  if (!isOpen) return null;

  const sheetInfo = [
    {
      title: "Item",
      icon: <LayoutList size={20} />,
      fields: "Label ID, Type, Location, Status, Time"
    },
    {
      title: "Roll",
      icon: <RotateCw size={20} />,
      fields: "Label ID, Code, Name, Size, Status, Time"
    },
    {
      title: "FG Pallet",
      icon: <Package size={20} />,
      fields: "Label ID, PLT, Quantity, Work Order, Total, Status, Time"
    }
  ];

  const handleExport = () => {
    onClose();
    onExport();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Export to Excel</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <p className="font-semibold mb-4">
            The following sheets will be exported:
          </p>
          
          <div className="space-y-3">
            {sheetInfo.map((sheet, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="text-gray-600 mt-1">
                  {sheet.icon}
                </div>
                <div>
                  <div className="font-semibold">
                    {sheet.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {sheet.fields}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;