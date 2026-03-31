/**
 * Central role mapping utility.
 * UI can display friendly names while  sending exact backend enum values.
 * When backend adds DELIVERY_AGENT support, just update backendValue below.
 */

export const UI_ROLES = [
  { label: 'Customer',       value: 'CUSTOMER',        backendValue: 'CUSTOMER' },
  { label: 'Delivery Agent', value: 'DELIVERY_AGENT',  backendValue: 'DELIVERY_AGENT' },
  { label: 'Admin',          value: 'ADMIN',           backendValue: 'ADMIN'    },
];

/** Normalize backend/frontend role variants to canonical enum-like values */
export const normalizeRole = (role) => {
  if (!role) return null;
  const cleaned = String(role).trim().toUpperCase().replace(/[\s-]/g, '_');
  if (cleaned === 'DELIVERYAGENT' || cleaned === 'DELIVERY_AGENT') return 'DELIVERY_AGENT';
  if (cleaned === 'ADMIN') return 'ADMIN';
  if (cleaned === 'CUSTOMER') return 'CUSTOMER';
  return cleaned;
};

/** Map a UI-selected role value to what the backend expects */
export const toBackendRole = (uiRole) => {
  const normalized = normalizeRole(uiRole);
  const found = UI_ROLES.find((r) => r.value === normalized);
  return found ? found.backendValue : uiRole;
};

/** Get a human-friendly label for a backend role string */
export const getRoleLabel = (backendRole) => {
  const normalizedRole = normalizeRole(backendRole);
  const mapping = {
    ADMIN:    'Admin',
    CUSTOMER: 'Customer',
    DELIVERY_AGENT: 'Delivery Agent',
  };
  return mapping[normalizedRole] || normalizedRole || 'Guest';
};
