// src/services/item.service.js

import { endpoints } from '../config/api.config';

export const itemService = {
  async getAllItems(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response = await fetch(`${endpoints.items.getAll}?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch items');
    return response.json();
  },

  async getItemById(id) {
    const response = await fetch(endpoints.items.getById(id));
    if (!response.ok) throw new Error('Failed to fetch item');
    return response.json();
  },

  async createItem(itemData) {
    const response = await fetch(endpoints.items.create, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error('Failed to create item');
    return response.json();
  },

  async updateItem(id, itemData) {
    const response = await fetch(endpoints.items.update(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error('Failed to update item');
    return response.json();
  },

  async deleteItem(id) {
    const response = await fetch(endpoints.items.delete(id), {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete item');
    return response.json();
  },

  async updateItemStatus(id, status) {
    const response = await fetch(endpoints.items.updateStatus(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update item status');
    return response.json();
  },

  async updateItemLocation(id, locationId) {
    const response = await fetch(endpoints.items.updateLocation(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location_id: locationId }),
    });
    if (!response.ok) throw new Error('Failed to update item location');
    return response.json();
  },
};