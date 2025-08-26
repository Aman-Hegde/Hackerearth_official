"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/config/db.ts
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
const sequelize = new sequelize_1.Sequelize(process.env.NEON_DB_NAME, // Supabase database name
process.env.NEON_DB_USER, // Supabase database username
process.env.NEON_DB_PASSWORD, // Supabase database password
{
    host: process.env.NEON_DB_HOST || 'localhost',
    port: Number(process.env.NEON_DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true, // Supabase requires SSL
            rejectUnauthorized: false, // Stricter SSL check for Supabase
        },
    },
});
exports.default = sequelize;
//# sourceMappingURL=db.js.map