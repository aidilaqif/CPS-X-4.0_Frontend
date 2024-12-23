import React from 'react';

const PreviewTable = ({ data, type }) => {
  const getHeaders = () => {
    switch (type) {
      case 'labels':
        return ['Label ID', 'Label Type', 'Location', 'Status', 'Last Scan'];
      case 'rolls':
        return ['Label ID', 'Code', 'Name', 'Size', 'Status', 'Last Scan'];
      case 'pallets':
        return ['Label ID', 'PLT', 'Quantity', 'Work Order', 'Total', 'Status', 'Last Scan'];
      default:
        return [];
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return <span className="text-blue-600 font-medium">New Scan</span>;

    try {
      const date = new Date(dateString);
      return date
        .toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(",", "");
    } catch (error) {
      return dateString;
    }
  };

  const formatValue = (item, header) => {
    switch (header) {
      case 'Label ID':
        return item.labelId || item.label_id || '-';
      case 'Label Type':
        return item.labelType || item.label_type || '-';
      case 'Location':
        return item.location || item.location_id || '-';
      case 'Status':
        return item.status || '-';
      case 'Last Scan':
        const timestamp = item.lastScanTime || item.last_scan_time;
        return formatDate(timestamp);
      case 'PLT':
        return item.pltNumber || item.plt_number || '-';
      case 'Quantity':
        return item.quantity?.toLocaleString() || '-';
      case 'Work Order':
        return item.workOrderId || item.work_order_id || '-';
      case 'Total':
        return item.totalPieces?.toLocaleString() || '-';
      case 'Code':
        return item.code || '-';
      case 'Name':
        return item.name || '-';
      case 'Size':
        return item.size_mm ? `${item.size_mm} mm` : '-';
      default:
        return '-';
    }
  };

  return (
    <div className="export-preview-table-container">
      <table className="export-preview-table">
        <thead>
          <tr>
            {getHeaders().map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {getHeaders().map((header) => (
                <td key={header}>{formatValue(item, header)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="export-preview-footer">
        Showing {data.length} of {data.length} records
      </div>
    </div>
  );
};

export default PreviewTable;