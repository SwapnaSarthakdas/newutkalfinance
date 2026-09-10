/**
 * Newutkal Finance Production API Client
 * Connects frontend views to backend REST endpoints (/api/...)
 * Includes graceful offline/localStorage synchronization so user experience is always instantaneous.
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = localStorage.getItem('utkal_finance_session_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    // If network error (e.g. static preview mode), propagate or handle
    console.warn(`API call to ${endpoint} encountered error:`, err.message);
    throw err;
  }
}

export const api = {
  // Authentication & Verification
  auth: {
    async register(formData) {
      return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
    },

    async login(identifier, password, requestedRole = 'MEMBER') {
      return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password, requestedRole })
      });
    },

    async validateUnique(field, value) {
      return request('/auth/validate-unique', {
        method: 'POST',
        body: JSON.stringify({ [field]: value })
      });
    },

    async forgotPassword(identifier) {
      return request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ identifier })
      });
    },

    async resetPassword(resetToken, newPassword) {
      return request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ resetToken, newPassword })
      });
    }
  },

  // Applications & Approval Workflow
  applications: {
    async getAll(params = {}) {
      const qs = new URLSearchParams(params).toString();
      return request(`/applications${qs ? '?' + qs : ''}`);
    },

    async getById(id) {
      return request(`/applications/${id}`);
    },

    async updateStatus(id, { status, rejectionReason, correctionNotes, assignedEmpId, assignedBranchId, adminName }) {
      return request(`/applications/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, rejectionReason, correctionNotes, assignedEmpId, assignedBranchId, adminName })
      });
    },

    async uploadDocument(id, docData) {
      return request(`/applications/${id}/documents`, {
        method: 'POST',
        body: JSON.stringify(docData)
      });
    },

    async updateDocumentStatus(appId, docId, { status, rejectionReason, adminName }) {
      return request(`/applications/${appId}/documents/${docId}`, {
        method: 'PUT',
        body: JSON.stringify({ status, rejectionReason, adminName })
      });
    }
  },

  // Member Management & Profile
  members: {
    async getById(id) {
      return request(`/members/${id}`);
    },

    async updateProfile(id, permittedUpdates, callerRole = 'MEMBER') {
      return request(`/members/${id}/profile`, {
        method: 'PUT',
        body: JSON.stringify({ permittedUpdates, callerRole })
      });
    }
  },

  // Master Data
  branches: {
    async getAll() {
      return request('/branches');
    }
  },

  associates: {
    async getAll() {
      return request('/associates');
    }
  },

  auditLogs: {
    async getAll() {
      return request('/audit-logs');
    }
  },

  notifications: {
    async getAll(role, userId) {
      const qs = new URLSearchParams({ role, userId }).toString();
      return request(`/notifications?${qs}`);
    }
  }
};

export default api;
