// backend/src/config/db.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import dns from 'dns';

// Force IPv4 DNS resolution
dns.setDefaultResultOrder('ipv4first');

dotenv.config(); // Load environment variables

const sequelize = new Sequelize(
  process.env.SUPABASE_DB_NAME!,     // Supabase database name
  process.env.SUPABASE_DB_USER!,     // Supabase database username
  process.env.SUPABASE_DB_PASSWORD!, // Supabase database password
  {
    host: process.env.SUPABASE_DB_HOST || 'localhost',
    port: Number(process.env.SUPABASE_DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,               // Supabase requires SSL
        rejectUnauthorized: false,    // Stricter SSL check for Supabase
      },
    },
  }
);

export default sequelize;
