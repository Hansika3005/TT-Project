/**
 * Central role mapping utility.
 * UI can display friendly names while  sending exact backend enum values.
 * When backend adds DELIVERY_AGENT support, just update backendValue below.
 */

export const UI_ROLES = [
  { label: 'Customer',       value: 'CUSTOMER',        backendValue: 'CUSTOMER' },
  { label: 'Delivery Agent', value: 'DELIVERY_AGENT',  backendValue: 'CUSTOMER' }, // Map to CUSTOMER until backend supports it
  { label: 'Admin',          value: 'ADMIN',           backendValue: 'ADMIN'    },
];

/** Map a UI-selected role value to what the backend expects */
export const toBackendRole = (uiRole) => {
  const found = UI_ROLES.find((r) => r.value === uiRole);
  return found ? found.backendValue : 'CUSTOMER';
};

/** Get a human-friendly label for a backend role string */
export const getRoleLabel = (backendRole) => {
  const mapping = {
    ADMIN:    'Admin',
    CUSTOMER: 'Customer',
    AGENT:    'Delivery Agent',
  };
  return mapping[backendRole] || backendRole;
};
