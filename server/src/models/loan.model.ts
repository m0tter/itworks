import * as Sequelize from 'sequelize';
import { sequelize } from '../utils/database.utils';
import { Device, IDeviceModel } from './device.model';
import { TassStudent, TassStaff } from './tass.model';

export interface ILoanAddModel {
  startdate: Date;
  deviceBarcode: string;
  // studentStudCode: string;
  userId: string;
  enddate?: Date;
  lost?: boolean;
  notes?: string;
}

export interface ILoanModel extends Sequelize.Model<ILoanModel, ILoanAddModel> {
  id: number;
  startdate: Date;
  enddate: Date;
  notes: string;
  lost: boolean;
  userId: string;
  deviceBarcode: string;
  // studentStudCode: string;
}

export const Loan = sequelize.define<ILoanModel, ILoanAddModel>('loan', {
  startdate: { type: Sequelize.DATE, allowNull: false },
  enddate: { type: Sequelize.DATE },
  notes: { type: Sequelize.STRING },
  lost: { type: Sequelize.BOOLEAN },
  userId: { type: Sequelize.STRING }
});

Loan.belongsTo(Device);
Loan.belongsTo(TassStudent, { constraints: false, foreignKey: 'userId' });
Loan.belongsTo(TassStaff, { constraints: false, foreignKey: 'userId' });

