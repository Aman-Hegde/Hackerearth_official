"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = __importDefault(require("./config/db"));
(async () => {
    try {
        await db_1.default.authenticate();
        console.log('✅ Database connected successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
})();
//# sourceMappingURL=testDb.js.map