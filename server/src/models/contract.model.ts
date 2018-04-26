import * as Sequelize from 'sequelize';
import { sequelize } from '../utils/database.utils';
import { Vendor } from './vendor.model';

// Contract

export interface IContract_AddModel { }
export interface IContract_ViewModel { }
export interface IContract_Model extends Sequelize.Model<IContract_Model, IContract_AddModel> {
  id: number;
  name: string;
  notes: string;
  vendorId: number;
  typeId: number;
  expiry: Date;
  start: Date;
}

export const Contract = sequelize.define<IContract_Model, IContract_AddModel>('contract',
{
  id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING, allowNull: false },
  notes: { type: Sequelize.STRING },
  vendorId: { type: Sequelize.INTEGER },
  typeId: { type: Sequelize.INTEGER },
  expiry: { type: Sequelize.DATE },
  start: { type: Sequelize.DATE }
});

// Contract Type

export interface IContractType_AddModel { }
export interface IContractType_ViewModel { }
export interface IContractType_Model extends Sequelize.Model<IContractType_Model, IContractType_AddModel> {
  id: number;
  type: string;
}

export const ContractType = sequelize.define<IContractType_Model, IContractType_AddModel>('contractType',
{
  id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  type: { type: Sequelize.STRING, allowNull: false }
});


Contract.belongsTo(ContractType, { foreignKey: 'typeId', as: 'type' });
Contract.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });