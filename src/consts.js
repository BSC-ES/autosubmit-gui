export const AUTOSUBMIT_API_SOURCE = import.meta.env.REACT_APP_AUTOSUBMIT_API_SOURCE;
export const PUBLIC_URL = import.meta.env.BASE_URL

export const MAX_ITEMS_QUICK_VIEW = 100;

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

// OpenID Connect Auth
export const OIDC_AUTHORIZATION_ENDPOINT = import.meta.env.REACT_APP_OIDC_AUTHORIZATION_ENDPOINT;
export const OIDC_CLIENT_ID = import.meta.env.REACT_APP_OIDC_CLIENT_ID;

// Other
export const DARK_MODE_SWITCHER = ["true", "T"].includes(import.meta.env.REACT_APP_DARK_MODE_SWITCHER);; // Experimental feature. Default: false.

export const TOP_ANNOUNCEMENT = import.meta.env.REACT_APP_TOP_ANNOUNCEMENT;
