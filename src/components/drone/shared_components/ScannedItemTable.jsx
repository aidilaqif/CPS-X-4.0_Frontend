import React, { useState } from "react";
import { Table, Button, Tag } from "antd";
import CreateItemDialog from "./CreateItemDialog";

const ScannedItemsTable = ({ items }) => {
  console.log("Received items:", items);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateItem = (createdItem) => {
    // Find and update the item in the list
    const updatedItems = items.map((item) =>
      item.label_id === createdItem.data.label_id
        ? { ...item, exists: true }
        : item
    );

    // Update the parent component's state
    if (typeof window !== "undefined" && window.updateScannedItems) {
      window.updateScannedItems(updatedItems);
    }
  };

  // Ensure each item has all required fields with default values
  const processedItems = items.map((item) => {
    console.log("Processing item:", item);

    return {
      key: item.label_id + (item.timestamp || ""),
      timestamp: item.timestamp || "",
      label_id: item.label_id || "",
      work_order: item.work_order || "",
      type: item.type || "",
      current_location: item.current_location || "N/A",
      past_location: item.past_location || "N/A",
      exists: !!item.exists,
      correct_location: item.correct_location ?? true,
    };
  });

  const columns = [
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      width: "15%",
    },
    {
      title: "Label ID",
      dataIndex: "label_id",
      key: "label_id",
      width: "15%",
    },
    {
      title: "Work Order",
      dataIndex: "work_order",
      key: "work_order",
      width: "15%",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "10%",
      render: (type) => (
        <Tag color={type === "Roll" ? "blue" : "purple"}>
          {type || "Unknown"}
        </Tag>
      ),
    },
    {
      title: "Current Location",
      dataIndex: "current_location",
      key: "current_location",
      width: "15%",
      render: (text, record) => (
        <span>
          {text || "N/A"}
          {record.correct_location === false && (
            <Tag color="red" style={{ marginLeft: "8px" }}>
              Wrong Rack
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: "Past Location",
      dataIndex: "past_location",
      key: "past_location",
      width: "15%",
      render: (text) => text || "N/A",
    },
    {
      title: "Status",
      dataIndex: "exists",
      key: "exists",
      width: "10%",
      render: (exists) => (
        <Tag color={exists ? "success" : "error"}>
          {exists ? "Found" : "Not Found"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
      render: (_, record) =>
        !record.exists && (
          <Button
            type="primary"
            onClick={() => {
              setSelectedItem(record);
              setIsDialogOpen(true);
            }}
            style={{ backgroundColor: "#22c55e" }}
          >
            Create
          </Button>
        ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={processedItems}
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
