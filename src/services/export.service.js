// src/services/export.service.js
import { endpoints } from '../config/api.config';
import * as XLSX from 'xlsx';

export const exportService = {
  formatLastScan(dateString) {
    if (!dateString) return 'New Scan';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).replace(',', '');
    } catch (error) {
      return dateString;
    }
  },

  async exportToExcel() {
    try {
      const response = await fetch(endpoints.export.csv);
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      
      const data = await response.json();
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Create Item sheet
      const itemHeaders = ['Label ID', 'Label Type', 'Location', 'Status', 'Last Scan'];
      const itemData = (data.labels || []).map(item => [
        item.labelId || '',
        item.labelType || '',
        item.location || '',
        item.status || '',
        this.formatLastScan(item.lastScanTime)
      ]);
      const itemSheet = XLSX.utils.aoa_to_sheet([itemHeaders, ...itemData]);
      XLSX.utils.book_append_sheet(workbook, itemSheet, 'Item');
      
      // Create Roll sheet
      const rollHeaders = ['Label ID', 'Code', 'Name', 'Size (mm)', 'Status', 'Last Scan'];
      const rollData = (data.rolls || []).map(roll => [
        roll.labelId || '',
        roll.code || '',
        roll.name || '',
        roll.size?.toString() || '',
        roll.status || '',
        this.formatLastScan(roll.lastScanTime)
      ]);
      const rollSheet = XLSX.utils.aoa_to_sheet([rollHeaders, ...rollData]);
      XLSX.utils.book_append_sheet(workbook, rollSheet, 'Roll');
      
      // Create FG Pallet sheet
      const palletHeaders = [
        'Label ID',
        'PLT',
        'Quantity (pcs)',
        'Work Order ID',
        'Total (pcs)',
        'Status',
        'Last Scan'
      ];
      const palletData = (data.pallets || []).map(pallet => [
        pallet.labelId || '',
        pallet.pltNumber?.toString() || '',
        pallet.quantity?.toString() || '',
        pallet.workOrderId || '',
        pallet.totalPieces?.toString() || '',
        pallet.status || '',
        this.formatLastScan(pallet.lastScanTime)
      ]);
      const palletSheet = XLSX.utils.aoa_to_sheet([palletHeaders, ...palletData]);
      XLSX.utils.book_append_sheet(workbook, palletSheet, 'FG Pallet');
      
      // Generate file name with timestamp
      const timestamp = new Date().getTime();
      const fileName = `CPS_Data_${timestamp}.xlsx`;
      
      // Export the file
      XLSX.writeFile(workbook, fileName);
      
      return true;
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }
};