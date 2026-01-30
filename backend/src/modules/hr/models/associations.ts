import Divisi from './Divisi';
import Department from './Department';
import PosisiJabatan from './PosisiJabatan';
import Employee from './Employee';

// Department belongs to Divisi
Department.belongsTo(Divisi, {
    foreignKey: 'divisi_id',
    as: 'divisi',
});

Divisi.hasMany(Department, {
    foreignKey: 'divisi_id',
    as: 'departments',
});

// Department belongs to Employee (Manager)
Department.belongsTo(Employee, {
    foreignKey: 'manager_id',
    as: 'manager',
});

Employee.hasMany(Department, {
    foreignKey: 'manager_id',
    as: 'managed_departments',
});

// PosisiJabatan belongs to Department
PosisiJabatan.belongsTo(Department, {
    foreignKey: 'department_id',
    as: 'department',
});

Department.hasMany(PosisiJabatan, {
    foreignKey: 'department_id',
    as: 'posisi_jabatan',
});

export {
    Divisi,
    Department,
    PosisiJabatan,
    Employee,
};
