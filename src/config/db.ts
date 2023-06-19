import { DataSource } from 'typeorm';
import { HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } from './config';
import { Roles, Usuarios } from '../models';


export const appDataSource = new DataSource({
  type: "mysql",
  host: HOST,
  port: Number(DB_PORT),
  database: DB_DATABASE,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  entities: [
    Roles, Usuarios
  ],
  synchronize: true
});