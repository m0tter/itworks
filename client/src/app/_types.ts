import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
import { plainToClass } from 'class-transformer';

export class SideNavItem {
  name: string;
  route: string;
  isDivider?: boolean;
}

export class Contract implements Serializable<Contract> {
  id: number;
  name: string;
  notes: string;
  vendorId: number;
  expiry: Date;
  start: Date;
  typeId: number;
  type: ContractType;
  vendor: Vendor;
  selected?: boolean;
  createdAt: Date;
  updatedAt: Date;

  deserialize(input) {
    try {
      this.id = input.id;
      this.name = input.name;
      this.notes = input.notes;
      this.vendorId = input.vendorId;
      this.expiry = input.expiry;
      this.start = input.start;
      this.type = input.contractType;
      this.typeId = input.contractTypeId;
      this.createdAt = input.createdAt;
      this.updatedAt = input.updatedAt;

      if (input.vendor) {
        this.vendor = <Vendor>plainToClass(Vendor, <Vendor>input.vendor);
      }

      if (input.type) {
        this.type = <ContractType>plainToClass(ContractType, <ContractType>input.type);
      }
    } catch (e) {
      console.log('error deserializing contract. id=' + input.id);
      throw new Error(e.message);
    }

    return this;
  }

  filterString(): string {
    const str =
      moment(this.start).format('DD/MM/YYYY')
      + this.name
      + this.notes
      + (this.vendor.name || '')
      + (this.type.type || '')
      + moment(this.expiry).format('DD/MM/YYYY');
    return str.toLowerCase();
  }
}

export enum VendorType {
  Manufacturer,
  Reseller,
  Financier
}

export class Vendor {
  id: number;
  name: string;
  website: string;
  email: string;
  notes: string;
  address1: string;
  address2: string;
  suburb: string;
  state: string;
  postcode: number;
  vendortype: VendorType;
  selected: boolean;

  getAddress(): string {
    return 'ralph';
  }
}

export interface IUser {
  name: string;
  userId: string;
  current: boolean;
}

export class User implements IUser {
  student: TassStudent;
  staff: TassStaff;
  isStudent = false;
  isStaff = false;

  get name() {
    if (this.student) { return this.student.name; } else { return this.staff.name; }
  }

  get userId() {
    if (this.student) { return this.student.userId; } else { return this.staff.userId; }
  }

  get current() {
    if (this.student) { return this.student.current; } else { return this.staff.current; }
  }

  deserialize(user: any): User {
    if (this.isStaff || this.isStudent) {
      return plainToClass(User, <User>user);
    } else {
      if (user.year_grp) {
        this.student = plainToClass(TassStudent, <TassStudent>user);
        this.isStudent = true;
      } else {
        this.staff = plainToClass(TassStaff, <TassStaff>user);
        this.isStaff = true;
      }
    }

    return this;
  }
}

export class TassStudent implements IUser {
  // stud_code: string;
  userId: string;
  surname: string;
  given_name: string;
  preferred_name: string;
  par_code: string;
  year_grp: number;
  form_cls: string;
  pctut_grp: string;
  dob: Date;
  dol: Date;
  e_mail: string;

  get name() {
    if (this.preferred_name && this.surname ) {
      return `${this.preferred_name.trim()} ${this.surname.trim()}(${this.year_grp})`;
    } else { return ''; }
  }

  get current() { if (this.dol) { return false; } else { return true; }}

  // get userId() { return this.stud_code; }

  constructor() { }
}

export class TassStaff implements IUser {
  // emp_code: string;
  userId: string;
  salutation_flag: string;
  surname_text: string;
  first_name: string;
  record_id: number;
  school_email: string;
  term_date: Date;

  get name() {
    let s = '';
    if (this.first_name) { s += this.first_name.trim(); }
    if (s.length > 0) { s += ' '; }
    if (this.surname_text) { s += this.surname_text.trim(); }
    if (s.length > 0) { s += '(Staff)'; }
    return s;
  }

  get current() { if (this.term_date) { return false; } else { return true; } }

  // get userId() { return this.emp_code; }

  constructor() { }
}

export class DeviceModel implements Serializable<DeviceModel> {
  id: number;
  model: string;
  deviceTypeId: number;
  edit = false;

  deserialize(input: DeviceModel): DeviceModel {
    try {
      this.id = input.id;
      this.model = input.model;
      this.deviceTypeId = input.deviceTypeId;
    } catch (e) {
      console.error('error deserializing deviceModel. id=' + input.id);
      throw new Error(e.message);
    }
    return this;
  }
}

export class DeviceType {
  id: number;
  type: string;
  models: DeviceModel[];

  newModel(): DeviceModel {
    const m = new DeviceModel();
    m.model = 'New';
    m.deviceTypeId = this.id;
    this.models.push(m);
    return m;
  }
}

export class Device implements Serializable<Device> {
  id: number;
  barcode: string;
  macWired: string;
  macWireless: string;
  purchaseDate: Date;
  disposalDate: Date;
  serialNumber: string;
  name: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  selected: boolean;
  modelId: number;
  model: DeviceModel;
  spare: boolean;
  contracts: Contract[];

  deserialize(input: Device): Device {
    try {
      this.id = input.id;
      this.barcode = input.barcode;
      this.macWired = input.macWired;
      this.macWireless = input.macWireless;
      this.purchaseDate = input.purchaseDate;
      this.disposalDate = input.disposalDate;
      this.serialNumber = input.serialNumber;
      this.name = input.name;
      this.notes = input.notes;
      this.createdAt = input.createdAt;
      this.updatedAt = input.updatedAt;
      this.modelId = input.modelId;
      if (input.model) { this.model = new DeviceModel().deserialize(input.model); }
      this.spare = input.spare;
      if (input.contracts) {
        this.contracts = [];
        input.contracts.forEach(e => this.contracts.push(new Contract().deserialize(e)));
      }
    } catch (e) {
      console.error(`error deserializing device. id=${input.id}\n` + e.message);
      throw new Error(e.message);
    }

    return this;
  }
}

export class Loan implements Serializable<Loan> {
  id: number;
  startdate: Date;
  enddate: Date;
  notes: string;
  lost: boolean;
  userId: string;
  device: Device;
  student: TassStudent;
  staff: TassStaff;
  selected: boolean;
  deviceBarcode: string;
  studentStudCode: string;
  user: User;

  filterString(): string {
    const str =
      moment(this.startdate).format('DD/MM/YYYY')
      + this.deviceBarcode
      + this.device.serialNumber
      + (this.user.name || '')
      + (this.device.name || '')
      + this.enddate
      + (this.userId || '');
    return str.toLowerCase();
  }

  deserialize(input: Loan): Loan {
    try {
      this.id = input.id;
      this.startdate = input.startdate;
      this.enddate = input.enddate;
      this.notes = input.notes;
      this.lost = input.lost;
      this.userId = input.userId;
      if (input.device) { this.device = new Device().deserialize(input.device); }
      if (input.student) { this.user = new User().deserialize(input.student); }
      if (input.staff) { this.user = new User().deserialize(input.staff); }
      this.deviceBarcode = input.deviceBarcode;
      this.studentStudCode = input.studentStudCode;
    } catch (e) {
      console.error(`error deserializing loan. id=${input.id}\n` + e.message);
      throw new Error(e.message);
    }

    return this;
  }

}

export class ContractType implements Serializable<ContractType> {
  id: number;
  type: string;
  description: string;
  selected?: boolean;

  deserialize(input) {
    this.id = input.id;
    this.type = input.type;
    this.description = input.description;
    return this;
  }
}

export class TableDataSource<T> extends DataSource<any[]> {
  dataChange: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  get data(): T[] { return this.dataChange.value; }
  set data(value: T[]) { this.dataChange.next(value); }

  constructor(data?: any) {
    super();
    this.dataChange.next(data);
  }

  connect(): Observable<any[]> { return this.dataChange; }
  disconnect(): void { }
}

export interface Serializable<T> {
  deserialize(input: Object): T;
}

export class ApiResponse implements Serializable<ApiResponse> {
  success: boolean;
  data: string;

  deserialize(input) {
    this.success = input.success;
    this.data = input.data;
    return this;
  }

  toClass(classType: any): any {
    return plainToClass(classType, this.data);
  }
}

