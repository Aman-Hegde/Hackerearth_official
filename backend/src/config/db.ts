// // backend/src/config/db.ts
// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config(); // Load environment variables

// const sequelize = new Sequelize(
//   process.env.SUPABASE_DB_NAME!,     // Supabase database name
//   process.env.SUPABASE_DB_USER!,     // Supabase database username
//   process.env.SUPABASE_DB_PASSWORD!, // Supabase database password
//   {
//     host: process.env.SUPABASE_DB_HOST || 'localhost',
//     port: Number(process.env.SUPABASE_DB_PORT) || 5432,
//     dialect: 'postgres',
//     logging: false,
//     dialectOptions: {
//       ssl: {
//         require: true,               // Supabase requires SSL
//         rejectUnauthorized: false,    // Stricter SSL check for Supabase
//       },
//     },
//   }
// );

// export default sequelize;


// backend/src/config/db.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,               // Supabase requires SSL
      rejectUnauthorized: false,  // To allow self-signed certs etc.
    },
  },
});

export default sequelize;
