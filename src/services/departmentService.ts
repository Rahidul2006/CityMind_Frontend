const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export interface DepartmentData {
  _id?: string;
  id?: string;
  name: string;
  code: string;
  description?: string;
  categories: string[];
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  complaintCount?: number;
  assigned?: number;
  inProgress?: number;
  active?: number;
  resolved?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DepartmentSummary {
  totalDepartments: number;
  activeDepartments: number;
  totalAssignedComplaints: number;
  totalUnassignedComplaints: number;
}

export const getDepartments = async (params?: { search?: string; isActive?: string }) => {
  const url = new URL(`${API_BASE_URL}/api/departments`);
  if (params?.search) url.searchParams.append('search', params.search);
  if (params?.isActive !== undefined) url.searchParams.append('isActive', params.isActive);

  const res = await fetch(url.toString(), { headers: getHeaders() });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Unable to load departments.');
  }
  return json as { success: boolean; data: DepartmentData[]; summary: DepartmentSummary };
};

export const getDepartmentById = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/api/departments/${id}`, { headers: getHeaders() });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Department not found.');
  }
  return json.data as DepartmentData & { stats: any };
};

export const createDepartment = async (data: Partial<DepartmentData>) => {
  const res = await fetch(`${API_BASE_URL}/api/departments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to create department.');
  }
  return json.data as DepartmentData;
};

export const updateDepartment = async (id: string, data: Partial<DepartmentData>) => {
  const res = await fetch(`${API_BASE_URL}/api/departments/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to update department.');
  }
  return json.data as DepartmentData;
};

export const toggleDepartmentStatus = async (id: string, isActive: boolean) => {
  const res = await fetch(`${API_BASE_URL}/api/departments/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ isActive }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to update department status.');
  }
  return json.data as DepartmentData;
};

export const deleteDepartment = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/api/departments/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to delete department.');
  }
  return json;
};

export const getDepartmentComplaints = async (id: string, params?: { status?: string; search?: string }) => {
  const url = new URL(`${API_BASE_URL}/api/departments/${id}/complaints`);
  if (params?.status) url.searchParams.append('status', params.status);
  if (params?.search) url.searchParams.append('search', params.search);

  const res = await fetch(url.toString(), { headers: getHeaders() });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch department complaints.');
  }
  return json.data as any[];
};

export const getDepartmentStats = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/api/departments/${id}/stats`, { headers: getHeaders() });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch department stats.');
  }
  return json.data as any;
};

export const getUnassignedComplaints = async (params?: { search?: string; category?: string }) => {
  const url = new URL(`${API_BASE_URL}/api/complaints/unassigned`);
  if (params?.search) url.searchParams.append('search', params.search);
  if (params?.category) url.searchParams.append('category', params.category);

  const res = await fetch(url.toString(), { headers: getHeaders() });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch unassigned complaints.');
  }
  return json.data as any[];
};

export const assignComplaintToDepartment = async (complaintId: string, departmentId: string, reason?: string) => {
  const res = await fetch(`${API_BASE_URL}/api/complaints/${complaintId}/department`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ departmentId, reason: reason || '' }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to assign complaint to department.');
  }
  return json.data as any;
};

export const deleteComplaint = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/api/complaints/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to delete complaint.');
  }
  return json;
};
