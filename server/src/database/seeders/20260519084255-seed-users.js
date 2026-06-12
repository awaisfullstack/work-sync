'use strict';
const bcrypt = require('bcrypt');

const departments = [
  'Development',
  'Human Resources',
  'Operations',
  'Design',
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@worksync.com',
    role: 'ADMIN',
    department_id: null,
  },
  {
    name: 'Admin User 2',
    email: 'admin2@worksync.com',
    role: 'ADMIN',
    department_id: null,
  },
  {
    name: 'Admin User 3',
    email: 'admin3@worksync.com',
    role: 'ADMIN',
    department_id: null,
  },
  {
    name: 'Admin User 4',
    email: 'admin4@worksync.com',
    role: 'ADMIN',
    department_id: null,
  },
  {
    name: 'Admin User 5',
    email: 'admin5@worksync.com',
    role: 'ADMIN',
    department_id: null,
  },

  {
    name: 'Sara Malik',
    email: 'sara.malik@worksync.com',
    role: 'EMPLOYEE',
    department: 'Human Resources',
  },
  {
    name: 'Ayesha Noor',
    email: 'ayesha.noor@worksync.com',
    role: 'EMPLOYEE',
    department: 'Human Resources',
  },
  {
    name: 'Fatima Zahra',
    email: 'fatima.zahra@worksync.com',
    role: 'EMPLOYEE',
    department: 'Human Resources',
  },
  {
    name: 'Zainab Ali',
    email: 'zainab.ali@worksync.com',
    role: 'EMPLOYEE',
    department: 'Human Resources',
  },
  {
    name: 'Maham Khan',
    email: 'maham.khan@worksync.com',
    role: 'EMPLOYEE',
    department: 'Human Resources',
  },
  {
    name: 'Hira Aslam',
    email: 'hira.aslam@worksync.com',
    role: 'EMPLOYEE',
    department: 'Human Resources',
  },

  {
    name: 'Ahmed Faraz',
    email: 'ahmed.faraz@worksync.com',
    role: 'EMPLOYEE',
    department: 'Operations',
  },
  {
    name: 'Danish Mehmood',
    email: 'danish.mehmood@worksync.com',
    role: 'EMPLOYEE',
    department: 'Operations',
  },
  {
    name: 'Saad Yousaf',
    email: 'saad.yousaf@worksync.com',
    role: 'EMPLOYEE',
    department: 'Operations',
  },
  {
    name: 'Noman Shah',
    email: 'noman.shah@worksync.com',
    role: 'EMPLOYEE',
    department: 'Operations',
  },
  {
    name: 'Taha Siddiqui',
    email: 'taha.siddiqui@worksync.com',
    role: 'EMPLOYEE',
    department: 'Development',
  },
  {
    name: 'Imran Qureshi',
    email: 'imran.qureshi@worksync.com',
    role: 'EMPLOYEE',
    department: 'Development',
  },

  {
    name: 'Maryam Iqbal',
    email: 'maryam.iqbal@worksync.com',
    role: 'EMPLOYEE',
    department: 'Design',
  },
  {
    name: 'Laiba Hassan',
    email: 'laiba.hassan@worksync.com',
    role: 'EMPLOYEE',
    department: 'Design',
  },
  {
    name: 'Iqra Javed',
    email: 'iqra.javed@worksync.com',
    role: 'EMPLOYEE',
    department: 'Design',
  },
  {
    name: 'Sana Tariq',
    email: 'sana.tariq@worksync.com',
    role: 'EMPLOYEE',
    department: 'Design',
  },
  {
    name: 'Noor Fatima',
    email: 'noor.fatima@worksync.com',
    role: 'EMPLOYEE',
    department: 'Development',
  },
  {
    name: 'Hania Sheikh',
    email: 'hania.sheikh@worksync.com',
    role: 'EMPLOYEE',
    department: 'Development',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'departments',
      departments.map((name) => ({
        id: Sequelize.literal('gen_random_uuid()'),
        name,
        created_at: now,
        updated_at: now,
      })),
      {
        ignoreDuplicates: true,
      },
    );

    const departmentRows = await queryInterface.sequelize.query(
      `
      SELECT id, name
      FROM departments
      WHERE name IN ('Human Resources', 'Operations', 'Design', 'Development')
      `,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const departmentByName = new Map(
      departmentRows.map((department) => [department.name, department.id]),
    );

    const missingDepartments = departments.filter(
      (name) => !departmentByName.has(name),
    );

    if (missingDepartments.length > 0) {
      throw new Error(
        `Required departments not found: ${missingDepartments.join(', ')}`,
      );
    }

    const password = await bcrypt.hash('Password@123', 10);
    await queryInterface.bulkInsert(
      'users',
      users.map((user) => ({
        id: Sequelize.literal('gen_random_uuid()'),
        name: user.name,
        email: user.email,
        password,
        role: user.role,
        department_id: user.department
          ? departmentByName.get(user.department)
          : user.department_id,
        is_active: true,
        created_at: now,
        updated_at: now,
      })),
      {
        ignoreDuplicates: true,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: users.map((user) => user.email),
      },
    });
  },
};
