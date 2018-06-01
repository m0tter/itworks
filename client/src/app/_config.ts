export const DEV_ENABLED = true;

export const DEV_SERVER = 'http://itdev01.gslc.local';
export const DEV_PORT = 4200;
export const PROD_SERVER = 'http://web-sql01.gslc.local';
export const PROD_PORT = 8080;
export const DEV_API_PORT = 3000;
export const PROD_API_PORT = DEV_API_PORT;
export const AUTH_CALLBACK = DEV_ENABLED ? `${DEV_SERVER}:${DEV_PORT}/callback` : `${PROD_SERVER}:${PROD_PORT}/callback`;
// export const AUTH_CLIENTCODE = '7saAhxTuD4DLwkE15cgcCOA6OTrHj1of';
export const AUTH_CLIENTCODE = 'SjFZifXB4maoB4KvB8E4Y84z4E0X7QXV';
