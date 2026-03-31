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

/** Map a UI-selected role value to what the backend expects */
export const toBackendRole = (uiRole) => {
  const found = UI_ROLES.find((r) => r.value === uiRole);
  return found ? found.backendValue : uiRole;
};

/** Get a human-friendly label for a backend role string */
export const getRoleLabel = (backendRole) => {
  const mapping = {
    ADMIN:    'Admin',
    CUSTOMER: 'Customer',
    DELIVERY_AGENT: 'Delivery Agent',
  };
  return mapping[backendRole] || backendRole;
};
