import { DEV_ENABLED, PROD_SERVER, DEV_SERVER, DEV_PORT, PROD_PORT, DEV_API_PORT, PROD_API_PORT } from './_config';

const API_SERVER = DEV_ENABLED ? `${DEV_SERVER}:${DEV_API_PORT}/api/1/` : `${PROD_SERVER}:${PROD_API_PORT}/api/1/`;

export const API_CONTRACT = `${API_SERVER}contract`;
export const API_CONTRACTTYPE = `${API_CONTRACT}/type`;
export const API_VENDOR = `${API_SERVER}vendor`;
export const API_DEVICE = `${API_SERVER}device`;
export const API_LOAN = `${API_SERVER}loan`;
export const API_USER = `${API_SERVER}user`;
export const API_TASS = `${API_SERVER}tass`;
