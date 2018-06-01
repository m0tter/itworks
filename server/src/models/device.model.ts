import * as Sequelize from 'sequelize';
import { sequelize } from '../utils/database.utils';
import { Contract, IContract_Model } from './contract.model';

// Device

export interface IDeviceAddModel { }
export interface IDeviceViewModel { }
export interface IDeviceModel extends Sequelize.Model<IDeviceModel, IDeviceAddModel> {
  id: number;
  barcode: string;
  purchaseDate: Date;
  macWired: string;
  macWireless: string;
  disposalDate: Date;
  serialNumber: string;
  name: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  spare: boolean;
  modelId: number;
  contracts: IContract_Model[];
}

export const Device = sequelize.define<IDeviceModel, IDeviceAddModel>('device', 
{
  id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  barcode: { type: Sequelize.STRING, allowNull: false, unique: true },
  purchaseDate: { type: Sequelize.DATE },
  macWired: { type: Sequelize.STRING },
  macWireless: { type: Sequelize.STRING },
  disposalDate: { type: Sequelize.DATE },
  serialNumber: { type: Sequelize.STRING },
  name: { type: Sequelize.STRING },
  notes: { type: Sequelize.STRING },
  spare: { type: Sequelize.BOOLEAN },
  modelId: { type: Sequelize.INTEGER }
});

// Device Type
export interface IDeviceType_AddModel {
  type: string;
}

export interface IDeviceTypeModel extends Sequelize.Model<IDeviceTypeModel, IDeviceType_AddModel> {
  id: number;
  type: string;
}

export const DeviceType = sequelize.define<IDeviceTypeModel, IDeviceType_AddModel>('deviceType',
{
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  type: { type: Sequelize.STRING, allowNull: false }
});

// Device Model

export interface IDeviceModel_AddModel {
  model: string;
  deviceTypeId: number;
}

export interface IDeviceModel_Model extends Sequelize.Model<IDeviceModel_Model, IDeviceModel_AddModel> {
  id: number;
  model: string;
  deviceTypeId: number;
}

export const DeviceModel = sequelize.define<IDeviceModel_Model, IDeviceModel_AddModel>('deviceModel',
{
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  model: { type: Sequelize.STRING, allowNull: false},
  deviceTypeId: { type: Sequelize.INTEGER, allowNull: false }
})

// Relationships
DeviceType.hasMany(DeviceModel, { foreignKey: 'deviceTypeId', as: 'models' });
Device.belongsTo(DeviceModel, { foreignKey: 'modelId', as: 'model' });
Device.belongsToMany(Contract, { as: 'contracts', through: 'deviceContracts', foreignKey: 'deviceId'});
