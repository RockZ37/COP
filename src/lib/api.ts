// API utility functions for client-side data fetching

// Generic fetch function with error handling
async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'An error occurred');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Members API
export const MembersAPI = {
  getAll: () => fetchAPI<any[]>('/api/members'),
  
  create: (data: any) => fetchAPI<any>('/api/members', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  
  getById: (id: string) => fetchAPI<any>(`/api/members/${id}`),
  
  update: (id: string, data: any) => fetchAPI<any>(`/api/members/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI<any>(`/api/members/${id}`, {
    method: 'DELETE',
  }),
};

// Events API
export const EventsAPI = {
  getAll: () => fetchAPI<any[]>('/api/events'),
  
  create: (data: any) => fetchAPI<any>('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  
  getById: (id: string) => fetchAPI<any>(`/api/events/${id}`),
  
  update: (id: string, data: any) => fetchAPI<any>(`/api/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI<any>(`/api/events/${id}`, {
    method: 'DELETE',
  }),
};

// Groups API
export const GroupsAPI = {
  getAll: () => fetchAPI<any[]>('/api/groups'),
  
  create: (data: any) => fetchAPI<any>('/api/groups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  
  getById: (id: string) => fetchAPI<any>(`/api/groups/${id}`),
  
  update: (id: string, data: any) => fetchAPI<any>(`/api/groups/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI<any>(`/api/groups/${id}`, {
    method: 'DELETE',
  }),
};

// Donations API
export const DonationsAPI = {
  getAll: () => fetchAPI<any[]>('/api/donations'),
  
  create: (data: any) => fetchAPI<any>('/api/donations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  
  getById: (id: string) => fetchAPI<any>(`/api/donations/${id}`),
  
  update: (id: string, data: any) => fetchAPI<any>(`/api/donations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI<any>(`/api/donations/${id}`, {
    method: 'DELETE',
  }),
};

// Announcements API
export const AnnouncementsAPI = {
  getAll: () => fetchAPI<any[]>('/api/announcements'),
  
  create: (data: any) => fetchAPI<any>('/api/announcements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  
  getById: (id: string) => fetchAPI<any>(`/api/announcements/${id}`),
  
  update: (id: string, data: any) => fetchAPI<any>(`/api/announcements/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI<any>(`/api/announcements/${id}`, {
    method: 'DELETE',
  }),
};
