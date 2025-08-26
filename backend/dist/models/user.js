"use strict";
// 
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    google_id: {
        type: sequelize_1.DataTypes.STRING(32),
        unique: true,
        allowNull: true, // Allows google_id to be null initially
        defaultValue: null,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(150),
        unique: true,
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    tableName: 'users',
    timestamps: false,
});
exports.default = User;
//# sourceMappingURL=user.js.map