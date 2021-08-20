"use strict";
var __importDefault = (this && this.__importDefault) || function(mod) {
	return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connect = void 0;
var Knex_1 = __importDefault(require("Knex"));
// Update with your config settings.
var Connect = function() {
	return Knex_1.default({
		client: "pg",
		connection: {
			database: "vaccinedb",
			user: "postgres",
			password: "admin",
			host: "localhost",
			port: Number("" + process.env.PG_PORT || 5432),
		},
		pool: { min: 0, max: 100 },
		acquireConnectionTimeout: 10000,
	});
};
exports.Connect = Connect;