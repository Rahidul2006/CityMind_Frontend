const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Authorization': token ? `Bearer ${token}` : '',
  };
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const departmentLogin = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/department-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || json.error || 'Department officer login failed.');
  }

  if (json.token) {
    localStorage.setItem('token', json.token);
    localStorage.setItem('userRole', 'DEPARTMENT_OFFICER');
    localStorage.setItem('userData', JSON.stringify(json.user));
    if (json.user?.departmentId) {
      localStorage.setItem('departmentId', json.user.departmentId);
    }
  }

  return json;
};

export const getDepartmentDashboard = async () => {
  const res = await fetch(`${API_BASE_URL}/api/department/dashboard`, {
    headers: getHeaders(),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch department dashboard.');
  }
  return json.data;
};

export const getDepartmentTasks = async (params?: {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const url = new URL(`${API_BASE_URL}/api/department/tasks`);
  if (params?.status) url.searchParams.append('status', params.status);
  if (params?.priority) url.searchParams.append('priority', params.priority);
  if (params?.category) url.searchParams.append('category', params.category);
  if (params?.search) url.searchParams.append('search', params.search);
  if (params?.page) url.searchParams.append('page', String(params.page));
  if (params?.limit) url.searchParams.append('limit', String(params.limit));

  const res = await fetch(url.toString(), { headers: getHeaders() });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch department tasks.');
  }
  return json as { success: boolean; data: any[]; complaints: any[]; pagination: any };
};

export const getTaskById = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/api/department/tasks/${id}`, {
    headers: getHeaders(),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Task not found or access denied.');
  }
  return json.data;
};

export const updateTaskStatus = async (id: string, status: string, message?: string) => {
  const res = await fetch(`${API_BASE_URL}/api/department/tasks/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status, message }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to update task status.');
  }
  return json.data;
};

export const addTaskRemark = async (id: string, message: string) => {
  const res = await fetch(`${API_BASE_URL}/api/department/tasks/${id}/remarks`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ message }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to add department remark.');
  }
  return json.data;
};

export const resolveTask = async (id: string, message?: string, imageFile?: File | null) => {
  const formData = new FormData();
  if (message) formData.append('message', message);
  if (imageFile) formData.append('image', imageFile);

  const res = await fetch(`${API_BASE_URL}/api/department/tasks/${id}/resolve`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to mark task as resolved.');
  }
  return json.data;
};

export const getPriorityTasks = async () => {
  const res = await fetch(`${API_BASE_URL}/api/department/priority`, {
    headers: getHeaders(),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch priority tasks.');
  }
  return json.data as any[];
};

export const getResolvedTasks = async () => {
  const res = await fetch(`${API_BASE_URL}/api/department/resolved`, {
    headers: getHeaders(),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch resolved tasks.');
  }
  return json.data as any[];
};

export const getDepartmentMapTasks = async () => {
  const res = await fetch(`${API_BASE_URL}/api/department/map`, {
    headers: getHeaders(),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch map tasks.');
  }
  return json.data as any[];
};

export const getDepartmentProfile = async () => {
  const res = await fetch(`${API_BASE_URL}/api/department/profile`, {
    headers: getHeaders(),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch department profile.');
  }
  return json.data;
};
