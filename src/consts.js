export const AUTOSUBMIT_API_SOURCE = process.env.REACT_APP_AUTOSUBMIT_API_SOURCE;
export const PUBLIC_URL = process.env.PUBLIC_URL

export const MAX_ITEMS_QUICK_VIEW = 100;

export const CUSTOM_LOGO_URL = process.env.REACT_APP_CUSTOM_LOGO_URL;

export const INTERVAL_BUTTON_REFRESH_RATE = process.env.REACT_APP_INTERVAL_BUTTON_REFRESH_RATE || 10;


// Authentication
export const AUTHENTICATION = ["true", "T"].includes(process.env.REACT_APP_AUTHENTICATION); // Default: false. If false -> The authentication requirement is disabled. Some API calls require a valid token though.
export const AUTH_PROVIDER = process.env.REACT_APP_AUTH_PROVIDER || "cas"; // Default: cas. Options: cas, github

// CAS Auth
export const CAS_THIRD_PARTY_LOGIN_URL = process.env.REACT_APP_CAS_THIRD_PARTY_LOGIN_URL;
export const CAS_SERVICE_ID = process.env.REACT_APP_CAS_SERVICE_ID;

// GitHub Auth
export const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;

export const DARK_MODE_SWITCHER = ["true", "T"].includes(process.env.REACT_APP_DARK_MODE_SWITCHER);; // Experimental feature. Default: false.

export const TOP_ANNOUNCEMENT = process.env.REACT_APP_TOP_ANNOUNCEMENT;
