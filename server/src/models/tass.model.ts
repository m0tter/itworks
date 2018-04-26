import * as Sequelize from 'sequelize';
import { sequelize } from '../utils/database.utils';

export interface TassStudentAddModel { }

export interface TassStudentModel extends Sequelize.Model<TassStudentModel, TassStudentAddModel> {
  stud_code: string;
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
}

export interface TassStudentViewModel { }

export const TassStudent = sequelize.define<TassStudentModel, TassStudentAddModel>('student', 
  {
    userId: { type: Sequelize.CHAR({length: 8}), allowNull: false, primaryKey: true, field: 'stud_code' },
    surname: { type: Sequelize.CHAR({length: 30}) },
    given_name: { type: Sequelize.CHAR({length: 30}) },
    preferred_name: { type: Sequelize.CHAR({length: 20}) },
    par_code: { type: Sequelize.CHAR({length: 8}) },
    year_grp: { type: Sequelize.SMALLINT},
    form_cls: { type: Sequelize.CHAR({length: 1}) },
    pctut_grp: { type: Sequelize.CHAR({length: 5}) },
    dob: { type: Sequelize.DATE },
    dol: { type: Sequelize.DATE },
    e_mail: { type: Sequelize.CHAR({length: 60}) }
  },
  {
    timestamps: false,
    tableName: 'TassStudents'
  }
);

// Tass Staff member

export interface ITassStaffModel extends Sequelize.Model<ITassStaffModel, ITassStaffModel> {
  // emp_code: string;
  userId: string;
  salutation_flag: string;
  surname_text: string;
  first_name: string;
  record_id: number;
  school_email: string;
  term_date: Date;
}

export const TassStaff = sequelize.define<ITassStaffModel, ITassStaffModel>('staff',
  {
    userId: { type: Sequelize.CHAR({length: 7}), allowNull: false, primaryKey: true, field: 'emp_code' },
    salutation_flag: { type: Sequelize.CHAR({length: 5}) },
    surname_text: { type: Sequelize.CHAR({length: 30}) },
    first_name: { type: Sequelize.CHAR({length: 20}) },
    record_id: { type: Sequelize.INTEGER, allowNull: false },
    school_email: { type: Sequelize.CHAR({length: 60}) },
    term_date: { type: Sequelize.DATE }
  },
  {
    timestamps: false,
    tableName: 'TassStaff'
  }
)

