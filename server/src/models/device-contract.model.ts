import * as Sequelize from 'sequelize';
import { sequelize } from '../utils/database.utils';
import { Device } from './device.model';
import { Contract } from './contract.model';

export interface IDeviceContract_AddModel { }
export interface IDeviceContract_ViewModel { }
export interface IDeviceContract_Model extends Sequelize.Model<IDeviceContract_Model, IDeviceContract_AddModel> {
  id: number;
  contractId: number;
  deviceId: number;
}

export const DeviceContract = sequelize.define<IDeviceContract_Model, IDeviceContract_AddModel>('deviceContract',
{
  id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  deviceId: { type: Sequelize.INTEGER, allowNull: false },
  contractId: { type: Sequelize.INTEGER, allowNull: false }
});

DeviceContract.hasOne(Device, { foreignKey: 'id' });
DeviceContract.hasOne(Contract, { foreignKey: 'id' });