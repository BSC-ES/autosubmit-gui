export const AUTOSUBMIT_API_SOURCE = process.env.REACT_APP_AUTOSUBMIT_API_SOURCE;
export const PUBLIC_URL = process.env.PUBLIC_URL

export const MAX_ITEMS_QUICK_VIEW = 100

export const CAS_THIRD_PARTY_LOGIN_URL = process.env.REACT_APP_CAS_THIRD_PARTY_LOGIN_URL;

export const AUTHENTICATION = ["true", "T"].includes(process.env.REACT_APP_AUTHENTICATION); // Default: false. If false -> The authentication requirement is disabled. Some API calls require a valid token though.

export const DARK_MODE_SWITCHER = false;