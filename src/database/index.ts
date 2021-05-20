import { Client } from 'pg';
import 'dotenv/config';

export const connection = new Client({
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: true
});

connection.connect();

export default connection;
