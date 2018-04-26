import * as Sequelize from 'sequelize';
import * as dbconfig from '../config/db.config';

export const sequelize = new Sequelize(dbconfig.connectionString);

sequelize.authenticate();
