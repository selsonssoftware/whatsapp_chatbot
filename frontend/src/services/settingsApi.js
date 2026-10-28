
const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://whatsapp.selsons.com/api'
).replace(/\/$/, '');

const TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'token';

export class ApiError extends Error {
  constructor(message, status = 0, errors = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

function authHeader() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

async function request(path, { method = 'GET', body } = {}) {
  let res;

  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(body !== undefined
          ? { 'Content-Type': 'application/json' }
          : {}),
        ...authHeader(),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      'Network error. Please check your connection and try again.'
    );
  }

  let payload = null;

  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent('auth:expired'));
    throw new ApiError(
      'Your session has expired. Please log in again.',
      401
    );
  }

  if (res.status === 403) {
    throw new ApiError(
      payload?.message || 'You do not have permission to do this.',
      403
    );
  }

  if (!res.ok) {
    throw new ApiError(
      payload?.message || `Request failed (${res.status}).`,
      res.status,
      payload?.errors || {}
    );
  }

  return payload && Object.prototype.hasOwnProperty.call(payload, 'data')
    ? payload.data
    : payload;
}

const enc = encodeURIComponent;

export const settingsApi = {
  // Settings access
  access: () => request('/settings/access'),

  // General settings sections
  get: (section) => request(`/settings/${enc(section)}`),

  update: (section, body) =>
    request(`/settings/${enc(section)}`, {
      method: 'PUT',
      body,
    }),

  // Messaging
  messagingOptions: () => request('/settings/messaging/options'),

  // WhatsApp Business / Meta Embedded Signup
  whatsapp: {
    status: () =>
      request('/settings/whatsapp/status'),

    embeddedConfig: () =>
      request('/settings/whatsapp/embedded-config'),

    connect: (payload) =>
      request('/settings/whatsapp/connect', {
        method: 'POST',
        body: payload,
      }),

    disconnect: (connectionId) => {
      if (connectionId === undefined || connectionId === null) {
        throw new ApiError('WhatsApp connection ID is required.');
      }

      return request(
        `/settings/whatsapp/disconnect/${enc(connectionId)}`,
        { method: 'POST' }
      );
    },
  },

  // Team management
  team: {
    list: () => request('/settings/team'),

    invite: (body) =>
      request('/settings/team/members', {
        method: 'POST',
        body,
      }),

    update: (id, body) =>
      request(`/settings/team/members/${enc(id)}`, {
        method: 'PATCH',
        body,
      }),

    remove: (id) =>
      request(`/settings/team/members/${enc(id)}`, {
        method: 'DELETE',
      }),

    updateRole: (roleKey, permissions) =>
      request(`/settings/team/roles/${enc(roleKey)}`, {
        method: 'PUT',
        body: { permissions },
      }),
  },

  // Third-party integrations
  integrations: {
    list: () => request('/settings/integrations'),

    connect: (key, config) =>
      request(`/settings/integrations/${enc(key)}/connect`, {
        method: 'POST',
        body: { config },
      }),

    reconnect: (key) =>
      request(`/settings/integrations/${enc(key)}/reconnect`, {
        method: 'POST',
      }),

    test: (key) =>
      request(`/settings/integrations/${enc(key)}/test`, {
        method: 'POST',
      }),

    disconnect: (key, connectionId) =>
      request(
        `/settings/integrations/${enc(key)}/disconnect/${enc(connectionId)}`,
        { method: 'POST' }
      ),
  },

  // Security
  security: {
    overview: () =>
      request('/settings/security/overview'),

    changePassword: (body) =>
      request('/settings/security/password', {
        method: 'POST',
        body,
      }),

    revokeSession: (id) =>
      request(`/settings/security/sessions/${enc(id)}`, {
        method: 'DELETE',
      }),

    revokeOtherSessions: () =>
      request('/settings/security/sessions/revoke-others', {
        method: 'POST',
      }),

    twoFactorSetup: () =>
      request('/settings/security/two-factor/setup', {
        method: 'POST',
      }),

    twoFactorConfirm: (code) =>
      request('/settings/security/two-factor/confirm', {
        method: 'POST',
        body: { code },
      }),

    twoFactorDisable: (code) =>
      request('/settings/security/two-factor/disable', {
        method: 'POST',
        body: { code },
      }),
  },

  // Billing
  billing: {
    subscription: () =>
      request('/settings/billing/subscription'),

    payments: () =>
      request('/settings/billing/payments'),

    requestUpgrade: (plan) =>
      request('/settings/billing/upgrade', {
        method: 'POST',
        body: { plan },
      }),
  },
};
