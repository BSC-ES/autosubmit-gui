export const AUTOSUBMIT_API_SOURCE = import.meta.env.REACT_APP_AUTOSUBMIT_API_SOURCE;
export const PUBLIC_URL = import.meta.env.BASE_URL

export const CUSTOM_LOGO_URL = import.meta.env.REACT_APP_CUSTOM_LOGO_URL;

export const INTERVAL_BUTTON_REFRESH_RATE = import.meta.env.REACT_APP_INTERVAL_BUTTON_REFRESH_RATE || 10;


// Authentication
export const AUTHENTICATION = ["true", "T"].includes(import.meta.env.REACT_APP_AUTHENTICATION); // Default: false. If false -> The authentication requirement is disabled. Some API calls require a valid token though.
export const AUTH_PROVIDER = import.meta.env.REACT_APP_AUTH_PROVIDER || "cas"; // Default: cas. Options: cas, github

// CAS Auth
export const CAS_THIRD_PARTY_LOGIN_URL = import.meta.env.REACT_APP_CAS_THIRD_PARTY_LOGIN_URL;
export const CAS_SERVICE_ID = import.meta.env.REACT_APP_CAS_SERVICE_ID;

// GitHub Auth
export const GITHUB_CLIENT_ID = import.meta.env.REACT_APP_GITHUB_CLIENT_ID;
export const GITHUB_REDIRECT_URI = import.meta.env.REACT_APP_GITHUB_REDIRECT_URI || undefined; // Optional. If not set (or empty), GitHub uses the callback URL configured in the OAuth app

// OpenID Connect Auth
export const OIDC_AUTHORIZATION_ENDPOINT = import.meta.env.REACT_APP_OIDC_AUTHORIZATION_ENDPOINT;
export const OIDC_CLIENT_ID = import.meta.env.REACT_APP_OIDC_CLIENT_ID;

// Other
export const DARK_MODE_SWITCHER = ["true", "T"].includes(import.meta.env.REACT_APP_DARK_MODE_SWITCHER); // Experimental feature. Default: false.

export const TOP_ANNOUNCEMENT = import.meta.env.REACT_APP_TOP_ANNOUNCEMENT;

export const MAINTENANCE_URL = import.meta.env.REACT_APP_MAINTENANCE_URL || `${PUBLIC_URL}/maintenance.json`; // Default: <PUBLIC_URL>/maintenance.json. The URL to check if the maintenance mode is enabled. Allows customizing the message. It must return a JSON with the following structure: { "enabled": boolean, "title": string, "message": string }. Optionally, ``start`` and ``end`` UTC timestamps can be included to define the maintenance window in ISO 8601 format
