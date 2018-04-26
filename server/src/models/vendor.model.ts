import * as Sequelize from 'sequelize';
import { sequelize } from '../utils/database.utils';

export interface VendorAddModel { }

export interface VendorModel extends Sequelize.Model<VendorModel, VendorAddModel> {
  id: number;
  name: string;
  contact: string;
  website: string;
  email: string;
  notes: string;
  address1: string;
  address2: string;
  suburb: string;
  state: string;
  postcode: number;
  typeId: number;
}

export interface VendorViewModel {

}

export const Vendor = sequelize.define<VendorModel, VendorAddModel>('vendor', {
  id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING, allowNull: false },
  contact: { type: Sequelize.STRING },
  website: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING },
  notes: { type: Sequelize.STRING(2000) },
  address1: { type: Sequelize.STRING },
  address2: { type: Sequelize.STRING },
  suburb: { type: Sequelize.STRING },
  state: { type: Sequelize.STRING },
  postcode: { type: Sequelize.INTEGER },
  typeId: { type: Sequelize.INTEGER }
});
