import dotenv from 'dotenv';
dotenv.config();

export const APP_PORT = process.env.APP_PORT || 3851;
export const CORS_URL = process.env.CORS_URL || '*';

export const HOST = process.env.HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_DATABASE = process.env.DB_DATABASE || 'tubasededatos';
export const DB_USERNAME = process.env.DB_USERNAME || '';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const APP_URL = `http://${HOST}:${APP_PORT}`;

export const JWT_SECRET = process.env.JWT_SECRET || 'CualestuSecreto';
export const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || '15m';
export const JWT_REFRESH = process.env.JWT_REFRESH || 'YasetuSecreto';
export const REFRESH_TOKEN_EXPIRATION_TIME = process.env.REFRESH_TOKEN_EXPIRATION_TIME || '7d';

export const MODE_NODE = process.env.MODE_NODE || 'developer';