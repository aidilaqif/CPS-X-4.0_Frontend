import React, { useState } from 'react';
import { Table, Button, Tag } from 'antd';
import CreateItemDialog from './CreateItemDialog';

const ScannedItemsTable = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateItem = (createdItem) => {
    // Find and update the item in the list
    const updatedItems = items.map(item => 
      item.label_id === createdItem.data.label_id 
        ? { ...item, exists: true }
        : item
    );
    
    // Update the parent component's state
    if (typeof window !== 'undefined' && window.updateScannedItems) {
      window.updateScannedItems(updatedItems);
    }
  };

  const columns = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: '15%',
    },
    {
      title: 'Label ID',
      dataIndex: 'label_id',
      key: 'label_id',
      width: '20%',
    },
    {
      title: 'Work Order',
      dataIndex: 'work_order',
      key: 'work_order',
      width: '20%',
    },
    {
      title: 'Status',
      dataIndex: 'exists',
      key: 'exists',
      width: '15%',
      render: (exists) => (
        <Tag color={exists ? 'success' : 'error'}>
          {exists ? 'Found' : 'Not Found'}
        </Tag>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: '15%',
      render: (type) => (
        <Tag color={type === 'Roll' ? 'blue' : 'purple'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        !record.exists && (
          <Button
            type="primary"
            onClick={() => {
              setSelectedItem(record);
              setIsDialogOpen(true);
            }}
            style={{ backgroundColor: '#22c55e' }}
          >
            Create
          </Button>
        )
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={items.map(item => ({ ...item, key: item.label_id + item.timestamp }))}
        pagination={false}
        scroll={{ y: 400 }}
        size="middle"
      />

      {selectedItem && (
        <CreateItemDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          onCreateItem={handleCreateItem}
        />
      )}
    </>
  );
};

export default ScannedItemsTable;